"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  techStackSchema,
  type TechStackInput,
} from "@/lib/validations/tech-stack";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function nullableText(value: string | undefined) {
  const trimmed = (value ?? "").trim();
  return trimmed === "" ? null : trimmed;
}

function revalidateTechStackPaths() {
  revalidatePath("/admin/tech-stack");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/internships");
  revalidatePath("/tech-stack");
  revalidatePath("/projects");
  revalidatePath("/internships");
  revalidatePath("/");
}

export async function createTechStack(
  input: TechStackInput
): Promise<ActionResult> {
  const parsed = techStackSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("tech_stack").insert({
    name: parsed.data.name,
    category: parsed.data.category,
    icon_slug: nullableText(parsed.data.icon_slug),
    display_order: parsed.data.display_order,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateTechStackPaths();
  return { success: true };
}

export async function updateTechStack(
  id: string,
  input: TechStackInput
): Promise<ActionResult> {
  const parsed = techStackSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("tech_stack")
    .update({
      name: parsed.data.name,
      category: parsed.data.category,
      icon_slug: nullableText(parsed.data.icon_slug),
      display_order: parsed.data.display_order,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateTechStackPaths();
  return { success: true };
}

export async function deleteTechStack(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("tech_stack").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateTechStackPaths();
  return { success: true };
}
