import type { TechCategory, TechStack } from "@/types/database";
import { EmptyState } from "@/components/shared/empty-state";

const CATEGORY_LABELS: Record<TechCategory, string> = {
  language: "Languages",
  framework: "Frameworks & Libraries",
  database: "Databases",
  tool: "Tools",
  cloud: "Cloud & Infra",
  other: "Other",
};

const CATEGORY_ORDER: TechCategory[] = [
  "language",
  "framework",
  "database",
  "cloud",
  "tool",
  "other",
];

export function TechStackGrid({ items }: { items: TechStack[] }) {
  if (items.length === 0) {
    return (
      <EmptyState message="Tech stack entries will appear here once added in the admin dashboard." />
    );
  }

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((item) => item.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col gap-10">
      {grouped.map((group) => (
        <div key={group.category}>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {CATEGORY_LABELS[group.category]}
          </h2>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <span
                key={item.id}
                className="glow-border rounded-lg bg-card px-3.5 py-2 text-sm text-foreground"
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
