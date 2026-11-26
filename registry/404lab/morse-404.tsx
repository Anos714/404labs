"use client";

// morse-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Caption, Foot, Screen } from "./chrome";

/* ---------------------------------- morse ---------------------------------- */

const UNIT = 115;
const GROUPS = ["....-", "-----", "....-"];
const DIGITS = ["4", "0", "4"];

type Ev = { on: boolean; dur: number; reveal?: string };

const EVENTS: Ev[] = (() => {
  const out: Ev[] = [];
  GROUPS.forEach((code, gi) => {
    code.split("").forEach((sym) => {
      out.push({ on: true, dur: (sym === "-" ? 3 : 1) * UNIT });
      out.push({ on: false, dur: UNIT });
    });
    out.push({ on: false, dur: 3 * UNIT, reveal: DIGITS[gi] });
  });
  return out;
})();

export function MorseDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-30px" });
  const [step, setStep] = useState(0);
  const [text, setText] = useState("");
  const [started, setStarted] = useState(false);

  const active = started || inView;

  useEffect(() => {
    if (!active || reduce) return;
    const ev = EVENTS[step];
    if (!ev) return;
    const t = setTimeout(() => {
      if (ev.reveal) setText((s) => s + ev.reveal);
      setStep((s) => s + 1);
    }, ev.dur);
    return () => clearTimeout(t);
  }, [active, step, reduce]);

  const lit = !reduce && active && step < EVENTS.length && EVENTS[step]?.on === true;
  const shownText = reduce ? "404" : text;

  function replay() {
    if (reduce) return;
    setStarted(true);
    setText("");
    setStep(0);
  }

  return (
    <Screen ref={ref} onPointerEnter={replay} onClick={replay} className="bg-[#07080a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(233,184,113,0.05),transparent_65%)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="relative grid size-[52px] place-items-center">
          <span className="absolute inset-0 rounded-full border border-line-2" />
          <span
            className={`size-3 rounded-full transition-[background-color,box-shadow] duration-75 ${
              lit
                ? "bg-amber shadow-[0_0_26px_6px_rgba(233,184,113,0.45)]"
                : "bg-fg/20 shadow-[0_0_10px_rgba(233,184,113,0.08)]"
            }`}
          />
          <span className="absolute -bottom-4 lab-mono text-[8px] text-white/35">
            lamp
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          {DIGITS.map((d, i) => (
            <span
              key={i}
              className={`display text-[56px] leading-none transition-colors duration-200 ${
                shownText.length > i ? "text-fg" : "text-fg/15"
              }`}
            >
              {d}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {GROUPS.map((g, gi) => (
            <span
              key={gi}
              className={`lab-mono text-[12px] tracking-[0.18em] ${
                shownText.length > gi ? "text-amber/80" : "text-white/30"
              }`}
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-9 left-4 lab-mono text-[9.5px] text-white/40">
        5 wpm · 404
      </div>

      <Caption label="404 / morse" />
      <Foot method="signal · 115ms" />
    </Screen>
  );
}
