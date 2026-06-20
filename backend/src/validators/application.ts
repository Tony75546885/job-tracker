import { z } from "zod";

const applicationStatusEnum = z.enum([
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
]);

export const createApplicationSchema = z.object({
  company: z.string().min(1, "Company name is required").max(200),
  position: z.string().min(1, "Position is required").max(200),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: applicationStatusEnum.default("APPLIED"),
  notes: z.string().max(5000).optional(),
  salary: z.string().max(100).optional(),
  techStack: z.array(z.string().max(50)).max(20).default([]),
  appliedAt: z.coerce.date().optional(),
  followUpAt: z.coerce.date().optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

export const updateStatusSchema = z.object({
  status: applicationStatusEnum,
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
