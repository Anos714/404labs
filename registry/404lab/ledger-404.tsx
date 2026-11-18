"use client";

// ledger-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { Caption, Foot, Screen } from "./chrome";

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
