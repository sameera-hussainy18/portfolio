import { CertificateCard } from "@/components/certificates/certificate-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { FadeIn } from "@/components/shared/fade-in";
import { getCertificates } from "@/lib/queries";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Certifications and credentials, with issuer and verification links.",
  openGraph: {
    title: "Certificates",
    description:
      "Certifications and credentials, with issuer and verification links.",
    url: "/certificates",
    type: "website",
    images: [`/api/og?title=Certificates`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Certificates",
    images: [`/api/og?title=Certificates`],
  },
};

export default async function CertificatesPage() {
  const certificates = await getCertificates();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 sm:py-24">
      <SectionHeading
        eyebrow="credentials"
        title="Certificates"
        description="Courses and certifications completed, verifiable at the source."
      />

      {certificates.length === 0 ? (
        <EmptyState message="No certificates listed yet — check back soon." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate, i) => (
            <FadeIn key={certificate.id} delay={i * 0.05}>
              <CertificateCard certificate={certificate} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
