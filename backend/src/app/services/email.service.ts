import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY!,
});

interface SendEmailParams {
    to: string;
    name?: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({
    to,
    name,
    subject,
    html,
}: SendEmailParams) => {
    try {

        console.log("FROM EMAIL:", process.env.BREVO_SENDER_EMAIL);
        console.log("FROM NAME:", process.env.BREVO_APP_NAME);

        await brevo.transactionalEmails.sendTransacEmail({
            sender: {
                email: process.env.BREVO_SENDER_EMAIL!,
                name: process.env.BREVO_APP_NAME!,
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
    } catch (error) {
        console.error("Brevo email error:", error);
        throw error;
    }
};