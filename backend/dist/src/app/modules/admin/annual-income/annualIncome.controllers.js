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
exports.deleteAnnualIncome = exports.updateAnnualIncome = exports.getAnnualIncomeById = exports.getAnnualIncomes = exports.createAnnualIncome = void 0;
const annualIncome_model_1 = require("./annualIncome.model");
const annualIncome_validation_1 = require("./annualIncome.validation");
const createAnnualIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = annualIncome_validation_1.createAnnualIncomeValidation.parse({
        body: req.body,
    });
    const result = yield annualIncome_model_1.AnnualIncome.create(validatedData.body);
    res.status(201).json({
        success: true,
        message: "Annual income created successfully",
        data: result,
    });
});
exports.createAnnualIncome = createAnnualIncome;
const getAnnualIncomes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield annualIncome_model_1.AnnualIncome.find({
        isDeleted: false,
    });
    res.status(200).json({
        success: true,
        data: result,
    });
});
exports.getAnnualIncomes = getAnnualIncomes;
const getAnnualIncomeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield annualIncome_model_1.AnnualIncome.findOne({
        _id: req.params.id,
        isDeleted: false,
    });
    res.status(200).json({
        success: true,
        data: result,
    });
});
exports.getAnnualIncomeById = getAnnualIncomeById;
const updateAnnualIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = annualIncome_validation_1.updateAnnualIncomeValidation.parse({
        body: req.body,
    });
    const result = yield annualIncome_model_1.AnnualIncome.findByIdAndUpdate(req.params.id, validatedData.body, { new: true });
    res.status(200).json({
        success: true,
        message: "Annual income updated successfully",
        data: result,
    });
});
exports.updateAnnualIncome = updateAnnualIncome;
const deleteAnnualIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield annualIncome_model_1.AnnualIncome.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    res.status(200).json({
        success: true,
        message: "Annual income deleted successfully",
        data: result,
    });
});
exports.deleteAnnualIncome = deleteAnnualIncome;
