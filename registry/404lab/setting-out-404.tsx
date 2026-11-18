"use client";

// setting-out-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useEffect, useRef, useState } from "react";
import { Screen, clamp } from "./chrome";

/* ------------------------------- setting out ------------------------------- */

const MEASURE = 210;
const SHEET = "#0a0a09";
const SHEET_INK = "#e9e4d5";
const SHEET_DIM = "#736f64";

export function SettingOutDemo() {
  const host = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const [w, setW] = useState(0);
  const [col, setCol] = useState(300);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const read = () => {
      const width = el.getBoundingClientRect().width;
      if (width < 1) return;
      setW(width);
      setCol((c) => clamp(c, width * 0.24, width * 0.82));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const base = w || 720;
  const min = Math.max(60, base * 0.24);
  const max = Math.max(min + 40, base * 0.82);
  const target = Math.min(MEASURE, max);
  const snapped = Math.abs(col - target) < 1.2;
  const status = snapped ? "SET" : col > target ? "OVER SET" : "UNDER SET";

  function place(clientX: number) {
    const el = host.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const raw = clientX - r.left - r.width * 0.08;
    const next = clamp(raw, min, max);
    setCol(Math.abs(next - MEASURE) <= 6 && MEASURE <= max ? MEASURE : next);
  }

  function down(e: React.PointerEvent<HTMLDivElement>) {
    drag.current = true;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    place(e.clientX);
  }

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    place(e.clientX);
  }

  function up() {
    drag.current = false;
    setDragging(false);
  }

  function key(e: React.KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 24 : 6;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      setCol((c) =>
        clamp(c + (e.key === "ArrowLeft" ? -step : step), min, max),
      );
    }
    if (e.key === "Home") setCol(min);
    if (e.key === "End") setCol(max);
    if (e.key === "Enter") setCol(target);
  }

  return (
    <Screen
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      className="touch-none select-none"
      style={{ backgroundColor: SHEET, color: SHEET_INK }}
    >
      <div
        ref={host}
        className="absolute inset-0 cursor-ew-resize"
        style={{
          backgroundImage:
            "linear-gradient(90deg,rgba(233,228,213,0.05) 0 1px,transparent 1px),linear-gradient(0deg,rgba(233,228,213,0.05) 0 1px,transparent 1px)",
          backgroundSize: "2.5cqw 2.5cqw",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg,rgba(233,228,213,0.055) 0 1px,transparent 1px),linear-gradient(0deg,rgba(233,228,213,0.055) 0 1px,transparent 1px)",
            backgroundSize: "10cqw 10cqw",
          }}
        />

        <div className="pointer-events-none absolute inset-x-[6%] top-[4.2%] flex items-center justify-between lab-mono text-[6.5px] tracking-[0.2em]">
          <span style={{ color: SHEET_INK }}>SHEET 01 · SETTING OUT</span>
          <span style={{ color: SHEET_DIM }}>ISSUE 01 · 210 PX COLUMN</span>
        </div>
        <div
          className="pointer-events-none absolute inset-x-[6%] top-[8.4%] h-px"
          style={{ background: "rgba(233,228,213,0.14)" }}
        />

        {[0, 100, 200].map((n) => (
          <div
            key={n}
            className="pointer-events-none absolute top-[9.4%] h-[1.4cqw] w-px"
            style={{
              left: `calc(8% + ${n}px)`,
              background: "rgba(233,228,213,0.35)",
            }}
          >
            <span
              className="absolute left-0 top-[1.6cqw] lab-mono text-[5.5px] tracking-[0.1em]"
              style={{ color: SHEET_DIM }}
            >
              {n}
            </span>
          </div>
        ))}

        <div
          className="pointer-events-none absolute bottom-[13%] top-[12%] w-px"
          style={{ left: "8%", background: "rgba(233,228,213,0.2)" }}
        />
        <div
          className="pointer-events-none absolute bottom-[13%] top-[12%] w-px"
          style={{ left: "8%", transform: "translateX(-4px)", background: "rgba(233,228,213,0.08)" }}
        />

        <div
          className="pointer-events-none absolute top-[24%]"
          style={{ left: "8%", width: col }}
        >
          <p
            className="display"
            style={{
              fontSize: col / 1.78,
              lineHeight: 0.78,
              letterSpacing: "-0.045em",
              color: SHEET_INK,
            }}
          >
            404
          </p>
          <div
            className="mt-[2.2cqw] h-px w-full"
            style={{ background: "rgba(233,228,213,0.3)" }}
          />
          <p
            className="mt-[1.6cqw] text-[clamp(8.5px,2.05cqw,14px)] leading-[1.55]"
            style={{ color: "#b6b0a1" }}
          >
            No page was set in this measure. The type was ready. The column was
            not.
          </p>
        </div>

        <div
          role="slider"
          tabIndex={0}
          aria-label="Column measure in pixels"
          aria-valuemin={Math.round(min)}
          aria-valuemax={Math.round(max)}
          aria-valuenow={Math.round(col)}
          aria-valuetext={`${Math.round(col)} pixels, ${status.toLowerCase()}`}
          onKeyDown={key}
          onPointerDown={down}
          className="absolute z-20 top-[11%] h-[66%] w-[4cqw] -translate-x-1/2 cursor-ew-resize touch-none outline-none focus-visible:[outline:1px_solid_#e9b871]"
          style={{ left: `calc(8% + ${col}px)` }}
        >
          <span
            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
            style={{
              background: dragging
                ? "#e9b871"
                : "repeating-linear-gradient(180deg,rgba(233,184,113,0.72) 0 5px,transparent 5px 10px)",
            }}
          />
          <span
            className="absolute bottom-0 left-1/2 size-[1.9cqw] -translate-x-1/2 rounded-[1px]"
            style={{ background: "#e9b871" }}
          />
          <span
            className="absolute left-1/2 top-[-1cqw] -translate-x-full whitespace-nowrap rounded-[2px] px-1.5 py-0.5 lab-mono text-[5.8px] tracking-[0.14em]"
            style={{
              background: "#e9b871",
              color: "#12100b",
              transform: "translate(-100%,-100%)",
            }}
          >
            {Math.round(col)} PX
          </span>
        </div>

        <div
          className="pointer-events-none absolute top-[15%] h-[4cqw] w-px"
          style={{ left: `calc(8% + ${MEASURE}px)`, background: "rgba(233,184,113,0.22)" }}
        />

        <div className="pointer-events-none absolute inset-x-[6%] bottom-[9%] h-px bg-[rgba(233,228,213,0.14)]" />
        <div className="pointer-events-none absolute inset-x-[6%] bottom-[3.4%] flex items-end justify-between gap-3 lab-mono text-[6.5px] tracking-[0.16em]">
          <span className="tabular-nums" style={{ color: SHEET_DIM }}>
            MEASURE{" "}
            <span style={{ color: SHEET_INK }}>
              {String(Math.round(col)).padStart(3, "0")} PX
            </span>
            <span className="mx-2 opacity-40">/</span>
            DRAG THE GUIDE
          </span>
          <span
            className="tabular-nums"
            style={{ color: snapped ? "#e9b871" : SHEET_DIM }}
          >
            {status} · TARGET {MEASURE}
          </span>
        </div>
      </div>
    </Screen>
  );
}
