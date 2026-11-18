"use client";

// ash-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Caption, Foot, Plate, Screen } from "./chrome";

/* ----------------------------------- ash ----------------------------------- */

const EDGE =
  "0,8 3,3 6,7 9,2 12,8 15,4 18,7 21,1 24,8 27,3 30,7 33,2 36,8 39,4 42,7 45,2 48,8 51,3 54,7 57,1 60,8 63,4 66,7 69,2 72,8 75,3 78,7 81,2 84,8 87,4 90,7 93,2 96,8 100,4";

const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  delay: (i % 7) * 0.36,
  size: 1 + (i % 3),
  drift: (i % 2 === 0 ? 1 : -1) * (5 + (i % 4) * 3),
}));

export function AshDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const reduce = useReducedMotion();

  return (
    <Screen ref={ref} className="bg-[#060707]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(233,184,113,0.08)_0%,transparent_62%)]" />
      <div className="absolute inset-0 grid place-items-center opacity-[0.06]">
        <span className="display text-[76px] leading-none text-fg">404</span>
      </div>

      <div className="absolute inset-0 transition-[clip-path] duration-[900ms] ease-out [clip-path:inset(0_0_29%_0)] group-hover:[clip-path:inset(0_0_50%_0)]">
        <Plate
          src="/worlds/w-bay-burn.webp"
          className="brightness-[0.72] saturate-[0.9]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.2)_0%,rgba(8,9,10,0.12)_45%,rgba(8,9,10,0.72)_100%)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="display text-[76px] leading-none text-fg drop-shadow-[0_2px_14px_rgba(8,9,10,0.6)]">
            404
          </span>
          <span className="lab-mono text-[10px] text-white/70">
            it started at the edge
          </span>
        </div>
      </div>

      <svg
        aria-hidden
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-[29%] z-20 h-3 w-full overflow-visible transition-[bottom] duration-[900ms] ease-out group-hover:bottom-[50%]"
      >
        <polyline
          points={EDGE}
          fill="none"
          stroke="rgba(233,184,113,0.9)"
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={EDGE}
          fill="none"
          stroke="rgba(255,238,206,0.55)"
          strokeWidth={0.6}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="pointer-events-none absolute inset-x-0 bottom-[28%] z-10 h-16 bg-[linear-gradient(0deg,rgba(233,184,113,0.16),transparent)] blur-md transition-[bottom] duration-[900ms] group-hover:bottom-[49%]" />

      {EMBERS.map((e, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute bottom-[31%] z-20 rounded-full bg-amber"
          style={{ left: `${e.left}%`, width: e.size, height: e.size }}
          animate={
            inView && !reduce
              ? {
                  y: [0, -16, -32],
                  x: [0, e.drift, e.drift * 0.4],
                  opacity: [0, 0.85, 0],
                }
              : { opacity: 0.4 }
          }
          transition={{
            duration: 3.2,
            delay: e.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      <div className="pointer-events-none absolute bottom-9 left-4 z-30 lab-mono text-[9.5px] text-white/45">
        412 °C
      </div>

      <Caption label="404 / ash" />
      <Foot method="burn line · clip-path" />
    </Screen>
  );
}
