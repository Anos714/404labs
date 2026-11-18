"use client";

// door-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Caption, Foot, Plate, Screen } from "./chrome";

/* ----------------------------------- door ---------------------------------- */

export function DoorDemo() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  const door =
    "absolute inset-0 [backface-visibility:hidden] will-change-transform";

  return (
    <Screen
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      className="bg-ink-950 [perspective:1200px]"
    >
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center gap-1.5">
          <span className="lab-mono text-[10px] text-white/40">no further</span>
          <span className="lab-mono text-[13px] text-amber/70">×</span>
        </div>
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgba(233,184,113,0.55),transparent)]"
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      <motion.div
        className={door}
        style={{ clipPath: "inset(0 50% 0 0)", transformOrigin: "left center" }}
        animate={{ rotateY: open && !reduce ? -104 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 19 }}
      >
        <Plate src="/worlds/w-dusk-light.webp" className="brightness-[0.8]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.35)_0%,rgba(8,9,10,0.1)_45%,rgba(8,9,10,0.88)_100%)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span className="display text-[64px] leading-none text-fg drop-shadow-[0_3px_12px_rgba(8,9,10,0.7)]">
            404
          </span>
          <span className="lab-mono text-[10px] text-white/75">
            the door was never here
          </span>
        </div>
      </motion.div>

      <motion.div
        className={door}
        style={{ clipPath: "inset(0 0 0 50%)", transformOrigin: "right center" }}
        animate={{ rotateY: open && !reduce ? 104 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 19 }}
      >
        <Plate src="/worlds/w-dusk-light.webp" className="brightness-[0.8]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.35)_0%,rgba(8,9,10,0.1)_45%,rgba(8,9,10,0.88)_100%)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span className="display text-[64px] leading-none text-fg drop-shadow-[0_3px_12px_rgba(8,9,10,0.7)]">
            404
          </span>
          <span className="lab-mono text-[10px] text-white/75">
            the door was never here
          </span>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-4 z-10 border border-white/10">
        <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40" />
      </div>

      <Caption label="404 / door" />
      <Foot method="rotateY · 104°" />
    </Screen>
  );
}
