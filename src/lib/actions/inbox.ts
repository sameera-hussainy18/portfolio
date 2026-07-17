"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  success: boolean;
  error?: string;
}

function revalidateInboxPaths() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin/notes");
  revalidatePath("/admin");
}

export async function setMessageRead(
  id: string,
  isRead: boolean
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: isRead })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidateInboxPaths();
  return { success: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidateInboxPaths();
  return { success: true };
}

export async function setNoteRead(
  id: string,
  isRead: boolean
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("private_notes")
    .update({ is_read: isRead })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidateInboxPaths();
  return { success: true };
}

export async function deleteNote(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: note } = await supabase
    .from("private_notes")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();

  if (note?.image_path) {
    await supabase.storage.from("note-attachments").remove([note.image_path]);
  }

  const { error } = await supabase.from("private_notes").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidateInboxPaths();
  return { success: true };
}
