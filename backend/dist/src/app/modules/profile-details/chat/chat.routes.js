"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = require("express");
const chat_controllers_1 = require("./chat.controllers");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post("/create-room", authMiddleware_1.authenticate, chat_controllers_1.createChat);
exports.chatRouter = router;
