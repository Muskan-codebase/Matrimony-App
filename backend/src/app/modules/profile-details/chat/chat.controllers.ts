import { Request, Response, NextFunction } from "express";
import { createChatRoom, sendMessage, getMessages } from "../../../services/chat.service";
import { createChatRoomValidation } from "./chat.validation";
import { ChatAttachment } from "./chat.interface";
import { getChats } from "../../../services/chat.service";

interface CloudinaryFile extends Express.Multer.File {
    path: string;
    filename: string;
}

export const sendMessageController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { roomId, text = "", type } = req.body;

        const authUserId = req.user.id;

        let attachment: ChatAttachment | undefined;

        if (req.file) {
            const file = req.file as CloudinaryFile;

            attachment = {
                url: file.path,
                publicId: file.filename,
                fileName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
            };
        }

        const message = await sendMessage(
            roomId,
            authUserId,
            text,
            type,
            attachment
        );

        return res.status(201).json({
            success: true,
            message: "Message sent successfully.",
            data: message,
        });

    } catch (error) {
        next(error);
    }
};

export const createChat = async (req: Request, res: Response) => {
    try {

        const validatedData = createChatRoomValidation.parse(req.body);

        const senderId = req.user.id;

        const { interestId } = validatedData;


        const chatRoom = await createChatRoom(
            senderId,
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

export const getChatsController = async (
    req: Request,
    res: Response
) => {
    try {

        const authUserId = req.user.id;

        const chats = await getChats(authUserId);

        return res.status(200).json({
            success: true,
            message: "Chats fetched successfully.",
            data: chats,
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong.",
        });

    }
};

export const getAllMyMessages = async (
    req: Request,
    res: Response,
) => {

    try {

        const authUserId = req.user.id;

        const { roomId } = req.params;

        const messages = await getMessages(
            roomId,
            authUserId,
        );

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully.",
            data: messages,
        });

    } catch (error: any) {

        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong.",
        });

    }

};