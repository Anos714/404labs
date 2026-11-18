"use client";

// orbit-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { motion, useReducedMotion } from "motion/react";
import { Caption, Foot, Plate, Screen } from "./chrome";

/* ---------------------------------- orbit ---------------------------------- */

export function OrbitDemo() {
  const reduce = useReducedMotion();

  return (
    <Screen>
      <Plate src="/worlds/px6.webp" className="opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.2)_0%,rgba(8,9,10,0.55)_60%,rgba(8,9,10,0.92)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,9,10,0.45)_0%,transparent_70%)]" />
      <Caption label="404 / orbit" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
        <div className="flex items-baseline">
          <span className="display text-[72px] leading-none text-fg">4</span>
          <span className="relative inline-block">
            <span className="display relative z-10 text-[72px] leading-none text-fg">
              0
            </span>
            <motion.span
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[74px] w-[104px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-amber/45"
              style={{ rotate: -18 }}
              animate={reduce ? undefined : { rotate: [-18, 342] }}
              transition={{ duration: 22, ease: "linear", repeat: Infinity }}
            >
              <span className="absolute -top-[3px] left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-amber" />
            </motion.span>
          </span>
          <span className="display text-[72px] leading-none text-fg">4</span>
        </div>
        <p className="lab-mono text-[10px] text-white/60">
          you have left the map
        </p>
      </div>

      <Foot method="22s loop" />
    </Screen>
  );
}
