"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const app_1 = __importDefault(require("../../src/app"));
const auth_model_1 = __importDefault(require("../../src/app/modules/auth/auth.model"));
const otp_model_1 = __importDefault(require("../../src/app/modules/auth/otp/otp.model"));
describe("POST /v1/api/auth/verify-otp", () => {
    describe("Validation", () => {
        //validates if mobile number is missing
        it("should return 400 when mobile is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/verify-otp")
                .send({
                otp: "1234",
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        }));
        //validates if OTP is missing
        it("should return 400 when OTP is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/verify-otp")
                .send({
                mobile: "9876543210",
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        }));
    });
    describe("Failure Cases", () => {
        //validates if a user does not exists
        it("should return 404 when user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/verify-otp")
                .send({
                mobile: "9876543210",
                otp: "1234",
            });
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("User not found.");
        }));
        //validates if OTP is not found
        it("should return 400 when OTP is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            yield auth_model_1.default.create({
                mobile: "9876543210",
                countryCode: "+91",
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/verify-otp")
                .send({
                mobile: "9876543210",
                otp: "1234",
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("OTP not found. Please request a new OTP.");
        }));
        //validates if OTP has expired
        it("should return 400 when OTP has expired", () => __awaiter(void 0, void 0, void 0, function* () {
            const auth = yield auth_model_1.default.create({
                mobile: "9876543210",
                countryCode: "+91",
            });
            yield otp_model_1.default.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() - 1000),
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/verify-otp")
                .send({
                mobile: "9876543210",
                otp: "1234",
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("OTP has expired.");
            const otp = yield otp_model_1.default.findOne({
                authId: auth._id,
            });
            expect(otp).not.toBeNull();
            expect(otp === null || otp === void 0 ? void 0 : otp.isUsed).toBe(true);
            expect(otp === null || otp === void 0 ? void 0 : otp.attempts).toBe(0);
        }));
        //validates if OTP is incorrect
        it("should return 400 when OTP is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
            const auth = yield auth_model_1.default.create({
                mobile: "9876543210",
                countryCode: "+91",
            });
            yield otp_model_1.default.create({
                authId: auth._id,
                otp: "6543",
                expiresAt: new Date(Date.now() + 60000),
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/verify-otp")
                .send({
                mobile: "9876543210",
                otp: "1234",
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Invalid OTP.");
            const otp = yield otp_model_1.default.findOne({
                authId: auth._id,
            });
            expect(otp).not.toBeNull();
            expect(otp === null || otp === void 0 ? void 0 : otp.attempts).toBe(1);
            expect(otp === null || otp === void 0 ? void 0 : otp.isUsed).toBe(false);
        }));
        //marks OTP as invalid after 5 repeated attempts
        it("should mark OTP as used after 5 invalid attempts", () => __awaiter(void 0, void 0, void 0, function* () {
            const auth = yield auth_model_1.default.create({
                mobile: "9876543210",
                countryCode: "+91",
            });
            yield otp_model_1.default.create({
                authId: auth._id,
                otp: "9999",
                attempts: 4,
                expiresAt: new Date(Date.now() + 60000),
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/verify-otp")
                .send({
                mobile: "9876543210",
                otp: "1234",
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Invalid OTP.");
            const otp = yield otp_model_1.default.findOne({
                authId: auth._id,
            });
            expect(otp).not.toBeNull();
            expect(otp === null || otp === void 0 ? void 0 : otp.attempts).toBe(5);
            expect(otp === null || otp === void 0 ? void 0 : otp.isUsed).toBe(true);
        }));
    });
    //Success test cases
    describe("Success Cases", () => {
        //registers a new user after successfull OTP verification
        it("should register a new user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const auth = yield auth_model_1.default.create({
                mobile: "9876543210",
                countryCode: "+91",
                isVerified: false,
            });
            yield otp_model_1.default.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() + 60000),
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/verify-otp")
                .send({
                mobile: "9876543210",
                otp: "1234",
            });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.isNewUser).toBe(true);
            expect(response.body.message).toBe("Registered successfully.");
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.refreshToken).toBeDefined();
            const updatedUser = yield auth_model_1.default.findById(auth._id);
            expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.isVerified).toBe(true);
            expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.loginCount).toBe(1);
            expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.lastLogin).toBeInstanceOf(Date);
            expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.refreshToken).toBeDefined();
            const isHashedCorrectly = yield bcrypt_1.default.compare(response.body.refreshToken, updatedUser.refreshToken);
            expect(isHashedCorrectly).toBe(true);
            const otp = yield otp_model_1.default.findOne({
                authId: auth._id,
            });
            expect(otp === null || otp === void 0 ? void 0 : otp.isUsed).toBe(true);
        }));
        //logs in a user after successfull OTP verification if user exists
        it("should login existing verified user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const auth = yield auth_model_1.default.create({
                mobile: "9876543210",
                countryCode: "+91",
                isVerified: true,
                loginCount: 5,
            });
            yield otp_model_1.default.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() + 60000),
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/verify-otp")
                .send({
                mobile: "9876543210",
                otp: "1234",
            });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.isNewUser).toBe(false);
            expect(response.body.message).toBe("Logged in successfully.");
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.refreshToken).toBeDefined();
            const updatedUser = yield auth_model_1.default.findById(auth._id);
            expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.isVerified).toBe(true);
            expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.loginCount).toBe(6);
            expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.lastLogin).toBeInstanceOf(Date);
            const isHashedCorrectly = yield bcrypt_1.default.compare(response.body.refreshToken, updatedUser.refreshToken);
            expect(isHashedCorrectly).toBe(true);
            const otp = yield otp_model_1.default.findOne({
                authId: auth._id,
            });
            expect(otp === null || otp === void 0 ? void 0 : otp.isUsed).toBe(true);
        }));
    });
});
