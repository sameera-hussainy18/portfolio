import { TechStackGrid } from "@/components/tech-stack/tech-stack-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { getTechStack } from "@/lib/queries";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tech Stack",
  description: "Languages, frameworks, tools, and platforms I work with.",
  openGraph: {
    title: "Tech Stack",
    description: "Languages, frameworks, tools, and platforms I work with.",
    url: "/tech-stack",
    type: "website",
    images: [`/api/og?title=Tech%20Stack`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Stack",
    images: [`/api/og?title=Tech%20Stack`],
  },
};

export default async function TechStackPage() {
  const techStack = await getTechStack();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 sm:py-24">
      <SectionHeading
        eyebrow="stack"
        title="Tech Stack"
        description="Languages, frameworks, tools, and platforms I work with."
      />

      <FadeIn>
        <TechStackGrid items={techStack} />
      </FadeIn>
    </div>
  );
}
