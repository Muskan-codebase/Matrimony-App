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
exports.createChat = void 0;
const chat_service_1 = require("../../../services/chat.service");
const chat_validation_1 = require("./chat.validation");
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = chat_validation_1.createChatRoomValidation.parse(req.body);
        const senderId = req.user.id;
        const { receiverId, interestId } = validatedData;
        const chatRoom = yield (0, chat_service_1.createChatRoom)(senderId, receiverId, interestId);
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
