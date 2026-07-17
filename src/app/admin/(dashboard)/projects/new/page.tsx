import { ProjectForm } from "@/components/admin/project-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getTechStack } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const techStack = await getTechStack();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <SectionHeading eyebrow="content" title="New Project" />
      <ProjectForm techStackOptions={techStack} />
    </div>
  );
}
