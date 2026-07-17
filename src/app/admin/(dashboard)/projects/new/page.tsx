import { ProjectForm } from "@/components/admin/project-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getTechStack } from "@/lib/queries";
import { getRepoByFullName, humanizeRepoName } from "@/lib/github";
import { slugify } from "@/lib/validations/project";

export const dynamic = "force-dynamic";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ repo?: string }>;
}) {
  const { repo: repoFullName } = await searchParams;

  const [techStack, repo] = await Promise.all([
    getTechStack(),
    repoFullName ? getRepoByFullName(repoFullName) : Promise.resolve(null),
  ]);

  const defaultValues = repo
    ? {
        title: humanizeRepoName(repo.name),
        slug: slugify(repo.name),
        summary: (repo.description ?? "").slice(0, 300),
        description: repo.description ?? "",
        github_url: repo.html_url,
        live_url: repo.homepage ?? "",
        image_url: "",
        featured: false,
        display_order: 0,
        tech_stack_ids: [],
      }
    : undefined;

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <SectionHeading
        eyebrow="content"
        title={repo ? `New Project — from ${repo.name}` : "New Project"}
        description={
          repo
            ? "Pulled from GitHub — review and edit before saving."
            : undefined
        }
      />
      <ProjectForm techStackOptions={techStack} defaultValues={defaultValues} />
    </div>
  );
}
