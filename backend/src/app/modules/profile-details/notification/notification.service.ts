import Auth from "../../auth/auth.model";

export const registerToken = async (userId: any, token: any) => {
    await Auth.findByIdAndUpdate(
        userId,
        {
            $addToSet: {
                fcmTokens: token,
            },
        },
        {
            new: true,
        }
    );
};