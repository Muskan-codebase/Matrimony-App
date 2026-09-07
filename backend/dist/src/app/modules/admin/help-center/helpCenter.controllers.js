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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHelpCentre = exports.updateHelpCentre = exports.getHelpCentreById = exports.getAllHelpCenter = exports.createHelpCenter = void 0;
const helpCenter_model_1 = require("./helpCenter.model");
const mongoose_1 = __importDefault(require("mongoose"));
const helpCenter_validation_1 = require("./helpCenter.validation");
//POST create/add Help Center
const createHelpCenter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = helpCenter_validation_1.createHelpCentreSchema.parse(req.body);
        const existingHelpCentre = yield helpCenter_model_1.HelpCentre.findOne({
            title: validatedData.title,
            isDeleted: false
        });
        if (existingHelpCentre) {
            res.status(400).json({
                success: false,
                message: "Help center with this title already exists"
            });
            return;
        }
        const helpCentre = yield helpCenter_model_1.HelpCentre.create(validatedData);
        res.status(200).json({
            success: true,
            message: "Help center created successfully",
            data: helpCentre
        });
    }
    catch (error) {
        console.error("Create Help Centre Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create Help Centre",
        });
    }
});
exports.createHelpCenter = createHelpCenter;
//GET all Help Centers
const getAllHelpCenter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const helpCenters = yield helpCenter_model_1.HelpCentre.find().lean();
        if (!helpCenters) {
            res.status(400).json({
                success: false,
                message: "No Help Center found"
            });
            return;
        }
        return res.status(200).json({
            success: true,
            message: "Help Centers fetched successfully",
            data: helpCenters
        });
    }
    catch (error) {
        console.error("Get Help Centre Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch Help Centre",
        });
    }
});
exports.getAllHelpCenter = getAllHelpCenter;
// GET Help Center by Id
const getHelpCentreById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid Help Centre ID",
            });
            return;
        }
        const helpCentre = yield helpCenter_model_1.HelpCentre.findOne({
            _id: id,
            isDeleted: false,
        });
        if (!helpCentre) {
            res.status(404).json({
                success: false,
                message: "Help Centre not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Help Centre fetched successfully",
            data: helpCentre,
        });
    }
    catch (error) {
        console.error("Get Help Centre By ID Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch Help Centre",
        });
    }
});
exports.getHelpCentreById = getHelpCentreById;
// PUT/Update Help center by Id
const updateHelpCentre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid Help Centre ID",
            });
            return;
        }
        const validatedData = helpCenter_validation_1.updateHelpCentreSchema.parse(req.body);
        const helpCentre = yield helpCenter_model_1.HelpCentre.findOne({
            _id: id,
            isDeleted: false,
        });
        if (!helpCentre) {
            res.status(404).json({
                success: false,
                message: "Help Centre not found",
            });
            return;
        }
        if (validatedData.title) {
            const duplicate = yield helpCenter_model_1.HelpCentre.findOne({
                title: validatedData.title,
                _id: { $ne: id },
                isDeleted: false,
            });
            if (duplicate) {
                res.status(409).json({
                    success: false,
                    message: "Help Centre with this title already exists",
                });
                return;
            }
        }
        Object.assign(helpCentre, validatedData);
        yield helpCentre.save();
        res.status(200).json({
            success: true,
            message: "Help Centre updated successfully",
            data: helpCentre,
        });
    }
    catch (error) {
        console.error("Update Help Centre Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update Help Centre",
        });
    }
});
exports.updateHelpCentre = updateHelpCentre;
// DELETE
const deleteHelpCentre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid Help Centre ID",
            });
            return;
        }
        const helpCentre = yield helpCenter_model_1.HelpCentre.findOne({
            _id: id,
            isDeleted: false,
        });
        if (!helpCentre) {
            res.status(404).json({
                success: false,
                message: "Help Centre not found",
            });
            return;
        }
        helpCentre.isDeleted = true;
        helpCentre.isActive = false;
        yield helpCentre.save();
        res.status(200).json({
            success: true,
            message: "Help Centre deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete Help Centre Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete Help Centre",
        });
    }
});
exports.deleteHelpCentre = deleteHelpCentre;
