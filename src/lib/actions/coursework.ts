"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  courseWorkSchema,
  type CourseWorkInput,
} from "@/lib/validations/coursework";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function nullableText(value: string | undefined) {
  const trimmed = (value ?? "").trim();
  return trimmed === "" ? null : trimmed;
}

function revalidateCourseWorkPaths() {
  revalidatePath("/admin/coursework");
  revalidatePath("/admin");
  revalidatePath("/coursework");
}

export async function createCourseWork(
  input: CourseWorkInput
): Promise<ActionResult> {
  const parsed = courseWorkSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("coursework").insert({
    category: parsed.data.category,
    semester: parsed.data.semester,
    course_code: nullableText(parsed.data.course_code),
    course_title: parsed.data.course_title,
    display_order: parsed.data.display_order,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateCourseWorkPaths();
  return { success: true };
}

export async function updateCourseWork(
  id: string,
  input: CourseWorkInput
): Promise<ActionResult> {
  const parsed = courseWorkSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("coursework")
    .update({
      category: parsed.data.category,
      semester: parsed.data.semester,
      course_code: nullableText(parsed.data.course_code),
      course_title: parsed.data.course_title,
      display_order: parsed.data.display_order,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateCourseWorkPaths();
  return { success: true };
}

export async function deleteCourseWork(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("coursework").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateCourseWorkPaths();
  return { success: true };
}
