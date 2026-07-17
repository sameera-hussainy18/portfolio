import Link from "next/link";
import type { ContentCounts } from "@/lib/queries";

const STATS: {
  key: keyof ContentCounts;
  label: string;
  href: string;
}[] = [
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "internships", label: "Internships", href: "/internships" },
  { key: "certificates", label: "Certificates", href: "/certificates" },
  { key: "techStack", label: "Tech Stack", href: "/tech-stack" },
];

export function StatCounts({ counts }: { counts: ContentCounts }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STATS.map((stat) => (
        <Link
          key={stat.key}
          href={stat.href}
          className="glow-border flex flex-col items-center gap-1 rounded-lg bg-card px-4 py-5 text-center transition-transform hover:-translate-y-0.5"
        >
          <span className="font-mono text-2xl font-semibold text-primary text-glow">
            {counts[stat.key]}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {stat.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
