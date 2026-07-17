import { notFound } from "next/navigation";
import { TechStackForm } from "@/components/admin/tech-stack-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getTechStackById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditTechStackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getTechStackById(id);

  if (!item) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <SectionHeading eyebrow="content" title="Edit Tech Stack Entry" />
      <TechStackForm
        techStackId={item.id}
        defaultValues={{
          name: item.name,
          category: item.category,
          icon_slug: item.icon_slug ?? "",
          display_order: item.display_order,
        }}
      />
    </div>
  );
}
