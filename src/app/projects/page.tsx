import { ProjectCard } from "@/components/projects/project-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { FadeIn } from "@/components/shared/fade-in";
import { getProjects } from "@/lib/queries";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects built and shipped, with source code and live links.",
  openGraph: {
    title: "Projects",
    description:
      "Projects built and shipped, with source code and live links.",
    url: "/projects",
    type: "website",
    images: [`/api/og?title=Projects`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects",
    images: [`/api/og?title=Projects`],
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 sm:py-24">
      <SectionHeading
        eyebrow="work"
        title="Projects"
        description="A running log of things I've built — from coursework to side projects."
      />

      {projects.length === 0 ? (
        <EmptyState message="No projects yet — check back soon." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <FadeIn key={project.id} delay={i * 0.05}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
