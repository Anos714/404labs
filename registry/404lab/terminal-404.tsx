"use client";

// terminal-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Caption, Foot, Plate, ScreenButton } from "./chrome";

/* --------------------------------- terminal -------------------------------- */

const TERM_LINE = "not found. this route is not on the map.";

export function TerminalDemo() {
  const [typed, setTyped] = useState(0);
  const reduce = useReducedMotion();
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const seen = useInView(ref, { once: true, margin: "-30px" });

  useEffect(() => {
    if (seen) setStarted(true);
  }, [seen]);

  useEffect(() => {
    if (!started) return;
    if (reduce) {
      setTyped(TERM_LINE.length);
      return;
    }
    if (typed >= TERM_LINE.length) return;
    const t = setTimeout(() => setTyped((n) => n + 2), 34);
    return () => clearTimeout(t);
  }, [started, typed, reduce]);

  return (
    <ScreenButton
      ref={ref}
      onMouseEnter={() => {
        setTyped(0);
        setStarted(true);
      }}
      onClick={() => {
        setTyped(0);
        setStarted(true);
      }}
      aria-label="Replay the terminal 404 demo"
    >
      <Plate
        src="/worlds/px5.webp"
        className="opacity-45 grayscale-[0.35]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.55)_0%,rgba(8,9,10,0.75)_100%)]" />
      <Caption label="404 / terminal" />

      <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-5">
        <div className="rounded-[6px] border border-white/10 bg-[#08090a]/80 p-3 backdrop-blur-[2px]">
          <p className="lab-mono text-[10px] leading-5 text-white/45">
            <span className="text-amber/80">$</span> cd /pricing
          </p>
          <p className="lab-mono text-[10px] leading-5 text-white/80">
            <span className="text-amber/80">&gt;</span>{" "}
            {TERM_LINE.slice(0, typed)}
            <span className="caret ml-0.5 inline-block h-3 w-1 translate-y-0.5 bg-fg/80" />
          </p>
          <p className="mt-2 lab-mono text-[10px] leading-5 text-white/45">
            exit 404 · layers 0
          </p>
        </div>
      </div>

      <Foot method="typewriter" label="cd ~" />
    </ScreenButton>
  );
}
