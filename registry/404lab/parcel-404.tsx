"use client";

// parcel-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { Caption, Foot, Plate, Screen } from "./chrome";

/* ---------------------------------- parcel --------------------------------- */

function Barcode({ className = "" }: { className?: string }) {
  const bars = [1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 1];
  return (
    <div className={`flex h-5 items-stretch gap-[1.5px] ${className}`}>
      {bars.map((w, i) => (
        <span
          key={i}
          className="block bg-current"
          style={{ width: w, opacity: i % 3 === 0 ? 0.9 : 0.55 }}
        />
      ))}
    </div>
  );
}

export function ParcelDemo() {
  return (
    <Screen className="bg-ink-950">
      <Plate
        src="/worlds/w-desert-dusk.webp"
        className="brightness-[0.62] saturate-[0.8] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.5)_0%,rgba(8,9,10,0.3)_55%,rgba(8,9,10,0.8)_100%)]" />

      <div className="absolute inset-y-0 left-[27%] z-20 w-7 -translate-x-1/2 rotate-[1deg] border-x border-[#e8dfcc]/15 bg-[#e8dfcc]/12 backdrop-blur-[1px] transition-transform duration-500 group-hover:-translate-x-[3px] group-hover:rotate-0">
        <div className="h-full w-full bg-[repeating-linear-gradient(45deg,rgba(232,223,204,0.16)_0_2px,transparent_2px_7px)]" />
      </div>
      <div className="absolute inset-x-0 top-[61%] z-20 h-7 -translate-y-1/2 rotate-[-1deg] border-y border-[#e8dfcc]/15 bg-[#e8dfcc]/12 backdrop-blur-[1px] transition-transform duration-500 group-hover:translate-y-[2px] group-hover:rotate-0">
        <div className="h-full w-full bg-[repeating-linear-gradient(45deg,rgba(232,223,204,0.16)_0_2px,transparent_2px_7px)]" />
      </div>

      <div className="absolute left-1/2 top-[60%] z-10 -translate-x-1/2 -translate-y-1/2">
        <span className="display block text-[18.5cqw] leading-none tracking-[0.04em] text-[#eee7d7] drop-shadow-[0_3px_16px_rgba(8,9,10,0.55)]">
          404
        </span>
      </div>

      <div className="absolute left-4 top-10 z-20 w-[44%] -rotate-[3deg] rounded-[1px] bg-[#e9e1cf] px-3 py-2.5 text-[#171310] shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:-rotate-[1deg] group-hover:-translate-y-0.5">
        <div className="flex items-baseline justify-between lab-mono text-[7.5px] leading-none">
          <span className="tracking-[0.14em]">404LAB POST</span>
          <span className="opacity-60">NO. 0004</span>
        </div>
        <div className="my-2 h-px bg-[#171310]/20" />
        <p className="lab-mono text-[8px] leading-[1.7] opacity-80">
          to: unknown recipient
          <br />
          route: not on file
        </p>
        <Barcode className="mt-2 text-[#171310]" />
      </div>

      <div className="absolute bottom-[13%] right-4 z-20 -rotate-[6deg] border-2 border-amber/70 px-[2cqw] py-[1.2cqw] text-right transition-transform duration-500 group-hover:-rotate-[3deg]">
        <p className="lab-mono text-[2.1cqw] leading-[1.5] tracking-[0.16em] text-amber">
          RETURN TO
          <br />
          SENDER
        </p>
      </div>

      <div className="pointer-events-none absolute inset-3 z-20 border border-white/10" />
      <div className="pointer-events-none absolute right-4 top-10 z-20 lab-mono text-[9px] text-white/50">
        04 / 04
      </div>

      <Caption label="404 / parcel" />
      <Foot method="kraft tape · label" />
    </Screen>
  );
}
