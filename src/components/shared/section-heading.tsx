import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
        {`// ${eyebrow}`}
      </span>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
