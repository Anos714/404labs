"use client";

// wireframe-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Screen, clamp } from "./chrome";

/* -------------------------------- wireframe -------------------------------- */

export function WireframeDemo() {
  const reduce = useReducedMotion() ?? false;
  const [p, setP] = useState(58);
  const [pen, setPen] = useState(58);
  const [hover, setHover] = useState(false);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const grow = (a: number, b: number) => clamp((p - a) / (b - a), 0, 1);

  function scrub(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = clamp(((e.clientX - r.left) / r.width) * 100, 0, 100);
    setPen(x);
    setP(x);
    setHover(true);
  }

  function walk() {
    cancelAnimationFrame(raf.current);
    if (reduce) {
      setP(100);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = clamp((now - start) / 1500, 0, 1);
      setP(t * 100);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }

  return (
    <Screen className="select-none bg-[#08090a] text-[#e9e4d7]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(242,237,227,0.055),transparent_66%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(90deg,rgba(242,237,227,0.04)_0_1px,transparent_1px),linear-gradient(0deg,rgba(242,237,227,0.04)_0_1px,transparent_1px)] [background-size:6cqw_6cqw]" />

      <div
        className="absolute left-1/2 top-[6%] w-[78cqw] -translate-x-1/2 rounded-[6px] border border-dashed border-[#2d3336] bg-[#0a0b0c] shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
        style={{ height: "63cqw" }}
      >
        <div className="absolute inset-x-[3.6cqw] top-[3.2cqw] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={walk}
              aria-label="Rebuild the layout from the start"
              className="group/icon grid size-[4.6cqw] cursor-pointer place-items-center rounded-full border border-[#2c3235] text-[#7d8178] transition-colors duration-200 hover:border-[#e9b871] hover:text-[#e9b871]"
            >
              <svg viewBox="0 0 16 16" className="size-[2.2cqw]" aria-hidden>
                <rect
                  x="2.5"
                  y="2.5"
                  width="11"
                  height="11"
                  rx="1.6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M4 10.5 L7 7 L9 9 L12 5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10.8" cy="4.6" r="0.8" fill="currentColor" />
              </svg>
            </button>
            <span className="lab-mono text-[6.5px] tracking-[0.2em] text-[#a29d8e]">
              TEMPLATE 01
            </span>
          </div>
          <span className="lab-mono text-[6px] tracking-[0.18em] text-[#656960]">
            {p > 96 ? "MISSING PAGE" : `LAYOUT ${Math.round(p).toString().padStart(3, "0")}`}
          </span>
        </div>

        <div
          onPointerMove={scrub}
          onPointerDown={scrub}
          onPointerLeave={() => setHover(false)}
          className="absolute left-[3.6cqw] top-[9.4cqw] h-[28cqw] w-[70.8cqw] cursor-ew-resize touch-none overflow-hidden border border-[#202528] bg-[#090a0b]"
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:linear-gradient(90deg,rgba(242,237,227,0.05)_0_1px,transparent_1px),linear-gradient(0deg,rgba(242,237,227,0.05)_0_1px,transparent_1px)] [background-size:3.2cqw_3.2cqw]" />

          <div
            className="pointer-events-none absolute left-[5%] top-[7%] h-[7%] rounded-[1px] bg-[#3c4446]"
            style={{ width: `${grow(3, 18) * 42}%` }}
          />
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="pointer-events-none absolute top-[9.5%] size-[1.1cqw] rounded-full bg-[#3c4446]"
              style={{
                right: `${16 - i * 4}%`,
                opacity: grow(8, 18),
              }}
            />
          ))}

          <div
            className="pointer-events-none absolute left-[5%] top-[19%] w-[17%] border border-[#252b2e] bg-[#0c0e0f]"
            style={{ height: `${grow(12, 30) * 44}%` }}
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="absolute left-[12%] h-[4%] bg-[#2b3235]"
                style={{
                  top: `${16 + i * 17}%`,
                  width: `${50 + (i % 2) * 18}%`,
                  opacity: grow(20 + i * 3, 30 + i * 3),
                }}
              />
            ))}
          </div>

          <div
            className="pointer-events-none absolute left-[26%] top-[19%] border border-[#2c3336] bg-[#0b0d0e]"
            style={{ height: "40%", width: `${grow(24, 54) * 69}%` }}
          >
            <span
              className="display absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[9cqw] leading-none text-[#d9d2c0]"
              style={{ opacity: grow(46, 60) }}
            >
              404
            </span>
            <span
              className="absolute bottom-[9%] left-[7%] h-[3%] w-[38%] bg-[#2c3336]"
              style={{ opacity: grow(50, 62) }}
            />
          </div>

          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="pointer-events-none absolute top-[64%] border border-[#252b2e] bg-[#0b0d0e]"
              style={{
                left: `${26 + i * 17}%`,
                width: "14%",
                height: `${grow(58 + i * 4, 74 + i * 4) * 18}%`,
              }}
            />
          ))}

          <div
            className="pointer-events-none absolute bottom-[8%] left-[5%] h-[1px] bg-[#394144]"
            style={{ width: `${grow(82, 95) * 62}%` }}
          />

          {hover && (
            <>
              <span
                className="pointer-events-none absolute inset-y-0 z-20 w-px"
                style={{
                  left: `${pen}%`,
                  background:
                    "repeating-linear-gradient(180deg,rgba(233,184,113,0.65) 0 4px,transparent 4px 8px)",
                }}
              />
              <span
                className="pointer-events-none absolute z-20 -translate-x-1/2 rounded-[1px] bg-[#e9b871] px-1 py-0.5 lab-mono text-[5.5px] text-[#17120a]"
                style={{ left: `${pen}%`, top: "4%" }}
              >
                {Math.round(p)}
              </span>
            </>
          )}
        </div>

        <p className="absolute left-[4.2cqw] right-[4.2cqw] top-[39.6cqw] text-[clamp(11px,2.9cqw,21px)] leading-[1.15] text-[#efe8d8]">
          This layout was never filed.
        </p>
        <p className="absolute left-[4.2cqw] right-[4.2cqw] top-[45.4cqw] text-[clamp(7px,1.6cqw,11px)] leading-[1.5] text-[#8c8d83]">
          The frame is here. The page is not. Sweep across the frame to lay it
          out, and sweep back to take it apart.
        </p>

        <div className="absolute inset-x-[4.2cqw] top-[52.6cqw] flex items-center gap-2.5">
          <span className="lab-mono text-[5.8px] tracking-[0.18em] text-[#6d7169]">
            LAYOUT
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(p)}
            aria-label="Layout progress"
            onChange={(e) => {
              setP(Number(e.target.value));
              setPen(Number(e.target.value));
            }}
            className="h-[1.1cqw] w-full cursor-pointer appearance-none rounded-full bg-[#242a2d] accent-[#e9b871]"
          />
          <span className="w-[5cqw] shrink-0 text-right lab-mono text-[5.8px] tabular-nums text-[#a49f90]">
            {Math.round(p)}
          </span>
        </div>

        <div className="absolute inset-x-[4.2cqw] top-[57.6cqw] flex items-center justify-between">
          <span className="lab-mono text-[5.8px] tracking-[0.16em] text-[#5e6359]">
            NO TEMPLATE BEHIND IT
          </span>
          <button
            type="button"
            onClick={walk}
            className="cursor-pointer border-b border-[#3a4144] pb-px lab-mono text-[5.8px] tracking-[0.16em] text-[#b5afa0] transition-colors duration-200 hover:text-[#e9b871]"
          >
            WALK THE FRAME
          </button>
        </div>

        {p > 95 && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute right-[4.2cqw] top-[9.4cqw] z-30 rounded-[2px] border border-[#8c3a2c]/70 bg-[#120d0b] px-1.5 py-0.5 lab-mono text-[5.5px] tracking-[0.14em] text-[#c47a63]"
          >
            PAGE MISSING
          </motion.span>
        )}
      </div>
    </Screen>
  );
}
