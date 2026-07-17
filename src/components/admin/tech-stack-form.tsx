"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TECH_CATEGORIES,
  techStackSchema,
  type TechStackInput,
} from "@/lib/validations/tech-stack";
import { createTechStack, updateTechStack } from "@/lib/actions/tech-stack";

interface TechStackFormProps {
  defaultValues?: TechStackInput;
  techStackId?: string;
}

const EMPTY_DEFAULTS: TechStackInput = {
  name: "",
  category: "language",
  icon_slug: "",
  display_order: 0,
};

const CATEGORY_LABELS: Record<(typeof TECH_CATEGORIES)[number], string> = {
  language: "Language",
  framework: "Framework / Library",
  database: "Database",
  tool: "Tool",
  cloud: "Cloud & Infra",
  other: "Other",
};

export function TechStackForm({ defaultValues, techStackId }: TechStackFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TechStackInput>({
    resolver: zodResolver(techStackSchema),
    defaultValues: defaultValues ?? EMPTY_DEFAULTS,
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    const result = techStackId
      ? await updateTechStack(techStackId, values)
      : await createTechStack(values);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(techStackId ? "Tech stack entry updated." : "Tech stack entry created.");
      router.push("/admin/tech-stack");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} placeholder="e.g. TypeScript" />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Category</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {TECH_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {CATEGORY_LABELS[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="icon_slug">Icon slug (optional)</Label>
          <Input id="icon_slug" {...register("icon_slug")} placeholder="typescript" />
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
          {isSubmitting ? "Saving…" : techStackId ? "Save Changes" : "Create Entry"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/tech-stack")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
