"use client";

import { motion, useReducedMotion } from "framer-motion";

const SIZE = 152;
const STROKE = 9;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CGPARing({
  cgpa,
  percent,
  caption,
}: {
  cgpa: number;
  percent: number;
  caption: string;
}) {
  const reducedMotion = useReducedMotion();
  const offset = CIRCUMFERENCE * (1 - percent / 100);

  return (
    <div className="glow-border flex flex-col items-center gap-3 rounded-xl bg-card px-6 py-6">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          className="-rotate-90"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            className="stroke-muted"
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            className="stroke-green-500"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: reducedMotion ? offset : CIRCUMFERENCE }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {cgpa.toFixed(2)}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            CGPA
          </span>
        </div>
      </div>
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {caption}
      </span>
    </div>
  );
}
