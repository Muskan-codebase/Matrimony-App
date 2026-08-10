import mongoose, { Schema } from "mongoose";
import { IContactUsDocument } from "./contactUs.interface";

const contactUsSchema = new Schema<IContactUsDocument>(
    {
        officeAddress: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
    },
    {
        timestamps: true,
    }
);

const ContactUs = mongoose.model<IContactUsDocument>(
    "ContactUs",
    contactUsSchema
);

export default ContactUs;