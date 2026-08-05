import { Request, Response } from "express";
import { updateCall, getCalls } from "../../../services/call.service";
import { Profile } from "../profile.model";

export const updateCallController = async (
    req: Request,
    res: Response
) => {

    await updateCall(req.body);

    return res.status(200).json({

        success: true,

        message: "Call updated successfully."

    });

};

export const getCallsController = async (
    req: Request,
    res: Response
) => {
    try {
        // Get logged-in user's profile
        const profile = await Profile.findOne({
            userId: req.user.id,
        }).select("_id");

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found.",
            });
        }

        const calls = await getCalls(profile._id.toString());

        return res.status(200).json({
            success: true,
            message: "Calls fetched successfully.",
            data: calls,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};