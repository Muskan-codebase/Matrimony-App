import Auth from "../../auth/auth.model";

export const registerToken = async (userId: any, token: any) => {

    console.log("User ID:", userId);
    console.log("Token:", token);

    const updatedUser = await Auth.findByIdAndUpdate(
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

    console.log("Updated User:", updatedUser);
};