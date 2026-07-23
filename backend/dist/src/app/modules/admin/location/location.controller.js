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
exports.deleteLocation = exports.updateLocation = exports.getLocationById = exports.getLocations = exports.createLocation = void 0;
const location_model_1 = require("./location.model");
const location_validation_1 = require("./location.validation");
const createLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = location_validation_1.createLocationSchema.parse({
            body: req.body,
        });
        const existingLocation = yield location_model_1.Location.findOne({
            country: validatedData.body.country,
            state: validatedData.body.state,
            city: validatedData.body.city,
            isDeleted: false,
        });
        if (existingLocation) {
            return res.status(409).json({
                success: false,
                message: "Location already exists.",
            });
        }
        const location = yield location_model_1.Location.create(validatedData.body);
        return res.status(201).json({
            success: true,
            message: "Location created successfully.",
            data: location,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createLocation = createLocation;
const getLocations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locations = yield location_model_1.Location.find({
            isDeleted: false,
        });
        return res.status(200).json({
            success: true,
            count: locations.length,
            data: locations,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getLocations = getLocations;
const getLocationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const location = yield location_model_1.Location.findOne({
            _id: req.params.id,
            isDeleted: false,
        });
        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found.",
            });
        }
        return res.status(200).json({
            success: true,
            data: location,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getLocationById = getLocationById;
const updateLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = location_validation_1.updateLocationSchema.parse({
            body: req.body,
        });
        const location = yield location_model_1.Location.findOneAndUpdate({
            _id: req.params.id,
            isDeleted: false,
        }, {
            $set: validatedData.body,
        }, {
            new: true,
            runValidators: true,
        });
        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Location updated successfully.",
            data: location,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updateLocation = updateLocation;
const deleteLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const location = yield location_model_1.Location.findOneAndUpdate({
            _id: req.params.id,
            isDeleted: false,
        }, {
            isDeleted: true,
        }, {
            new: true,
        });
        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Location deleted successfully.",
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.deleteLocation = deleteLocation;
