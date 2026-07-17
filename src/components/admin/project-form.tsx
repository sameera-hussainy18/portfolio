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
import { Switch } from "@/components/ui/switch";
import { TechMultiSelect } from "@/components/admin/tech-multi-select";
import {
  projectSchema,
  slugify,
  type ProjectInput,
} from "@/lib/validations/project";
import { createProject, updateProject } from "@/lib/actions/projects";
import type { TechStack } from "@/types/database";

interface ProjectFormProps {
  techStackOptions: TechStack[];
  defaultValues?: ProjectInput;
  projectId?: string;
}

const EMPTY_DEFAULTS: ProjectInput = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  github_url: "",
  live_url: "",
  image_url: "",
  featured: false,
  display_order: 0,
  tech_stack_ids: [],
};

export function ProjectForm({
  techStackOptions,
  defaultValues,
  projectId,
}: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues));

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues ?? EMPTY_DEFAULTS,
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    const result = projectId
      ? await updateProject(projectId, values)
      : await createProject(values);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(projectId ? "Project updated." : "Project created.");
      router.push("/admin/projects");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register("title", {
              onChange: (e) => {
                if (!slugTouched) {
                  setValue("slug", slugify(e.target.value));
                }
              },
            })}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            {...register("slug", {
              onChange: () => setSlugTouched(true),
            })}
          />
          {errors.slug && (
            <p className="text-xs text-destructive">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" rows={2} {...register("summary")} />
        {errors.summary && (
          <p className="text-xs text-destructive">{errors.summary.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" rows={5} {...register("description")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="github_url">GitHub URL (optional)</Label>
          <Input id="github_url" {...register("github_url")} placeholder="https://github.com/..." />
          {errors.github_url && (
            <p className="text-xs text-destructive">{errors.github_url.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="live_url">Live URL (optional)</Label>
          <Input id="live_url" {...register("live_url")} placeholder="https://..." />
          {errors.live_url && (
            <p className="text-xs text-destructive">{errors.live_url.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="image_url">Image URL (optional)</Label>
        <Input id="image_url" {...register("image_url")} placeholder="https://..." />
        {errors.image_url && (
          <p className="text-xs text-destructive">{errors.image_url.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            {...register("display_order", { valueAsNumber: true })}
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Controller
            control={control}
            name="featured"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label>Featured on home page</Label>
        </div>
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
          {isSubmitting ? "Saving…" : projectId ? "Save Changes" : "Create Project"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
