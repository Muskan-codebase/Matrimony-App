import { Request, Response } from "express";
import { sendEmail } from "./email.service";

export const testEmail = async (req: Request, res: Response) => {
    try {
        await sendEmail({
            to: "dummyuserjd1995@gmail.com",
            name: "John Doe",
            subject: "SahaJeevan Test Email",
            html: `
                <h2>Brevo is working!</h2>
                <p>This is a test email from SahaJeevan.</p>
            `,
        });

        res.status(200).json({
            success: true,
            message: "Test email sent successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to send test email",
        });
    }
};