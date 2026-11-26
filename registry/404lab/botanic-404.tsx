"use client";

// botanic-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useState } from "react";
import { Screen } from "./chrome";

/* ---------------------------------- bloom ---------------------------------- */

const PAPER = "#f2eee3";
const BOTANIC = "#1f2b22";
const BOTANIC_RED = "#9a4b32";

type Stem = {
  x: number;
  y: number;
  s: number;
  tilt: number;
  petals: number;
};

const STEMS: Stem[] = [
  { x: 7, y: 45, s: 9.2, tilt: -9, petals: 6 },
  { x: 17, y: 39, s: 11.6, tilt: 5, petals: 5 },
  { x: 27, y: 48, s: 8.2, tilt: -5, petals: 6 },
  { x: 38, y: 41, s: 10.4, tilt: 7, petals: 6 },
  { x: 50, y: 49, s: 8.8, tilt: -4, petals: 5 },
  { x: 62, y: 40, s: 12.2, tilt: 5, petals: 6 },
  { x: 73, y: 47, s: 8.6, tilt: -7, petals: 5 },
  { x: 83, y: 41, s: 11.2, tilt: 8, petals: 6 },
  { x: 93, y: 49, s: 9, tilt: -4, petals: 6 },
];

function Flower({
  stem,
  open,
  pinned,
  onToggle,
}: {
  stem: Stem;
  open: boolean;
  pinned: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="absolute"
      style={{
        left: `${stem.x}%`,
        top: `${(stem.y / 75) * 100}%`,
        width: `${stem.s}cqw`,
        height: `${stem.s}cqw`,
        transform: "translate(-50%,-50%)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={pinned}
        aria-label={`Flower ${stem.x}. ${pinned ? "Pinned open." : "Pin it open."}`}
        className="group/flower relative block h-full w-full cursor-pointer rounded-full focus-visible:[outline:1.5px_solid_#9a4b32] focus-visible:outline-offset-4"
      >
        {[...Array(stem.petals)].map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-[50%] border"
            style={{
              width: "31%",
              height: "60%",
              borderColor: open ? BOTANIC : "rgba(31,43,34,0.8)",
              background: open
                ? "rgba(250,247,238,0.92)"
                : "rgba(242,238,227,0.95)",
              transformOrigin: "50% 50%",
              transform: `translate(-50%,-50%) rotate(${
                open ? i * (360 / stem.petals) : i * (360 / stem.petals) + 14
              }deg) translateY(${open ? -64 : -22}%) scaleY(${
                open ? 1 : 0.52
              }) scaleX(${open ? (i % 2 ? 0.86 : 1) : 0.82})`,
              transition: "transform 620ms cubic-bezier(0.22,1,0.36,1)",
              boxShadow: open ? "inset 0 0 0 0.5px rgba(31,43,34,0.08)" : "none",
            }}
          />
        ))}
        <span
          className="absolute left-1/2 top-1/2 size-[19%] -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            borderColor: BOTANIC,
            background: open ? BOTANIC_RED : "rgba(242,238,227,0.95)",
            transition: "background 400ms ease-out",
          }}
        >
          <span
            className="absolute left-1/2 top-1/2 size-[32%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: open ? PAPER : BOTANIC }}
          />
        </span>
        <span
          className="absolute bottom-[-13%] left-1/2 size-[1.1cqw] -translate-x-1/2 rounded-full transition-opacity duration-300"
          style={{ background: BOTANIC_RED, opacity: pinned ? 1 : 0 }}
        />
      </button>
    </div>
  );
}

export function BotanicDemo() {
  const [pinned, setPinned] = useState<boolean[]>(STEMS.map(() => false));
  const [near, setNear] = useState<boolean[]>(STEMS.map(() => false));

  const pinnedCount = pinned.filter(Boolean).length;
  const all = pinnedCount === STEMS.length;

  function aim(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.width) * 100;
    setNear((prev) => {
      const next = STEMS.map((f) => Math.hypot(x - f.x, y - f.y) < 13);
      return next.some((v, i) => v !== prev[i]) ? next : prev;
    });
  }

  function rest() {
    setNear((prev) =>
      prev.some(Boolean) ? STEMS.map(() => false) : prev,
    );
  }

  function toggle(i: number) {
    setPinned((prev) => prev.map((v, j) => (i === j ? !v : v)));
  }

  return (
    <Screen
      onPointerMove={aim}
      onPointerLeave={rest}
      className="select-none text-[#1f2b22]"
      style={{ backgroundColor: PAPER }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_24%,rgba(255,253,246,0.85),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:repeating-linear-gradient(0deg,rgba(31,43,34,0.035)_0_1px,transparent_1px_3px)]" />
      <div className="pointer-events-none absolute inset-[3%] border border-[rgba(31,43,34,0.14)]" />

      <div className="pointer-events-none absolute inset-x-[6%] top-[4%] flex items-center justify-between lab-mono text-[6.5px] tracking-[0.2em] text-[#6c766b]">
        <span className="text-[#1f2b22]">404LAB · BOTANICAL REGISTER</span>
        <span>PLATE 404</span>
      </div>
      <div className="pointer-events-none absolute inset-x-[6%] top-[7.8%] h-px bg-[rgba(31,43,34,0.18)]" />

      <div className="pointer-events-none absolute inset-x-0 top-[10%] text-center">
        <p className="display text-[24cqw] leading-[0.76] tracking-[-0.05em] text-[#1f2b22]">
          404
        </p>
        <p className="display mt-[2.4cqw] text-[3cqw] leading-none text-[#1f2b22]">
          {all ? "All nine open. The page still did not grow." : "Nine stems, no page."}
        </p>
        <p className="mt-[1.4cqw] lab-mono text-[6px] tracking-[0.16em] text-[#6c766b]">
          MOVE ACROSS THE PLATE TO OPEN · TAP TO PIN
        </p>
      </div>

      <svg
        viewBox="0 0 100 75"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        {STEMS.map((f) => {
          const top = f.y + f.s * 0.32;
          const mid = (f.y + 70) / 2;
          return (
            <g key={f.x}>
              <path
                d={`M ${f.x} 70 C ${f.x + f.tilt} ${mid + 7}, ${f.x + f.tilt * 0.4} ${mid - 2}, ${f.x} ${top}`}
                fill="none"
                stroke={BOTANIC}
                strokeWidth={0.24}
                strokeLinecap="round"
              />
              <ellipse
                cx={f.x + f.tilt * 0.5 - 1.4}
                cy={mid + 2}
                rx={2.2}
                ry={0.72}
                fill="none"
                stroke={BOTANIC}
                strokeWidth={0.2}
                transform={`rotate(${f.tilt * 2.4} ${f.x + f.tilt * 0.5 - 1.4} ${mid + 2})`}
              />
              <ellipse
                cx={f.x + f.tilt * 0.2 + 1.2}
                cy={mid - 3}
                rx={1.7}
                ry={0.58}
                fill="none"
                stroke={BOTANIC}
                strokeWidth={0.18}
                transform={`rotate(${f.tilt * -2} ${f.x + f.tilt * 0.2 + 1.2} ${mid - 3})`}
              />
            </g>
          );
        })}
      </svg>

      {STEMS.map((f, i) => (
        <Flower
          key={f.x}
          stem={f}
          open={near[i] || pinned[i]}
          pinned={pinned[i]}
          onToggle={() => toggle(i)}
        />
      ))}

      <div className="pointer-events-none absolute inset-x-0 top-[70cqw] bottom-0 bg-[#ece6d8]" />
      <div className="pointer-events-none absolute inset-x-[6%] top-[70cqw] h-px bg-[rgba(31,43,34,0.24)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[70cqw] bottom-0 opacity-[0.16] [background-image:repeating-linear-gradient(112deg,rgba(31,43,34,0.28)_0_0.5px,transparent_0.5px_3.4px)]" />

      <div className="pointer-events-none absolute inset-x-[6%] bottom-[2.4%] flex items-end justify-between gap-3">
        <p className="lab-mono text-[6.5px] tracking-[0.16em] text-[#3a463b]">
          {all ? "THE REGISTER IS FULL" : "NO FLOWER IS THE PAGE"}
        </p>
        <p className="lab-mono text-[6.5px] tracking-[0.16em] tabular-nums text-[#1f2b22]">
          PINNED {String(pinnedCount).padStart(2, "0")} / 09
        </p>
      </div>
    </Screen>
  );
}
