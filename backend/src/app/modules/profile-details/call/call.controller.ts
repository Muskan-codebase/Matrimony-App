import { Request, Response } from "express";
import { updateCall } from "../../../services/call.service";

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