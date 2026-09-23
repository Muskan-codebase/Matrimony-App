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
const app_1 = __importDefault(require("../../src/app"));
const auth_model_1 = __importDefault(require("../../src/app/modules/auth/auth.model"));
const otp_model_1 = __importDefault(require("../../src/app/modules/auth/otp/otp.model"));
describe("POST /v1/api/auth/resend-otp", () => {
    describe("Validation", () => {
        it("should return 400 when mobile is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/resend-otp")
                .send({});
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        }));
    });
    describe("Failure Cases", () => {
        it("should return 404 when user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/resend-otp")
                .send({
                mobile: "9876543210",
            });
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message)
                .toBe("User not found.");
        }));
        it("should return 400 when no active OTP exists", () => __awaiter(void 0, void 0, void 0, function* () {
            yield auth_model_1.default.create({
                mobile: "9876543210",
                countryCode: "+91",
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/resend-otp")
                .send({
                mobile: "9876543210",
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message)
                .toBe("No active OTP found. Please request a new OTP.");
        }));
        it("should return 429 when resend limit is exceeded", () => __awaiter(void 0, void 0, void 0, function* () {
            const auth = yield auth_model_1.default.create({
                mobile: "9876543210",
                countryCode: "+91",
            });
            yield otp_model_1.default.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() + 60000),
                resendCount: 3, // MAX_RESEND_COUNT
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/resend-otp")
                .send({
                mobile: "9876543210",
            });
            expect(response.status).toBe(429);
            expect(response.body.success).toBe(false);
            expect(response.body.message)
                .toBe("Maximum OTP resend limit reached.");
        }));
        it("should return 429 when resend cooldown is active", () => __awaiter(void 0, void 0, void 0, function* () {
            const auth = yield auth_model_1.default.create({
                mobile: "9876543210",
                countryCode: "+91",
            });
            yield otp_model_1.default.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() + 60000),
                resendCount: 1,
                lastResendAt: new Date(), // just resent
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/resend-otp")
                .send({
                mobile: "9876543210",
            });
            expect(response.status).toBe(429);
            expect(response.body.success).toBe(false);
            expect(response.body.message)
                .toContain("Please wait");
        }));
    });
    describe("Success Cases", () => {
        it("should resend OTP successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const auth = yield auth_model_1.default.create({
                mobile: "9876543210",
                countryCode: "+91",
            });
            yield otp_model_1.default.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() + 60000),
                resendCount: 0,
                lastResendAt: new Date(Date.now() - 60000), // cooldown passed
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/resend-otp")
                .send({
                mobile: "9876543210",
            });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message)
                .toBe("OTP resent successfully.");
        }));
        it("should invalidate previous OTP", () => __awaiter(void 0, void 0, void 0, function* () {
            const auth = yield auth_model_1.default.create({
                mobile: "9876543210",
                countryCode: "+91",
            });
            const oldOtp = yield otp_model_1.default.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() + 60000),
                resendCount: 0,
                lastResendAt: new Date(Date.now() - 60000),
            });
            yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/resend-otp")
                .send({
                mobile: "9876543210",
            });
            const updatedOtp = yield otp_model_1.default.findById(oldOtp._id);
            expect(updatedOtp).not.toBeNull();
            expect(updatedOtp === null || updatedOtp === void 0 ? void 0 : updatedOtp.isUsed).toBe(true);
        }));
        it("should create new OTP with new expiry", () => __awaiter(void 0, void 0, void 0, function* () {
            const auth = yield auth_model_1.default.create({
                mobile: "9876543210",
                countryCode: "+91",
            });
            yield otp_model_1.default.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() + 60000),
                resendCount: 1,
                lastResendAt: new Date(Date.now() - 60000),
            });
            yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/resend-otp")
                .send({
                mobile: "9876543210",
            });
            const otps = yield otp_model_1.default.find({
                authId: auth._id,
            });
            expect(otps.length).toBe(2);
            const latestOtp = yield otp_model_1.default.findOne({
                authId: auth._id,
                isUsed: false,
            });
            expect(latestOtp).not.toBeNull();
            expect(latestOtp === null || latestOtp === void 0 ? void 0 : latestOtp.otp).not.toBe("1234");
            expect(latestOtp === null || latestOtp === void 0 ? void 0 : latestOtp.resendCount).toBe(2);
            expect(latestOtp === null || latestOtp === void 0 ? void 0 : latestOtp.expiresAt).toBeInstanceOf(Date);
            expect(latestOtp === null || latestOtp === void 0 ? void 0 : latestOtp.lastResendAt).toBeInstanceOf(Date);
        }));
    });
});
