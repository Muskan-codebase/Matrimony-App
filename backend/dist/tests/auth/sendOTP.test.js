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
describe("POST /v1/api/auth/send-otp", () => {
    describe("Validation", () => {
        //validates if a given mobile number is missing
        it("should return 400 when mobile is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/send-otp")
                .send({
                countryCode: "+91"
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        }));
        //validates if the given country code is missing
        it("should return 400 when countryCode is missing", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/send-otp")
                .send({
                mobile: "9876543210"
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        }));
        //validates if a given mobile number is invalid
        it("should return 400 when mobile is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/send-otp")
                .send({
                countryCode: "+91",
                mobile: "123"
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        }));
    });
    describe("Success Cases", () => {
        //Creates a new user & sends OTP
        it("should create new user and send OTP", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/send-otp")
                .send({
                countryCode: "+91",
                mobile: "9876543210"
            });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        }));
        //sends OTP to the existing verified user
        it("should send OTP for existing verified user", () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const existingUser = yield auth_model_1.default.create({
                mobile: "9876543210",
                countryCode: "+91",
                isVerified: true,
            });
            // Act
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/v1/api/auth/send-otp")
                .send({
                countryCode: "+91",
                mobile: "9876543210",
            });
            // Assert Response
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.isExistingUser).toBe(true);
            expect(response.body.message).toBe("OTP sent. Enter it to log in.");
            // Verify only one Auth document exists
            const authUsers = yield auth_model_1.default.find({
                mobile: "9876543210",
            });
            expect(authUsers.length).toBe(1);
            // Verify OTP is created
            const otp = yield otp_model_1.default.findOne({
                authId: existingUser._id,
                isUsed: false,
            });
            expect(otp).not.toBeNull();
            expect(otp === null || otp === void 0 ? void 0 : otp.authId.toString()).toBe(existingUser._id.toString());
            expect(otp === null || otp === void 0 ? void 0 : otp.expiresAt).toBeInstanceOf(Date);
        }));
    });
});
