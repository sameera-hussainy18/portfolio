"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
}: CertificateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      ? await updateCertificate(certificateId, values)
      : await createCertificate(values);
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
