"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { siteConfig } from "@/lib/site-config";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { stiffness: 200, damping: 20, mass: 0.5 };

export function ProfilePhoto() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [12, -12]), SPRING);
  const rotateY = useSpring(useTransform(x, [0, 1], [-12, 12]), SPRING);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: EASE }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={reducedMotion ? undefined : { scale: 1.05 }}
        whileTap={reducedMotion ? undefined : { scale: 0.97 }}
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
        }}
        className="glow-border relative size-56 shrink-0 overflow-hidden rounded-full transition-shadow duration-300 sm:size-80 lg:size-96"
      >
        <Image
          src={siteConfig.profileImage}
          alt={siteConfig.name}
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 20rem, 14rem"
          className="object-cover"
          priority
        />
      </motion.div>
    </div>
  );
}
