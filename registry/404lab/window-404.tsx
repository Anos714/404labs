"use client";

// window-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Caption, Foot, Plate, Screen } from "./chrome";

/* ---------------------------------- window --------------------------------- */

const RAIN = [
  { left: 14, delay: 0, dur: 2.4, len: 22, op: 0.35 },
  { left: 27, delay: 0.9, dur: 3.1, len: 34, op: 0.22 },
  { left: 42, delay: 0.35, dur: 2.7, len: 18, op: 0.4 },
  { left: 58, delay: 1.4, dur: 3.4, len: 28, op: 0.2 },
  { left: 71, delay: 0.55, dur: 2.2, len: 24, op: 0.32 },
  { left: 84, delay: 1.1, dur: 2.9, len: 38, op: 0.26 },
];

export function WindowDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });

  return (
    <Screen ref={ref} className="bg-[#07080a]">
      <Plate src="/worlds/w-night-light.webp" className="brightness-[0.7]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.28)_0%,rgba(8,9,10,0.12)_50%,rgba(8,9,10,0.78)_100%)]" />

      <div className="absolute inset-5 z-10 overflow-hidden border-[7px] border-[#08090a] shadow-[inset_0_0_36px_rgba(8,9,10,0.8)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_20%,rgba(8,9,10,0.45)_100%)]" />
        <div className="absolute inset-x-0 top-1/2 h-[6px] -translate-y-1/2 bg-[#08090a]" />
        <div className="absolute inset-y-0 left-[58%] w-[6px] -translate-x-1/2 bg-[#08090a]" />

        {RAIN.map((r, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute top-0 w-px rounded-full bg-[linear-gradient(180deg,transparent,rgba(242,237,227,0.9),transparent)]"
            style={{ left: `${r.left}%`, height: r.len, opacity: r.op }}
            animate={inView && !reduce ? { y: ["-12%", "520%"] } : undefined}
            transition={{
              duration: r.dur,
              delay: r.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#f4ecd9]"
          animate={
            inView && !reduce
              ? { opacity: [0, 0, 0.16, 0, 0] }
              : { opacity: 0 }
          }
          transition={{
            duration: 7.5,
            times: [0, 0.62, 0.65, 0.69, 1],
            repeat: Infinity,
            repeatDelay: 3.2,
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span className="display text-[70px] leading-none text-fg/85 blur-[0.4px] drop-shadow-[0_2px_12px_rgba(8,9,10,0.7)]">
            404
          </span>
          <span className="lab-mono text-[10px] text-white/55">
            nobody is coming back
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-3 bottom-2 lab-mono text-[8px] text-white/35">
          condensation / 04:04
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-2 left-5 z-20 h-2 w-16 bg-[#08090a]" />
      <div className="pointer-events-none absolute bottom-2 right-5 z-20 h-2 w-16 bg-[#08090a]" />

      <Caption label="404 / window" className="left-6 top-6" />
      <Foot method="rain · condensation" />
    </Screen>
  );
}
