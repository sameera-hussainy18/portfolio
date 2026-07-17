import { notFound } from "next/navigation";
import { InternshipForm } from "@/components/admin/internship-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getInternshipById, getTechStack } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditInternshipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [internship, techStack] = await Promise.all([
    getInternshipById(id),
    getTechStack(),
  ]);

  if (!internship) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <SectionHeading eyebrow="content" title="Edit Internship" />
      <InternshipForm
        techStackOptions={techStack}
        internshipId={internship.id}
        defaultValues={{
          company: internship.company,
          role: internship.role,
          location: internship.location ?? "",
          start_date: internship.start_date,
          end_date: internship.end_date ?? "",
          description: internship.description ?? "",
          display_order: internship.display_order,
          tech_stack_ids: internship.tech_stack.map((t) => t.id),
        }}
      />
    </div>
  );
}
