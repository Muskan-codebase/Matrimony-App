import { Ignore } from "../modules/profile-details/ignore/ignore.model";
import { Block } from "../modules/profile-details/block/block.model";
import { Interest } from "../modules/profile-details/interest/interest.model";
import { Profile } from "../modules/profile-details/profile.model";

export const getRecommended = async (profileId: string) => {

    const loggedInProfile = await Profile.findById(profileId);

    if (!loggedInProfile || loggedInProfile.isDeleted) {
        throw new Error("Your profile was not found.");
    }
    // Ignored profiles
    const ignoredProfileIds = await Ignore.find({
        userId: loggedInProfile._id,
    }).distinct("ignoredUserId");

    // Blocked profiles
    const blockedProfileIds = await Block.find({
        userId: loggedInProfile._id,
    }).distinct("blockedUserId");

    // Profiles that blocked me
    const blockedMeProfileIds = await Block.find({
        blockedUserId: loggedInProfile._id,
    }).distinct("userId");

    // Already sent interest
    const interestedProfileIds = await Interest.find({
        senderId: loggedInProfile._id,
    }).distinct("receiverId");

    // Excluded profiles
    const excludedIds = [
        loggedInProfile._id,
        ...ignoredProfileIds,
        ...blockedProfileIds,
        ...blockedMeProfileIds,
        ...interestedProfileIds,
    ];

    const uniqueExcludedIds = [
        ...new Set(excludedIds.map((id) => id.toString())),
    ];

    // Fetch remaining profiles
    const profiles = await Profile.find({
        _id: {
            $nin: uniqueExcludedIds,
        },
        isDeleted: false,
    });

    const recommendedProfiles = profiles.map((profile) => {

        let score = 0;

        // Religion
        if (
            profile.religionDetails?.religion ===
            loggedInProfile.religionDetails?.religion
        ) {
            score += 20;
        }

        // Mother Tongue
        if (
            profile.religionDetails?.motherTongue ===
            loggedInProfile.religionDetails?.motherTongue
        ) {
            score += 15;
        }

        // State
        if (
            profile.locationDetails?.state ===
            loggedInProfile.locationDetails?.state
        ) {
            score += 10;
        }

        // City
        if (
            profile.locationDetails?.city ===
            loggedInProfile.locationDetails?.city
        ) {
            score += 10;
        }

        // Highest Qualification
        if (
            profile.educationDetails?.highestQualification ===
            loggedInProfile.educationDetails?.highestQualification
        ) {
            score += 15;
        }

        // Occupation
        if (
            profile.careerDetails?.occupation ===
            loggedInProfile.careerDetails?.occupation
        ) {
            score += 10;
        }

        // Diet
        if (
            profile.lifestyle?.dietaryHabit ===
            loggedInProfile.lifestyle?.dietaryHabit
        ) {
            score += 5;
        }

        // Drinking
        if (
            profile.lifestyle?.drinkingHabit ===
            loggedInProfile.lifestyle?.drinkingHabit
        ) {
            score += 3;
        }

        // Smoking
        if (
            profile.lifestyle?.smokingHabit ===
            loggedInProfile.lifestyle?.smokingHabit
        ) {
            score += 3;
        }

        // Family Status
        if (
            profile.family?.familyStatus ===
            loggedInProfile.family?.familyStatus
        ) {
            score += 5;
        }

        // Rashi
        if (
            profile.horoscopeDetails?.starDetails?.rashi ===
            loggedInProfile.horoscopeDetails?.starDetails?.rashi
        ) {
            score += 8;
        }

        // Age Difference
        const ageDifference = Math.abs(
            profile.basicDetails.age -
            loggedInProfile.basicDetails.age
        );

        if (ageDifference <= 2) {
            score += 15;
        } else if (ageDifference <= 5) {
            score += 10;
        }

        // Maximum possible score = 104
        const matchPercentage = Math.round((score / 104) * 100);

        return {
            matchPercentage,
            profile,
        };

    });

    const filteredProfiles = recommendedProfiles
        .filter((profile) => profile.matchPercentage >= 50)
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 20);

    return filteredProfiles;
}