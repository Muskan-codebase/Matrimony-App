import { Document } from "mongoose";

export interface ILocation extends Document {

    country: string;

    state: string;

    city: string;

    isDeleted: boolean;

}