import { TechStackForm } from "@/components/admin/tech-stack-form";
import { SectionHeading } from "@/components/shared/section-heading";

export default function NewTechStackPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <SectionHeading eyebrow="content" title="New Tech Stack Entry" />
      <TechStackForm />
    </div>
  );
}
