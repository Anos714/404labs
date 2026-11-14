"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
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

/* ---------------------------------- ledger --------------------------------- */

export function LedgerDemo() {
  return (
    <Screen className="bg-[#0b0c0e]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(242,237,227,0.07),transparent_65%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,237,227,0.03)_0_1px,transparent_1px_26px)]" />

      <div className="absolute inset-0 z-10 grid place-items-center">
        <div className="relative w-[64%] -rotate-[1.6deg] bg-[#ece4d2] px-[4cqw] pb-[4cqw] pt-[3cqw] text-[#171310] shadow-[0_18px_40px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out group-hover:-rotate-[0.6deg] group-hover:-translate-y-0.5">
          <div className="flex items-baseline justify-between lab-mono text-[1.75cqw] leading-none">
            <span className="tracking-[0.16em]">404LAB GENERAL STORE</span>
            <span className="opacity-55">NO. 000404</span>
          </div>

          <div className="mt-[3cqw] flex items-end justify-between gap-[3cqw]">
            <span className="display text-[12.5cqw] leading-[0.78]">404</span>
            <span className="text-right lab-mono text-[1.65cqw] leading-[1.5] opacity-65">
              amount
              <br />
              due
            </span>
          </div>

          <div className="my-[3cqw] border-t border-dashed border-[#171310]/30" />

          <div className="space-y-[1cqw] lab-mono text-[1.9cqw] leading-[1.5]">
            {[
              ["requested route", "1"],
              ["route found", "0"],
              ["reason given", "none"],
              ["return window", "closed"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline gap-[1.5cqw]">
                <span className="opacity-65">{label}</span>
                <span className="flex-1 border-b border-dotted border-[#171310]/30" />
                <span className="tabular-nums">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-[3cqw] flex items-baseline justify-between border-t border-[#171310]/35 pt-[2cqw] lab-mono text-[1.9cqw]">
            <span className="tracking-[0.12em]">TOTAL</span>
            <span className="display text-[4.5cqw] leading-none">404.00</span>
          </div>

          <p className="mt-[2.5cqw] text-center lab-mono text-[1.65cqw] tracking-[0.1em] opacity-50">
            NO REFUND · NO ROUTE · NO RECORD
          </p>

          <div className="absolute -bottom-[2.2cqw] -right-[1.5cqw] z-20 -rotate-[7deg] border-2 border-[#8a3b24]/70 px-[2cqw] py-[1cqw] transition-transform duration-300 group-hover:rotate-[2deg] group-hover:scale-105">
            <span className="lab-mono text-[2.5cqw] font-medium tracking-[0.22em] text-[#8a3b24]">
              VOID
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-4 top-9 lab-mono text-[9px] text-white/40">
        receipt 04/04
      </div>

      <Caption label="404 / ledger" />
      <Foot method="receipt · void stamp" />
    </Screen>
  );
}

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

/* ---------------------------------- ransom --------------------------------- */

const CUTS = [
  {
    digit: "4",
    rotate: "-6deg",
    surface: "bg-[#e9e1cf] text-[#171310]",
    tape: "left-[3cqw] top-[2cqw] -rotate-3",
  },
  {
    digit: "0",
    rotate: "3deg",
    surface: "bg-[#cf9c58] text-[#171310]",
    tape: "right-[3cqw] top-[2cqw] rotate-2",
  },
  {
    digit: "4",
    rotate: "-2deg",
    surface: "bg-[#1b1e22] text-[#f2ede3]",
    tape: "left-[4cqw] top-[2cqw] rotate-2",
  },
];

export function RansomDemo() {
  return (
    <Screen className="bg-[#0b0c0e]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(242,237,227,0.06),transparent_64%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(242,237,227,0.035)_0_1px,transparent_1px_24px)]" />

      <div className="absolute inset-0 z-10 flex items-center justify-center gap-[3cqw]">
        {CUTS.map((cut, i) => (
          <div
            key={i}
            style={{ rotate: cut.rotate }}
            className={`relative grid h-[31cqw] w-[23cqw] place-items-center shadow-[0_12px_28px_rgba(0,0,0,0.42)] transition-all duration-500 ease-out group-hover:rotate-0 ${
              cut.surface
            } ${i === 1 ? "group-hover:-translate-y-1" : "group-hover:translate-y-0.5"}`}
          >
            <span className="display text-[21.5cqw] leading-none">{cut.digit}</span>
            {i === 1 && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(23,19,16,0.45)_1px,transparent_1.4px)] bg-[length:5px_5px] opacity-40"
              />
            )}
            <span
              aria-hidden
              className={`absolute h-[4cqw] w-[14cqw] bg-[#e9e1cf]/45 backdrop-blur-[1px] ${cut.tape}`}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-9 left-4 lab-mono text-[9.5px] text-white/40">
        three cuts, one word
      </div>
      <div className="pointer-events-none absolute right-4 top-9 -rotate-3 border border-white/15 px-1.5 py-1 lab-mono text-[8px] tracking-[0.14em] text-white/45">
        PASTE UP
      </div>

      <Caption label="404 / ransom" />
      <Foot method="3 cuts · tape" />
    </Screen>
  );
}

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

/* ----------------------------------- crop ---------------------------------- */

const MARKS = [
  "left-[10%] top-[12%] border-l border-t",
  "right-[10%] top-[12%] border-r border-t",
  "bottom-[18%] left-[10%] border-b border-l",
  "bottom-[18%] right-[10%] border-b border-r",
];

export function CropDemo() {
  return (
    <Screen className="bg-[#07080a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,237,227,0.05),transparent_68%)]" />

      <div className="pointer-events-none absolute inset-x-[10%] inset-y-[12%] border border-white/10 transition-opacity duration-500 group-hover:opacity-40">
        <div className="absolute inset-y-0 left-[38%] w-px bg-[#7fd1c8]/25" />
        <div className="absolute inset-x-0 top-[46%] h-px bg-amber/20" />
        <span className="absolute left-[38%] top-[46%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber/40" />
        <span className="absolute left-[38%] top-[46%] h-px w-5 -translate-x-1/2 bg-amber/40" />
        <span className="absolute left-[38%] top-[46%] h-5 w-px -translate-y-1/2 bg-amber/40" />
      </div>

      {MARKS.map((m) => (
        <span
          key={m}
          aria-hidden
          className={`absolute size-6 border-white/35 transition-opacity duration-500 group-hover:opacity-30 ${m}`}
        />
      ))}

      <div className="absolute inset-0 z-10 grid place-items-center">
        <div className="relative">
          <span
            className="display block text-[82px] leading-none transition-opacity duration-500 group-hover:opacity-0"
            style={{
              color: "transparent",
              WebkitTextStroke: "1.2px rgba(242,237,227,0.72)",
            }}
          >
            404
          </span>
          <span className="display absolute inset-0 block text-[82px] leading-none text-fg opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            404
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-[12%] top-[14%] flex items-center justify-between lab-mono text-[7.5px] text-white/40">
        <span className="tracking-[0.14em]">404LAB PROOF</span>
        <span className="flex gap-1">
          <span className="block size-2 bg-fg/80" />
          <span className="block size-2 bg-amber/80" />
          <span className="block size-2 bg-[#7fd1c8]/80" />
          <span className="block size-2 bg-fg/20" />
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-[14.5%] left-1/2 -translate-x-1/2 lab-mono text-[7.5px] text-white/35">
        trim 210 x 297 · K100
      </div>

      <Caption label="404 / crop" />
      <Foot method="registration · proof" />
    </Screen>
  );
}
