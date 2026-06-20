import { z } from "zod";

export const parseJobSchema = z.object({
  text: z
    .string()
    .min(20, "Job posting text must be at least 20 characters")
    .max(10000, "Job posting text is too long"),
});
