import { z } from "zod";

export const certificateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  issuer: z.string().trim().min(1, "Issuer is required").max(200),
  issue_date: z.string().trim().min(1, "Issue date is required"),
  credential_url: z
    .string()
    .trim()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
  credential_id: z.string().trim().max(200).optional().or(z.literal("")),
  display_order: z.number().int(),
});

export type CertificateInput = z.infer<typeof certificateSchema>;

export const MAX_CERTIFICATE_IMAGE_BYTES = 8 * 1024 * 1024;
