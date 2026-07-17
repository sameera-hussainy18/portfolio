"use client";

import { Label } from "@/components/ui/label";
import type { TechStack } from "@/types/database";

interface TechMultiSelectProps {
  options: TechStack[];
  value: string[];
  onChange: (ids: string[]) => void;
}

export function TechMultiSelect({ options, value, onChange }: TechMultiSelectProps) {
  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  if (options.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No tech stack entries yet — add some under Tech Stack first.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Tech Stack</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const selected = value.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(option.id)}
              className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
                selected
                  ? "border-primary/60 bg-primary/15 text-foreground"
                  : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
