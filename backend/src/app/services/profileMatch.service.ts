import { MATCH_WEIGHTS } from "../constants/matchWeights";

/* =========================================================
   BASIC HELPERS
========================================================= */

const normalize = (value: any): string => {
    if (value === undefined || value === null) {
        return "";
    }

    return String(value)
        .trim()
        .toLowerCase();
};

const normalizeArray = (value: any): string[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => normalize(item))
        .filter(Boolean);
};

const arrayMatches = (
    actualValue: any,
    preferredValues: any
): boolean => {
    const actual = normalize(actualValue);

    if (!actual) {
        return false;
    }

    const preferences = normalizeArray(preferredValues);

    if (!preferences.length) {
        return true;
    }

    return preferences.includes(actual);
};

const arrayOverlap = (
    firstValues: any,
    secondValues: any
): boolean => {
    const first = normalizeArray(firstValues);
    const second = normalizeArray(secondValues);

    if (!first.length || !second.length) {
        return false;
    }

    return first.some((value) => second.includes(value));
};


/* =========================================================
   HEIGHT
   Profile stores height as String.

   Supports:
   5'4"
   5' 4"
   5'4
   5 feet 4 inches
   64
   ========================================================= */

const heightToInches = (value: any): number | null => {
    if (value === undefined || value === null) {
        return null;
    }

    const stringValue = String(value)
        .trim()
        .toLowerCase();

    if (!stringValue) {
        return null;
    }

    // 5'4", 5' 4", 5'4
    const feetInchesMatch = stringValue.match(
        /(\d+)\s*(?:'|ft|feet)\s*(\d+)?/
    );

    if (feetInchesMatch) {
        const feet = Number(feetInchesMatch[1]);
        const inches = Number(feetInchesMatch[2] || 0);

        if (!Number.isNaN(feet) && !Number.isNaN(inches)) {
            return feet * 12 + inches;
        }
    }

    // 64 inches
    const inchesMatch = stringValue.match(
        /^(\d+(?:\.\d+)?)\s*(?:"|in|inch|inches)$/
    );

    if (inchesMatch) {
        const inches = Number(inchesMatch[1]);

        return Number.isNaN(inches) ? null : inches;
    }

    // Numeric value
    const numericValue = Number(stringValue);

    if (!Number.isNaN(numericValue)) {
        return numericValue;
    }

    return null;
};


/* =========================================================
   RANGE HELPER
========================================================= */

const numberValue = (value: any): number | null => {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }

    const number = Number(value);

    return Number.isNaN(number) ? null : number;
};


/* =========================================================
   AGE
========================================================= */

const isAgeMatch = (
    profile: any,
    preference: any
): boolean => {
    const age = numberValue(
        profile?.basicDetails?.age
    );

    if (age === null) {
        return false;
    }

    const minAge = numberValue(
        preference?.basicDetails?.age?.minAge
    );

    const maxAge = numberValue(
        preference?.basicDetails?.age?.maxAge
    );

    if (minAge !== null && age < minAge) {
        return false;
    }

    if (maxAge !== null && age > maxAge) {
        return false;
    }

    return true;
};


/* =========================================================
   HEIGHT
========================================================= */

const isHeightMatch = (
    profile: any,
    preference: any
): boolean => {
    const height = heightToInches(
        profile?.basicDetails?.height
    );

    if (height === null) {
        return false;
    }

    const minHeight = heightToInches(
        preference?.basicDetails?.height?.minHeight
    );

    const maxHeight = heightToInches(
        preference?.basicDetails?.height?.maxHeight
    );

    if (
        minHeight !== null &&
        height < minHeight
    ) {
        return false;
    }

    if (
        maxHeight !== null &&
        height > maxHeight
    ) {
        return false;
    }

    return true;
};


/* =========================================================
   RELIGION
========================================================= */

const isReligionMatch = (
    profile: any,
    preference: any
): boolean => {
    const preferredReligion =
        preference
            ?.religionAndEthnicity
            ?.religion
            ?.preference;

    if (!preferredReligion) {
        return true;
    }

    return arrayMatches(
        profile?.religionDetails?.religion,
        preferredReligion
    );
};


/* =========================================================
   CASTE / SUB-CASTE
========================================================= */

const isCasteMatch = (
    profile: any,
    preference: any
): boolean => {
    const castePreferences =
        preference
            ?.religionAndEthnicity
            ?.caste
            ?.preferences;

    const subCastePreferences =
        preference
            ?.religionAndEthnicity
            ?.subCaste
            ?.preferences;

    const casteValues =
        normalizeArray(castePreferences);

    const subCasteValues =
        normalizeArray(subCastePreferences);

    const casteMatch =
        casteValues.length === 0 ||
        arrayMatches(
            profile?.religionDetails?.caste,
            casteValues
        );

    const subCasteMatch =
        subCasteValues.length === 0 ||
        arrayMatches(
            profile?.religionDetails?.subCaste,
            subCasteValues
        );

    return casteMatch && subCasteMatch;
};


/* =========================================================
   LOCATION
========================================================= */

const isLocationMatch = (
    profile: any,
    preference: any
): boolean => {
    const basicDetails =
        preference?.basicDetails;

    const preferredCountry =
        normalize(
            basicDetails?.partnerCountry
        );

    const preferredState =
        normalize(
            basicDetails?.partnerState
        );

    const preferredCity =
        normalize(
            basicDetails?.partnerCity
        );

    const country =
        normalize(
            profile?.locationDetails?.country
        );

    const state =
        normalize(
            profile?.locationDetails?.state
        );

    const city =
        normalize(
            profile?.locationDetails?.city
        );

    if (
        preferredCountry &&
        preferredCountry !== country
    ) {
        return false;
    }

    if (
        preferredState &&
        preferredState !== state
    ) {
        return false;
    }

    if (
        preferredCity &&
        preferredCity !== city
    ) {
        return false;
    }

    return true;
};


/* =========================================================
   EDUCATION
========================================================= */

const isEducationMatch = (
    profile: any,
    preference: any
): boolean => {
    const educationPreference =
        preference?.educationDetails;

    if (!educationPreference) {
        return true;
    }

    if (
        educationPreference?.doesntMatter === true
    ) {
        return true;
    }

    const preferredDegrees =
        educationPreference?.highestDegrees;

    if (
        normalizeArray(preferredDegrees).length === 0
    ) {
        return true;
    }

    return arrayMatches(
        profile?.educationDetails?.highestQualification,
        preferredDegrees
    );
};


/* =========================================================
   OCCUPATION / PROFESSION

   Profile source:
   careerDetails.occupation
========================================================= */

const isOccupationMatch = (
    profile: any,
    preference: any
): boolean => {
    const occupationPreference =
        preference
            ?.educationDetails
            ?.occupation;

    if (!occupationPreference) {
        return true;
    }

    if (
        occupationPreference?.doesntMatter === true
    ) {
        return true;
    }

    const preferredOccupations =
        occupationPreference?.preferences;

    if (
        normalizeArray(preferredOccupations).length === 0
    ) {
        return true;
    }

    return arrayMatches(
        profile?.careerDetails?.occupation,
        preferredOccupations
    );
};


/* =========================================================
   INCOME
========================================================= */

const isIncomeMatch = (
    profile: any,
    preference: any
): boolean => {
    const preferredIncome =
        preference
            ?.educationDetails
            ?.annualIncome;

    if (
        preferredIncome === undefined ||
        preferredIncome === null ||
        preferredIncome === ""
    ) {
        return true;
    }

    const actualIncome =
        normalize(
            profile?.educationDetails?.annualIncome
        );

    if (!actualIncome) {
        return false;
    }

    if (Array.isArray(preferredIncome)) {
        return preferredIncome.some(
            (income: any) =>
                normalize(income) === actualIncome
        );
    }

    return (
        normalize(preferredIncome) ===
        actualIncome
    );
};


/* =========================================================
   MARITAL STATUS
========================================================= */

const isMaritalStatusMatch = (
    profile: any,
    preference: any
): boolean => {
    const preferences =
        preference
            ?.basicDetails
            ?.maritalStatus
            ?.preferences;

    if (
        normalizeArray(preferences).length === 0
    ) {
        return true;
    }

    return arrayMatches(
        profile?.basicDetails?.maritalStatus,
        preferences
    );
};


/* =========================================================
   MOTHER TONGUE
========================================================= */

const isMotherTongueMatch = (
    profile: any,
    preference: any
): boolean => {
    const preferred =
        preference
            ?.religionAndEthnicity
            ?.motherTongue
            ?.preference;

    if (!preferred) {
        return true;
    }

    return arrayMatches(
        profile?.religionDetails?.motherTongue,
        preferred
    );
};


/* =========================================================
   LIFESTYLE

   Profile:
   lifestyleDetails.eatingHabit
   lifestyle.smokingHabit
   lifestyle.drinkingHabit
========================================================= */

const isLifestyleMatch = (
    profile: any,
    preference: any
): boolean => {
    const lifestyle =
        preference?.lifestyleAndAppearance;

    if (!lifestyle) {
        return true;
    }

    const dietaryPreferences =
        lifestyle
            ?.dietaryHabits
            ?.preferences;

    const smokingPreferences =
        lifestyle
            ?.smokingHabits
            ?.preferences;

    const drinkingPreferences =
        lifestyle
            ?.drinkingHabits
            ?.preferences;

    if (
        normalizeArray(dietaryPreferences).length > 0 &&
        !arrayMatches(
            profile?.lifestyleDetails?.eatingHabit,
            dietaryPreferences
        )
    ) {
        return false;
    }

    if (
        normalizeArray(smokingPreferences).length > 0 &&
        !arrayMatches(
            profile?.lifestyle?.smokingHabit,
            smokingPreferences
        )
    ) {
        return false;
    }

    if (
        normalizeArray(drinkingPreferences).length > 0 &&
        !arrayMatches(
            profile?.lifestyle?.drinkingHabit,
            drinkingPreferences
        )
    ) {
        return false;
    }

    return true;
};


/* =========================================================
   FAMILY

   Profile:
   family.familyType
   family.familyValue
   family.familyBasedOutOf
========================================================= */

const isFamilyMatch = (
    profile: any,
    preference: any
): boolean => {
    const familyPreference =
        preference?.familyDetails;

    if (!familyPreference) {
        return true;
    }

    /*
     * Family type
     */
    const preferredFamilyTypes =
        familyPreference
            ?.familyType
            ?.preferences ??
        familyPreference
            ?.familyTypes
            ?.preferences;

    if (
        normalizeArray(preferredFamilyTypes).length > 0 &&
        !arrayMatches(
            profile?.family?.familyType,
            preferredFamilyTypes
        )
    ) {
        return false;
    }

    /*
     * Family values
     */
    const preferredFamilyValues =
        familyPreference
            ?.familyValue
            ?.preferences ??
        familyPreference
            ?.familyValues
            ?.preferences;

    if (
        normalizeArray(preferredFamilyValues).length > 0 &&
        !arrayMatches(
            profile?.family?.familyValue,
            preferredFamilyValues
        )
    ) {
        return false;
    }

    /*
     * Family location
     */
    const preferredCountry =
        familyPreference
            ?.familyBasedOutOfCountry
            ?.country;

    if (
        preferredCountry &&
        normalize(preferredCountry) !==
            normalize(
                profile?.family?.familyBasedOutOf
            )
    ) {
        return false;
    }

    return true;
};


/* =========================================================
   HOROSCOPE / MANGLIK
========================================================= */

const isHoroscopeMatch = (
    profile: any,
    preference: any
): boolean => {
    const horoscopePreference =
        preference?.religionAndEthnicity;

    /*
     * Manglik / Dosh
     */
    const manglikPreferences =
        horoscopePreference
            ?.manglikStatus
            ?.preferences;

    if (
        normalizeArray(manglikPreferences).length > 0
    ) {
        const hasDosh =
            profile?.religionDetails?.hasDosh;

        const manglikMatch =
            normalizeArray(
                manglikPreferences
            ).some((value) => {
                if (
                    value === "yes" ||
                    value === "true" ||
                    value === "manglik"
                ) {
                    return hasDosh === true;
                }

                if (
                    value === "no" ||
                    value === "false" ||
                    value === "non-manglik" ||
                    value === "non manglik"
                ) {
                    return hasDosh === false;
                }

                return false;
            });

        if (!manglikMatch) {
            return false;
        }
    }

    /*
     * Nakshatra
     */
    const nakshatraPreferences =
        horoscopePreference
            ?.nakshatra
            ?.preferences;

    if (
        normalizeArray(nakshatraPreferences).length > 0 &&
        !arrayMatches(
            profile
                ?.horoscopeDetails
                ?.starDetails
                ?.nakshatra,
            nakshatraPreferences
        )
    ) {
        return false;
    }

    /*
     * Rashi
     */
    const rashiPreferences =
        horoscopePreference
            ?.rashi
            ?.preferences;

    if (
        normalizeArray(rashiPreferences).length > 0 &&
        !arrayMatches(
            profile
                ?.horoscopeDetails
                ?.starDetails
                ?.rashi,
            rashiPreferences
        )
    ) {
        return false;
    }

    return true;
};


/* =========================================================
   INTERESTS & HOBBIES

   This is profile-to-profile compatibility because
   interests are characteristics of the profiles themselves.

   Weight = only 2%, so this contributes 2 points when
   there is at least one common interest.
========================================================= */

const isInterestsMatch = (
    profileA: any,
    profileB: any
): boolean => {
    const interestsA = [
        ...(profileA?.lifestyle?.hobbies ?? []),
        ...(profileA?.lifestyle?.favouriteMusic ?? []),
        ...(profileA?.lifestyle?.favouriteBooks ?? []),
        ...(profileA?.lifestyle?.sports ?? []),
        ...(profileA?.lifestyle?.cuisine ?? []),
        ...(profileA?.lifestyle?.movies ?? []),
        ...(profileA?.lifestyle?.favouriteRead ?? []),
        ...(profileA?.lifestyle?.tvShow ?? []),
    ];

    const interestsB = [
        ...(profileB?.lifestyle?.hobbies ?? []),
        ...(profileB?.lifestyle?.favouriteMusic ?? []),
        ...(profileB?.lifestyle?.favouriteBooks ?? []),
        ...(profileB?.lifestyle?.sports ?? []),
        ...(profileB?.lifestyle?.cuisine ?? []),
        ...(profileB?.lifestyle?.movies ?? []),
        ...(profileB?.lifestyle?.favouriteRead ?? []),
        ...(profileB?.lifestyle?.tvShow ?? []),
    ];

    return arrayOverlap(
        interestsA,
        interestsB
    );
};


/* =========================================================
   MUTUAL MATCH CALCULATION
========================================================= */

export const calculateMatchPercentage = (
    profileA: any,
    preferenceA: any,
    profileB: any,
    preferenceB: any
): number => {
    let score = 0;

    /*
     * AGE - 10
     *
     * B must satisfy A
     * AND
     * A must satisfy B
     */
    if (
        isAgeMatch(profileB, preferenceA) &&
        isAgeMatch(profileA, preferenceB)
    ) {
        score += MATCH_WEIGHTS.age;
    }

    /*
     * RELIGION - 10
     */
    if (
        isReligionMatch(profileB, preferenceA) &&
        isReligionMatch(profileA, preferenceB)
    ) {
        score += MATCH_WEIGHTS.religion;
    }

    /*
     * CASTE / SUB-CASTE - 8
     */
    if (
        isCasteMatch(profileB, preferenceA) &&
        isCasteMatch(profileA, preferenceB)
    ) {
        score += MATCH_WEIGHTS.casteSubCaste;
    }

    /*
     * LOCATION - 8
     */
    if (
        isLocationMatch(profileB, preferenceA) &&
        isLocationMatch(profileA, preferenceB)
    ) {
        score += MATCH_WEIGHTS.location;
    }

    /*
     * EDUCATION - 10
     */
    if (
        isEducationMatch(profileB, preferenceA) &&
        isEducationMatch(profileA, preferenceB)
    ) {
        score += MATCH_WEIGHTS.education;
    }

    /*
     * PROFESSION / OCCUPATION - 10
     */
    if (
        isOccupationMatch(profileB, preferenceA) &&
        isOccupationMatch(profileA, preferenceB)
    ) {
        score += MATCH_WEIGHTS.occupation;
    }

    /*
     * INCOME - 8
     */
    if (
        isIncomeMatch(profileB, preferenceA) &&
        isIncomeMatch(profileA, preferenceB)
    ) {
        score += MATCH_WEIGHTS.income;
    }

    /*
     * HEIGHT - 5
     */
    if (
        isHeightMatch(profileB, preferenceA) &&
        isHeightMatch(profileA, preferenceB)
    ) {
        score += MATCH_WEIGHTS.height;
    }

    /*
     * MARITAL STATUS - 8
     */
    if (
        isMaritalStatusMatch(profileB, preferenceA) &&
        isMaritalStatusMatch(profileA, preferenceB)
    ) {
        score += MATCH_WEIGHTS.maritalStatus;
    }

    /*
     * MOTHER TONGUE - 5
     */
    if (
        isMotherTongueMatch(profileB, preferenceA) &&
        isMotherTongueMatch(profileA, preferenceB)
    ) {
        score += MATCH_WEIGHTS.motherTongue;
    }

    /*
     * LIFESTYLE - 7
     */
    if (
        isLifestyleMatch(profileB, preferenceA) &&
        isLifestyleMatch(profileA, preferenceB)
    ) {
        score += MATCH_WEIGHTS.lifestyle;
    }

    /*
     * FAMILY - 5
     */
    if (
        isFamilyMatch(profileB, preferenceA) &&
        isFamilyMatch(profileA, preferenceB)
    ) {
        score += MATCH_WEIGHTS.family;
    }

    /*
     * HOROSCOPE / MANGLIK - 4
     */
    if (
        isHoroscopeMatch(profileB, preferenceA) &&
        isHoroscopeMatch(profileA, preferenceB)
    ) {
        score += MATCH_WEIGHTS.horoscope;
    }

    /*
     * INTERESTS & HOBBIES - 2
     */
    if (
        isInterestsMatch(profileA, profileB)
    ) {
        score += MATCH_WEIGHTS.interests;
    }

    return Math.min(score, 100);
};