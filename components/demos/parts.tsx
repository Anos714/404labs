"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

/* --------------------------------- scramble -------------------------------- */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+-/";

export function ScrambleText() {
  const target = "not found";
  const [out, setOut] = useState(target);
  const reduce = useReducedMotion();
  const raf = useRef<number | null>(null);
  const start = useRef(0);

  function run() {
    if (reduce) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    start.current = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start.current) / 620);
      const solved = Math.floor(p * target.length);
      setOut(
        target
          .split("")
          .map((c, i) =>
            c === " " || i < solved
              ? c
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(""),
      );
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setOut(target);
    };
    raf.current = requestAnimationFrame(tick);
  }

  useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    },
    [],
  );

  return (
    <span
      onMouseEnter={run}
      onClick={run}
      className="cursor-default lab-mono text-[13px] text-fg/80"
    >
      {out}
    </span>
  );
}

/* ---------------------------------- digits --------------------------------- */

export function AnimatedDigits() {
  const [vals, setVals] = useState(["4", "0", "4"]);
  const reduce = useReducedMotion();
  const busy = useRef(false);

  function run() {
    if (reduce || busy.current) return;
    busy.current = true;
    let ticks = 0;
    const id = setInterval(() => {
      ticks += 1;
      setVals([
        String(Math.floor(Math.random() * 10)),
        String(Math.floor(Math.random() * 10)),
        String(Math.floor(Math.random() * 10)),
      ]);
      if (ticks > 9) {
        clearInterval(id);
        setVals(["4", "0", "4"]);
        busy.current = false;
      }
    }, 55);
  }

  return (
    <span
      onMouseEnter={run}
      onClick={run}
      className="flex cursor-default items-center gap-1 lab-mono text-[13px] text-fg/80"
    >
      {vals.map((v, i) => (
        <span
          key={i}
          className="grid h-6 w-5 place-items-center rounded-[4px] border border-line-2 bg-ink-850 tabular-nums"
        >
          {v}
        </span>
      ))}
    </span>
  );
}

/* --------------------------------- magnetic -------------------------------- */

export function MagneticButton() {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      type="button"
      animate={pos}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setPos({
          x: Math.max(-7, Math.min(7, (e.clientX - (r.left + r.width / 2)) * 0.18)),
          y: Math.max(-5, Math.min(5, (e.clientY - (r.top + r.height / 2)) * 0.22)),
        });
      }}
      onPointerLeave={() => setPos({ x: 0, y: 0 })}
      className="rounded-[6px] border border-line-2 bg-ink-850 px-3 py-1.5 lab-mono text-[11px] text-fg/85 transition-colors duration-200 hover:border-fg/25"
    >
      take me home
    </motion.button>
  );
}

/* ---------------------------------- arrow ---------------------------------- */

export function ElasticArrow() {
  return (
    <span className="group/arrow inline-flex items-center gap-2 lab-mono text-[11px] text-fg/70">
      back
      <motion.span
        className="inline-block"
        whileHover={{ scaleX: 1.5, x: 3 }}
        whileTap={{ scaleX: 1.5, x: 3 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
      >
        <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
      </motion.span>
    </span>
  );
}

/* -------------------------------- typewriter ------------------------------- */

export function TypeLine() {
  const text = "you took a wrong turn";
  const [n, setN] = useState(0);
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!on || reduce || n >= text.length) return;
    const t = setTimeout(() => setN((v) => v + 1), 46);
    return () => clearTimeout(t);
  }, [on, n, reduce, text.length]);

  const shownCount = reduce && on ? text.length : n;

  return (
    <span
      onMouseEnter={() => {
        setN(0);
        setOn(true);
      }}
      onClick={() => {
        setN(0);
        setOn(true);
      }}
      className="cursor-default lab-mono text-[11px] text-fg/70"
    >
      {text.slice(0, shownCount) || "hover or tap"}
      <span className="caret ml-0.5 inline-block h-3 w-[3px] translate-y-0.5 bg-amber/80" />
    </span>
  );
}

/* -------------------------------- flip digit ------------------------------- */

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const FLIP_TARGET = "4";

export function FlipDigit() {
  const [ch, setCh] = useState(FLIP_TARGET);
  const reduce = useReducedMotion();
  const busy = useRef(false);

  function run() {
    if (reduce || busy.current) return;
    busy.current = true;
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      if (n > 8) {
        clearInterval(id);
        setCh(FLIP_TARGET);
        busy.current = false;
        return;
      }
      setCh(ALPHA[Math.floor(Math.random() * ALPHA.length)]);
    }, 86);
  }

  return (
    <span
      onMouseEnter={run}
      onClick={run}
      className="relative grid h-9 w-7 cursor-default place-items-center overflow-hidden rounded-[4px] border border-line-2 bg-ink-850 lab-mono text-[15px] text-fg [perspective:200px]"
    >
      <motion.span
        key={ch}
        initial={reduce ? false : { rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        className="tabular-nums"
      >
        {ch}
      </motion.span>
      <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-ink-950" />
    </span>
  );
}

/* -------------------------------- morse lamp ------------------------------- */

const PULSES = [
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0,
  1, 0, 0, 1, 0, 0, 1,
];

export function MorseLamp() {
  const [i, setI] = useState(-1);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (i < 0) return;
    if (reduce || i >= PULSES.length) return;
    const t = setTimeout(() => setI((v) => v + 1), 95);
    return () => clearTimeout(t);
  }, [i, reduce]);

  const lit = i >= 0 && i < PULSES.length && PULSES[i] === 1;

  return (
    <span
      onMouseEnter={() => setI(0)}
      onClick={() => setI(0)}
      className="flex cursor-default items-center gap-2.5"
    >
      <span
        className={`size-2.5 rounded-full transition-[background-color,box-shadow] duration-100 ${
          lit
            ? "bg-amber shadow-[0_0_10px_rgba(233,184,113,0.55)]"
            : "bg-fg/20"
        }`}
      />
      <span className="flex max-w-[84px] items-center gap-[3px] overflow-hidden sm:max-w-none">
        {PULSES.map((p, n) => (
          <span
            key={n}
            className={`block rounded-full transition-colors duration-100 ${
              p === 1 ? "h-[3px] w-[3px]" : "h-[2px] w-1.5"
            } ${i > n ? "bg-fg/60" : "bg-fg/15"}`}
          />
        ))}
      </span>
    </span>
  );
}

/* ---------------------------------- sweep ---------------------------------- */

export function ScanSweep() {
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();

  return (
    <span
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onClick={() => setOn((v) => !v)}
      className="relative inline-block cursor-default overflow-hidden lab-mono text-[11px] text-fg/45"
    >
      <span className="relative z-10">not found</span>
      <motion.span
        className="absolute inset-y-0 left-0 z-20 overflow-hidden whitespace-nowrap lab-mono text-[11px] text-fg/85"
        animate={{ width: on || reduce ? "100%" : "0%" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        not found
        <span className="absolute right-0 top-0 h-full w-px bg-amber/80" />
      </motion.span>
    </span>
  );
}
