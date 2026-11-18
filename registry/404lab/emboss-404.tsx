"use client";

// emboss-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Caption, Foot, Screen } from "./chrome";

/* ---------------------------------- emboss --------------------------------- */

export function EmbossDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });

  return (
    <Screen ref={ref} className="bg-[#0d0f12]">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.014)_0_1px,transparent_1px_3px)]" />
      <motion.div
        aria-hidden
        className="absolute -inset-x-1/4 -top-1/3 h-[190%] w-[150%] origin-center bg-[linear-gradient(90deg,transparent_35%,rgba(242,237,227,0.075)_50%,transparent_65%)] blur-xl"
        animate={inView && !reduce ? { x: ["-18%", "18%"] } : undefined}
        transition={{
          duration: 9,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />

      <div className="absolute inset-0 z-10 grid place-items-center">
        <span
          className="display text-[84px] leading-none text-[#242a2f] transition-[text-shadow] duration-500 group-hover:[text-shadow:0_2px_0_rgba(242,237,227,0.22),0_-2px_0_rgba(0,0,0,0.95)]"
          style={{
            textShadow:
              "0 1px 0 rgba(242,237,227,0.2), 0 -1px 0 rgba(0,0,0,0.95), 0 16px 30px rgba(0,0,0,0.45)",
          }}
        >
          404
        </span>
      </div>

      <div className="pointer-events-none absolute inset-5 border border-white/[0.045]" />
      <div className="pointer-events-none absolute left-4 top-9 lab-mono text-[9px] leading-relaxed text-white/35">
        <p>BLIND EMBOSS</p>
        <p>0.4 mm</p>
      </div>
      <div className="pointer-events-none absolute bottom-9 right-4 lab-mono text-[9px] text-white/35">
        no ink
      </div>

      <Caption label="404 / emboss" />
      <Foot method="deboss · raking light" />
    </Screen>
  );
}
