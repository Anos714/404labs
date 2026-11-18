"use client";

// mosaic-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { motion, useReducedMotion } from "motion/react";
import { Caption, EASE, Foot, Screen, useReplay } from "./chrome";

/* ---------------------------------- mosaic --------------------------------- */

const TILES = Array.from({ length: 12 }, (_, i) => ({
  c: i % 4,
  r: Math.floor(i / 4),
}));

export function MosaicDemo() {
  const reduce = useReducedMotion();
  const { run, replay } = useReplay();

  return (
    <Screen onPointerEnter={replay} onClick={replay}>
      {TILES.map(({ c, r }, i) => (
        <motion.div
          key={`${run}-${i}`}
          className="absolute h-1/3 w-1/4"
          style={{
            left: `${c * 25}%`,
            top: `${r * 33.3333}%`,
            backgroundImage: "url(/worlds/w-dark-ridge.webp)",
            backgroundSize: "400% 300%",
            backgroundPosition: `${c * 33.3333}% ${r * 50}%`,
            boxShadow: "inset 0 0 0 1px rgba(8,9,10,0.85)",
          }}
          initial={reduce ? false : { opacity: 0, scale: 0.78 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.55,
            ease: EASE,
            delay: (Math.abs(c - 1.5) + Math.abs(r - 1)) * 0.06,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.35)_0%,rgba(8,9,10,0.05)_40%,rgba(8,9,10,0.85)_100%)]" />
      <Caption label="404 / mosaic" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2">
        <span className="display text-[68px] leading-none text-fg drop-shadow-[0_2px_14px_rgba(8,9,10,0.7)]">
          404
        </span>
        <span className="lab-mono text-[10px] text-white/75">
          assembled from twelve tiles
        </span>
      </div>

      <Foot method="mosaic · 12 tiles" />
    </Screen>
  );
}
