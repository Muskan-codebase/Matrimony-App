import { Document, Types } from "mongoose";

export interface IProfileVisit extends Document {
  viewerProfileId: Types.ObjectId;
  visitedProfileId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}