import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
}

export function StatCard({ label, value, href, icon: Icon, highlight }: StatCardProps) {
  return (
    <Link href={href}>
      <Card className="glow-border h-full transition-transform hover:-translate-y-0.5">
        <CardContent className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p
              className={`mt-1 text-2xl font-semibold ${
                highlight ? "text-primary" : "text-foreground"
              }`}
            >
              {value}
            </p>
          </div>
          <Icon className="size-6 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
}
