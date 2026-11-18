"use client";

// crop-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { Caption, Foot, Screen } from "./chrome";

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
