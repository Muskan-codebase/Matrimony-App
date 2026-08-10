import { Router } from "express";
import {
    createPress,
    getPress,
    getPressById,
    updatePress,
    deletePress,
} from "./press.controllers";
import { authenticate } from "../../../middlewares/authMiddleware";
import { upload } from "../../../config/cloudinary";

const router = Router();

router.post("/", authenticate, upload.single("image"), createPress);

router.get("/", getPress);

router.get("/:id", getPressById);

router.put("/:id", authenticate, upload.single("image"), updatePress);

router.delete("/:id", authenticate, deletePress);

export const pressRouter = router;