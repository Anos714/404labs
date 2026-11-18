"use client";

// latch-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef, useState } from "react";
import { Caption, Foot, Screen, clamp } from "./chrome";

/* ---------------------------------- latch ---------------------------------- */

export function LatchDemo() {
  const [open, setOpen] = useState(0);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; base: number } | null>(null);
  const lock = useRef<HTMLDivElement>(null);

  function down(e: React.PointerEvent<HTMLDivElement>) {
    start.current = { x: e.clientX, base: open };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (!start.current) return;
    const w = lock.current?.getBoundingClientRect().width ?? 220;
    setOpen(clamp(start.current.base + (e.clientX - start.current.x) / w, 0, 1));
  }

  function up() {
    if (!start.current) return;
    start.current = null;
    setDragging(false);
    setOpen((v) => (v > 0.45 ? 0.92 : 0));
  }

  const settled = !dragging && open > 0.5;

  return (
    <Screen
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      className="touch-none select-none bg-[#0a0b0d]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),transparent_30%,rgba(0,0,0,0.25))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(242,237,227,0.05),transparent_68%)]" />

      <div className="absolute inset-x-4 top-9 flex items-center justify-between lab-mono text-[8px] tracking-[0.16em] text-white/35">
        <span>SEALED UNIT 04</span>
        <span className={settled ? "text-amber/70" : ""}>
          {settled ? "OPEN" : "BOLTED"}
        </span>
      </div>

      <div className="absolute inset-0 grid place-items-center">
        <div
          ref={lock}
          className="relative h-[148px] w-[236px] overflow-hidden border border-line-2 bg-ink-950"
        >
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_50%_50%,rgba(233,184,113,0.13),transparent_65%)]">
            <div className="text-center">
              <span className="display block text-[60px] leading-none text-fg">
                404
              </span>
              <span className="lab-mono text-[8px] tracking-[0.14em] text-amber/60">
                EMPTY ROOM
              </span>
            </div>
          </div>

          <div
            className={`absolute inset-0 z-10 bg-[linear-gradient(180deg,#22262b,#121519_55%,#0d1013)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${
              dragging ? "" : "transition-transform duration-500 ease-out"
            }`}
            style={{ transform: `translateX(${open * 100}%)` }}
          >
            <div className="absolute inset-2 border border-white/[0.06]" />
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-px w-4 bg-white/15" />
              ))}
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <span className="lab-mono text-[9px] tracking-[0.22em] text-white/40">
                  DEADBOLT
                </span>
                <span className="mt-1 block lab-mono text-[8px] text-amber/60">
                  DRAG RIGHT
                </span>
              </div>
            </div>
            <span className="absolute inset-y-0 right-0 w-1.5 bg-[linear-gradient(90deg,rgba(0,0,0,0.3),rgba(255,255,255,0.06))]" />
            {[
              "left-2 top-2",
              "right-2 top-2",
              "bottom-2 left-2",
              "bottom-2 right-2",
            ].map((pos) => (
              <span
                key={pos}
                className={`absolute size-1.5 rounded-full bg-white/20 ${pos}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[46px] text-center lab-mono text-[9px] text-white/45">
        {settled ? "the room was never occupied" : "pull the bolt"}
      </div>

      <Caption label="404 / latch" />
      <Foot method="deadbolt · drag" />
    </Screen>
  );
}
