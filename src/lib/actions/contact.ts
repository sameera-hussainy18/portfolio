"use server";

import { createClient } from "@/lib/supabase/server";
import {
  MAX_NOTE_IMAGE_BYTES,
  contactMessageSchema,
  privateNoteSchema,
} from "@/lib/validations/contact";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function submitContactMessage(
  formData: FormData
): Promise<ActionResult> {
  const parsed = contactMessageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  // Honeypot tripped — silently report success so bots don't learn anything.
  if (parsed.data.company) {
    return { success: true };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}

export async function submitPrivateNote(
  formData: FormData
): Promise<ActionResult> {
  const parsed = privateNoteSchema.safeParse({
    name: formData.get("name"),
    message: formData.get("message"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  if (parsed.data.company) {
    return { success: true };
  }

  const supabase = await createClient();
  let imagePath: string | null = null;

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) {
      return { success: false, error: "Attachment must be an image." };
    }
    if (image.size > MAX_NOTE_IMAGE_BYTES) {
      return { success: false, error: "Image must be under 5MB." };
    }

    const extension = image.name.split(".").pop() || "bin";
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("note-attachments")
      .upload(path, image, { contentType: image.type });

    if (uploadError) {
      return { success: false, error: "Could not upload the image. Please try again." };
    }
    imagePath = path;
  }

  const { error } = await supabase.from("private_notes").insert({
    name: parsed.data.name || null,
    message: parsed.data.message,
    image_path: imagePath,
  });

  if (error) {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
