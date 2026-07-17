"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  certificateSchema,
  type CertificateInput,
} from "@/lib/validations/certificate";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function nullableText(value: string | undefined) {
  const trimmed = (value ?? "").trim();
  return trimmed === "" ? null : trimmed;
}

function revalidateCertificatePaths() {
  revalidatePath("/admin/certificates");
  revalidatePath("/admin");
  revalidatePath("/certificates");
  revalidatePath("/");
}

export async function createCertificate(
  input: CertificateInput
): Promise<ActionResult> {
  const parsed = certificateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("certificates").insert({
    title: parsed.data.title,
    issuer: parsed.data.issuer,
    issue_date: parsed.data.issue_date,
    credential_url: nullableText(parsed.data.credential_url),
    credential_id: nullableText(parsed.data.credential_id),
    display_order: parsed.data.display_order,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateCertificatePaths();
  return { success: true };
}

export async function updateCertificate(
  id: string,
  input: CertificateInput
): Promise<ActionResult> {
  const parsed = certificateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("certificates")
    .update({
      title: parsed.data.title,
      issuer: parsed.data.issuer,
      issue_date: parsed.data.issue_date,
      credential_url: nullableText(parsed.data.credential_url),
      credential_id: nullableText(parsed.data.credential_id),
      display_order: parsed.data.display_order,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateCertificatePaths();
  return { success: true };
}

export async function deleteCertificate(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("certificates").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidateCertificatePaths();
  return { success: true };
}
