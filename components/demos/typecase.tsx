"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Caption, EASE, Foot, Screen, useReplay } from "./chrome";

/* ---------------------------------- stroke --------------------------------- */

export function StrokeDemo() {
  const reduce = useReducedMotion();
  const { run, replay } = useReplay();

  return (
    <Screen onPointerEnter={replay} onClick={replay} className="bg-[#07080a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,237,227,0.06),transparent_70%)]" />
      <div className="absolute inset-0 grid place-items-center">
        <svg viewBox="0 0 320 160" className="w-[88%]">
          <motion.text
            key={run}
            x="160"
            y="122"
            textAnchor="middle"
            fill="#f2ede3"
            stroke="#f2ede3"
            strokeWidth="1.1"
            strokeDasharray="820 820"
            style={{
              fontFamily: "var(--lab-font-display, var(--font-display))",
              fontSize: 118,
              letterSpacing: "-3px",
            }}
            initial={
              reduce
                ? false
                : { strokeDashoffset: 820, fillOpacity: 0, strokeOpacity: 0.75 }
            }
            whileInView={{ strokeDashoffset: 0, fillOpacity: 0.94 }}
            viewport={{ once: true }}
            transition={{
              strokeDashoffset: { duration: 1.7, ease: "easeInOut" },
              fillOpacity: { duration: 0.5, delay: 1.2 },
            }}
          >
            404
          </motion.text>
        </svg>
      </div>

      <div className="absolute inset-x-8 top-[70%] h-px bg-[repeating-linear-gradient(to_right,rgba(242,237,227,0.28)_0_3px,transparent_3px_9px)]" />
      <div className="absolute bottom-9 left-4 lab-mono text-[9.5px] text-white/45">
        drawn, not typed
      </div>

      <Caption label="404 / stroke" />
      <Foot method="svg · stroke draw" />
    </Screen>
  );
}

/* ---------------------------------- stack ---------------------------------- */

const LAYERS = [0, 1, 2, 3, 4];

export function StackDemo() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <Screen
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      className="bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,237,227,0.05),transparent_65%)]" />
      <div className="absolute inset-0 [perspective:720px]">
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
          animate={
            open || reduce
              ? { rotateX: 0, rotateY: 0 }
              : { rotateX: 6, rotateY: -16 }
          }
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {LAYERS.map((i) => (
              <motion.span
                key={i}
                aria-hidden={i > 0}
                className="display absolute text-[66px] leading-none text-fg"
                animate={
                  open || reduce
                    ? { z: 0, opacity: 1 }
                    : { z: -i * 54, opacity: 1 - i * 0.2 }
                }
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 20,
                  delay: i * 0.02,
                }}
              >
                404
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute left-4 top-1/2 flex -translate-y-1/2 flex-col gap-1.5">
        {LAYERS.map((i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="h-px w-3 bg-white/25" />
            <span className="lab-mono text-[8px] text-white/35">
              {String(i).padStart(2, "0")}
            </span>
          </span>
        ))}
      </div>

      <Caption label="404 / stack" />
      <Foot method="5 layers · z" />
    </Screen>
  );
}

/* --------------------------------- odometer -------------------------------- */

const CELL = 76;

function reel(target: string, cycles: number) {
  const seq: string[] = [];
  for (let i = 0; i < cycles * 10 + 2; i += 1) seq.push(String(i % 10));
  if (seq[seq.length - 1] !== target) seq.push(target);
  return seq;
}

const REELS = [
  reel("4", 2),
  reel("0", 2),
  reel("4", 1),
];

export function OdometerDemo() {
  const reduce = useReducedMotion();
  const { run, replay } = useReplay();

  return (
    <Screen onPointerEnter={replay} onClick={replay} className="bg-[#07080a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,237,227,0.05),transparent_65%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="flex items-start gap-1.5">
          {REELS.map((seq, i) => (
            <div
              key={i}
              className="relative h-[76px] w-[56px] overflow-hidden border-y border-line-2 bg-ink-850/60"
              style={{
                maskImage:
                  "linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%)",
              }}
            >
              {reduce ? (
                <span className="grid h-[76px] place-items-center display text-[62px] leading-none text-fg">
                  {seq[seq.length - 1]}
                </span>
              ) : (
                <motion.div
                  key={run}
                  initial={{ y: 0 }}
                  animate={{ y: -(seq.length - 1) * CELL }}
                  transition={{
                    duration: 1.9,
                    delay: i * 0.14,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {seq.map((d, j) => (
                    <span
                      key={j}
                      className="grid h-[76px] place-items-center display text-[62px] leading-none tabular-nums text-fg"
                    >
                      {d}
                    </span>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </div>
        <p className="lab-mono text-[10px] text-white/50">
          three reels, one answer
        </p>
      </div>

      <div className="absolute inset-x-0 top-[26%] h-px bg-gradient-to-r from-transparent via-line-2 to-transparent" />
      <div className="absolute inset-x-0 bottom-[26%] h-px bg-gradient-to-r from-transparent via-line-2 to-transparent" />

      <Caption label="404 / odometer" />
      <Foot method="reels · 3 digits" />
    </Screen>
  );
}

/* --------------------------------- defocus --------------------------------- */

const SLICES = 14;

export function DefocusDemo() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <Screen
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      className="bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,237,227,0.07),transparent_68%)]" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative">
          <motion.span
            aria-hidden
            className="display absolute inset-0 text-[68px] leading-none text-fg blur-[6px]"
            animate={{ opacity: open && !reduce ? 0 : 0.5 }}
            transition={{ duration: 0.45 }}
          >
            404
          </motion.span>

          {Array.from({ length: SLICES }).map((_, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="display absolute inset-0 text-[68px] leading-none text-fg"
              style={{
                clipPath: `inset(${i * (100 / SLICES)}% 0 ${
                  100 - (i + 1) * (100 / SLICES)
                }% 0)`,
              }}
              animate={{
                x: open || reduce ? 0 : (i - (SLICES - 1) / 2) * 2.4,
              }}
              transition={{
                duration: 0.5,
                ease: EASE,
                delay: reduce ? 0 : i * 0.012,
              }}
            >
              404
            </motion.span>
          ))}

          <span className="display text-[68px] leading-none text-transparent">
            404
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-14 flex items-center justify-center gap-1.5">
        {Array.from({ length: 17 }).map((_, i) => (
          <span
            key={i}
            className={`block w-px bg-white/25 ${
              i % 4 === 0 ? "h-2.5" : "h-1.5"
            }`}
          />
        ))}
      </div>
      <div className="absolute bottom-9 left-4 lab-mono text-[9.5px] text-white/45">
        diopter −0.4
      </div>

      <Caption label="404 / defocus" />
      <Foot method="slices · focus" />
    </Screen>
  );
}

/* ---------------------------------- sweep ---------------------------------- */

export function SweepDemo() {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (reduce) setOn(true);
  }, [reduce]);

  return (
    <Screen
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(reduce ? true : false)}
      onClick={() => setOn((v) => !v)}
      className="bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,237,227,0.045)_0_1px,transparent_1px_24px)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.2)_0%,rgba(8,9,10,0.65)_100%)]" />

      <div className="absolute inset-0 grid place-items-center">
        <div className="relative">
          <span
            className="display text-[70px] leading-none"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px rgba(242,237,227,0.6)",
            }}
          >
            404
          </span>

          <motion.div
            className="absolute inset-y-0 left-0 overflow-hidden"
            animate={{ width: on ? "100%" : "0%" }}
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
          >
            <span className="display absolute left-0 top-0 whitespace-nowrap text-[70px] leading-none text-fg">
              404
            </span>
            <span className="absolute right-0 top-0 h-full w-px bg-amber" />
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-6 top-[74%] flex items-center justify-between lab-mono text-[9px] text-white/40">
        <span>0</span>
        <span>sweep</span>
        <span>100</span>
      </div>

      <Caption label="404 / sweep" />
      <Foot method="mask · wipe" />
    </Screen>
  );
}

/* ---------------------------------- morse ---------------------------------- */

const UNIT = 115;
const GROUPS = ["....-", "-----", "....-"];
const DIGITS = ["4", "0", "4"];

type Ev = { on: boolean; dur: number; reveal?: string };

const EVENTS: Ev[] = (() => {
  const out: Ev[] = [];
  GROUPS.forEach((code, gi) => {
    code.split("").forEach((sym) => {
      out.push({ on: true, dur: (sym === "-" ? 3 : 1) * UNIT });
      out.push({ on: false, dur: UNIT });
    });
    out.push({ on: false, dur: 3 * UNIT, reveal: DIGITS[gi] });
  });
  return out;
})();

export function MorseDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-30px" });
  const [step, setStep] = useState(-1);
  const [text, setText] = useState("");

  useEffect(() => {
    if (inView) setStep(0);
  }, [inView]);

  useEffect(() => {
    if (step < 0) return;
    const ev = EVENTS[step];
    if (!ev) {
      setStep(-1);
      return;
    }
    if (reduce) {
      setText("404");
      setStep(-1);
      return;
    }
    const t = setTimeout(() => {
      if (ev.reveal) setText((s) => s + ev.reveal);
      setStep((s) => s + 1);
    }, ev.dur);
    return () => clearTimeout(t);
  }, [step, reduce]);

  const lit = step >= 0 && EVENTS[step]?.on === true;

  function replay() {
    if (reduce) return;
    setText("");
    setStep(0);
  }

  return (
    <Screen ref={ref} onPointerEnter={replay} onClick={replay} className="bg-[#07080a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(233,184,113,0.05),transparent_65%)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="relative grid size-[52px] place-items-center">
          <span className="absolute inset-0 rounded-full border border-line-2" />
          <span
            className={`size-3 rounded-full transition-[background-color,box-shadow] duration-75 ${
              lit
                ? "bg-amber shadow-[0_0_26px_6px_rgba(233,184,113,0.45)]"
                : "bg-fg/15"
            }`}
          />
          <span className="absolute -bottom-4 lab-mono text-[8px] text-white/35">
            lamp
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          {DIGITS.map((d, i) => (
            <span
              key={i}
              className={`display text-[56px] leading-none transition-colors duration-200 ${
                text.length > i ? "text-fg" : "text-fg/15"
              }`}
            >
              {d}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {GROUPS.map((g, gi) => (
            <span
              key={gi}
              className={`lab-mono text-[12px] tracking-[0.18em] ${
                text.length > gi ? "text-amber/80" : "text-white/30"
              }`}
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-9 left-4 lab-mono text-[9.5px] text-white/40">
        5 wpm · 404
      </div>

      <Caption label="404 / morse" />
      <Foot method="signal · 115ms" />
    </Screen>
  );
}

/* ---------------------------------- ticker --------------------------------- */

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const TARGET = ["4", "0", "4"];

export function TickerDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const [chars, setChars] = useState(TARGET);
  const [spin, setSpin] = useState(0);
  const busy = useRef(false);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setChars(TARGET);
      return;
    }
    busy.current = true;
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      if (n > 9) {
        clearInterval(id);
        setChars(TARGET);
        busy.current = false;
        return;
      }
      setChars(
        TARGET.map(() => ALPHA[Math.floor(Math.random() * ALPHA.length)]),
      );
    }, 92);
    return () => clearInterval(id);
  }, [inView, spin, reduce]);

  function replay() {
    if (reduce || busy.current) return;
    setSpin((s) => s + 1);
  }

  return (
    <Screen ref={ref} onPointerEnter={replay} onClick={replay} className="bg-[#07080a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,237,227,0.05),transparent_65%)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5">
        <div className="flex w-full max-w-[280px] items-center justify-between lab-mono text-[9px] text-white/40">
          <span>departures</span>
          <span>04:04</span>
        </div>

        <div className="flex items-start gap-2">
          {chars.map((c, i) => (
            <div
              key={i}
              className="relative grid h-[84px] w-[60px] place-items-center overflow-hidden rounded-[3px] border border-line-2 bg-ink-850 [perspective:260px]"
            >
              <motion.span
                key={`${c}-${i}`}
                initial={reduce ? false : { rotateX: -86, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="display text-[52px] leading-none text-fg"
              >
                {c}
              </motion.span>
              <span className="absolute inset-x-0 top-1/2 h-px bg-ink-950" />
              <span className="absolute left-[3px] top-1/2 size-1 -translate-y-1/2 rounded-full bg-ink-950" />
              <span className="absolute right-[3px] top-1/2 size-1 -translate-y-1/2 rounded-full bg-ink-950" />
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]" />
            </div>
          ))}
        </div>

        <div className="mt-1 flex w-full max-w-[280px] flex-col gap-1.5 lab-mono text-[9px] text-white/40">
          <span className="flex items-baseline gap-2">
            <span className="text-white/60">nowhere</span>
            <span className="h-px flex-1 bg-[repeating-linear-gradient(to_right,rgba(242,237,227,0.18)_0_2px,transparent_2px_6px)]" />
            <span className="text-amber/70">on time</span>
          </span>
          <span className="flex items-baseline gap-2">
            <span className="text-white/60">gate 404</span>
            <span className="h-px flex-1 bg-[repeating-linear-gradient(to_right,rgba(242,237,227,0.18)_0_2px,transparent_2px_6px)]" />
            <span>boarding</span>
          </span>
        </div>
      </div>

      <Caption label="404 / ticker" />
      <Foot method="split-flap · 92ms" />
    </Screen>
  );
}
