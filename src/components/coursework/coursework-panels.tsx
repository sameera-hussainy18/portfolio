"use client";

import { useState } from "react";
import { Award, Code2, Truck, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseCategory, CourseWork } from "@/types/database";
import { EmptyState } from "@/components/shared/empty-state";
import { TiltCard } from "@/components/shared/tilt-card";

const CATEGORIES: {
  value: CourseCategory;
  label: string;
  icon: typeof Code2;
}[] = [
  { value: "cs", label: "Computer Science", icon: Code2 },
  { value: "business", label: "Business", icon: TrendingUp },
  { value: "minor", label: "Minor", icon: Truck },
  { value: "honours", label: "Honours", icon: Award },
];

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
                {course.course_code && (
                  <span className="shrink-0 font-mono text-xs text-primary">
                    {course.course_code}
                  </span>
                )}
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
  const [selected, setSelected] = useState<CourseCategory>("cs");

  if (items.length === 0) {
    return (
      <EmptyState message="Coursework will appear here once added in the admin dashboard." />
    );
  }

  const counts: Record<CourseCategory, number> = {
    cs: items.filter((item) => item.category === "cs").length,
    business: items.filter((item) => item.category === "business").length,
    minor: items.filter((item) => item.category === "minor").length,
    honours: items.filter((item) => item.category === "honours").length,
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map(({ value, label, icon: Icon }) => {
          const isActive = selected === value;
          return (
            <TiltCard key={value}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelected(value)}
                className={cn(
                  "glow-border flex w-full items-center gap-5 rounded-xl bg-card px-7 py-8 text-left transition-all hover:-translate-y-0.5",
                  isActive
                    ? "ring-2 ring-primary/70"
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <span
                  className={cn(
                    "flex size-14 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="size-7" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-xl font-semibold tracking-tight text-foreground">
                    {label}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    {counts[value]} course{counts[value] === 1 ? "" : "s"}
                  </span>
                </span>
              </button>
            </TiltCard>
          );
        })}
      </div>

      <CourseList items={items.filter((item) => item.category === selected)} />
    </div>
  );
}
