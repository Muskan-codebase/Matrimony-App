import { Counter } from "./counter.model";

export const generateMatrimonyId = async (): Promise<string> => {
    const counter = await Counter.findOneAndUpdate(
        {
            name: "matrimonyId",
        },
        {
            $inc: {
                sequence: 1,
            },
        },
        {
            new: true,
            upsert: true,
        }
    );

    return `SJ${counter.sequence.toString().padStart(6, "0")}`;
};