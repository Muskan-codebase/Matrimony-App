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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const brevo_1 = require("@getbrevo/brevo");
const brevo = new brevo_1.BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, name, subject, html, }) {
    try {
        console.log("FROM EMAIL:", process.env.BREVO_SENDER_EMAIL);
        console.log("FROM NAME:", process.env.BREVO_APP_NAME);
        yield brevo.transactionalEmails.sendTransacEmail({
            sender: {
                email: process.env.BREVO_SENDER_EMAIL,
                name: process.env.BREVO_APP_NAME,
            },
            to: [
                {
                    email: to,
                    name,
                },
            ],
            subject,
            htmlContent: html,
        });
        console.log(`Email sent successfully to ${to}`);
    }
    catch (error) {
        console.error("Brevo email error:", error);
        throw error;
    }
});
exports.sendEmail = sendEmail;
