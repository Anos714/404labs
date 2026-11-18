"use client";

// bloom-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { Caption, Foot, Plate, Screen } from "./chrome";

/* ---------------------------------- bloom ---------------------------------- */

export function BloomDemo() {
  return (
    <Screen className="bg-[#07080a]">
      <Plate
        src="/worlds/w-bench-blossom.webp"
        className="brightness-[0.52] saturate-[0.85] transition-[filter] duration-[900ms] group-hover:brightness-[0.8]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.45)_0%,rgba(8,9,10,0.08)_45%,rgba(8,9,10,0.86)_100%)]" />

      <div
        aria-hidden
        className="absolute -right-16 -top-20 size-[290px] rounded-full bg-[radial-gradient(circle,rgba(255,238,206,0.34)_0%,rgba(233,184,113,0.13)_38%,transparent_70%)] blur-xl transition-all duration-[1100ms] ease-out group-hover:-right-8 group-hover:-top-10 group-hover:scale-125 group-hover:opacity-90"
      />
      <div
        aria-hidden
        className="absolute -left-24 bottom-0 size-[220px] rounded-full bg-[radial-gradient(circle,rgba(233,184,113,0.16)_0%,transparent_66%)] blur-2xl transition-opacity duration-700 group-hover:opacity-40"
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
        <span className="display text-[76px] leading-none text-fg transition-[text-shadow] duration-700 group-hover:[text-shadow:0_0_34px_rgba(255,238,206,0.35)]">
          404
        </span>
        <span className="lab-mono text-[10px] text-white/70">
          the frame gave up
        </span>
      </div>

      <div className="pointer-events-none absolute right-4 top-9 z-20 text-right lab-mono text-[9px] leading-relaxed text-white/50">
        <p>f/1.4</p>
        <p className="text-amber/75 group-hover:text-amber">+2 EV</p>
      </div>

      <Caption label="404 / bloom" />
      <Foot method="light leak · +2 EV" />
    </Screen>
  );
}
