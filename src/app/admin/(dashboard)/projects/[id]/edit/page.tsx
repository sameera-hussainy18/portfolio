import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getProjectById, getTechStack } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, techStack] = await Promise.all([
    getProjectById(id),
    getTechStack(),
  ]);

  if (!project) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <SectionHeading eyebrow="content" title="Edit Project" />
      <ProjectForm
        techStackOptions={techStack}
        projectId={project.id}
        defaultValues={{
          title: project.title,
          slug: project.slug,
          summary: project.summary,
          description: project.description ?? "",
          github_url: project.github_url ?? "",
          live_url: project.live_url ?? "",
          image_url: project.image_url ?? "",
          featured: project.featured,
          display_order: project.display_order,
          tech_stack_ids: project.tech_stack.map((t) => t.id),
        }}
      />
    </div>
  );
}
