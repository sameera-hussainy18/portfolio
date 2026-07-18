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
  COURSE_CATEGORIES,
  courseWorkSchema,
  type CourseWorkInput,
} from "@/lib/validations/coursework";
import { createCourseWork, updateCourseWork } from "@/lib/actions/coursework";

interface CourseWorkFormProps {
  defaultValues?: CourseWorkInput;
  courseWorkId?: string;
}

const EMPTY_DEFAULTS: CourseWorkInput = {
  category: "cs",
  semester: 1,
  course_code: "",
  course_title: "",
  display_order: 0,
};

const CATEGORY_LABELS: Record<(typeof COURSE_CATEGORIES)[number], string> = {
  cs: "Computer Science",
  business: "Business",
  minor: "Minor",
  honours: "Honours",
};

export function CourseWorkForm({
  defaultValues,
  courseWorkId,
}: CourseWorkFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CourseWorkInput>({
    resolver: zodResolver(courseWorkSchema),
    defaultValues: defaultValues ?? EMPTY_DEFAULTS,
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    const result = courseWorkId
      ? await updateCourseWork(courseWorkId, values)
      : await createCourseWork(values);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(
        courseWorkId ? "Course updated." : "Course added."
      );
      router.push("/admin/coursework");
      router.refresh();
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
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
                  {COURSE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {CATEGORY_LABELS[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="semester">Semester</Label>
          <Input
            id="semester"
            type="number"
            min={1}
            max={8}
            {...register("semester", { valueAsNumber: true })}
          />
          {errors.semester && (
            <p className="text-xs text-destructive">
              {errors.semester.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="course_code">Course Code (optional)</Label>
          <Input
            id="course_code"
            {...register("course_code")}
            placeholder="e.g. CSE308"
          />
          {errors.course_code && (
            <p className="text-xs text-destructive">
              {errors.course_code.message}
            </p>
          )}
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
        <Label htmlFor="course_title">Course Title</Label>
        <Input
          id="course_title"
          {...register("course_title")}
          placeholder="e.g. Operating Systems"
        />
        {errors.course_title && (
          <p className="text-xs text-destructive">
            {errors.course_title.message}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : courseWorkId ? "Save Changes" : "Add Course"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/coursework")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
