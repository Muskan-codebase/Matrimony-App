import { Document } from "mongoose";

export interface ISuccessStory extends Document {

    groomName: string;

    brideName: string;

    story: string;

    year: number;

    image: string;

    isDeleted: boolean;

}