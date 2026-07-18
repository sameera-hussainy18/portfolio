import type { CourseWork } from "@/types/database";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

function groupBySemester(items: CourseWork[]) {
  const semesters = new Map<number, CourseWork[]>();
  for (const item of items) {
    const group = semesters.get(item.semester) ?? [];
    group.push(item);
    semesters.set(item.semester, group);
  }
  return [...semesters.entries()].sort(([a], [b]) => a - b);
}

function CourseList({ items }: { items: CourseWork[] }) {
  if (items.length === 0) {
    return (
      <EmptyState message="Courses for this track will appear here once added in the admin dashboard." />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {groupBySemester(items).map(([semester, courses]) => (
        <div key={semester}>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Semester {semester}
          </h3>
          <div className="flex flex-col gap-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className="glow-border flex items-center gap-3 rounded-lg bg-card px-4 py-2.5"
              >
                <span className="shrink-0 font-mono text-xs text-primary">
                  {course.course_code}
                </span>
                <span className="text-sm text-foreground">
                  {course.course_title}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CourseWorkPanels({ items }: { items: CourseWork[] }) {
  if (items.length === 0) {
    return (
      <EmptyState message="Coursework will appear here once added in the admin dashboard." />
    );
  }

  const cs = items.filter((item) => item.category === "cs");
  const business = items.filter((item) => item.category === "business");

  return (
    <Tabs defaultValue="cs">
      <TabsList>
        <TabsTrigger value="cs">Computer Science</TabsTrigger>
        <TabsTrigger value="business">Business</TabsTrigger>
      </TabsList>
      <TabsContent value="cs" className="pt-6">
        <CourseList items={cs} />
      </TabsContent>
      <TabsContent value="business" className="pt-6">
        <CourseList items={business} />
      </TabsContent>
    </Tabs>
  );
}
