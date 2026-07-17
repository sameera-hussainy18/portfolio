import { Badge } from "@/components/ui/badge";
import type { InternshipWithTech } from "@/types/database";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function InternshipItem({
  internship,
}: {
  internship: InternshipWithTech;
}) {
  const range = `${formatDate(internship.start_date)} — ${
    internship.end_date ? formatDate(internship.end_date) : "Present"
  }`;

  return (
    <div className="relative pl-8">
      <div className="absolute top-1.5 left-0 size-2.5 rounded-full bg-primary shadow-[0_0_12px_2px] shadow-primary/50" />
      <div className="absolute top-4 bottom-[-2.5rem] left-[4.5px] w-px bg-border last:hidden" />

      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {range}
      </span>
      <h3 className="mt-1 text-lg font-semibold text-foreground">
        {internship.role}
      </h3>
      <p className="text-sm text-muted-foreground">
        {internship.company}
        {internship.location ? ` · ${internship.location}` : ""}
      </p>
      {internship.description && (
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {internship.description}
        </p>
      )}
      {internship.tech_stack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {internship.tech_stack.map((tech) => (
            <Badge
              key={tech.id}
              variant="secondary"
              className="font-mono text-[10px]"
            >
              {tech.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
