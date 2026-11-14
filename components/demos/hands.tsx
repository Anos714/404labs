"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { Caption, clamp, Foot, Plate, Screen } from "./chrome";

/* ----------------------------------- dial ---------------------------------- */

const DIAL = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const STEP = 36;

export function DialDemo() {
  const reduce = useReducedMotion();
  const spring = useSpring(0, { stiffness: 150, damping: 18 });
  const drag = useRef<{ start: number; base: number } | null>(null);
  const [entered, setEntered] = useState("");
  const [note, setNote] = useState("dial 404");

  function enter(digit: string) {
    if (entered.length >= 3) return;
    const next = entered + digit;
    setEntered(next);
    if (next.length === 3) {
      if (next === "404") {
        setNote("no answer. of course.");
      } else {
        setNote("wrong number");
        setTimeout(() => {
          setEntered("");
          setNote("dial 404");
        }, 1200);
      }
    } else {
      setNote("keep going");
    }
  }

  function down(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    drag.current = { start: e.clientX, base: spring.get() };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current || reduce) return;
    spring.set(clamp(drag.current.base + (e.clientX - drag.current.start), -170, 170));
  }

  function up() {
    if (!drag.current) return;
    drag.current = null;
    const angle = spring.get();
    if (Math.abs(angle) > 14) {
      const index = ((Math.round(-angle / STEP) % 10) + 10) % 10;
      enter(DIAL[index]);
    }
    spring.set(0);
  }

  return (
    <Screen
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      className="touch-none select-none bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(242,237,227,0.06),transparent_66%)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3cqw]">
        <div className="relative size-[50cqw] cursor-grab active:cursor-grabbing">
          <span className="absolute inset-0 rounded-full border border-line-2" />
          <span className="absolute inset-[2.2cqw] rounded-full border border-white/[0.045]" />

          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 h-px w-[2cqw] bg-white/15"
              style={{
                transform: `rotate(${i * 9}deg) translateY(-24cqw)`,
                transformOrigin: "0 0",
              }}
            />
          ))}

          <span className="absolute left-1/2 top-0 size-[2cqw] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-amber" />

          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ rotate: spring }}
          >
            {DIAL.map((digit, i) => (
              <div
                key={digit}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${i * STEP}deg) translateY(-17cqw) rotate(${
                    -i * STEP
                  }deg)`,
                }}
              >
                <span className="grid size-[9.5cqw] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line-2 bg-ink-850 lab-mono text-[3cqw] text-fg/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  {digit}
                </span>
              </div>
            ))}
          </motion.div>

          <div className="absolute left-1/2 top-1/2 grid size-[17cqw] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line-2 bg-ink-900 shadow-[0_8px_20px_rgba(0,0,0,0.45)]">
            <div className="flex items-baseline gap-0.5 display text-[7.5cqw] leading-none">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={entered[i] ? "text-fg" : "text-fg/20"}
                >
                  {entered[i] ?? "·"}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-none lab-mono text-[9px] text-white/45">
          {note}
        </div>
      </div>

      <Caption label="404 / dial" />
      <Foot method="drag · 3 stops" />
    </Screen>
  );
}

/* -------------------------------- pendulum -------------------------------- */

export function PendulumDemo() {
  const reduce = useReducedMotion();
  const target = useMotionValue(0);
  const tilt = useSpring(target, { stiffness: 70, damping: 11 });
  const r1 = useTransform(tilt, (v) => v * 0.78);
  const r2 = useTransform(tilt, (v) => v * 1.12);
  const r3 = useTransform(tilt, (v) => v * 0.92);

  const digits = [
    { d: "4", left: "31%", len: 58, rotate: r1 },
    { d: "0", left: "50%", len: 82, rotate: r2 },
    { d: "4", left: "69%", len: 66, rotate: r3 },
  ];

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    target.set(((e.clientX - r.left) / r.width - 0.5) * 26);
  }

  return (
    <Screen
      onPointerMove={move}
      onPointerLeave={() => target.set(0)}
      className="bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(242,237,227,0.055),transparent_66%)]" />

      <div className="absolute inset-x-[12%] top-[18%] h-px bg-white/25" />
      {digits.map((p) => (
        <span
          key={p.left}
          className="absolute top-[17.4%] size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/70"
          style={{ left: p.left }}
        />
      ))}

      {digits.map((p) => (
        <motion.div
          key={p.left}
          className="absolute top-[18%] origin-top"
          style={{ left: p.left, rotate: p.rotate }}
        >
          <div
            className="absolute left-0 top-0 w-px -translate-x-1/2 bg-[linear-gradient(180deg,rgba(242,237,227,0.55),rgba(242,237,227,0.18))]"
            style={{ height: p.len }}
          />
          <div
            className="absolute left-0 -translate-x-1/2"
            style={{ top: p.len - 4 }}
          >
            <span className="display block text-[52px] leading-none text-fg drop-shadow-[0_3px_10px_rgba(8,9,10,0.5)]">
              {p.d}
            </span>
          </div>
        </motion.div>
      ))}

      <div className="pointer-events-none absolute bottom-[19%] left-1/2 h-px w-[46%] -translate-x-1/2 bg-[repeating-linear-gradient(to_right,rgba(242,237,227,0.22)_0_3px,transparent_3px_8px)]" />

      <div className="pointer-events-none absolute inset-x-0 bottom-[46px] text-center lab-mono text-[9px] text-white/45">
        push the number off balance
      </div>

      <Caption label="404 / pendulum" />
      <Foot method="pendulum · pointer" />
    </Screen>
  );
}

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

/* --------------------------------- plunger --------------------------------- */

export function PlungerDemo() {
  const reduce = useReducedMotion();
  const [pull, setPull] = useState(0);
  const [launch, setLaunch] = useState(false);
  const dragging = useRef<{ y: number } | null>(null);

  function down(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    dragging.current = { y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    setPull(clamp(e.clientY - dragging.current.y, 0, 62));
  }

  function up() {
    if (!dragging.current) return;
    dragging.current = null;
    if (pull > 16) setLaunch(true);
    setPull(0);
  }

  return (
    <Screen
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      className="touch-none select-none bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(242,237,227,0.055),transparent_66%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,237,227,0.035)_0_1px,transparent_1px_24px),linear-gradient(0deg,rgba(242,237,227,0.035)_0_1px,transparent_1px_24px)]" />

      <div className="absolute inset-x-[32%] top-[10%] h-[64%] border-x border-white/10">
        <div className="absolute inset-y-0 left-[18%] w-px bg-white/[0.05]" />
        <div className="absolute inset-y-0 right-[18%] w-px bg-white/[0.05]" />
      </div>

      {[
        { left: "39%", top: "21%", size: 22 },
        { left: "61%", top: "32%", size: 17 },
      ].map((b) => (
        <motion.span
          key={b.left}
          aria-hidden
          className="absolute z-10 rounded-full border border-amber/50 bg-[radial-gradient(circle_at_35%_30%,rgba(233,184,113,0.3),rgba(8,9,10,0.9))]"
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            marginLeft: -b.size / 2,
            marginTop: -b.size / 2,
          }}
          animate={launch ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, delay: 0.18 }}
        />
      ))}

      <div className="absolute left-4 top-9 lab-mono text-[8.5px] leading-relaxed text-white/40">
        <p>BALL 404</p>
        <p className="text-amber/70">{launch ? "IN PLAY" : "READY"}</p>
      </div>
      <div className="absolute right-4 top-9 lab-mono text-[8.5px] text-white/35">
        TILT
      </div>

      <motion.div
        aria-hidden
        className="absolute z-20 grid size-[6.75cqw] place-items-center rounded-full border border-white/40 bg-[radial-gradient(circle_at_35%_28%,#8b8f94,#2a2f34_58%,#121519)] shadow-[0_3px_10px_rgba(0,0,0,0.6)]"
        style={{
          left: "50%",
          marginLeft: "-3.375cqw",
          marginTop: "-3.375cqw",
        }}
        animate={
          launch
            ? {
                top: ["72%", "22%", "48%", "22%", "64%", "72%"],
                left: ["50%", "43%", "57%", "50%", "47%", "50%"],
                rotate: [0, -18, 14, -10, 5, 0],
              }
            : { top: "72%" }
        }
        transition={
          launch
            ? {
                duration: 1.45,
                times: [0, 0.28, 0.46, 0.62, 0.86, 1],
                ease: "easeOut",
              }
            : { duration: 0 }
        }
        onAnimationComplete={() => {
          if (launch) setLaunch(false);
        }}
      >
        <span className="lab-mono text-[6px] tracking-[-0.02em] text-fg/70">
          404
        </span>
      </motion.div>

      <div className="absolute inset-x-0 bottom-[9%] flex flex-col items-center gap-1">
        <div className="h-[7px] w-[74px] rounded-[2px] bg-[linear-gradient(180deg,#3a4045,#1b1f23)]" />
        <div
          className="h-6 w-3 rounded-b-[2px] bg-[linear-gradient(180deg,#555b61,#24292e)] shadow-[0_6px_10px_rgba(0,0,0,0.4)] transition-transform duration-150"
          style={{ transform: `translateY(${pull}px)` }}
        />
        <span className="lab-mono text-[7.5px] tracking-[0.14em] text-white/30">
          PLUNGER
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[78px] text-center lab-mono text-[9px] text-white/45">
        {launch ? "one bad bounce" : "pull down, let go"}
      </div>

      <Caption label="404 / plunger" />
      <Foot method="plunger · spring" />
    </Screen>
  );
}
