"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  certificateSchema,
  type CertificateInput,
} from "@/lib/validations/certificate";
import { createCertificate, updateCertificate } from "@/lib/actions/certificates";

interface CertificateFormProps {
  defaultValues?: CertificateInput;
  certificateId?: string;
  existingImageUrl?: string | null;
}

const EMPTY_DEFAULTS: CertificateInput = {
  title: "",
  issuer: "",
  issue_date: "",
  credential_url: "",
  credential_id: "",
  display_order: 0,
};

export function CertificateForm({
  defaultValues,
  certificateId,
  existingImageUrl,
}: CertificateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CertificateInput>({
    resolver: zodResolver(certificateSchema),
    defaultValues: defaultValues ?? EMPTY_DEFAULTS,
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    const result = certificateId
      ? await updateCertificate(certificateId, values, file)
      : await createCertificate(values, file);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(certificateId ? "Certificate updated." : "Certificate created.");
      router.push("/admin/certificates");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="issuer">Issuer</Label>
          <Input id="issuer" {...register("issuer")} />
          {errors.issuer && (
            <p className="text-xs text-destructive">{errors.issuer.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="issue_date">Issue Date</Label>
          <Input id="issue_date" type="date" {...register("issue_date")} />
          {errors.issue_date && (
            <p className="text-xs text-destructive">{errors.issue_date.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="credential_url">Credential URL (optional)</Label>
        <Input
          id="credential_url"
          {...register("credential_url")}
          placeholder="https://..."
        />
        {errors.credential_url && (
          <p className="text-xs text-destructive">{errors.credential_url.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="credential_id">Credential ID (optional)</Label>
          <Input id="credential_id" {...register("credential_id")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            {...register("display_order", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cert-image">Certificate image (optional)</Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="size-3.5" />
            {file ? "Change image" : existingImageUrl ? "Replace image" : "Choose image"}
          </Button>
          {file && (
            <span className="truncate font-mono text-xs text-muted-foreground">
              {file.name}
            </span>
          )}
        </div>
        {(file || existingImageUrl) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={file ? URL.createObjectURL(file) : existingImageUrl ?? undefined}
            alt="Certificate preview"
            className="mt-1 max-h-40 w-fit rounded-lg border border-border/60 object-contain"
          />
        )}
        <input
          ref={fileInputRef}
          id="cert-image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : certificateId ? "Save Changes" : "Create Certificate"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/certificates")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
