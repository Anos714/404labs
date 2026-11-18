"use client";

// odometer-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { motion, useReducedMotion } from "motion/react";
import { Caption, Foot, Screen, useReplay } from "./chrome";

/* --------------------------------- odometer -------------------------------- */

const CELL = 76;

function reel(target: string, cycles: number) {
  const seq: string[] = [];
  for (let i = 0; i < cycles * 10 + 2; i += 1) seq.push(String(i % 10));
  if (seq[seq.length - 1] !== target) seq.push(target);
  return seq;
}

const REELS = [
  reel("4", 2),
  reel("0", 2),
  reel("4", 1),
];

export function OdometerDemo() {
  const reduce = useReducedMotion();
  const { run, replay } = useReplay();

  return (
    <Screen onPointerEnter={replay} onClick={replay} className="bg-[#07080a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,237,227,0.05),transparent_65%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="flex items-start gap-1.5">
          {REELS.map((seq, i) => (
            <div
              key={i}
              className="relative h-[76px] w-[56px] overflow-hidden border-y border-line-2 bg-ink-850/60"
              style={{
                maskImage:
                  "linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)",
              }}
            >
              {reduce ? (
                <span className="grid h-[76px] place-items-center display text-[62px] leading-none text-fg">
                  {seq[seq.length - 1]}
                </span>
              ) : (
                <motion.div
                  key={run}
                  initial={{ y: 0 }}
                  animate={{ y: -(seq.length - 1) * CELL }}
                  transition={{
                    duration: 1.9,
                    delay: i * 0.14,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {seq.map((d, j) => (
                    <span
                      key={j}
                      className="grid h-[76px] place-items-center display text-[62px] leading-none tabular-nums text-fg"
                    >
                      {d}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </div>
        <p className="lab-mono text-[10px] text-white/50">
          three reels, one answer
        </p>
      </div>

      <div className="absolute inset-x-0 top-[26%] h-px bg-gradient-to-r from-transparent via-line-2 to-transparent" />
      <div className="absolute inset-x-0 bottom-[26%] h-px bg-gradient-to-r from-transparent via-line-2 to-transparent" />

      <Caption label="404 / odometer" />
      <Foot method="reels · 3 digits" />
    </Screen>
  );
}
