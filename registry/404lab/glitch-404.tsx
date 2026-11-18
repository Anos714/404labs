"use client";

// glitch-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Caption, Foot, Plate, ScreenButton } from "./chrome";

/* ---------------------------------- glitch --------------------------------- */

export function GlitchDemo() {
  const [run, setRun] = useState(false);
  const reduce = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function fire() {
    if (reduce) return;
    setRun(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setRun(true);
      timer.current = setTimeout(() => setRun(false), 460);
    }, 20);
  }

  return (
    <ScreenButton
      onMouseEnter={fire}
      onClick={fire}
      onFocus={fire}
      aria-label="Replay the glitch 404 demo"
    >
      <Plate
        src="/worlds/px1.webp"
        className="opacity-70 transition-opacity duration-500 group-hover:opacity-85"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.3)_0%,rgba(8,9,10,0.62)_45%,rgba(8,9,10,0.94)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,9,10,0.55)_0%,transparent_68%)]" />
      <Caption label="404 / glitch" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 pt-4">
        <div
          className="glitch-digits display text-[76px] leading-none text-fg"
          data-run={run}
        >
          404
          <span aria-hidden>404</span>
          <span aria-hidden>404</span>
        </div>
        <p className="lab-mono text-[10px] text-white/60">
          this path was never built
        </p>
      </div>

      <Foot method="clip-path" />
    </ScreenButton>
  );
}
