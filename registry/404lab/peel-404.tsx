"use client";

// peel-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef, useState } from "react";
import { Caption, Foot, Plate, Screen, clamp } from "./chrome";

/* ----------------------------------- peel ---------------------------------- */

export function PeelDemo() {
  const [p, setP] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);

  function down(e: React.PointerEvent<HTMLDivElement>) {
    start.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (!start.current) return;
    const d =
      start.current.x - e.clientX + (start.current.y - e.clientY);
    setP(clamp(d / 140, 0, 0.62));
  }

  function up() {
    if (!start.current) return;
    start.current = null;
    setDragging(false);
    setP((v) => (v > 0.3 ? 0.62 : 0));
  }

  const cut = 100 - p * 100;

  return (
    <Screen
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      className="touch-none select-none bg-[#07080a]"
    >
      <Plate src="/worlds/w-pink-hill.webp" className="brightness-[0.52]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.35)_0%,rgba(8,9,10,0.2)_50%,rgba(8,9,10,0.8)_100%)]" />

      <div className="absolute left-1/2 top-1/2 z-10 h-[56%] w-[62%] -translate-x-1/2 -translate-y-1/2 -rotate-[2deg]">
        <div className="absolute inset-0 overflow-hidden bg-ink-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(233,184,113,0.12),transparent_68%)]" />
          <div className="absolute bottom-[2cqw] right-[2.5cqw] text-right">
            <span className="display block text-[7.5cqw] leading-none text-fg/75">
              404
            </span>
            <span className="lab-mono text-[1.5cqw] tracking-[0.16em] text-white/40">
              LAYER 02
            </span>
          </div>
        </div>

        <div
          className={`absolute inset-0 bg-[#e9e1cf] px-[4cqw] py-[3cqw] text-[#171310] shadow-[0_14px_24px_rgba(0,0,0,0.45)] ${
            dragging ? "" : "transition-[clip-path] duration-500 ease-out"
          }`}
          style={{
            clipPath: `polygon(0 0, 100% 0, 100% ${cut}%, ${cut}% 100%, 0 100%)`,
          }}
        >
          <div className="flex items-baseline justify-between lab-mono text-[1.75cqw] leading-none">
            <span className="tracking-[0.16em]">404 / VOID</span>
            <span className="opacity-55">DO NOT DELIVER</span>
          </div>
          <div className="mt-[2cqw] flex items-end justify-between">
            <span className="display text-[12cqw] leading-[0.8]">404</span>
            <div className="flex h-[5cqw] items-end gap-[0.5cqw]">
              {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1].map((w, i) => (
                <span
                  key={i}
                  className="block bg-[#171310]/70"
                  style={{ width: w, height: `${5 - (i % 3) * 0.75}cqw` }}
                />
              ))}
            </div>
          </div>
          <p className="mt-[2cqw] lab-mono text-[1.75cqw] leading-[1.6] opacity-60">
            peel slowly. the page underneath is not the page you wanted.
          </p>
        </div>

        {p > 0.01 && (
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-20 h-full w-full"
          >
            <line
              x1={cut}
              y1={100}
              x2={100}
              y2={cut}
              stroke="rgba(23,19,16,0.35)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1={cut}
              y1={100}
              x2={100}
              y2={cut}
              stroke="rgba(255,255,255,0.45)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              transform="translate(0.7 -0.7)"
            />
          </svg>
        )}
      </div>

      <span
        className="pointer-events-none absolute bottom-[21.4%] right-[18.6%] z-30 size-2 rounded-full border border-[#171310]/50 bg-[#e9e1cf]"
        style={{ opacity: p < 0.03 ? 0.9 : 0 }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-[46px] text-center lab-mono text-[9px] text-white/45">
        {p > 0.3 ? "there is nothing under it" : "peel the corner"}
      </div>

      <Caption label="404 / peel" />
      <Foot method="peel · drag" />
    </Screen>
  );
}
