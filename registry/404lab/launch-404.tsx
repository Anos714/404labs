"use client";

// launch-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useEffect, useRef, useState } from "react";
import { Screen, clamp } from "./chrome";

/* ---------------------------------- launch --------------------------------- */

const PAD_X = 18;

const GROUND = (x: number) =>
  Math.min(
    66,
    56.5 +
      Math.sin((x + 6) / 13) * 2.4 +
      Math.sin((x - 28) / 6.4) * 0.9 +
      x * 0.045,
  );

const HILL_POINTS = Array.from({ length: 51 }, (_, i) => {
  const x = i * 2;
  return `${x} ${GROUND(x).toFixed(2)}`;
}).join(" L ");

const HILL_PATH = `M 0 75 L 0 ${GROUND(0).toFixed(2)} L ${HILL_POINTS} L 100 75 Z`;
const BACK_POINTS = Array.from({ length: 51 }, (_, i) => {
  const x = i * 2;
  return `${x} ${(GROUND(x) - 7 - Math.sin(x / 9) * 1.2).toFixed(2)}`;
}).join(" L ");
const BACK_PATH = `M 0 75 L 0 ${(GROUND(0) - 7).toFixed(2)} L ${BACK_POINTS} L 100 75 Z`;
const FAR_PATH = `M 0 75 L 0 45 L 22 41 L 44 44 L 68 38 L 88 42 L 100 39 L 100 75 Z`;

export function LaunchDemo() {
  const plane = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const charge = useRef(0);
  const charging = useRef(false);
  const flying = useRef(false);
  const start = useRef(0);
  const chargeRaf = useRef(0);
  const flightRaf = useRef(0);
  const throwCount = useRef(0);
  const [throws, setThrows] = useState(0);
  const [best, setBest] = useState(0);
  const [note, setNote] = useState("hold anywhere to pull it back");
  const [arc, setArc] = useState<[number, number][]>([]);
  const [landed, setLanded] = useState<{ x: number; y: number; d: number } | null>(
    null,
  );
  const [pulling, setPulling] = useState(false);

  useEffect(
    () => () => {
      cancelAnimationFrame(chargeRaf.current);
      cancelAnimationFrame(flightRaf.current);
    },
    [],
  );

  function restPlane() {
    if (!plane.current) return;
    plane.current.style.left = `${PAD_X}%`;
    plane.current.style.top = `${((GROUND(PAD_X) - 2.4) / 75) * 100}%`;
    plane.current.style.transform = "translate(-50%,-50%) rotate(0deg)";
  }

  function begin() {
    if (flying.current || throwCount.current >= 3) return;
    cancelAnimationFrame(chargeRaf.current);
    charging.current = true;
    setPulling(true);
    restPlane();
    charge.current = 0;
    start.current = performance.now();
    setNote("keep holding, then let go");

    const tick = (now: number) => {
      if (!charging.current) return;
      const c = clamp((now - start.current) / 1050, 0, 1);
      charge.current = c;
      if (fill.current) fill.current.style.width = `${c * 100}%`;
      if (plane.current) {
        plane.current.style.left = `${PAD_X - c * 5}%`;
        plane.current.style.top = `${((GROUND(PAD_X) - 2.4 + c * 1.2) / 75) * 100}%`;
        plane.current.style.transform = `translate(-50%,-50%) rotate(${-c * 14}deg)`;
      }
      chargeRaf.current = requestAnimationFrame(tick);
    };
    chargeRaf.current = requestAnimationFrame(tick);
  }

  function release() {
    if (!charging.current) return;
    charging.current = false;
    setPulling(false);
    cancelAnimationFrame(chargeRaf.current);
    launch(charge.current);
  }

  function launch(c: number) {
    if (flying.current) return;
    flying.current = true;
    setLanded(null);
    setArc([]);
    setNote("in the air");

    let x = PAD_X;
    let y = GROUND(PAD_X) - 2.4;
    const vx = 34 + 44 * c;
    let vy = -(44 + 22 * c);
    const pts: [number, number][] = [[x, y]];
    let last = performance.now();
    let mark = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000 || 0.016, 0.032);
      last = now;
      const steps = 3;
      for (let s = 0; s < steps; s++) {
        const h = dt / steps;
        vy += 96 * h;
        x += vx * h;
        y += vy * h;
        if (x > 98) {
          x = 98;
          break;
        }
        if (y >= GROUND(x)) break;
      }
      pts.push([x, y]);
      mark += 1;
      if (mark % 2 === 0) setArc([...pts]);
      if (plane.current) {
        plane.current.style.left = `${x}%`;
        plane.current.style.top = `${(y / 75) * 100}%`;
        plane.current.style.transform = `translate(-50%,-50%) rotate(${
          (Math.atan2(vy, vx) * 180) / Math.PI
        }deg)`;
      }
      if (x >= 98 || y >= GROUND(x)) {
        const gy = GROUND(x);
        if (plane.current) {
          plane.current.style.top = `${(gy / 75) * 100}%`;
          plane.current.style.transform = "translate(-50%,-50%) rotate(8deg)";
        }
        const d = Math.max(1, Math.round((x - PAD_X) * 2.2));
        const next = throwCount.current + 1;
        throwCount.current = next;
        setThrows(next);
        setBest((b) => Math.max(b, d));
        setLanded({ x, y: gy, d });
        setArc(pts);
        setNote(
          next >= 3
            ? "three throws, still no page at the end of any of them"
            : `${d} m and no page at the end of it`,
        );
        if (fill.current) fill.current.style.width = "0%";
        flying.current = false;
        return;
      }
      flightRaf.current = requestAnimationFrame(tick);
    };

    flightRaf.current = requestAnimationFrame(tick);
  }

  function reset() {
    cancelAnimationFrame(flightRaf.current);
    cancelAnimationFrame(chargeRaf.current);
    flying.current = false;
    charging.current = false;
    throwCount.current = 0;
    setThrows(0);
    setBest(0);
    setArc([]);
    setLanded(null);
    setPulling(false);
    setNote("hold anywhere to pull it back");
    if (fill.current) fill.current.style.width = "0%";
    restPlane();
  }

  return (
    <Screen
      role="application"
      tabIndex={0}
      aria-label="Paper plane launch. Hold the page to pull back, release to throw."
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        begin();
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
      onKeyDown={(e) => {
        if (e.key === " " && !e.repeat) {
          e.preventDefault();
          begin();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === " ") {
          e.preventDefault();
          release();
        }
      }}
      className="touch-none select-none outline-none focus-visible:[outline:1px_solid_#e9b871] focus-visible:outline-offset-[-3px]"
      style={{ background: "linear-gradient(#f1e8d5, #e5cfac)" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_74%_18%,rgba(255,250,235,0.7),transparent_58%)]" />

      <div className="pointer-events-none absolute inset-x-[6%] top-[4%] flex items-center justify-between lab-mono text-[6.5px] tracking-[0.2em] text-[#4a584a]">
        <span>THROW {String(Math.min(throws + (throws < 3 ? 1 : 0), 3)).padStart(2, "0")} / 03</span>
        <span className="tabular-nums">
          BEST {best ? `${String(best).padStart(3, "0")} M` : "--- M"}
        </span>
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-[8.4%] flex w-[30cqw] -translate-x-1/2 items-center gap-2"
        style={{ opacity: pulling ? 1 : 0.55 }}
      >
        <span className="lab-mono text-[5.5px] tracking-[0.18em] text-[#4a584a]">
          PULL
        </span>
        <span className="relative h-[0.7cqw] flex-1 overflow-hidden bg-[rgba(46,58,44,0.18)]">
          <span
            ref={fill}
            className="absolute inset-y-0 left-0 bg-[#9a4b32]"
            style={{ width: 0 }}
          />
        </span>
      </div>

      <p
        className="display pointer-events-none absolute inset-x-0 top-[12%] text-center text-[30cqw] leading-none"
        style={{ color: "rgba(58,74,56,0.13)" }}
      >
        404
      </p>

      <svg
        viewBox="0 0 100 75"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        <path d={FAR_PATH} fill="#b9c0a8" />
        <path d={BACK_PATH} fill="#9aa78c" />
        <path d={HILL_PATH} fill="#5f7259" />
      </svg>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[10%]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(105deg,rgba(28,40,28,0.18) 0 1px,transparent 1px 6px)",
        }}
      />

      {arc.length > 1 && (
        <svg
          viewBox="0 0 100 75"
          className="pointer-events-none absolute inset-0 z-[8] h-full w-full"
          aria-hidden
        >
          <polyline
            points={arc.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke="#9a4b32"
            strokeWidth="0.32"
            strokeDasharray="0.9 1.4"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      )}

      {landed && (
        <div
          className="pointer-events-none absolute z-[9] flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${landed.x}%`, top: `${(landed.y / 75) * 100}%` }}
        >
          <span className="lab-mono text-[6px] tracking-[0.12em] text-[#f4eeda]">
            {String(landed.d).padStart(3, "0")} M
          </span>
          <span className="mt-0.5 h-[2.2cqw] w-px bg-[#f4eeda]/70" />
          <span className="size-[0.8cqw] rounded-full bg-[#9a4b32]" />
        </div>
      )}

      <div
        ref={plane}
        className="pointer-events-none absolute z-10"
        style={{
          left: `${PAD_X}%`,
          top: `${((GROUND(PAD_X) - 2.4) / 75) * 100}%`,
          width: "5.4cqw",
          transform: "translate(-50%,-50%)",
        }}
      >
        <svg viewBox="0 0 26 18" className="h-auto w-full overflow-visible">
          <path
            d="M1.5 8.6 L24.5 1.4 L14.4 16.6 L11.8 9.8 Z"
            fill="#f7f1e2"
            stroke="#33412f"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          <path
            d="M11.8 9.8 L24.5 1.4"
            fill="none"
            stroke="#33412f"
            strokeWidth="0.7"
            opacity="0.65"
          />
          <path
            d="M11.8 9.8 L13.4 15.6"
            fill="none"
            stroke="#9a4b32"
            strokeWidth="0.9"
          />
        </svg>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[5%] z-20 flex items-end justify-between px-[6%]">
        <p
          role="status"
          aria-live="polite"
          className="max-w-[62%] text-[clamp(7px,1.55cqw,10.5px)] leading-[1.5] text-[#f7f1e2] [text-shadow:0_1px_3px_rgba(28,40,28,0.7)]"
        >
          {note}
        </p>
        <span className="lab-mono text-[5.5px] tracking-[0.14em] text-[#f7f1e2]/75 [text-shadow:0_1px_3px_rgba(28,40,28,0.6)]">
          HOLD · RELEASE
        </span>
      </div>

      {throws >= 3 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            reset();
          }}
          className="absolute bottom-[11%] left-1/2 z-20 -translate-x-1/2 cursor-pointer rounded-control border border-[#33412f]/60 bg-[#f4eeda]/70 px-3 py-1.5 lab-mono text-[6.5px] tracking-[0.14em] text-[#2f3d30] transition-colors duration-200 hover:bg-[#f4eeda]"
        >
          THREE MORE THROWS
        </button>
      )}
    </Screen>
  );
}
