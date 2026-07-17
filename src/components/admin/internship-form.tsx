"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TechMultiSelect } from "@/components/admin/tech-multi-select";
import {
  internshipSchema,
  type InternshipInput,
} from "@/lib/validations/internship";
import { createInternship, updateInternship } from "@/lib/actions/internships";
import type { TechStack } from "@/types/database";

interface InternshipFormProps {
  techStackOptions: TechStack[];
  defaultValues?: InternshipInput;
  internshipId?: string;
}

const EMPTY_DEFAULTS: InternshipInput = {
  company: "",
  role: "",
  location: "",
  start_date: "",
  end_date: "",
  description: "",
  display_order: 0,
  tech_stack_ids: [],
};

export function InternshipForm({
  techStackOptions,
  defaultValues,
  internshipId,
}: InternshipFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InternshipInput>({
    resolver: zodResolver(internshipSchema),
    defaultValues: defaultValues ?? EMPTY_DEFAULTS,
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    const result = internshipId
      ? await updateInternship(internshipId, values)
      : await createInternship(values);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(internshipId ? "Internship updated." : "Internship created.");
      router.push("/admin/internships");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company">Company</Label>
          <Input id="company" {...register("company")} />
          {errors.company && (
            <p className="text-xs text-destructive">{errors.company.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role">Role</Label>
          <Input id="role" {...register("role")} />
          {errors.role && (
            <p className="text-xs text-destructive">{errors.role.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="location">Location (optional)</Label>
        <Input id="location" {...register("location")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="start_date">Start Date</Label>
          <Input id="start_date" type="date" {...register("start_date")} />
          {errors.start_date && (
            <p className="text-xs text-destructive">{errors.start_date.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="end_date">End Date (leave blank if current)</Label>
          <Input id="end_date" type="date" {...register("end_date")} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" rows={5} {...register("description")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="display_order">Display Order</Label>
        <Input
          id="display_order"
          type="number"
          className="max-w-32"
          {...register("display_order", { valueAsNumber: true })}
        />
      </div>

      <Controller
        control={control}
        name="tech_stack_ids"
        render={({ field }) => (
          <TechMultiSelect
            options={techStackOptions}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : internshipId ? "Save Changes" : "Create Internship"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/internships")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
