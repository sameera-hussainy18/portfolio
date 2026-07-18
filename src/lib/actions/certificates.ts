"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  certificateSchema,
  MAX_CERTIFICATE_IMAGE_BYTES,
  type CertificateInput,
} from "@/lib/validations/certificate";
import type { Database } from "@/types/database";

type CertificateUpdate = Database["public"]["Tables"]["certificates"]["Update"];

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

async function uploadCertificateImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imageFile: File
): Promise<{ url?: string; error?: string }> {
  if (!imageFile.type.startsWith("image/")) {
    return { error: "Attachment must be an image." };
  }
  if (imageFile.size > MAX_CERTIFICATE_IMAGE_BYTES) {
    return { error: "Image must be under 8MB." };
  }

  const extension = imageFile.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("certificate-images")
    .upload(path, imageFile, { contentType: imageFile.type });

  if (uploadError) {
    return { error: "Could not upload the image. Please try again." };
  }

  const { data } = supabase.storage.from("certificate-images").getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function createCertificate(
  input: CertificateInput,
  imageFile?: File | null
): Promise<ActionResult> {
  const parsed = certificateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const supabase = await createClient();

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const result = await uploadCertificateImage(supabase, imageFile);
    if (result.error) return { success: false, error: result.error };
    imageUrl = result.url ?? null;
  }

  const { error } = await supabase.from("certificates").insert({
    title: parsed.data.title,
    issuer: parsed.data.issuer,
    issue_date: parsed.data.issue_date,
    credential_url: nullableText(parsed.data.credential_url),
    credential_id: nullableText(parsed.data.credential_id),
    image_url: imageUrl,
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
  input: CertificateInput,
  imageFile?: File | null
): Promise<ActionResult> {
  const parsed = certificateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  const supabase = await createClient();

  const updates: CertificateUpdate = {
    title: parsed.data.title,
    issuer: parsed.data.issuer,
    issue_date: parsed.data.issue_date,
    credential_url: nullableText(parsed.data.credential_url),
    credential_id: nullableText(parsed.data.credential_id),
    display_order: parsed.data.display_order,
  };

  if (imageFile && imageFile.size > 0) {
    const result = await uploadCertificateImage(supabase, imageFile);
    if (result.error) return { success: false, error: result.error };
    updates.image_url = result.url ?? null;
  }

  const { error } = await supabase
    .from("certificates")
    .update(updates)
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
