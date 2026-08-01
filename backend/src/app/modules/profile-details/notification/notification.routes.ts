import express from "express";
import { authenticate } from "../../../middlewares/authMiddleware.js";
import { registerTokenSchema } from "./notification.validation.js";
import * as notificationController from "./notification.controller.js";

const router = express.Router();

router.post("/register-token", authenticate, notificationController.registerToken);

export const notificationRouter = router;