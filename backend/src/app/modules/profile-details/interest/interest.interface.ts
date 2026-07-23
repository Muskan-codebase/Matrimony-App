import { Document, Types } from "mongoose";

export interface IInterest extends Document {

    senderId: Types.ObjectId;

    receiverId: Types.ObjectId;

    status: "Pending" | "Accepted" | "Rejected" | "Withdrawn";

    isDeleted: boolean;

}