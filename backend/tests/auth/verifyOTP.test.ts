import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../src/app";
import Auth from "../../src/app/modules/auth/auth.model";
import Otp from "../../src/app/modules/auth/otp/otp.model";

describe("POST /v1/api/auth/verify-otp", () => {

    describe("Validation", () => {

        //validates if mobile number is missing
        it("should return 400 when mobile is missing", async () => {

            const response = await request(app)
                .post("/v1/api/auth/verify-otp")
                .send({
                    otp: "1234",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);

        });

        //validates if OTP is missing
        it("should return 400 when OTP is missing", async () => {

            const response = await request(app)
                .post("/v1/api/auth/verify-otp")
                .send({
                    mobile: "9876543210",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);

        });

    });

    describe("Failure Cases", () => {

        //validates if a user does not exists
        it("should return 404 when user does not exist", async () => {

            const response = await request(app)
                .post("/v1/api/auth/verify-otp")
                .send({
                    mobile: "9876543210",
                    otp: "1234",
                });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("User not found.");

        });

        //validates if OTP is not found
        it("should return 400 when OTP is not found", async () => {

            await Auth.create({
                mobile: "9876543210",
                countryCode: "+91",
            });

            const response = await request(app)
                .post("/v1/api/auth/verify-otp")
                .send({
                    mobile: "9876543210",
                    otp: "1234",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe(
                "OTP not found. Please request a new OTP."
            );

        });

        //validates if OTP has expired
        it("should return 400 when OTP has expired", async () => {

            const auth = await Auth.create({
                mobile: "9876543210",
                countryCode: "+91",
            });

            await Otp.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() - 1000),
            });

            const response = await request(app)
                .post("/v1/api/auth/verify-otp")
                .send({
                    mobile: "9876543210",
                    otp: "1234",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("OTP has expired.");

            const otp = await Otp.findOne({
                authId: auth._id,
            });

            expect(otp).not.toBeNull();
            expect(otp?.isUsed).toBe(true);
            expect(otp?.attempts).toBe(0);

        });

        //validates if OTP is incorrect
        it("should return 400 when OTP is incorrect", async () => {

            const auth = await Auth.create({
                mobile: "9876543210",
                countryCode: "+91",
            });

            await Otp.create({
                authId: auth._id,
                otp: "6543",
                expiresAt: new Date(Date.now() + 60000),
            });

            const response = await request(app)
                .post("/v1/api/auth/verify-otp")
                .send({
                    mobile: "9876543210",
                    otp: "1234",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Invalid OTP.");

            const otp = await Otp.findOne({
                authId: auth._id,
            });

            expect(otp).not.toBeNull();
            expect(otp?.attempts).toBe(1);
            expect(otp?.isUsed).toBe(false);

        });

        //marks OTP as invalid after 5 repeated attempts
        it("should mark OTP as used after 5 invalid attempts", async () => {

            const auth = await Auth.create({
                mobile: "9876543210",
                countryCode: "+91",
            });

            await Otp.create({
                authId: auth._id,
                otp: "9999",
                attempts: 4,
                expiresAt: new Date(Date.now() + 60000),
            });

            const response = await request(app)
                .post("/v1/api/auth/verify-otp")
                .send({
                    mobile: "9876543210",
                    otp: "1234",
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Invalid OTP.");

            const otp = await Otp.findOne({
                authId: auth._id,
            });

            expect(otp).not.toBeNull();
            expect(otp?.attempts).toBe(5);
            expect(otp?.isUsed).toBe(true);

        });

    });

    //Success test cases
    describe("Success Cases", () => {

        //registers a new user after successfull OTP verification
        it("should register a new user successfully", async () => {

            const auth = await Auth.create({
                mobile: "9876543210",
                countryCode: "+91",
                isVerified: false,
            });

            await Otp.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() + 60000),
            });

            const response = await request(app)
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

            const updatedUser = await Auth.findById(auth._id);

            expect(updatedUser?.isVerified).toBe(true);
            expect(updatedUser?.loginCount).toBe(1);
            expect(updatedUser?.lastLogin).toBeInstanceOf(Date);

            expect(updatedUser?.refreshToken).toBeDefined();

            const isHashedCorrectly = await bcrypt.compare(
                response.body.refreshToken,
                updatedUser!.refreshToken!
            );

            expect(isHashedCorrectly).toBe(true);

            const otp = await Otp.findOne({
                authId: auth._id,
            });

            expect(otp?.isUsed).toBe(true);

        });

        //logs in a user after successfull OTP verification if user exists
        it("should login existing verified user successfully", async () => {

            const auth = await Auth.create({
                mobile: "9876543210",
                countryCode: "+91",
                isVerified: true,
                loginCount: 5,
            });

            await Otp.create({
                authId: auth._id,
                otp: "1234",
                expiresAt: new Date(Date.now() + 60000),
            });

            const response = await request(app)
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

            const updatedUser = await Auth.findById(auth._id);

            expect(updatedUser?.isVerified).toBe(true);
            expect(updatedUser?.loginCount).toBe(6);
            expect(updatedUser?.lastLogin).toBeInstanceOf(Date);

            const isHashedCorrectly = await bcrypt.compare(
                response.body.refreshToken,
                updatedUser!.refreshToken!
            );

            expect(isHashedCorrectly).toBe(true);

            const otp = await Otp.findOne({
                authId: auth._id,
            });

            expect(otp?.isUsed).toBe(true);

        });

    });

});