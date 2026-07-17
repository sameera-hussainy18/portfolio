import { z } from "zod";

export const internshipSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(200),
  role: z.string().trim().min(1, "Role is required").max(200),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  start_date: z.string().trim().min(1, "Start date is required"),
  end_date: z.string().trim().optional().or(z.literal("")),
  description: z.string().trim().max(3000).optional().or(z.literal("")),
  display_order: z.number().int(),
  tech_stack_ids: z.array(z.string()),
});

export type InternshipInput = z.infer<typeof internshipSchema>;
