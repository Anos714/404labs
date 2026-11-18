"use client";

// dust-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Caption, Foot, Plate, Screen } from "./chrome";

/* ----------------------------------- dust ---------------------------------- */

const MOTES = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 41 + 7) % 100,
  top: (i * 53 + 19) % 82,
  size: i % 7 === 0 ? 2.5 : 1 + (i % 3) * 0.5,
  delay: (i % 9) * 0.55,
  dur: 8 + (i % 6) * 2,
  drift: (i % 2 === 0 ? 1 : -1) * (4 + (i % 5) * 3),
}));

export function DustDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const [open, setOpen] = useState(false);

  return (
    <Screen
      ref={ref}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      className="bg-[#07080a]"
    >
      <Plate
        src="/worlds/w-dark-range.webp"
        className="brightness-[0.38] blur-[1px]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.35)_0%,rgba(8,9,10,0.15)_50%,rgba(8,9,10,0.9)_100%)]" />
      <div
        aria-hidden
        className="absolute -left-[18%] -top-[30%] h-[150%] w-[70%] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(242,237,227,0.09),transparent)] blur-2xl"
      />

      {MOTES.map((m, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-fg"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            opacity: 0.35,
          }}
          animate={
            inView && !reduce
              ? {
                  y: [0, -14, 4, 0],
                  x: [0, m.drift, m.drift * 0.2, 0],
                  opacity: open ? [0.15, 0.7, 0.1] : [0.2, 0.5, 0.2],
                }
              : undefined
          }
          transition={{
            duration: m.dur,
            delay: m.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
        <span
          className={`display text-[76px] leading-none text-fg transition-all duration-700 ${
            open ? "blur-[2px] opacity-60" : "blur-0 opacity-100"
          }`}
        >
          404
        </span>
        <span className="lab-mono text-[10px] text-white/60">
          the air keeps the shape
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-9 left-4 lab-mono text-[9.5px] text-white/40">
        0.4 µm · still air
      </div>

      <Caption label="404 / dust" />
      <Foot method="motes · drift" />
    </Screen>
  );
}
