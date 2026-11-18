"use client";

// barcode-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Caption, Foot, Screen } from "./chrome";

/* --------------------------------- barcode --------------------------------- */

function Bars() {
  const widths = [
    2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1,
    1, 3, 2, 1, 4, 1, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3,
  ];
  return (
    <div aria-hidden className="flex h-9 items-stretch gap-[2px]">
      {widths.map((w, i) => (
        <span
          key={i}
          className="block bg-fg/80"
          style={{ width: w, opacity: i % 5 === 0 ? 0.95 : 0.55 }}
        />
      ))}
    </div>
  );
}

export function BarcodeDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });

  return (
    <Screen ref={ref} className="bg-[#07080a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(242,237,227,0.055),transparent_66%)]" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
        <span className="display text-[80px] leading-none text-fg">404</span>
        <Bars />
        <span className="lab-mono text-[8.5px] tracking-[0.26em] text-white/45">
          4 940404 000404
        </span>
        <span className="lab-mono text-[9.5px] text-white/40">
          scanned, not found
        </span>
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-20 w-[2px] bg-amber/90 shadow-[0_0_18px_2px_rgba(233,184,113,0.35)]"
        animate={inView && !reduce ? { left: ["6%", "94%"] } : { left: "50%" }}
        transition={{
          duration: 3.4,
          repeat: Infinity,
          repeatDelay: 1.1,
          ease: "easeInOut",
        }}
      >
        <span className="absolute inset-y-0 -left-3 w-8 bg-[linear-gradient(90deg,transparent,rgba(233,184,113,0.14),transparent)]" />
      </motion.div>

      <div className="pointer-events-none absolute bottom-9 right-4 lab-mono text-[9px] text-white/35">
        EAN 404
      </div>

      <Caption label="404 / barcode" />
      <Foot method="scan · EAN" />
    </Screen>
  );
}
