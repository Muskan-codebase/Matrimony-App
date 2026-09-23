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
exports.getAllMyMessages = exports.getChatsController = exports.createChat = exports.sendMessageController = void 0;
const chat_service_1 = require("../../../services/chat.service");
const chat_validation_1 = require("./chat.validation");
const chat_service_2 = require("../../../services/chat.service");
const sendMessageController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, text = "", type } = req.body;
        const authUserId = req.user.id;
        let attachment;
        if (req.file) {
            const file = req.file;
            attachment = {
                url: file.path,
                publicId: file.filename,
                fileName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
            };
        }
        const message = yield (0, chat_service_1.sendMessage)(roomId, authUserId, text, type, attachment);
        return res.status(201).json({
            success: true,
            message: "Message sent successfully.",
            data: message,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.sendMessageController = sendMessageController;
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = chat_validation_1.createChatRoomValidation.parse(req.body);
        const senderId = req.user.id;
        const { interestId } = validatedData;
        const chatRoom = yield (0, chat_service_1.createChatRoom)(senderId, interestId);
        return res.status(201).json({
            success: true,
            message: "Chat room created successfully.",
            data: chatRoom,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createChat = createChat;
const getChatsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authUserId = req.user.id;
        const chats = yield (0, chat_service_2.getChats)(authUserId);
        return res.status(200).json({
            success: true,
            message: "Chats fetched successfully.",
            data: chats,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong.",
        });
    }
});
exports.getChatsController = getChatsController;
const getAllMyMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authUserId = req.user.id;
        const { roomId } = req.params;
        const messages = yield (0, chat_service_1.getMessages)(roomId, authUserId);
        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully.",
            data: messages,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong.",
        });
    }
});
exports.getAllMyMessages = getAllMyMessages;
