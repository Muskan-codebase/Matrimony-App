import { Request, Response } from 'express';
import { HelpCentre } from './helpCenter.model';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import {
  createHelpCentreSchema,
  updateHelpCentreSchema,
} from './helpCenter.validation';

// multer/form-data sends every field as a string — coerce before Zod sees it
const coerceBody = (body: Record<string, any>) => {
  const out = { ...body };
  if (out.displayOrder !== undefined)
    out.displayOrder = Number(out.displayOrder);
  if (out.isActive !== undefined)
    out.isActive = out.isActive === 'true' || out.isActive === true;
  return out;
};

//POST create/add Help Center
export const createHelpCenter = async (req: Request, res: Response) => {
  try {
    const validatedData = createHelpCentreSchema.parse(coerceBody(req.body));
    const iconUrl = (req.file as any)?.path;

    const existingHelpCentre = await HelpCentre.findOne({
      title: validatedData.title,
      isDeleted: false,
    });

    if (existingHelpCentre) {
      res.status(400).json({
        success: false,
        message: 'Help center with this title already exists',
      });
      return;
    }

    const helpCentre = await HelpCentre.create({
      ...validatedData,
      icon: iconUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Help center created successfully',
      data: helpCentre,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: error.message,
      });
      return;
    }

    console.error('Create Help Centre Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Help Centre',
    });
  }
};

//GET all Help Centers
export const getAllHelpCenter = async (req: Request, res: Response) => {
  try {
    const helpCenters = await HelpCentre.find({ isDeleted: false })
      .sort({ displayOrder: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Help Centers fetched successfully',
      data: helpCenters,
    });
  } catch (error: any) {
    console.error('Get Help Centre Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Help Centre',
    });
  }
};

// GET Help Center by Id
export const getHelpCentreById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid Help Centre ID',
      });
      return;
    }

    const helpCentre = await HelpCentre.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!helpCentre) {
      res.status(404).json({
        success: false,
        message: 'Help Centre not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Help Centre fetched successfully',
      data: helpCentre,
    });
  } catch (error) {
    console.error('Get Help Centre By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Help Centre',
    });
  }
};

// PUT/Update Help center by Id
export const updateHelpCentre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid Help Centre ID',
      });
      return;
    }

    const validatedData: any = updateHelpCentreSchema.parse(
      coerceBody(req.body),
    );

    const helpCentre = await HelpCentre.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!helpCentre) {
      res.status(404).json({
        success: false,
        message: 'Help Centre not found',
      });
      return;
    }

    if (validatedData.title) {
      const duplicate = await HelpCentre.findOne({
        title: validatedData.title,
        _id: { $ne: id },
        isDeleted: false,
      });

      if (duplicate) {
        res.status(409).json({
          success: false,
          message: 'Help Centre with this title already exists',
        });
        return;
      }
    }

    // only overwrite icon if a new file was actually uploaded
    if (req.file) {
      validatedData.icon = (req.file as any).path;
    }

    Object.assign(helpCentre, validatedData);
    await helpCentre.save();

    res.status(200).json({
      success: true,
      message: 'Help Centre updated successfully',
      data: helpCentre,
    });
  } catch (error: any) {
    if (error instanceof ZodError || error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: error.errors,
      });
      return;
    }

    console.error('Update Help Centre Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update Help Centre',
    });
  }
};

// DELETE Help Center by Id
export const deleteHelpCentre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid Help Centre ID',
      });
      return;
    }

    const helpCentre = await HelpCentre.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!helpCentre) {
      res.status(404).json({
        success: false,
        message: 'Help Centre not found',
      });
      return;
    }

    helpCentre.isDeleted = true;
    helpCentre.isActive = false;

    await helpCentre.save();

    res.status(200).json({
      success: true,
      message: 'Help Centre deleted successfully',
    });
  } catch (error) {
    console.error('Delete Help Centre Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete Help Centre',
    });
  }
};
