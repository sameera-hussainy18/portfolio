import { CertificateForm } from "@/components/admin/certificate-form";
import { SectionHeading } from "@/components/shared/section-heading";

export default function NewCertificatePage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <SectionHeading eyebrow="content" title="New Certificate" />
      <CertificateForm />
    </div>
  );
}
