"use client";

// braille-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { motion, useReducedMotion } from "motion/react";
import { Caption, Foot, Screen, useReplay } from "./chrome";

/* --------------------------------- braille --------------------------------- */

const CELLS = [
  [true, false, false, true, true, false],
  [false, true, false, true, true, false],
  [true, false, false, true, true, false],
];

const DIGITS = ["4", "0", "4"];

export function BrailleDemo() {
  const reduce = useReducedMotion();
  const { run, replay } = useReplay();

  return (
    <Screen
      onPointerEnter={replay}
      onClick={replay}
      className="bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,237,227,0.05),transparent_66%)]" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6">
        <div className="flex items-start gap-7">
          {CELLS.map((cell, c) => (
            <div key={c} className="flex flex-col items-center gap-3">
              <div className="grid grid-cols-2 gap-x-3.5 gap-y-3">
                {cell.map((on, i) => (
                  <motion.span
                    key={`${run}-${c}-${i}`}
                    initial={reduce ? false : { scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: on ? 1 : 0.14 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 320,
                      damping: 18,
                      delay: reduce ? 0 : c * 0.28 + i * 0.05,
                    }}
                    className={`size-[13px] rounded-full ${
                      on ? "bg-fg" : "border border-fg/25"
                    }`}
                  />
                ))}
              </div>
              <span className="display text-[21px] leading-none text-white/45">
                {DIGITS[c]}
              </span>
            </div>
          ))}
        </div>

        <p className="lab-mono text-[10px] text-white/45">
          read by touch, not by sight
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-9 left-4 lab-mono text-[9.5px] text-white/35">
        6 dots per cell
      </div>

      <Caption label="404 / braille" />
      <Foot method="6 dots · 3 cells" />
    </Screen>
  );
}
