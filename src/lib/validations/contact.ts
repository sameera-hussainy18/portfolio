import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(320),
  message: z.string().trim().min(1, "Message is required").max(5000),
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export const privateNoteSchema = z.object({
  name: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(5000),
  company: z.string().max(0).optional().or(z.literal("")),
});

export type PrivateNoteInput = z.infer<typeof privateNoteSchema>;

export const MAX_NOTE_IMAGE_BYTES = 5 * 1024 * 1024;
