"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    var _a;
    // Extract field name from keyPattern
    const field = Object.keys(err.keyPattern || {})[0] || 'unknown';
    // Extract value from keyValue
    const value = ((_a = err.keyValue) === null || _a === void 0 ? void 0 : _a[field]) || 'unknown';
    const errorSources = [
        {
            path: field, // ✅ NOW shows which field!
            message: `${field}: "${value}" already exists`,
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: `Duplicate ${field} error`, // ✅ Clear message
        errorSources,
    };
};
exports.default = handleDuplicateError;
