"use client";

// ticker-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Caption, Foot, Screen } from "./chrome";

/* ---------------------------------- ticker --------------------------------- */

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const TARGET = ["4", "0", "4"];

export function TickerDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const [chars, setChars] = useState(TARGET);
  const [spin, setSpin] = useState(0);
  const busy = useRef(false);

  useEffect(() => {
    if (!inView || reduce) return;
    busy.current = true;
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      if (n > 9) {
        clearInterval(id);
        setChars(TARGET);
        busy.current = false;
        return;
      }
      setChars(
        TARGET.map(() => ALPHA[Math.floor(Math.random() * ALPHA.length)]),
      );
    }, 92);
    return () => clearInterval(id);
  }, [inView, spin, reduce]);

  const shownChars = reduce ? TARGET : chars;

  function replay() {
    if (reduce || busy.current) return;
    setSpin((s) => s + 1);
  }

  return (
    <Screen ref={ref} onPointerEnter={replay} onClick={replay} className="bg-[#07080a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,237,227,0.05),transparent_65%)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5">
        <div className="flex w-full max-w-[280px] items-center justify-between lab-mono text-[9px] text-white/40">
          <span>departures</span>
          <span>04:04</span>
        </div>

        <div className="flex items-start gap-2">
          {shownChars.map((c, i) => (
            <div
              key={i}
              className="relative grid h-[84px] w-[60px] place-items-center overflow-hidden rounded-[3px] border border-line-2 bg-ink-850 [perspective:260px]"
            >
              <motion.span
                key={`${c}-${i}`}
                initial={reduce ? false : { rotateX: -86, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="display text-[52px] leading-none text-fg"
              >
                {c}
              </motion.span>
              <span className="absolute inset-x-0 top-1/2 h-px bg-ink-950" />
              <span className="absolute left-[3px] top-1/2 size-1 -translate-y-1/2 rounded-full bg-ink-950" />
              <span className="absolute right-[3px] top-1/2 size-1 -translate-y-1/2 rounded-full bg-ink-950" />
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]" />
            </div>
          ))}
        </div>

        <div className="mt-1 flex w-full max-w-[280px] flex-col gap-1.5 lab-mono text-[9px] text-white/40">
          <span className="flex items-baseline gap-2">
            <span className="text-white/60">nowhere</span>
            <span className="h-px flex-1 bg-[repeating-linear-gradient(to_right,rgba(242,237,227,0.18)_0_2px,transparent_2px_6px)]" />
            <span className="text-amber/70">on time</span>
          </span>
          <span className="flex items-baseline gap-2">
            <span className="text-white/60">gate 404</span>
            <span className="h-px flex-1 bg-[repeating-linear-gradient(to_right,rgba(242,237,227,0.18)_0_2px,transparent_2px_6px)]" />
            <span>boarding</span>
          </span>
        </div>
      </div>

      <Caption label="404 / ticker" />
      <Foot method="split-flap · 92ms" />
    </Screen>
  );
}
