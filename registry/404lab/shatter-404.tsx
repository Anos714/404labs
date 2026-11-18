"use client";

// shatter-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Caption, Foot, Screen } from "./chrome";

/* --------------------------------- shatter --------------------------------- */

const LATTICE: [number, number][][] = [
  [
    [0, 0],
    [31, 0],
    [67, 0],
    [100, 0],
  ],
  [
    [0, 26],
    [28, 31],
    [70, 24],
    [100, 29],
  ],
  [
    [0, 65],
    [33, 59],
    [66, 68],
    [100, 61],
  ],
  [
    [0, 100],
    [30, 100],
    [69, 100],
    [100, 100],
  ],
];

const SHARDS = (() => {
  const out: { clip: string; x: number; y: number; rot: number }[] = [];
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      const p = [
        LATTICE[r][c],
        LATTICE[r][c + 1],
        LATTICE[r + 1][c + 1],
        LATTICE[r + 1][c],
      ];
      out.push({
        clip: `polygon(${p.map(([x, y]) => `${x}% ${y}%`).join(", ")})`,
        x: (c - 1) * 20 + (r - 1) * 3,
        y: (r - 1) * 16,
        rot: (c - 1) * 3 + (r - 1) * 2,
      });
    }
  }
  return out;
})();

export function ShatterDemo() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <Screen
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
    >
      {SHARDS.map((s, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{ clipPath: s.clip }}
          animate={
            open && !reduce ? { x: s.x, y: s.y, rotate: s.rot } : { x: 0, y: 0, rotate: 0 }
          }
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 18,
            delay: i * 0.012,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/worlds/w-dark-range.webp)" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.3)_0%,rgba(8,9,10,0.1)_50%,rgba(8,9,10,0.85)_100%)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="display text-[66px] leading-none text-fg drop-shadow-[0_2px_12px_rgba(8,9,10,0.7)]">
              404
            </span>
            <span className="lab-mono text-[10px] text-white/70">
              the page broke apart
            </span>
          </div>
        </motion.div>
      ))}

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(8,9,10,0.55)_100%)]" />
      <Caption label="404 / shatter" />
      <Foot method="9 shards · clip-path" />
    </Screen>
  );
}
