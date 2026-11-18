"use client";

// ransom-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { Caption, Foot, Screen } from "./chrome";

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
