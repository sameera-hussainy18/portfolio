"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  internshipSchema,
  type InternshipInput,
} from "@/lib/validations/internship";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function nullableText(value: string | undefined) {
  const trimmed = (value ?? "").trim();
  return trimmed === "" ? null : trimmed;
}

function revalidateInternshipPaths() {
  revalidatePath("/admin/internships");
  revalidatePath("/admin");
  revalidatePath("/internships");
  revalidatePath("/");
}

export async function createInternship(
  input: InternshipInput
): Promise<ActionResult> {
  const parsed = internshipSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }
  const { tech_stack_ids, ...rest } = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("internships")
    .insert({
      company: rest.company,
      role: rest.role,
      location: nullableText(rest.location),
      start_date: rest.start_date,
      end_date: nullableText(rest.end_date),
      description: nullableText(rest.description),
      display_order: rest.display_order,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error?.message ?? "Could not create internship.",
    };
  }

  if (tech_stack_ids.length > 0) {
    await supabase
      .from("internship_tech_stack")
      .insert(
        tech_stack_ids.map((tech_stack_id) => ({
          internship_id: data.id,
          tech_stack_id,
        }))
      );
  }

  revalidateInternshipPaths();
  return { success: true };
}

export async function updateInternship(
  id: string,
  input: InternshipInput
): Promise<ActionResult> {
  const parsed = internshipSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }
  const { tech_stack_ids, ...rest } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("internships")
    .update({
      company: rest.company,
      role: rest.role,
      location: nullableText(rest.location),
      start_date: rest.start_date,
      end_date: nullableText(rest.end_date),
      description: nullableText(rest.description),
      display_order: rest.display_order,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  await supabase
    .from("internship_tech_stack")
    .delete()
    .eq("internship_id", id);
  if (tech_stack_ids.length > 0) {
    await supabase
      .from("internship_tech_stack")
      .insert(
        tech_stack_ids.map((tech_stack_id) => ({
          internship_id: id,
          tech_stack_id,
        }))
      );
  }

  revalidateInternshipPaths();
  return { success: true };
}

export async function deleteInternship(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("internships").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateInternshipPaths();
  return { success: true };
}
