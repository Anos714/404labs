"use client";

import { useEffect, useRef, useState } from "react";
import { Screen } from "./chrome";

/* ---------------------------------- snake ---------------------------------- */

const S_COLS = 16;
const S_ROWS = 11;
const S_GOAL = 9;
const S_STEP = 0.14;
const S_START = [
  { x: 3, y: 5 },
  { x: 2, y: 5 },
  { x: 1, y: 5 },
];

type SnakeCell = { x: number; y: number };
type SnakePhase = "idle" | "live" | "dead" | "won";
type SnakeDir = { x: number; y: number };
type SnakePointer = {
  clientX: number;
  clientY: number;
  target: EventTarget | null;
};

function pelletFrom(body: SnakeCell[]): SnakeCell {
  const free: SnakeCell[] = [];
  for (let y = 0; y < S_ROWS; y++) {
    for (let x = 0; x < S_COLS; x++) {
      if (body.some((c) => c.x === x && c.y === y)) continue;
      free.push({ x, y });
    }
  }
  if (!free.length) return { x: 0, y: 0 };
  return free[Math.floor(Math.random() * free.length)];
}

const S_PIPS = Array.from({ length: S_GOAL }, (_, i) => i);

export function SnakeDemo() {
  const [body, setBody] = useState<SnakeCell[]>(S_START);
  const [pellet, setPellet] = useState<SnakeCell>({ x: 12, y: 2 });
  const [eaten, setEaten] = useState(0);
  const [best, setBest] = useState(0);
  const [phase, setPhase] = useState<SnakePhase>("idle");
  const [heading, setHeading] = useState<SnakeDir>({ x: 1, y: 0 });

  const bodyRef = useRef<SnakeCell[]>(S_START);
  const pelletRef = useRef<SnakeCell>({ x: 12, y: 2 });
  const eatenRef = useRef(0);
  const phaseRef = useRef<SnakePhase>("idle");
  const dirRef = useRef<SnakeDir>({ x: 1, y: 0 });
  const queueRef = useRef<SnakeDir[]>([]);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    let acc = 0;

    const finish = (next: SnakePhase) => {
      phaseRef.current = next;
      setPhase(next);
    };

    const tick = () => {
      const next = queueRef.current.shift();
      if (next) {
        dirRef.current = next;
        setHeading(next);
      }
      const d = dirRef.current;
      const segs = bodyRef.current;
      const head = { x: segs[0].x + d.x, y: segs[0].y + d.y };

      if (head.x < 0 || head.x >= S_COLS || head.y < 0 || head.y >= S_ROWS) {
        finish("dead");
        return;
      }

      const eating =
        head.x === pelletRef.current.x && head.y === pelletRef.current.y;
      const keep = eating ? segs.length : segs.length - 1;

      for (let i = 0; i < keep; i++) {
        if (segs[i].x === head.x && segs[i].y === head.y) {
          finish("dead");
          return;
        }
      }

      const grown = [head, ...segs.slice(0, keep)];
      bodyRef.current = grown;
      setBody(grown);

      if (!eating) return;

      eatenRef.current += 1;
      setEaten(eatenRef.current);
      setBest((n) => Math.max(n, eatenRef.current));

      if (eatenRef.current >= S_GOAL) {
        finish("won");
        return;
      }

      const nextPellet = pelletFrom(grown);
      pelletRef.current = nextPellet;
      setPellet(nextPellet);
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000 || 0, 0.2);
      last = now;

      if (phaseRef.current === "live") {
        acc += dt;
        while (acc >= S_STEP) {
          acc -= S_STEP;
          tick();
          if (phaseRef.current !== "live") {
            acc = 0;
            break;
          }
        }
      } else {
        acc = 0;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  function begin() {
    if (phaseRef.current === "idle") {
      phaseRef.current = "live";
      setPhase("live");
    }
  }

  function turn(x: number, y: number) {
    if (phaseRef.current === "dead" || phaseRef.current === "won") return;
    const last = queueRef.current.length
      ? queueRef.current[queueRef.current.length - 1]
      : dirRef.current;
    if (last.x === x && last.y === y) return;
    if (last.x === -x && last.y === -y) return;
    if (queueRef.current.length < 2) queueRef.current.push({ x, y });
    begin();
  }

  function reset(andGo = false) {
    const start = S_START.map((c) => ({ ...c }));
    bodyRef.current = start;
    setBody(start);
    pelletRef.current = { x: 12, y: 2 };
    setPellet({ x: 12, y: 2 });
    eatenRef.current = 0;
    setEaten(0);
    dirRef.current = { x: 1, y: 0 };
    setHeading({ x: 1, y: 0 });
    queueRef.current = [];
    phaseRef.current = andGo ? "live" : "idle";
    setPhase(andGo ? "live" : "idle");
  }

  function swipeDown(e: SnakePointer) {
    if ((e.target as HTMLElement).closest("button")) return;
    touchRef.current = { x: e.clientX, y: e.clientY };
  }

  function swipeUp(e: SnakePointer) {
    const from = touchRef.current;
    touchRef.current = null;
    if (!from) return;
    const dx = e.clientX - from.x;
    const dy = e.clientY - from.y;
    if (Math.abs(dx) < 14 && Math.abs(dy) < 14) {
      if (phaseRef.current === "dead" || phaseRef.current === "won") reset(true);
      else begin();
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 1 : -1, 0);
    else turn(0, dy > 0 ? 1 : -1);
  }

  const over = phase === "dead" || phase === "won";

  return (
    <Screen
      role="application"
      aria-label="Snake field. Arrow keys, W A S D or swipe to turn. Eat nine pellets."
      tabIndex={0}
      onPointerDown={swipeDown}
      onPointerUp={swipeUp}
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        const k = e.key.toLowerCase();
        if (k === "arrowleft" || k === "a") {
          e.preventDefault();
          turn(-1, 0);
        } else if (k === "arrowright" || k === "d") {
          e.preventDefault();
          turn(1, 0);
        } else if (k === "arrowup" || k === "w") {
          e.preventDefault();
          turn(0, -1);
        } else if (k === "arrowdown" || k === "s") {
          e.preventDefault();
          turn(0, 1);
        } else if (k === " " || k === "enter") {
          e.preventDefault();
          if (over) reset(true);
          else begin();
        }
      }}
      className="touch-none select-none text-[#1f2b22] outline-none focus-visible:[outline:1.5px_solid_#9a4b32] focus-visible:outline-offset-[-3px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[#f2eee3]" />
      <div className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(104deg,rgba(31,43,34,0.035)_0_0.5px,transparent_0.5px_4.2px)]" />

      <div className="pointer-events-none absolute inset-x-[6%] top-[4.2%] flex items-center justify-between lab-mono text-[clamp(6px,1.15cqw,9px)] tracking-[0.2em] text-[#5c6a5c]">
        <span className="text-[#1f2b22]">404LAB FIELD NOTES</span>
        <span>PLATE 09 · SNAKE</span>
      </div>
      <div className="pointer-events-none absolute inset-x-[6%] top-[7.6%] h-px bg-[rgba(31,43,34,0.22)]" />
      <div className="pointer-events-none absolute inset-x-[6%] top-[8.8%] flex items-baseline justify-between">
        <p className="lab-mono text-[clamp(6px,1.1cqw,8.5px)] tracking-[0.18em] text-[#9a4b32]">
          SPECIMEN 404 · MOVES ON A GRID
        </p>
        <p className="lab-mono text-[clamp(6px,1.1cqw,8.5px)] tabular-nums tracking-[0.16em] text-[#5c6a5c]">
          BEST {String(best).padStart(2, "0")}
        </p>
      </div>

      <div
        className="absolute overflow-hidden border border-[rgba(31,43,34,0.5)] bg-[#efe9db]"
        style={{
          left: "13cqw",
          top: "12.4cqw",
          width: "74cqw",
          height: "50.875cqw",
        }}
      >
        <p className="sr-only" role="status" aria-live="polite">
          {phase === "won"
            ? "Nine pellets. No page."
            : phase === "dead"
              ? `Stopped at ${eaten} of nine pellets.`
              : `${eaten} of nine pellets.`}
        </p>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="display select-none text-[30cqw] leading-[0.8] text-[#1f2b22]/[0.055]">
            404
          </span>
        </div>
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(90deg,rgba(31,43,34,0.10)_0_0.5px,transparent_0.5px),linear-gradient(rgba(31,43,34,0.10)_0_0.5px,transparent_0.5px)] [background-size:6.25%_9.0909%]" />

        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            left: `${(pellet.x / S_COLS) * 100}%`,
            top: `${(pellet.y / S_ROWS) * 100}%`,
            width: `${100 / S_COLS}%`,
            height: `${100 / S_ROWS}%`,
          }}
        >
          <span className="absolute inset-[31%] rounded-full bg-[#9a4b32] shadow-[0_0_0_1.2px_rgba(242,238,227,0.9),0_0_0_2.2px_rgba(154,75,50,0.35)]" />
        </div>

        {body.map((seg, i) => {
          const head = i === 0;
          return (
            <div
              key={`${seg.x}-${seg.y}-${i}`}
              className="pointer-events-none absolute"
              style={{
                left: `${(seg.x / S_COLS) * 100}%`,
                top: `${(seg.y / S_ROWS) * 100}%`,
                width: `${100 / S_COLS}%`,
                height: `${100 / S_ROWS}%`,
                zIndex: head ? 5 : 2,
              }}
            >
              <span
                className={`absolute inset-[9%] rounded-[22%] ${
                  head ? "bg-[#9a4b32]" : "bg-[#1f2b22]"
                }`}
                style={{
                  boxShadow: head
                    ? "0 1px 2px rgba(31,43,34,0.35)"
                    : "inset 0 0 0 0.5px rgba(242,238,227,0.18)",
                }}
              >
                {head && (
                  <span className="absolute inset-0">
                    <span
                      className="absolute size-[14%] rounded-full bg-[#f2eee3]"
                      style={{
                        left:
                          heading.x > 0 ? "58%" : heading.x < 0 ? "16%" : "24%",
                        top:
                          heading.x !== 0
                            ? "22%"
                            : heading.y > 0
                              ? "58%"
                              : "18%",
                      }}
                    />
                    <span
                      className="absolute size-[14%] rounded-full bg-[#f2eee3]"
                      style={{
                        left:
                          heading.x > 0 ? "58%" : heading.x < 0 ? "16%" : "58%",
                        top:
                          heading.x !== 0
                            ? "62%"
                            : heading.y > 0
                              ? "58%"
                              : "18%",
                      }}
                    />
                  </span>
                )}
              </span>
            </div>
          );
        })}

        {phase === "idle" && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-[2%]">
            <span className="border border-[rgba(31,43,34,0.35)] bg-[rgba(242,238,227,0.96)] px-[2.2cqw] py-[0.9cqw] lab-mono text-[clamp(6px,1.05cqw,8px)] tracking-[0.16em] text-[#3a463b]">
              PRESS AN ARROW TO BEGIN
            </span>
          </div>
        )}

        {over && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-[1.2cqw] bg-[rgba(242,238,227,0.94)] text-center">
            <p className="lab-mono text-[clamp(6px,1.1cqw,8.5px)] tracking-[0.22em] text-[#9a4b32]">
              {phase === "won"
                ? "REGISTER CLOSED · 09 / 09"
                : `STOPPED AT ${String(eaten).padStart(2, "0")} / 09`}
            </p>
            <p className="display text-[clamp(15px,3.4cqw,26px)] text-[#1f2b22]">
              {phase === "won" ? "Nine fragments. No page." : "The grid closed."}
            </p>
            <p className="max-w-[58%] text-[clamp(7px,1.4cqw,10px)] leading-[1.5] text-[#4c574b]">
              {phase === "won"
                ? "Every pellet was in the field. The route was not."
                : "Nothing was hiding under the board either."}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                reset(true);
              }}
              className="mt-[0.4cqw] cursor-pointer border border-[rgba(31,43,34,0.5)] bg-[#1f2b22] px-[2.2cqw] py-[0.9cqw] lab-mono text-[clamp(6px,1.15cqw,8.5px)] tracking-[0.14em] text-[#f2eee3] transition-colors duration-200 hover:bg-[#9a4b32]"
            >
              START A NEW FIELD
            </button>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-[6%] top-[64.9cqw] hidden items-baseline justify-between lab-mono text-[clamp(5.5px,1.05cqw,8px)] tracking-[0.16em] text-[#4c574b] @[34rem]:flex">
        <span>NINE PELLETS CLOSE THE REGISTER</span>
        <span className="text-[#9a4b32]">NOTHING UNDER THE BOARD</span>
      </div>

      <div className="absolute inset-x-[6%] bottom-[2.4%] flex items-end justify-between gap-[2.5cqw]">
        <div className="min-w-0">
          <p className="lab-mono text-[clamp(6px,1.15cqw,8.5px)] tracking-[0.16em] text-[#3a463b]">
            PELLETS{" "}
            <span className="tabular-nums text-[#1f2b22]">
              {String(eaten).padStart(2, "0")}
            </span>{" "}
            / 09
          </p>
          <div className="mt-[0.9cqw] flex gap-[0.55cqw]">
            {S_PIPS.map((i) => (
              <span
                key={i}
                className="h-[clamp(4px,1.1cqw,8px)] w-[clamp(4px,1.1cqw,8px)] border border-[rgba(31,43,34,0.45)]"
                style={{ background: i < eaten ? "#9a4b32" : "transparent" }}
              />
            ))}
          </div>
        </div>
        <p className="hidden pb-[0.4cqw] text-right text-[clamp(6px,1.05cqw,8px)] leading-[1.45] text-[#5c6a5c] sm:block">
          ARROWS · W A S D · SWIPE
        </p>
        <div className="flex shrink-0 gap-[0.5cqw]">
          {[
            { label: "↑", x: 0, y: -1 },
            { label: "←", x: -1, y: 0 },
            { label: "↓", x: 0, y: 1 },
            { label: "→", x: 1, y: 0 },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              aria-label={`Turn ${b.label}`}
              onClick={(e) => {
                e.stopPropagation();
                turn(b.x, b.y);
                e.currentTarget.blur();
              }}
              className="flex size-[clamp(24px,4.4cqw,34px)] cursor-pointer items-center justify-center border border-[rgba(31,43,34,0.4)] bg-[#f2eee3] lab-mono text-[clamp(7px,1.6cqw,12px)] text-[#1f2b22] transition-colors duration-150 hover:border-[#9a4b32] hover:text-[#9a4b32] active:bg-[#e6dfcd]"
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </Screen>
  );
}
