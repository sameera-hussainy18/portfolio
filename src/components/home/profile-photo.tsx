"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProfilePhoto() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: EASE }}
      whileHover={reducedMotion ? undefined : { scale: 1.05, rotate: 1.5 }}
      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      className="glow-border relative size-48 shrink-0 overflow-hidden rounded-full transition-shadow duration-300 sm:size-64 lg:size-72"
    >
      <Image
        src={siteConfig.profileImage}
        alt={siteConfig.name}
        fill
        sizes="(min-width: 1024px) 18rem, (min-width: 640px) 16rem, 12rem"
        className="object-cover"
        priority
      />
    </motion.div>
  );
}
