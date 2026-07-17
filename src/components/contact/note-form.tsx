"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  privateNoteSchema,
  type PrivateNoteInput,
} from "@/lib/validations/contact";
import { submitPrivateNote } from "@/lib/actions/contact";

export function NoteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PrivateNoteInput>({
    resolver: zodResolver(privateNoteSchema),
    defaultValues: { name: "", message: "", company: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.set("name", values.name ?? "");
    formData.set("message", values.message);
    formData.set("company", values.company ?? "");
    if (file) formData.set("image", file);

    const result = await submitPrivateNote(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Note sent — only I can see this.");
      reset();
      setFile(null);
      setFileInputKey((key) => key + 1);
    } else {
      toast.error(result.error ?? "Something went wrong. Please try again.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-card/40 px-3 py-2.5">
        <Lock className="mt-0.5 size-3.5 shrink-0 text-primary" />
        <p className="text-xs text-muted-foreground">
          Private channel — this note goes straight to me and is never shown
          anywhere on the site.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note-name">Name (optional)</Label>
        <Input id="note-name" {...register("name")} placeholder="Optional" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note-message">Note</Label>
        <Textarea
          id="note-message"
          rows={5}
          {...register("message")}
          placeholder="Anything you'd like to say privately."
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="note-image">Attach an image (optional)</Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="size-3.5" />
            {file ? "Change file" : "Choose file"}
          </Button>
          {file && (
            <span className="truncate font-mono text-xs text-muted-foreground">
              {file.name}
            </span>
          )}
        </div>
        <input
          key={fileInputKey}
          ref={fileInputRef}
          id="note-image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="note-company">Company</label>
        <input
          id="note-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-1 self-start">
        {isSubmitting ? "Sending…" : "Send Privately"}
      </Button>
    </form>
  );
}
