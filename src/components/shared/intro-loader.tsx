"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

// Sameera's own languages (from her resume), not a copy of anyone else's greeting set.
const GREETINGS = ["Hello", "నమస్కారం", "नमस्ते", "السلام علیکم"];
const EASE = [0.22, 1, 0.36, 1] as const;
const GREETING_INTERVAL_MS = 650;
const TOTAL_DURATION_MS = 2500;

export function IntroLoader() {
  const [visible, setVisible] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const alreadyPlayed = sessionStorage.getItem("introPlayed");
    sessionStorage.setItem("introPlayed", "true");

    if (alreadyPlayed || reducedMotion) return;

    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const greetingTimer = setInterval(() => {
      setGreetingIndex((i) => (i + 1) % GREETINGS.length);
    }, GREETING_INTERVAL_MS);
    const dismissTimer = setTimeout(() => setVisible(false), TOTAL_DURATION_MS);

    return () => {
      clearInterval(greetingTimer);
      clearTimeout(dismissTimer);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          onClick={() => setVisible(false)}
          className="bg-grid fixed inset-0 z-[999] flex cursor-pointer items-center justify-center overflow-hidden bg-background"
        >
          <div className="relative flex w-full max-w-xl flex-col items-center gap-5 px-6 text-center">
            <motion.span
              key={greetingIndex}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.4, ease: EASE }}
              className="font-mono text-xs uppercase tracking-[0.3em] text-primary"
            >
              {GREETINGS[greetingIndex]}
            </motion.span>

            <div className="overflow-hidden">
              <motion.div
                role="presentation"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ delay: 0.3, duration: 1, ease: EASE }}
                className="text-glow text-[clamp(1.75rem,7vw,4rem)] leading-[0.95] font-bold tracking-tight text-foreground uppercase"
              >
                {siteConfig.name}
              </motion.div>
            </div>

            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7, ease: EASE }}
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
              {siteConfig.tagline}
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.7, ease: EASE }}
              className="glow-border mt-1 rounded-full px-4 py-1.5 font-mono text-[11px] tracking-[0.15em] text-muted-foreground uppercase"
            >
              ~/portfolio
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
