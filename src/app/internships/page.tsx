import { InternshipItem } from "@/components/internships/internship-item";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { FadeIn } from "@/components/shared/fade-in";
import { getInternships } from "@/lib/queries";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Internships",
  description: "Professional and internship experience.",
  openGraph: {
    title: "Internships",
    description: "Professional and internship experience.",
    url: "/internships",
    type: "website",
    images: [`/api/og?title=Internships`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Internships",
    images: [`/api/og?title=Internships`],
  },
};

export default async function InternshipsPage() {
  const internships = await getInternships();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 sm:py-24">
      <SectionHeading
        eyebrow="experience"
        title="Internships"
        description="Where I've worked and what I worked on."
      />

      {internships.length === 0 ? (
        <EmptyState message="No internships listed yet — check back soon." />
      ) : (
        <div className="flex max-w-2xl flex-col gap-10">
          {internships.map((internship, i) => (
            <FadeIn key={internship.id} delay={i * 0.05}>
              <InternshipItem internship={internship} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
