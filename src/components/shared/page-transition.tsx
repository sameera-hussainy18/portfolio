"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <div style={{ perspective: 1200 }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={
            reducedMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 16, rotateX: -6 }
          }
          animate={
            reducedMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0, rotateX: 0 }
          }
          exit={
            reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12, rotateX: 4 }
          }
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "top center" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
