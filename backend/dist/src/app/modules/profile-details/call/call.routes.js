"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../../middlewares/authMiddleware");
const call_controller_1 = require("./call.controller");
const router = (0, express_1.Router)();
router.post("/update", authMiddleware_1.authenticate, call_controller_1.updateCallController);
exports.default = router;
