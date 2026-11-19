import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { StatCounts } from "@/components/home/stat-counts";
import { ProjectCard } from "@/components/projects/project-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { FadeIn } from "@/components/shared/fade-in";
import { JsonLd } from "@/components/shared/json-ld";
import { getContentCounts } from "@/lib/queries";
import { getAllProjectCards } from "@/lib/project-cards";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [contentCounts, projects] = await Promise.all([
    getContentCounts(),
    getAllProjectCards(),
  ]);
  const counts = { ...contentCounts, projects: projects.length };
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 3);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-24 px-6 py-16 sm:py-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: siteConfig.name,
          url: siteConfig.url,
          description: siteConfig.description,
          sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url,
        }}
      />
      <Hero />

      <FadeIn>
        <StatCounts counts={counts} />
      </FadeIn>

      <FadeIn>
        <div className="flex flex-col gap-8">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading eyebrow="featured" title="Featured Projects" />
            <Link
              href="/projects"
              className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {featuredProjects.length === 0 ? (
            <EmptyState message="Featured projects will appear here once added in the admin dashboard." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.key} project={project} />
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
