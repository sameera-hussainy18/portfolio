import { z } from "zod";

export const TECH_CATEGORIES = [
  "language",
  "framework",
  "database",
  "tool",
  "cloud",
  "other",
] as const;

export const techStackSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  category: z.enum(TECH_CATEGORIES),
  icon_slug: z.string().trim().max(100).optional().or(z.literal("")),
  display_order: z.number().int(),
});

export type TechStackInput = z.infer<typeof techStackSchema>;
