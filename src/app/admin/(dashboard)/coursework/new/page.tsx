import { CourseWorkForm } from "@/components/admin/coursework-form";
import { SectionHeading } from "@/components/shared/section-heading";

export default function NewCourseWorkPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <SectionHeading eyebrow="content" title="Add Course" />
      <CourseWorkForm />
    </div>
  );
}
