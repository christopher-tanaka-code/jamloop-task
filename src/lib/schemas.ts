import { z } from "zod";

export const CampaignInput = z
  .object({
    name: z.string().min(2),
    budget_usd: z.coerce.number().min(0),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    age_min: z.coerce.number().int().min(13),
    age_max: z.coerce.number().int().max(120),
    gender: z.enum(["any", "male", "female", "nonbinary"]),
    country: z.string().min(2),
    state: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    zip: z.string().optional().nullable(),
    inventory: z
      .array(
        z.enum([
          "Hulu",
          "Discovery",
          "ABC",
          "A&E",
          "TLC",
          "Fox News",
          "Fox Sports",
          "Etc",
        ])
      )
      .min(1),
    screens: z.array(z.enum(["CTV", "Mobile Device", "Web Browser"])).min(1),
  })
  .refine((v) => v.start_date <= v.end_date, {
    message: "Start must be ≤ End",
    path: ["start_date"],
  })
  .refine((v) => v.age_min <= v.age_max, {
    message: "Age min must be ≤ max",
    path: ["age_min"],
  });

export type CampaignInputType = z.infer<typeof CampaignInput>;
