"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  contactMessageSchema,
  type ContactMessageInput,
} from "@/lib/validations/contact";
import { submitContactMessage } from "@/lib/actions/contact";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: { name: "", email: "", message: "", company: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("message", values.message);
    formData.set("company", values.company ?? "");

    const result = await submitContactMessage(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Message sent — thanks for reaching out.");
      reset();
    } else {
      toast.error(result.error ?? "Something went wrong. Please try again.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-name">Name</Label>
        <Input id="contact-name" {...register("name")} placeholder="Your name" />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          type="email"
          {...register("email")}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          rows={5}
          {...register("message")}
          placeholder="What would you like to talk about?"
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-1 self-start">
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
