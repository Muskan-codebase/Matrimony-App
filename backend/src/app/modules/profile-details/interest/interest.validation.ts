import { z } from "zod";

export const createInterestSchema = z.object({

    body: z.object({

        receiverId: z.string().min(1, "Receiver Id is required."),

    }),

});

export const updateInterestSchema = z.object({

    body: z.object({

        status: z.enum([
            "Accepted",
            "Rejected",
            "Withdrawn",
        ]),

    }),

});