import { Request, Response } from 'express';
import { updateCall, getCalls } from '../../../services/call.service';
import {
  generateZegoToken,
  generateRoomId,
} from '../../../services/zego.service';
import { Profile } from '../profile.model';
import { checkCallLimit } from './call.limit.service';

export const updateCallController = async (req: Request, res: Response) => {
  try {
    // Only gate the call at creation time ("ringing"). Every other
    // status (answered/rejected/missed/ended) is just a lifecycle
    // update on a call that was already allowed to start.
    if (req.body?.status === 'ringing' && req.body?.senderId) {
      const limitResult = await checkCallLimit(req.body.senderId);

      if (!limitResult.allowed) {
        return res.status(403).json({
          success: false,
          message: limitResult.message,
        });
      }
    }

    await updateCall(req.body);

    return res.status(200).json({
      success: true,

      message: 'Call updated successfully.',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Issues a ZegoCloud token for the authenticated user, after checking
 * their package's callLimit / dailyCallLimit via checkCallLimit().
 * The frontend calls this right before joining a Zego room; /call/update
 * (above) remains the source of truth for call history/limit counting.
 */
export const getCallTokenController = async (req: Request, res: Response) => {
  try {
    const { receiverId, callType } = req.body as {
      receiverId?: string;
      callType?: 'voice' | 'video';
    };

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: 'receiverId is required.',
      });
    }

    const callerProfile = await Profile.findOne({
      userId: req.user.id,
    }).select('_id');

    if (!callerProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found.',
      });
    }

    const callerProfileId = callerProfile._id.toString();

    if (callerProfileId === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot call yourself.',
      });
    }

    const limitResult = await checkCallLimit(callerProfileId);

    if (!limitResult.allowed) {
      return res.status(403).json({
        success: false,
        message: limitResult.message,
      });
    }

    const { token, appId, expiresIn } = generateZegoToken(callerProfileId);
    const roomId = generateRoomId(callerProfileId, receiverId);

    return res.status(200).json({
      success: true,
      message: 'Call token generated successfully.',
      data: {
        token,
        appId,
        roomId,
        userId: callerProfileId,
        callType: callType ?? 'voice',
        expiresIn,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCallsController = async (req: Request, res: Response) => {
  try {
    // Get logged-in user's profile
    const profile = await Profile.findOne({
      userId: req.user.id,
    }).select('_id');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found.',
      });
    }

    const calls = await getCalls(profile._id.toString());

    return res.status(200).json({
      success: true,
      message: 'Calls fetched successfully.',
      data: calls,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
