import request from "supertest";
import app from "../../src/app";
import Auth from "../../src/app/modules/auth/auth.model";
import Otp from "../../src/app/modules/auth/otp/otp.model";

describe("POST /v1/api/auth/resend-otp", () => {

    describe("Validation", () => {

        it("should return 400 when mobile is missing", async () => {

            const response = await request(app)
                .post("/v1/api/auth/resend-otp")
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);

        });

    });

    describe("Failure Cases", () => {

        it("should return 404 when user does not exist", async () => {

            const response = await request(app)
                .post("/v1/api/auth/resend-otp")
                .send({
                    mobile: "9876543210",
                });

            expect(response.status).toBe(404);

            expect(response.body.success).toBe(false);

            expect(response.body.message)
                .toBe("User not found.");

        });

        it("should return 400 when no active OTP exists", async () => {

            await Auth.create({
                mobile: "9876543210",
                countryCode: "+91",
            });

            const response = await request(app)
                .post("/v1/api/auth/resend-otp")
                .send({
                    mobile: "9876543210",
                });

            expect(response.status).toBe(400);

            expect(response.body.success).toBe(false);

            expect(response.body.message)
                .toBe("No active OTP found. Please request a new OTP.");

        });

        it("should return 429 when resend limit is exceeded", async () => {

            const auth = await Auth.create({
                mobile: "9876543210",
                countryCode: "+91",
            });

            await Otp.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() + 60000),
                resendCount: 3, // MAX_RESEND_COUNT
            });

            const response = await request(app)
                .post("/v1/api/auth/resend-otp")
                .send({
                    mobile: "9876543210",
                });

            expect(response.status).toBe(429);

            expect(response.body.success).toBe(false);

            expect(response.body.message)
                .toBe("Maximum OTP resend limit reached.");

        });

        it("should return 429 when resend cooldown is active", async () => {

            const auth = await Auth.create({
                mobile: "9876543210",
                countryCode: "+91",
            });

            await Otp.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() + 60000),
                resendCount: 1,
                lastResendAt: new Date(), // just resent
            });

            const response = await request(app)
                .post("/v1/api/auth/resend-otp")
                .send({
                    mobile: "9876543210",
                });

            expect(response.status).toBe(429);

            expect(response.body.success).toBe(false);

            expect(response.body.message)
                .toContain("Please wait");

        });

    });

    describe("Success Cases", () => {

        it("should resend OTP successfully", async () => {

            const auth = await Auth.create({
                mobile: "9876543210",
                countryCode: "+91",
            });

            await Otp.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() + 60000),
                resendCount: 0,
                lastResendAt: new Date(Date.now() - 60000), // cooldown passed
            });

            const response = await request(app)
                .post("/v1/api/auth/resend-otp")
                .send({
                    mobile: "9876543210",
                });

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);

            expect(response.body.message)
                .toBe("OTP resent successfully.");

        });

        it("should invalidate previous OTP", async () => {

            const auth = await Auth.create({
                mobile: "9876543210",
                countryCode: "+91",
            });

            const oldOtp = await Otp.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() + 60000),
                resendCount: 0,
                lastResendAt: new Date(Date.now() - 60000),
            });

            await request(app)
                .post("/v1/api/auth/resend-otp")
                .send({
                    mobile: "9876543210",
                });

            const updatedOtp = await Otp.findById(oldOtp._id);

            expect(updatedOtp).not.toBeNull();

            expect(updatedOtp?.isUsed).toBe(true);

        });

        it("should create new OTP with new expiry", async () => {

            const auth = await Auth.create({
                mobile: "9876543210",
                countryCode: "+91",
            });

            await Otp.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() + 60000),
                resendCount: 1,
                lastResendAt: new Date(Date.now() - 60000),
            });

            await request(app)
                .post("/v1/api/auth/resend-otp")
                .send({
                    mobile: "9876543210",
                });

            const otps = await Otp.find({
                authId: auth._id,
            });

            expect(otps.length).toBe(2);

            const latestOtp = await Otp.findOne({
                authId: auth._id,
                isUsed: false,
            });

            expect(latestOtp).not.toBeNull();

            expect(latestOtp?.otp).not.toBe("1234");

            expect(latestOtp?.resendCount).toBe(2);

            expect(latestOtp?.expiresAt).toBeInstanceOf(Date);

            expect(latestOtp?.lastResendAt).toBeInstanceOf(Date);

        });

    });

});