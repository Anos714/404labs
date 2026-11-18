"use client";

// segment-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { motion, useReducedMotion } from "motion/react";
import { Caption, Foot, Screen, useReplay } from "./chrome";

const DIGITS = ["4", "0", "4"];

/* --------------------------------- segment --------------------------------- */

const SEGMENTS = {
  a: "8,3 32,3 29,7 11,7",
  b: "33,4 37,8 37,30 33,27",
  c: "33,36 37,39 37,61 33,57",
  d: "8,60 32,60 29,56 11,56",
  e: "3,36 7,39 7,61 3,57",
  f: "3,4 7,8 7,30 3,27",
  g: "8,31 32,31 29,34 11,34",
} as const;

const SEVEN: Record<string, (keyof typeof SEGMENTS)[]> = {
  "4": ["b", "c", "f", "g"],
  "0": ["a", "b", "c", "d", "e", "f"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
};

function SevenSegment({
  digit,
  run,
  reduce,
  index,
}: {
  digit: string;
  run: number;
  reduce: boolean;
  index: number;
}) {
  const lit = SEVEN[digit];
  return (
    <div className="relative grid h-[96px] w-[66px] place-items-center rounded-[4px] border border-line-2 bg-ink-850/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <svg viewBox="0 0 40 64" className="h-[76px] w-[48px]" aria-hidden>
        {(Object.keys(SEGMENTS) as (keyof typeof SEGMENTS)[]).map((key, i) => {
          const on = lit.includes(key);
          return (
            <motion.polygon
              key={`${run}-${key}`}
              points={SEGMENTS[key]}
              fill="#f2ede3"
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: on ? 0.94 : 0.07 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.22,
                delay: reduce ? 0 : index * 0.16 + i * 0.035,
              }}
            />
          );
        })}
      </svg>
      <span className="absolute right-1.5 top-1.5 size-1 rounded-full bg-amber/25" />
    </div>
  );
}

export function SegmentDemo() {
  const reduce = useReducedMotion();
  const { run, replay } = useReplay();

  return (
    <Screen onPointerEnter={replay} onClick={replay} className="bg-[#07080a]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,237,227,0.035)_0_1px,transparent_1px_23px)]" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          {DIGITS.map((d, i) => (
            <SevenSegment
              key={`${run}-${i}`}
              digit={d}
              run={run}
              reduce={reduce ?? false}
              index={i}
            />
          ))}
        </div>
        <div className="flex w-[214px] items-center justify-between lab-mono text-[8.5px] text-white/40">
          <span>DIGIT MODULE</span>
          <span className="text-amber/70">404</span>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-9 left-4 lab-mono text-[9.5px] text-white/35">
        7 bars · 3 cells
      </div>

      <Caption label="404 / segment" />
      <Foot method="7 segments · 3 cells" />
    </Screen>
  );
}
