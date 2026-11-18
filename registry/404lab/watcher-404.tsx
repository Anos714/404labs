"use client";

// watcher-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ScreenButton, clamp } from "./chrome";

/* --------------------------------- watcher --------------------------------- */

const WATCH_LOGS = [
  "it saw you arrive",
  "it saw no page",
  "it looked again",
  "still nothing",
];

const WATCH_EYE = "#181a14";
const WATCH_LINE = "rgba(233,184,113,0.17)";

function WatchEye({
  blink,
  left,
  top,
}: {
  blink: boolean;
  left: MotionValue<string>;
  top: MotionValue<string>;
}) {
  return (
    <motion.div
      className="relative shrink-0 overflow-hidden rounded-[50%] border border-[#4a4d3d] bg-[#0c0d0a]"
      style={{
        width: "17.4cqw",
        height: "10.2cqw",
        boxShadow:
          "inset 0 2.4cqw 3.4cqw rgba(0,0,0,0.9), inset 0 -0.5cqw 1.2cqw rgba(233,184,113,0.12), 0 0 4cqw rgba(233,184,113,0.07)",
      }}
      animate={{ scaleY: blink ? 0.045 : 1 }}
      transition={{ duration: 0.13, ease: "easeInOut" }}
    >
      <div
        className="absolute inset-[8%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, #4e5341 0%, #2b3023 54%, #0d0f0a 100%)",
        }}
      />
      {[...Array(16)].map((_, i) => (
        <span
          key={i}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[0.12cqw] w-[40%] origin-left"
          style={{
            transform: `rotate(${i * 22.5}deg) translateX(6%)`,
            background:
              "linear-gradient(90deg, rgba(233,184,113,0.3), rgba(233,184,113,0.03) 70%, transparent)",
          }}
        />
      ))}
      <motion.span
        className="absolute z-10 block rounded-[50%]"
        style={{
          left,
          top,
          width: "3.1cqw",
          height: "5.3cqw",
          translate: "-50% -50%",
          border: "1px solid #d3a862",
          background:
            "radial-gradient(circle at 42% 34%, #ffe8bd 0%, #e1b473 32%, #a3722f 66%, #5a3c18 100%)",
          boxShadow:
            "0 0 1.2cqw rgba(224,176,106,0.35), inset 0 0 0 0.18cqw rgba(26,18,8,0.35)",
        }}
      >
        <span className="absolute left-1/2 top-1/2 h-[68%] w-[0.85cqw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0a0b07]" />
        <span className="absolute left-[18%] top-[14%] size-[0.75cqw] rounded-full bg-[#fffaf0]" />
        <span className="absolute bottom-[20%] right-[17%] size-[0.32cqw] rounded-full bg-[#fff4dc]/70" />
      </motion.span>
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[24%] rounded-b-[50%] bg-[#080905]" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] rounded-t-[50%] bg-[#080905]/85" />
      <motion.span
        className="pointer-events-none absolute inset-0 origin-top bg-[#0b0c09]"
        animate={{ scaleY: blink ? 1 : 0 }}
        transition={{ duration: 0.11 }}
      />
      <span
        className="pointer-events-none absolute inset-0 rounded-[50%]"
        style={{ boxShadow: `inset 0 0 0 1px ${WATCH_LINE}` }}
      />
    </motion.div>
  );
}

export function WatcherDemo() {
  const reduce = useReducedMotion() ?? false;
  const mx = useSpring(0, { stiffness: 150, damping: 20 });
  const my = useSpring(0, { stiffness: 150, damping: 20 });
  const left = useTransform(mx, (v) => `${50 + v * 19}%`);
  const top = useTransform(my, (v) => `${50 + v * 24}%`);
  const [blink, setBlink] = useState(false);
  const [blinks, setBlinks] = useState(0);
  const [log, setLog] = useState(0);
  const busy = useRef(false);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 150);
    }, 6400);
    return () => window.clearInterval(id);
  }, [reduce]);

  function move(e: React.PointerEvent<HTMLButtonElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1));
    my.set(clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1));
  }

  function blinkOnce() {
    if (busy.current) return;
    busy.current = true;
    setBlink(true);
    setBlinks((n) => n + 1);
    setLog((n) => (n + 1) % WATCH_LOGS.length);
    window.setTimeout(() => {
      busy.current = false;
      setBlink(false);
    }, 180);
  }

  return (
    <ScreenButton
      aria-label="A single eye set inside the number 404. Move the pointer to make it look. Click to blink."
      onPointerMove={move}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      onClick={blinkOnce}
      className="select-none bg-[#070806] text-[#e6ddc8] outline-none focus-visible:[outline:1px_solid_#e9b871] focus-visible:outline-offset-[-3px]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(90deg,rgba(233,184,113,0.055)_0_1px,transparent_1px),linear-gradient(0deg,rgba(233,184,113,0.045)_0_1px,transparent_1px)] [background-size:5cqw_5cqw]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_46%,rgba(0,0,0,0)_35%,rgba(3,4,2,0.78)_100%)]" />

      <div className="pointer-events-none absolute inset-x-[7%] top-[4%] flex items-center justify-between lab-mono text-[7px] tracking-[0.2em] text-[#7e7865]">
        <span className="text-[#d8ceb6]">NIGHT WATCH</span>
        <span>SECTOR 404</span>
      </div>
      <div
        className="pointer-events-none absolute inset-x-[7%] top-[8.6%] h-px"
        style={{ background: "rgba(233,184,113,0.13)" }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[19%] size-[52cqw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,184,113,0.11)_0%,rgba(233,184,113,0.035)_42%,transparent_68%)]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[21%] flex items-center justify-center gap-[1.8cqw]">
        <span
          className="display select-none text-[29cqw] leading-[0.72]"
          style={{ color: "transparent", WebkitTextStroke: "1.5px #4a4c3c" }}
        >
          4
        </span>
        <WatchEye blink={blink} left={left} top={top} />
        <span
          className="display select-none text-[29cqw] leading-[0.72]"
          style={{ color: "transparent", WebkitTextStroke: "1.5px #4a4c3c" }}
        >
          4
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[51.5%] flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span className="h-px w-5" style={{ background: WATCH_LINE }} />
          <span className="lab-mono text-[6.5px] tracking-[0.22em] text-[#8b836e]">
            THE ZERO OPENED ONE EYE
          </span>
          <span className="h-px w-5" style={{ background: WATCH_LINE }} />
        </div>
        <p className="display mt-[2.6cqw] max-w-[70%] text-center text-[clamp(13px,3.5cqw,25px)] leading-[1.12] text-[#efe6d1]">
          It watched the empty slot all night.
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-[8%] bottom-[11%]">
        <div
          className="h-px w-full"
          style={{ background: "rgba(233,184,113,0.12)" }}
        />
        <div className="mt-[1.6cqw] flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="lab-mono text-[6px] tracking-[0.2em] text-[#6f6a59]">
              WATCH LOG
            </p>
            <p
              role="status"
              aria-live="polite"
              className="mt-1 lab-mono text-[7.5px] tracking-[0.1em] text-[#bdb39b]"
            >
              {WATCH_LOGS[log]}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 lab-mono text-[6.5px] tracking-[0.14em] text-[#7e7865]">
            <span className="tabular-nums">
              {String(blinks).padStart(2, "0")} BLINKS
            </span>
            <span className="text-[#c9bfa5]">CLICK TO BLINK</span>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-[7%] bottom-[4.5%] flex items-center justify-between lab-mono text-[6.5px] tracking-[0.18em] text-[#5f5b4c]"
      >
        <span>NO ASSIGNMENT · NO RELIEF</span>
        <span className="flex items-center gap-1.5">
          <span className="size-[0.9cqw] bg-[#a2681f]" />
          REC
        </span>
      </div>
    </ScreenButton>
  );
}
