import { notFound } from "next/navigation";
import { CertificateForm } from "@/components/admin/certificate-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getCertificateById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const certificate = await getCertificateById(id);

  if (!certificate) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <SectionHeading eyebrow="content" title="Edit Certificate" />
      <CertificateForm
        certificateId={certificate.id}
        existingImageUrl={certificate.image_url}
        defaultValues={{
          title: certificate.title,
          issuer: certificate.issuer,
          issue_date: certificate.issue_date,
          credential_url: certificate.credential_url ?? "",
          credential_id: certificate.credential_id ?? "",
          display_order: certificate.display_order,
        }}
      />
    </div>
  );
}
