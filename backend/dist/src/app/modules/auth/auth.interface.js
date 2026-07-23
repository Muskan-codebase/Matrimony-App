"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.AuthProvider = void 0;
var AuthProvider;
(function (AuthProvider) {
    AuthProvider["OTP"] = "OTP";
})(AuthProvider || (exports.AuthProvider = AuthProvider = {}));
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
