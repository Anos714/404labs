"use client";

// flood-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Caption, Foot, Plate, Screen } from "./chrome";

/* ---------------------------------- flood ---------------------------------- */

export function FloodDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });

  return (
    <Screen ref={ref} className="bg-ink-950">
      <Plate
        src="/worlds/w-river-dusk.webp"
        className="brightness-[0.82] transition-[filter] duration-700 group-hover:brightness-[0.68]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.18)_0%,rgba(8,9,10,0.35)_55%,rgba(8,9,10,0.82)_100%)]" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 transition-transform duration-700 ease-out group-hover:translate-y-2">
        <span className="display text-[76px] leading-none text-fg drop-shadow-[0_2px_16px_rgba(8,9,10,0.7)]">
          404
        </span>
        <span className="lab-mono text-[10px] text-white/65">
          the path is under water
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 h-[30%] transition-[height] duration-700 ease-out group-hover:h-[39%]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,42,44,0.72)_0%,rgba(7,16,18,0.94)_65%,#07090a_100%)]" />
        <motion.div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px w-[200%] bg-[repeating-linear-gradient(90deg,rgba(242,237,227,0.42)_0_18px,transparent_18px_46px)]"
          animate={inView && !reduce ? { x: ["0%", "-50%"] } : undefined}
          transition={{ duration: 9, ease: "linear", repeat: Infinity }}
        />
        <div className="absolute inset-x-0 top-[18%] h-px bg-white/10" />
        <div className="absolute inset-x-0 bottom-[26%] h-px bg-white/[0.06]" />

        <div
          aria-hidden
          className="absolute -top-[76px] left-1/2 -translate-x-1/2 scale-y-[-1] opacity-[0.16] blur-[1.5px]"
          style={{
            maskImage:
              "linear-gradient(180deg,transparent 0%,#000 55%,transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg,transparent 0%,#000 55%,transparent 100%)",
          }}
        >
          <span className="display text-[68px] leading-none text-fg">404</span>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-9 right-4 z-30 lab-mono text-[9.5px] text-white/45">
        + 2.40 m
      </div>

      <Caption label="404 / flood" />
      <Foot method="waterline · 2 layers" />
    </Screen>
  );
}
