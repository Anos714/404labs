"use client";

// fog-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Caption, Foot, Plate, Screen } from "./chrome";

/* ----------------------------------- fog ----------------------------------- */

export function FogDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });

  const drift = (dx: string) =>
    inView && !reduce
      ? {
          x: [dx, `-${dx}`],
          opacity: [0.45, 0.85, 0.45],
        }
      : undefined;

  return (
    <Screen ref={ref}>
      <Plate
        src="/worlds/w-cloud-platform.webp"
        className="scale-105 blur-[1.5px] brightness-[0.62]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.4)_0%,rgba(8,9,10,0.05)_45%,rgba(8,9,10,0.8)_100%)]" />

      <motion.div
        className="absolute -inset-x-1/3 top-[-25%] h-[150%] bg-[radial-gradient(closest-side,rgba(242,237,227,0.16),transparent)] blur-2xl"
        animate={drift("6%")}
        transition={{ duration: 16, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -inset-x-1/2 top-[10%] h-[110%] bg-[radial-gradient(closest-side,rgba(242,237,227,0.12),transparent)] blur-2xl"
        animate={drift("9%")}
        transition={{ duration: 22, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -inset-x-1/3 bottom-[-20%] h-[90%] bg-[radial-gradient(closest-side,rgba(242,237,227,0.1),transparent)] blur-2xl"
        animate={drift("5%")}
        transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
        <span
          className="display text-[70px] leading-none text-fg"
          style={{
            maskImage:
              "linear-gradient(180deg, transparent 0%, #000 28%, #000 72%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, #000 28%, #000 72%, transparent 100%)",
          }}
        >
          404
        </span>
        <span className="lab-mono text-[10px] text-white/70">
          visibility 20 m
        </span>
      </div>

      <Caption label="404 / fog" />
      <Foot method="drift · blur" />
    </Screen>
  );
}
