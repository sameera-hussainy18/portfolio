import { z } from "zod";

export const COURSE_CATEGORIES = ["cs", "business"] as const;

export const courseWorkSchema = z.object({
  category: z.enum(COURSE_CATEGORIES),
  semester: z.number().int().min(1).max(8),
  course_code: z.string().trim().min(1, "Course code is required").max(20),
  course_title: z.string().trim().min(1, "Course title is required").max(150),
  display_order: z.number().int(),
});

export type CourseWorkInput = z.infer<typeof courseWorkSchema>;
