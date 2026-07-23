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
exports.deleteSuccessStory = exports.updateSuccessStory = exports.getSuccessStoryById = exports.getSuccessStories = exports.createSuccessStory = void 0;
const successStory_model_1 = require("./successStory.model");
const successStory_validation_1 = require("./successStory.validation");
// Create Success Story
const createSuccessStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validatedData = successStory_validation_1.createSuccessStorySchema.parse(Object.assign(Object.assign({}, req.body), { year: Number(req.body.year), image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path }));
        const successStory = yield successStory_model_1.SuccessStory.create(validatedData);
        res.status(201).json({
            success: true,
            message: "Success story created successfully.",
            data: successStory,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createSuccessStory = createSuccessStory;
const getSuccessStories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = {
            isDeleted: false,
        };
        if (req.query.year) {
            filter.year = Number(req.query.year);
        }
        if (req.query.search) {
            filter.$or = [
                {
                    groomName: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },
                {
                    brideName: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },
            ];
        }
        const total = yield successStory_model_1.SuccessStory.countDocuments(filter);
        const successStories = yield successStory_model_1.SuccessStory.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            success: true,
            total,
            page,
            limit,
            data: successStories,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getSuccessStories = getSuccessStories;
const getSuccessStoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const successStory = yield successStory_model_1.SuccessStory.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!successStory) {
            res.status(404).json({
                success: false,
                message: "Success story not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: successStory,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getSuccessStoryById = getSuccessStoryById;
const updateSuccessStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingStory = yield successStory_model_1.SuccessStory.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!existingStory) {
            res.status(404).json({
                success: false,
                message: "Success story not found.",
            });
            return;
        }
        const validatedData = successStory_validation_1.updateSuccessStorySchema.parse(Object.assign(Object.assign(Object.assign({}, req.body), (req.body.year && {
            year: Number(req.body.year),
        })), (req.file && {
            image: req.file.path,
        })));
        Object.assign(existingStory, validatedData);
        yield existingStory.save();
        res.status(200).json({
            success: true,
            message: "Success story updated successfully.",
            data: existingStory,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updateSuccessStory = updateSuccessStory;
const deleteSuccessStory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const successStory = yield successStory_model_1.SuccessStory.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!successStory) {
            res.status(404).json({
                success: false,
                message: "Success story not found.",
            });
            return;
        }
        successStory.isDeleted = true;
        yield successStory.save();
        res.status(200).json({
            success: true,
            message: "Success story deleted successfully.",
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.deleteSuccessStory = deleteSuccessStory;
