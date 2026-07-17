"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { projectSchema, type ProjectInput } from "@/lib/validations/project";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function nullableText(value: string | undefined) {
  const trimmed = (value ?? "").trim();
  return trimmed === "" ? null : trimmed;
}

function revalidateProjectPaths() {
  revalidatePath("/admin/projects");
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function createProject(input: ProjectInput): Promise<ActionResult> {
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }
  const { tech_stack_ids, ...rest } = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: rest.title,
      slug: rest.slug,
      summary: rest.summary,
      description: nullableText(rest.description),
      github_url: nullableText(rest.github_url),
      live_url: nullableText(rest.live_url),
      image_url: nullableText(rest.image_url),
      featured: rest.featured,
      display_order: rest.display_order,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      success: false,
      error: error?.message ?? "Could not create project.",
    };
  }

  if (tech_stack_ids.length > 0) {
    await supabase
      .from("project_tech_stack")
      .insert(
        tech_stack_ids.map((tech_stack_id) => ({
          project_id: data.id,
          tech_stack_id,
        }))
      );
  }

  revalidateProjectPaths();
  return { success: true };
}

export async function updateProject(
  id: string,
  input: ProjectInput
): Promise<ActionResult> {
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }
  const { tech_stack_ids, ...rest } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({
      title: rest.title,
      slug: rest.slug,
      summary: rest.summary,
      description: nullableText(rest.description),
      github_url: nullableText(rest.github_url),
      live_url: nullableText(rest.live_url),
      image_url: nullableText(rest.image_url),
      featured: rest.featured,
      display_order: rest.display_order,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  await supabase.from("project_tech_stack").delete().eq("project_id", id);
  if (tech_stack_ids.length > 0) {
    await supabase
      .from("project_tech_stack")
      .insert(
        tech_stack_ids.map((tech_stack_id) => ({
          project_id: id,
          tech_stack_id,
        }))
      );
  }

  revalidateProjectPaths();
  return { success: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateProjectPaths();
  return { success: true };
}
