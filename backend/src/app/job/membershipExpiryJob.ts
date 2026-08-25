import cron from "node-cron";
import { Profile } from "../modules/profile-details/profile.model";
import { AccountSettings } from "../modules/account-settings/accountSettings.model";
import { sendEmail } from "../services/email.service";
import Auth from "../modules/auth/auth.model"

export const startMembershipExpiryJob = () => {

    // Runs every hour
    cron.schedule("0 * * * *", async () => {

        try {

            const now = new Date();

            // Find memberships expiring within the next 24 hours
            const next24Hours = new Date(now);
            next24Hours.setHours(
                next24Hours.getHours() + 24
            );

            const profiles = await Profile.find({
                "subscription.isActive": true,

                "subscription.expiryDate": {
                    $gte: now,
                    $lte: next24Hours,
                },
            }).lean();


            for (const profile of profiles) {

                const userId = profile.userId;

                // Check email notification setting
                const settings =
                    await AccountSettings.findOne({
                        userId,
                        isDeleted: false,
                    }).lean();


                if (
                    settings
                        ?.notificationSettings
                        ?.emailNotifications
                        ?.membershipMails === false
                ) {
                    continue;
                }


                // Get user's email
                const userProfile =
                    await Profile.findById(userId).lean();


                if (!userProfile?.contactDetails?.email) {
                    continue;
                }


                const expiryDate =
                    profile.subscription?.expiryDate;


                if (!expiryDate) {
                    continue;
                }


                await sendEmail({

                    to: userProfile?.contactDetails?.email,

                    name: userProfile?.basicDetails?.firstName,

                    subject:
                        "Your SahaJeevan Membership is Expiring",

                    html: `
                        <h2>Membership Expiry Reminder</h2>

                        <p>
                            Hi ${userProfile?.basicDetails?.firstName || "User"},
                        </p>

                        <p>
                            Your SahaJeevan membership will
                            expire on
                            <strong>
                                ${new Date(
                        expiryDate
                    ).toLocaleDateString()}
                            </strong>.
                        </p>

                        <p>
                            Renew your membership to continue
                            enjoying SahaJeevan's premium features.
                        </p>

                        <p>
                            Regards,<br>
                            SahaJeevan Team
                        </p>
                    `,
                });

            }

        } catch (error) {

            console.error(
                "Membership expiry email job error:",
                error
            );

        }

    });

};