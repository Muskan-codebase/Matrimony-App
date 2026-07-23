import { Request, Response } from "express";
import { createChatRoom } from "../../../services/chat.service";
import { createChatRoomValidation } from "./chat.validation";

export const createChat = async (req: Request, res: Response) => {
    try {

        const validatedData = createChatRoomValidation.parse(req.body);

        const senderId = req.user.id;

        const { receiverId, interestId } = validatedData;

        const chatRoom = await createChatRoom(
            senderId,
            receiverId,
            interestId
        );

        return res.status(201).json({
            success: true,
            message: "Chat room created successfully.",
            data: chatRoom,
        });

    } catch (error: any) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};