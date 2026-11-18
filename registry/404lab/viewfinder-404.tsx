"use client";

// viewfinder-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { Caption, Foot, Plate, Screen } from "./chrome";

/* -------------------------------- viewfinder ------------------------------- */

export function ViewfinderDemo() {
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();
  const blur = on && !reduce;

  const bracket = "absolute size-5 transition-all duration-500 ease-out";

  return (
    <Screen
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
      onClick={() => setOn((v) => !v)}
    >
      <div
        className={`absolute inset-0 transition-[filter,transform] duration-700 ease-out ${
          blur ? "scale-[1.03] blur-none" : "scale-[1.08] blur-[7px]"
        }`}
      >
        <Plate src="/worlds/w-bench-blossom.webp" className="brightness-[0.72]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.3)_0%,rgba(8,9,10,0.1)_50%,rgba(8,9,10,0.8)_100%)]" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2">
        <span className="display text-[66px] leading-none text-fg drop-shadow-[0_3px_14px_rgba(8,9,10,0.8)]">
          404
        </span>
        <span className="lab-mono text-[10px] text-white/75">
          subject not found
        </span>
      </div>

      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border transition-all duration-700 ease-out ${
          blur
            ? "h-[104px] w-[176px] border-amber/70"
            : "h-[120px] w-[196px] border-amber/30"
        }`}
      >
        <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute left-1/2 top-0 h-full w-px bg-amber/60" />
          <span className="absolute left-0 top-1/2 h-px w-full bg-amber/60" />
        </span>
      </div>

      <span className={`${bracket} left-3 top-3 border-l border-t ${blur ? "border-white/70" : "border-white/30"}`} />
      <span className={`${bracket} right-3 top-3 border-r border-t ${blur ? "border-white/70" : "border-white/30"}`} />
      <span className={`${bracket} bottom-9 left-3 border-b border-l ${blur ? "border-white/70" : "border-white/30"}`} />
      <span className={`${bracket} bottom-9 right-3 border-b border-r ${blur ? "border-white/70" : "border-white/30"}`} />

      <div className="pointer-events-none absolute left-4 top-9 z-20 flex items-center gap-1.5 lab-mono text-[9.5px] text-white/65">
        <span className="size-1.5 rounded-full bg-amber" />
        REC 00:04:04
      </div>
      <div className="pointer-events-none absolute right-4 top-9 z-20 lab-mono text-[9.5px] text-white/55">
        f/4.0 · ISO 400
      </div>
      <div className="pointer-events-none absolute bottom-9 right-4 z-20 lab-mono text-[9.5px] text-white/45">
        AF-S
      </div>

      <Caption label="404 / viewfinder" />
      <Foot method="focus hunt" />
    </Screen>
  );
}
