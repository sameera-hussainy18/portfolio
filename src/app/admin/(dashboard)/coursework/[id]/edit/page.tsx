import { notFound } from "next/navigation";
import { CourseWorkForm } from "@/components/admin/coursework-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { getCourseWorkById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditCourseWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getCourseWorkById(id);

  if (!item) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <SectionHeading eyebrow="content" title="Edit Course" />
      <CourseWorkForm
        courseWorkId={item.id}
        defaultValues={{
          category: item.category,
          semester: item.semester,
          course_code: item.course_code,
          course_title: item.course_title,
          display_order: item.display_order,
        }}
      />
    </div>
  );
}
