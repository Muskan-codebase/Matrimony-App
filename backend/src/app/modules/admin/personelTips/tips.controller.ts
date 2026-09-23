import { Request, Response } from 'express';
import { OnlinePersonalTip } from './tips.model';
import {
  createOnlinePersonalTipSchema,
  updateOnlinePersonalTipSchema,
} from './tips.validation';

export const createOnlinePersonalTip = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const image = (req.file as any)?.path;

    if (!image) {
      res.status(400).json({
        success: false,
        message: 'Image is required.',
      });
      return;
    }

    const validatedData = createOnlinePersonalTipSchema.parse({
      ...req.body,
      image,
      displayOrder: req.body.displayOrder
        ? Number(req.body.displayOrder)
        : undefined,
      isActive:
        req.body.isActive !== undefined
          ? req.body.isActive === 'true'
          : undefined,
    });

    const tip = await OnlinePersonalTip.create(validatedData);

    res.status(201).json({
      success: true,
      message: 'Online Personal Tip created successfully.',
      data: tip,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: error.errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const getOnlinePersonalTips = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const tips = await OnlinePersonalTip.find({ isDeleted: false }).sort({
      displayOrder: 1,
    });

    res.status(200).json({
      success: true,
      message: 'Online Personal Tips fetched successfully.',
      data: tips,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const getOnlinePersonalTipById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const tip = await OnlinePersonalTip.findOne({ _id: id, isDeleted: false });

    if (!tip) {
      res.status(404).json({
        success: false,
        message: 'Online Personal Tip not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Online Personal Tip fetched successfully.',
      data: tip,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const updateOnlinePersonalTip = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const existingTip = await OnlinePersonalTip.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!existingTip) {
      res.status(404).json({
        success: false,
        message: 'Online Personal Tip not found.',
      });
      return;
    }

    const updatedData: any = { ...req.body };

    // Update image only if a new file is uploaded
    if (req.file) {
      updatedData.image = (req.file as any).path;
    }

    // multipart/form-data sends everything as strings — coerce before Zod sees it
    if (updatedData.displayOrder !== undefined) {
      updatedData.displayOrder = Number(updatedData.displayOrder);
    }
    if (updatedData.isActive !== undefined) {
      updatedData.isActive = updatedData.isActive === 'true';
    }

    const validatedData = updateOnlinePersonalTipSchema.parse(updatedData);

    const tip = await OnlinePersonalTip.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Online Personal Tip updated successfully.',
      data: tip,
    });
  } catch (error: any) {
    if (error.name === 'ZodError' || error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: error.errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const deleteOnlinePersonalTip = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const tip = await OnlinePersonalTip.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );

    if (!tip) {
      res.status(404).json({
        success: false,
        message: 'Online Personal Tip not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Online Personal Tip deleted successfully.',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
