import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  summary: z.string().trim().min(1, "Summary is required").max(300),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  github_url: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  live_url: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  image_url: z.string().trim().url("Enter a valid URL").optional().or(z.literal("")),
  featured: z.boolean(),
  display_order: z.number().int(),
  tech_stack_ids: z.array(z.string()),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
