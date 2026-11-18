"use client";

// tuner-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Caption, Foot, Screen, clamp } from "./chrome";

/* ---------------------------------- tuner ---------------------------------- */

const TARGET = 94.4;
const MIN = 88;
const MAX = 108;

export function TunerDemo() {
  const [ratio, setRatio] = useState((TARGET - MIN) / (MAX - MIN));
  const track = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const freq = MIN + ratio * (MAX - MIN);
  const off = Math.abs(freq - TARGET);
  const locked = off < 0.9;
  const noise = clamp(off / 5, 0, 0.6);
  const blur = clamp(off * 1.1, 0, 6);
  const opacity = clamp(1 - off / 7, 0.1, 1);

  function setFrom(clientX: number) {
    const r = track.current?.getBoundingClientRect();
    if (!r) return;
    setRatio(clamp((clientX - r.left) / r.width, 0, 1));
  }

  return (
    <Screen className="touch-none select-none bg-[#07080a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(242,237,227,0.055),transparent_66%)]" />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          opacity: noise,
          backgroundImage:
            "repeating-linear-gradient(0deg,rgba(242,237,227,0.35)_0_1px,transparent_1px_3px),repeating-linear-gradient(90deg,rgba(242,237,227,0.18)_0_1px,transparent_1px_5px)",
        }}
        animate={{ backgroundPosition: ["0px 0px", "6px 6px"] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
        <div className="flex items-baseline gap-2">
          <span
            className="display text-[72px] leading-none text-fg transition-[filter,opacity] duration-150"
            style={{ filter: `blur(${blur}px)`, opacity }}
          >
            404
          </span>
          <span
            className={`lab-mono text-[8px] tracking-[0.18em] transition-colors duration-200 ${
              locked ? "text-amber" : "text-white/25"
            }`}
          >
            {locked ? "LOCKED" : "NO SIGNAL"}
          </span>
        </div>

        <div className="lab-mono text-[9px] text-white/45">
          FM {freq.toFixed(1)} · station 404
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[52px] z-10 flex justify-center">
        <div
          ref={track}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            setFrom(e.clientX);
          }}
          onPointerMove={(e) => {
            if (dragging.current) setFrom(e.clientX);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          className="relative h-7 w-[72%] cursor-ew-resize"
        >
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/20" />
          {Array.from({ length: 21 }).map((_, i) => (
            <span
              key={i}
              className={`absolute top-1/2 w-px -translate-y-1/2 ${
                i % 5 === 0 ? "h-2.5 bg-white/40" : "h-1.5 bg-white/20"
              }`}
              style={{ left: `${(i / 20) * 100}%` }}
            />
          ))}
          <span
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber/80 bg-ink-900 shadow-[0_0_12px_rgba(233,184,113,0.3)] after:absolute after:left-1/2 after:top-1/2 after:size-1 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-amber"
            style={{ left: `${ratio * 100}%` }}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[30px] text-center lab-mono text-[8px] text-white/25">
        88 · 94.4 · 108
      </div>

      <Caption label="404 / tuner" />
      <Foot method="tune · 94.4" />
    </Screen>
  );
}
