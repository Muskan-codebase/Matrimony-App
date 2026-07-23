import { Document } from "mongoose";

export interface IHeight extends Document {

    height: string;

    isDeleted: boolean;

}