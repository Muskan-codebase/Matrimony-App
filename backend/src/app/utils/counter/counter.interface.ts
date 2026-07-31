import { Document } from "mongoose";

export interface ICounter extends Document {
    name: string;
    sequence: number;
}