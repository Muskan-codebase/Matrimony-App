import mongoose, { Schema } from "mongoose";
import { IProfileVisit } from "./profileVisits.interface";

const profileVisitSchema = new Schema<IProfileVisit>(
    {
        viewerProfileId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },
        visitedProfileId: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

profileVisitSchema.index({
    viewerProfileId: 1,
    visitedProfileId: 1,
});

export default mongoose.model<IProfileVisit>(
    "ProfileVisit",
    profileVisitSchema
);