"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMatchPercentage = void 0;
const matchWeights_1 = require("../constants/matchWeights");
/* =========================================================
   BASIC HELPERS
========================================================= */
const normalize = (value) => {
    if (value === undefined || value === null) {
        return "";
    }
    return String(value)
        .trim()
        .toLowerCase();
};
const normalizeArray = (value) => {
    if (!Array.isArray(value)) {
        return [];
    }
    return value
        .map((item) => normalize(item))
        .filter(Boolean);
};
const arrayMatches = (actualValue, preferredValues) => {
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
const arrayOverlap = (firstValues, secondValues) => {
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
const heightToInches = (value) => {
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
    const feetInchesMatch = stringValue.match(/(\d+)\s*(?:'|ft|feet)\s*(\d+)?/);
    if (feetInchesMatch) {
        const feet = Number(feetInchesMatch[1]);
        const inches = Number(feetInchesMatch[2] || 0);
        if (!Number.isNaN(feet) && !Number.isNaN(inches)) {
            return feet * 12 + inches;
        }
    }
    // 64 inches
    const inchesMatch = stringValue.match(/^(\d+(?:\.\d+)?)\s*(?:"|in|inch|inches)$/);
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
const numberValue = (value) => {
    if (value === undefined ||
        value === null ||
        value === "") {
        return null;
    }
    const number = Number(value);
    return Number.isNaN(number) ? null : number;
};
/* =========================================================
   AGE
========================================================= */
const isAgeMatch = (profile, preference) => {
    var _a, _b, _c, _d, _e;
    const age = numberValue((_a = profile === null || profile === void 0 ? void 0 : profile.basicDetails) === null || _a === void 0 ? void 0 : _a.age);
    if (age === null) {
        return false;
    }
    const minAge = numberValue((_c = (_b = preference === null || preference === void 0 ? void 0 : preference.basicDetails) === null || _b === void 0 ? void 0 : _b.age) === null || _c === void 0 ? void 0 : _c.minAge);
    const maxAge = numberValue((_e = (_d = preference === null || preference === void 0 ? void 0 : preference.basicDetails) === null || _d === void 0 ? void 0 : _d.age) === null || _e === void 0 ? void 0 : _e.maxAge);
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
const isHeightMatch = (profile, preference) => {
    var _a, _b, _c, _d, _e;
    const height = heightToInches((_a = profile === null || profile === void 0 ? void 0 : profile.basicDetails) === null || _a === void 0 ? void 0 : _a.height);
    if (height === null) {
        return false;
    }
    const minHeight = heightToInches((_c = (_b = preference === null || preference === void 0 ? void 0 : preference.basicDetails) === null || _b === void 0 ? void 0 : _b.height) === null || _c === void 0 ? void 0 : _c.minHeight);
    const maxHeight = heightToInches((_e = (_d = preference === null || preference === void 0 ? void 0 : preference.basicDetails) === null || _d === void 0 ? void 0 : _d.height) === null || _e === void 0 ? void 0 : _e.maxHeight);
    if (minHeight !== null &&
        height < minHeight) {
        return false;
    }
    if (maxHeight !== null &&
        height > maxHeight) {
        return false;
    }
    return true;
};
/* =========================================================
   RELIGION
========================================================= */
const isReligionMatch = (profile, preference) => {
    var _a, _b, _c;
    const preferredReligion = (_b = (_a = preference === null || preference === void 0 ? void 0 : preference.religionAndEthnicity) === null || _a === void 0 ? void 0 : _a.religion) === null || _b === void 0 ? void 0 : _b.preference;
    if (!preferredReligion) {
        return true;
    }
    return arrayMatches((_c = profile === null || profile === void 0 ? void 0 : profile.religionDetails) === null || _c === void 0 ? void 0 : _c.religion, preferredReligion);
};
/* =========================================================
   CASTE / SUB-CASTE
========================================================= */
const isCasteMatch = (profile, preference) => {
    var _a, _b, _c, _d, _e, _f;
    const castePreferences = (_b = (_a = preference === null || preference === void 0 ? void 0 : preference.religionAndEthnicity) === null || _a === void 0 ? void 0 : _a.caste) === null || _b === void 0 ? void 0 : _b.preferences;
    const subCastePreferences = (_d = (_c = preference === null || preference === void 0 ? void 0 : preference.religionAndEthnicity) === null || _c === void 0 ? void 0 : _c.subCaste) === null || _d === void 0 ? void 0 : _d.preferences;
    const casteValues = normalizeArray(castePreferences);
    const subCasteValues = normalizeArray(subCastePreferences);
    const casteMatch = casteValues.length === 0 ||
        arrayMatches((_e = profile === null || profile === void 0 ? void 0 : profile.religionDetails) === null || _e === void 0 ? void 0 : _e.caste, casteValues);
    const subCasteMatch = subCasteValues.length === 0 ||
        arrayMatches((_f = profile === null || profile === void 0 ? void 0 : profile.religionDetails) === null || _f === void 0 ? void 0 : _f.subCaste, subCasteValues);
    return casteMatch && subCasteMatch;
};
/* =========================================================
   LOCATION
========================================================= */
const isLocationMatch = (profile, preference) => {
    var _a, _b, _c;
    const basicDetails = preference === null || preference === void 0 ? void 0 : preference.basicDetails;
    const preferredCountry = normalize(basicDetails === null || basicDetails === void 0 ? void 0 : basicDetails.partnerCountry);
    const preferredState = normalize(basicDetails === null || basicDetails === void 0 ? void 0 : basicDetails.partnerState);
    const preferredCity = normalize(basicDetails === null || basicDetails === void 0 ? void 0 : basicDetails.partnerCity);
    const country = normalize((_a = profile === null || profile === void 0 ? void 0 : profile.locationDetails) === null || _a === void 0 ? void 0 : _a.country);
    const state = normalize((_b = profile === null || profile === void 0 ? void 0 : profile.locationDetails) === null || _b === void 0 ? void 0 : _b.state);
    const city = normalize((_c = profile === null || profile === void 0 ? void 0 : profile.locationDetails) === null || _c === void 0 ? void 0 : _c.city);
    if (preferredCountry &&
        preferredCountry !== country) {
        return false;
    }
    if (preferredState &&
        preferredState !== state) {
        return false;
    }
    if (preferredCity &&
        preferredCity !== city) {
        return false;
    }
    return true;
};
/* =========================================================
   EDUCATION
========================================================= */
const isEducationMatch = (profile, preference) => {
    var _a;
    const educationPreference = preference === null || preference === void 0 ? void 0 : preference.educationDetails;
    if (!educationPreference) {
        return true;
    }
    if ((educationPreference === null || educationPreference === void 0 ? void 0 : educationPreference.doesntMatter) === true) {
        return true;
    }
    const preferredDegrees = educationPreference === null || educationPreference === void 0 ? void 0 : educationPreference.highestDegrees;
    if (normalizeArray(preferredDegrees).length === 0) {
        return true;
    }
    return arrayMatches((_a = profile === null || profile === void 0 ? void 0 : profile.educationDetails) === null || _a === void 0 ? void 0 : _a.highestQualification, preferredDegrees);
};
/* =========================================================
   OCCUPATION / PROFESSION

   Profile source:
   careerDetails.occupation
========================================================= */
const isOccupationMatch = (profile, preference) => {
    var _a, _b;
    const occupationPreference = (_a = preference === null || preference === void 0 ? void 0 : preference.educationDetails) === null || _a === void 0 ? void 0 : _a.occupation;
    if (!occupationPreference) {
        return true;
    }
    if ((occupationPreference === null || occupationPreference === void 0 ? void 0 : occupationPreference.doesntMatter) === true) {
        return true;
    }
    const preferredOccupations = occupationPreference === null || occupationPreference === void 0 ? void 0 : occupationPreference.preferences;
    if (normalizeArray(preferredOccupations).length === 0) {
        return true;
    }
    return arrayMatches((_b = profile === null || profile === void 0 ? void 0 : profile.careerDetails) === null || _b === void 0 ? void 0 : _b.occupation, preferredOccupations);
};
/* =========================================================
   INCOME
========================================================= */
const isIncomeMatch = (profile, preference) => {
    var _a, _b;
    const preferredIncome = (_a = preference === null || preference === void 0 ? void 0 : preference.educationDetails) === null || _a === void 0 ? void 0 : _a.annualIncome;
    if (preferredIncome === undefined ||
        preferredIncome === null ||
        preferredIncome === "") {
        return true;
    }
    const actualIncome = normalize((_b = profile === null || profile === void 0 ? void 0 : profile.educationDetails) === null || _b === void 0 ? void 0 : _b.annualIncome);
    if (!actualIncome) {
        return false;
    }
    if (Array.isArray(preferredIncome)) {
        return preferredIncome.some((income) => normalize(income) === actualIncome);
    }
    return (normalize(preferredIncome) ===
        actualIncome);
};
/* =========================================================
   MARITAL STATUS
========================================================= */
const isMaritalStatusMatch = (profile, preference) => {
    var _a, _b, _c;
    const preferences = (_b = (_a = preference === null || preference === void 0 ? void 0 : preference.basicDetails) === null || _a === void 0 ? void 0 : _a.maritalStatus) === null || _b === void 0 ? void 0 : _b.preferences;
    if (normalizeArray(preferences).length === 0) {
        return true;
    }
    return arrayMatches((_c = profile === null || profile === void 0 ? void 0 : profile.basicDetails) === null || _c === void 0 ? void 0 : _c.maritalStatus, preferences);
};
/* =========================================================
   MOTHER TONGUE
========================================================= */
const isMotherTongueMatch = (profile, preference) => {
    var _a, _b, _c;
    const preferred = (_b = (_a = preference === null || preference === void 0 ? void 0 : preference.religionAndEthnicity) === null || _a === void 0 ? void 0 : _a.motherTongue) === null || _b === void 0 ? void 0 : _b.preference;
    if (!preferred) {
        return true;
    }
    return arrayMatches((_c = profile === null || profile === void 0 ? void 0 : profile.religionDetails) === null || _c === void 0 ? void 0 : _c.motherTongue, preferred);
};
/* =========================================================
   LIFESTYLE

   Profile:
   lifestyleDetails.eatingHabit
   lifestyle.smokingHabit
   lifestyle.drinkingHabit
========================================================= */
const isLifestyleMatch = (profile, preference) => {
    var _a, _b, _c, _d, _e, _f;
    const lifestyle = preference === null || preference === void 0 ? void 0 : preference.lifestyleAndAppearance;
    if (!lifestyle) {
        return true;
    }
    const dietaryPreferences = (_a = lifestyle === null || lifestyle === void 0 ? void 0 : lifestyle.dietaryHabits) === null || _a === void 0 ? void 0 : _a.preferences;
    const smokingPreferences = (_b = lifestyle === null || lifestyle === void 0 ? void 0 : lifestyle.smokingHabits) === null || _b === void 0 ? void 0 : _b.preferences;
    const drinkingPreferences = (_c = lifestyle === null || lifestyle === void 0 ? void 0 : lifestyle.drinkingHabits) === null || _c === void 0 ? void 0 : _c.preferences;
    if (normalizeArray(dietaryPreferences).length > 0 &&
        !arrayMatches((_d = profile === null || profile === void 0 ? void 0 : profile.lifestyleDetails) === null || _d === void 0 ? void 0 : _d.eatingHabit, dietaryPreferences)) {
        return false;
    }
    if (normalizeArray(smokingPreferences).length > 0 &&
        !arrayMatches((_e = profile === null || profile === void 0 ? void 0 : profile.lifestyle) === null || _e === void 0 ? void 0 : _e.smokingHabit, smokingPreferences)) {
        return false;
    }
    if (normalizeArray(drinkingPreferences).length > 0 &&
        !arrayMatches((_f = profile === null || profile === void 0 ? void 0 : profile.lifestyle) === null || _f === void 0 ? void 0 : _f.drinkingHabit, drinkingPreferences)) {
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
const isFamilyMatch = (profile, preference) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const familyPreference = preference === null || preference === void 0 ? void 0 : preference.familyDetails;
    if (!familyPreference) {
        return true;
    }
    /*
     * Family type
     */
    const preferredFamilyTypes = (_b = (_a = familyPreference === null || familyPreference === void 0 ? void 0 : familyPreference.familyType) === null || _a === void 0 ? void 0 : _a.preferences) !== null && _b !== void 0 ? _b : (_c = familyPreference === null || familyPreference === void 0 ? void 0 : familyPreference.familyTypes) === null || _c === void 0 ? void 0 : _c.preferences;
    if (normalizeArray(preferredFamilyTypes).length > 0 &&
        !arrayMatches((_d = profile === null || profile === void 0 ? void 0 : profile.family) === null || _d === void 0 ? void 0 : _d.familyType, preferredFamilyTypes)) {
        return false;
    }
    /*
     * Family values
     */
    const preferredFamilyValues = (_f = (_e = familyPreference === null || familyPreference === void 0 ? void 0 : familyPreference.familyValue) === null || _e === void 0 ? void 0 : _e.preferences) !== null && _f !== void 0 ? _f : (_g = familyPreference === null || familyPreference === void 0 ? void 0 : familyPreference.familyValues) === null || _g === void 0 ? void 0 : _g.preferences;
    if (normalizeArray(preferredFamilyValues).length > 0 &&
        !arrayMatches((_h = profile === null || profile === void 0 ? void 0 : profile.family) === null || _h === void 0 ? void 0 : _h.familyValue, preferredFamilyValues)) {
        return false;
    }
    /*
     * Family location
     */
    const preferredCountry = (_j = familyPreference === null || familyPreference === void 0 ? void 0 : familyPreference.familyBasedOutOfCountry) === null || _j === void 0 ? void 0 : _j.country;
    if (preferredCountry &&
        normalize(preferredCountry) !==
            normalize((_k = profile === null || profile === void 0 ? void 0 : profile.family) === null || _k === void 0 ? void 0 : _k.familyBasedOutOf)) {
        return false;
    }
    return true;
};
/* =========================================================
   HOROSCOPE / MANGLIK
========================================================= */
const isHoroscopeMatch = (profile, preference) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const horoscopePreference = preference === null || preference === void 0 ? void 0 : preference.religionAndEthnicity;
    /*
     * Manglik / Dosh
     */
    const manglikPreferences = (_a = horoscopePreference === null || horoscopePreference === void 0 ? void 0 : horoscopePreference.manglikStatus) === null || _a === void 0 ? void 0 : _a.preferences;
    if (normalizeArray(manglikPreferences).length > 0) {
        const hasDosh = (_b = profile === null || profile === void 0 ? void 0 : profile.religionDetails) === null || _b === void 0 ? void 0 : _b.hasDosh;
        const manglikMatch = normalizeArray(manglikPreferences).some((value) => {
            if (value === "yes" ||
                value === "true" ||
                value === "manglik") {
                return hasDosh === true;
            }
            if (value === "no" ||
                value === "false" ||
                value === "non-manglik" ||
                value === "non manglik") {
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
    const nakshatraPreferences = (_c = horoscopePreference === null || horoscopePreference === void 0 ? void 0 : horoscopePreference.nakshatra) === null || _c === void 0 ? void 0 : _c.preferences;
    if (normalizeArray(nakshatraPreferences).length > 0 &&
        !arrayMatches((_e = (_d = profile === null || profile === void 0 ? void 0 : profile.horoscopeDetails) === null || _d === void 0 ? void 0 : _d.starDetails) === null || _e === void 0 ? void 0 : _e.nakshatra, nakshatraPreferences)) {
        return false;
    }
    /*
     * Rashi
     */
    const rashiPreferences = (_f = horoscopePreference === null || horoscopePreference === void 0 ? void 0 : horoscopePreference.rashi) === null || _f === void 0 ? void 0 : _f.preferences;
    if (normalizeArray(rashiPreferences).length > 0 &&
        !arrayMatches((_h = (_g = profile === null || profile === void 0 ? void 0 : profile.horoscopeDetails) === null || _g === void 0 ? void 0 : _g.starDetails) === null || _h === void 0 ? void 0 : _h.rashi, rashiPreferences)) {
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
const isInterestsMatch = (profileA, profileB) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
    const interestsA = [
        ...((_b = (_a = profileA === null || profileA === void 0 ? void 0 : profileA.lifestyle) === null || _a === void 0 ? void 0 : _a.hobbies) !== null && _b !== void 0 ? _b : []),
        ...((_d = (_c = profileA === null || profileA === void 0 ? void 0 : profileA.lifestyle) === null || _c === void 0 ? void 0 : _c.favouriteMusic) !== null && _d !== void 0 ? _d : []),
        ...((_f = (_e = profileA === null || profileA === void 0 ? void 0 : profileA.lifestyle) === null || _e === void 0 ? void 0 : _e.favouriteBooks) !== null && _f !== void 0 ? _f : []),
        ...((_h = (_g = profileA === null || profileA === void 0 ? void 0 : profileA.lifestyle) === null || _g === void 0 ? void 0 : _g.sports) !== null && _h !== void 0 ? _h : []),
        ...((_k = (_j = profileA === null || profileA === void 0 ? void 0 : profileA.lifestyle) === null || _j === void 0 ? void 0 : _j.cuisine) !== null && _k !== void 0 ? _k : []),
        ...((_m = (_l = profileA === null || profileA === void 0 ? void 0 : profileA.lifestyle) === null || _l === void 0 ? void 0 : _l.movies) !== null && _m !== void 0 ? _m : []),
        ...((_p = (_o = profileA === null || profileA === void 0 ? void 0 : profileA.lifestyle) === null || _o === void 0 ? void 0 : _o.favouriteRead) !== null && _p !== void 0 ? _p : []),
        ...((_r = (_q = profileA === null || profileA === void 0 ? void 0 : profileA.lifestyle) === null || _q === void 0 ? void 0 : _q.tvShow) !== null && _r !== void 0 ? _r : []),
    ];
    const interestsB = [
        ...((_t = (_s = profileB === null || profileB === void 0 ? void 0 : profileB.lifestyle) === null || _s === void 0 ? void 0 : _s.hobbies) !== null && _t !== void 0 ? _t : []),
        ...((_v = (_u = profileB === null || profileB === void 0 ? void 0 : profileB.lifestyle) === null || _u === void 0 ? void 0 : _u.favouriteMusic) !== null && _v !== void 0 ? _v : []),
        ...((_x = (_w = profileB === null || profileB === void 0 ? void 0 : profileB.lifestyle) === null || _w === void 0 ? void 0 : _w.favouriteBooks) !== null && _x !== void 0 ? _x : []),
        ...((_z = (_y = profileB === null || profileB === void 0 ? void 0 : profileB.lifestyle) === null || _y === void 0 ? void 0 : _y.sports) !== null && _z !== void 0 ? _z : []),
        ...((_1 = (_0 = profileB === null || profileB === void 0 ? void 0 : profileB.lifestyle) === null || _0 === void 0 ? void 0 : _0.cuisine) !== null && _1 !== void 0 ? _1 : []),
        ...((_3 = (_2 = profileB === null || profileB === void 0 ? void 0 : profileB.lifestyle) === null || _2 === void 0 ? void 0 : _2.movies) !== null && _3 !== void 0 ? _3 : []),
        ...((_5 = (_4 = profileB === null || profileB === void 0 ? void 0 : profileB.lifestyle) === null || _4 === void 0 ? void 0 : _4.favouriteRead) !== null && _5 !== void 0 ? _5 : []),
        ...((_7 = (_6 = profileB === null || profileB === void 0 ? void 0 : profileB.lifestyle) === null || _6 === void 0 ? void 0 : _6.tvShow) !== null && _7 !== void 0 ? _7 : []),
    ];
    return arrayOverlap(interestsA, interestsB);
};
/* =========================================================
   MUTUAL MATCH CALCULATION
========================================================= */
const calculateMatchPercentage = (profileA, preferenceA, profileB, preferenceB) => {
    let score = 0;
    /*
     * AGE - 10
     *
     * B must satisfy A
     * AND
     * A must satisfy B
     */
    if (isAgeMatch(profileB, preferenceA) &&
        isAgeMatch(profileA, preferenceB)) {
        score += matchWeights_1.MATCH_WEIGHTS.age;
    }
    /*
     * RELIGION - 10
     */
    if (isReligionMatch(profileB, preferenceA) &&
        isReligionMatch(profileA, preferenceB)) {
        score += matchWeights_1.MATCH_WEIGHTS.religion;
    }
    /*
     * CASTE / SUB-CASTE - 8
     */
    if (isCasteMatch(profileB, preferenceA) &&
        isCasteMatch(profileA, preferenceB)) {
        score += matchWeights_1.MATCH_WEIGHTS.casteSubCaste;
    }
    /*
     * LOCATION - 8
     */
    if (isLocationMatch(profileB, preferenceA) &&
        isLocationMatch(profileA, preferenceB)) {
        score += matchWeights_1.MATCH_WEIGHTS.location;
    }
    /*
     * EDUCATION - 10
     */
    if (isEducationMatch(profileB, preferenceA) &&
        isEducationMatch(profileA, preferenceB)) {
        score += matchWeights_1.MATCH_WEIGHTS.education;
    }
    /*
     * PROFESSION / OCCUPATION - 10
     */
    if (isOccupationMatch(profileB, preferenceA) &&
        isOccupationMatch(profileA, preferenceB)) {
        score += matchWeights_1.MATCH_WEIGHTS.occupation;
    }
    /*
     * INCOME - 8
     */
    if (isIncomeMatch(profileB, preferenceA) &&
        isIncomeMatch(profileA, preferenceB)) {
        score += matchWeights_1.MATCH_WEIGHTS.income;
    }
    /*
     * HEIGHT - 5
     */
    if (isHeightMatch(profileB, preferenceA) &&
        isHeightMatch(profileA, preferenceB)) {
        score += matchWeights_1.MATCH_WEIGHTS.height;
    }
    /*
     * MARITAL STATUS - 8
     */
    if (isMaritalStatusMatch(profileB, preferenceA) &&
        isMaritalStatusMatch(profileA, preferenceB)) {
        score += matchWeights_1.MATCH_WEIGHTS.maritalStatus;
    }
    /*
     * MOTHER TONGUE - 5
     */
    if (isMotherTongueMatch(profileB, preferenceA) &&
        isMotherTongueMatch(profileA, preferenceB)) {
        score += matchWeights_1.MATCH_WEIGHTS.motherTongue;
    }
    /*
     * LIFESTYLE - 7
     */
    if (isLifestyleMatch(profileB, preferenceA) &&
        isLifestyleMatch(profileA, preferenceB)) {
        score += matchWeights_1.MATCH_WEIGHTS.lifestyle;
    }
    /*
     * FAMILY - 5
     */
    if (isFamilyMatch(profileB, preferenceA) &&
        isFamilyMatch(profileA, preferenceB)) {
        score += matchWeights_1.MATCH_WEIGHTS.family;
    }
    /*
     * HOROSCOPE / MANGLIK - 4
     */
    if (isHoroscopeMatch(profileB, preferenceA) &&
        isHoroscopeMatch(profileA, preferenceB)) {
        score += matchWeights_1.MATCH_WEIGHTS.horoscope;
    }
    /*
     * INTERESTS & HOBBIES - 2
     */
    if (isInterestsMatch(profileA, profileB)) {
        score += matchWeights_1.MATCH_WEIGHTS.interests;
    }
    return Math.min(score, 100);
};
exports.calculateMatchPercentage = calculateMatchPercentage;
