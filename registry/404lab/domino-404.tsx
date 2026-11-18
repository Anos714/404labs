"use client";

// domino-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Caption, Foot, Screen } from "./chrome";

/* --------------------------------- domino ---------------------------------- */

type Block = { w: number; h: number; digit?: string };

const BLOCKS: Block[] = [
  { w: 6, h: 40 },
  { w: 6, h: 46 },
  { w: 6, h: 42 },
  { w: 6, h: 50 },
  { w: 6, h: 44 },
  { w: 6, h: 48 },
  { w: 44, h: 74, digit: "4" },
  { w: 44, h: 74, digit: "0" },
  { w: 44, h: 74, digit: "4" },
];

export function DominoDemo() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <Screen
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      className="bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_35%,rgba(242,237,227,0.07),transparent_65%)]" />

      <div className="absolute inset-x-0 bottom-[24%] top-[14%] flex items-end justify-center">
        <div className="flex items-end gap-[7px]">
          {BLOCKS.map((b, i) => (
            <motion.div
              key={i}
              className={`relative shrink-0 rounded-[2px] ${
                b.digit ? "bg-fg/90" : "bg-fg/55"
              }`}
              style={{
                width: b.w,
                height: b.h,
                transformOrigin: "bottom left",
              }}
              animate={{
                rotate: open && !reduce ? 74 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 18,
                delay: open ? i * 0.055 : 0,
              }}
            >
              {b.digit && (
                <span className="absolute inset-0 grid place-items-center lab-mono text-[26px] font-medium text-ink-950">
                  {b.digit}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-6 bottom-[24%] h-px bg-white/15" />
      <div className="pointer-events-none absolute inset-x-0 bottom-11 text-center lab-mono text-[10px] text-white/45">
        one small push
      </div>

      <Caption label="404 / domino" />
      <Foot method="chain · 55ms" />
    </Screen>
  );
}
