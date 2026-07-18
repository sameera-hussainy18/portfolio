import type { Metadata } from "next";
import { CourseWorkPanels } from "@/components/coursework/coursework-panels";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { getCourseWork } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Coursework",
  description:
    "Computer Science, Business, Minor, and Honours coursework from the B.Tech in Computer Science and Business Systems.",
  openGraph: {
    title: "Coursework",
    description:
      "Computer Science, Business, Minor, and Honours coursework from the B.Tech in Computer Science and Business Systems.",
    url: "/coursework",
    type: "website",
    images: [`/api/og?title=Coursework`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coursework",
    images: [`/api/og?title=Coursework`],
  },
};

export default async function CourseWorkPage() {
  const coursework = await getCourseWork();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 sm:py-24">
      <SectionHeading
        eyebrow="academics"
        title="Coursework"
        description="Computer Science, Business, Minor, and Honours coursework, semester by semester."
      />

      <FadeIn>
        <CourseWorkPanels items={coursework} />
      </FadeIn>
    </div>
  );
}
