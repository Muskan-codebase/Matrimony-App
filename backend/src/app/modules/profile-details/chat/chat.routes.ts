import { Router } from "express";
import { createChat } from "./chat.controllers";
import { authenticate } from "../../../middlewares/authMiddleware";

const router = Router();

router.post("/create-room", authenticate, createChat);

export const chatRouter = router;