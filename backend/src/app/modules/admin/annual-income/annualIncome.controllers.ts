import { Request, Response } from "express";
import { AnnualIncome } from "./annualIncome.model";
import {
    createAnnualIncomeValidation,
    updateAnnualIncomeValidation,
} from "./annualIncome.validation";

export const createAnnualIncome = async (
    req: Request,
    res: Response
) => {
    const validatedData = createAnnualIncomeValidation.parse({
        body: req.body,
    });

    const result = await AnnualIncome.create(validatedData.body);

    res.status(201).json({
        success: true,
        message: "Annual income created successfully",
        data: result,
    });
};

export const getAnnualIncomes = async (
    req: Request,
    res: Response
) => {
    const result = await AnnualIncome.find({
        isDeleted: false,
    });

    res.status(200).json({
        success: true,
        data: result,
    });
};

export const getAnnualIncomeById = async (
    req: Request,
    res: Response
) => {
    const result = await AnnualIncome.findOne({
        _id: req.params.id,
        isDeleted: false,
    });

    res.status(200).json({
        success: true,
        data: result,
    });
};

export const updateAnnualIncome = async (
    req: Request,
    res: Response
) => {
    const validatedData = updateAnnualIncomeValidation.parse({
        body: req.body,
    });

    const result = await AnnualIncome.findByIdAndUpdate(
        req.params.id,
        validatedData.body,
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: "Annual income updated successfully",
        data: result,
    });
};

export const deleteAnnualIncome = async (
    req: Request,
    res: Response
) => {
    const result = await AnnualIncome.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: "Annual income deleted successfully",
        data: result,
    });
};