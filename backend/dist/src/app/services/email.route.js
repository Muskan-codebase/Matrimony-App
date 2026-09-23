"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmailRouter = void 0;
const email_controller_1 = require("./email.controller");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/email", email_controller_1.testEmail);
exports.testEmailRouter = router;
