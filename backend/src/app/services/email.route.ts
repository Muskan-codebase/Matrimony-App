import { testEmail } from "./email.controller";
import { Router } from "express";
const router = Router();

router.get("/email", testEmail);

export const testEmailRouter = router;