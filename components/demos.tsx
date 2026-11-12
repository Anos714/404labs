"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useInView,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Copy, Check } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------------------------- shared --------------------------------- */

function Caption({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`pointer-events-none absolute left-4 top-3 z-20 font-mono text-[10px] tracking-[0.02em] text-white/75 [text-shadow:0_1px_3px_rgba(8,9,10,0.6)] ${className}`}
    >
      {label}
    </span>
  );
}

function HomeLink({ label = "back home" }: { label?: string }) {
  return (
    <span className="pointer-events-none inline-flex items-center gap-1 font-mono text-[10px] text-white/70">
      {label}
      <ArrowUpRight className="size-3" strokeWidth={1.5} />
    </span>
  );
}

/* ---------------------------------- glitch --------------------------------- */

export function GlitchDemo() {
  const [run, setRun] = useState(false);
  const reduce = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function fire() {
    if (reduce) return;
    setRun(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setRun(true);
      timer.current = setTimeout(() => setRun(false), 460);
    }, 20);
  }

  return (
    <button
      type="button"
      onMouseEnter={fire}
      onClick={fire}
      onFocus={fire}
      aria-label="Replay the glitch 404 demo"
      className="group relative block h-full w-full cursor-default overflow-hidden bg-ink-900 text-left"
    >
      <Image
        src="/worlds/px1.webp"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-85"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.3)_0%,rgba(8,9,10,0.62)_45%,rgba(8,9,10,0.94)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,9,10,0.55)_0%,transparent_68%)]" />
      <Caption label="404 / glitch" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 pt-4">
        <div
          className="glitch-digits display text-[76px] leading-none text-fg"
          data-run={run}
        >
          404
          <span aria-hidden>404</span>
          <span aria-hidden>404</span>
        </div>
        <p className="font-mono text-[10px] text-white/60">
          this path was never built
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-4 pb-3">
        <HomeLink />
        <span className="font-mono text-[10px] text-white/35">0.4kb</span>
      </div>
    </button>
  );
}

/* --------------------------------- gravity -------------------------------- */

export function GravityDemo() {
  const [drop, setDrop] = useState(0);
  const reduce = useReducedMotion();

  function fire() {
    if (reduce) return;
    setDrop((n) => n + 1);
  }

  return (
    <button
      type="button"
      onMouseEnter={fire}
      onClick={fire}
      onFocus={fire}
      aria-label="Replay the gravity 404 demo"
      className="group relative block h-full w-full cursor-default overflow-hidden bg-ink-900 text-left"
    >
      <Image
        src="/worlds/px3.webp"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.15)_0%,rgba(8,9,10,0.35)_50%,rgba(8,9,10,0.9)_100%)]" />
      <Caption label="404 / gravity" />

      <div className="absolute inset-x-0 bottom-10 z-10 flex items-end justify-center gap-1">
        {["4", "0", "4"].map((d, i) => (
          <motion.span
            key={`${drop}-${i}`}
            initial={reduce ? false : { y: -170, rotate: i === 1 ? 10 : -6, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              bounce: 0.32,
              duration: 1.15,
              delay: i * 0.07,
            }}
            className="display text-[72px] leading-[0.8] text-fg"
            style={{ textShadow: "0 2px 18px rgba(8,9,10,0.55)" }}
          >
            {d}
          </motion.span>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-4 pb-3">
        <HomeLink />
        <span className="font-mono text-[10px] text-white/35">spring</span>
      </div>
    </button>
  );
}

/* --------------------------------- terminal -------------------------------- */

const TERM_LINE = "not found. this route is not on the map.";

export function TerminalDemo() {
  const [typed, setTyped] = useState(0);
  const reduce = useReducedMotion();
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const seen = useInView(ref, { once: true, margin: "-30px" });

  useEffect(() => {
    if (seen) setStarted(true);
  }, [seen]);

  useEffect(() => {
    if (!started) return;
    if (reduce) {
      setTyped(TERM_LINE.length);
      return;
    }
    if (typed >= TERM_LINE.length) return;
    const t = setTimeout(() => setTyped((n) => n + 2), 34);
    return () => clearTimeout(t);
  }, [started, typed, reduce]);

  return (
    <button
      ref={ref}
      type="button"
      onMouseEnter={() => {
        setTyped(0);
        setStarted(true);
      }}
      onClick={() => {
        setTyped(0);
        setStarted(true);
      }}
      onFocus={() => setStarted(true)}
      aria-label="Replay the terminal 404 demo"
      className="group relative block h-full w-full cursor-default overflow-hidden bg-ink-900 text-left"
    >
      <Image
        src="/worlds/px5.webp"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover opacity-45 grayscale-[0.35]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.55)_0%,rgba(8,9,10,0.75)_100%)]" />
      <Caption label="404 / terminal" />

      <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-5">
        <div className="rounded-[6px] border border-white/10 bg-[#08090a]/80 p-3 backdrop-blur-[2px]">
          <p className="font-mono text-[10px] leading-5 text-white/45">
            <span className="text-amber/80">$</span> cd /pricing
          </p>
          <p className="font-mono text-[10px] leading-5 text-white/80">
            <span className="text-amber/80">&gt;</span>{" "}
            {TERM_LINE.slice(0, typed)}
            <span className="caret ml-0.5 inline-block h-3 w-1 translate-y-0.5 bg-fg/80" />
          </p>
          <p className="mt-2 font-mono text-[10px] leading-5 text-white/30">
            exit 404 · layers 0
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-4 pb-3">
        <HomeLink label="cd ~" />
        <span className="font-mono text-[10px] text-white/35">12 lines</span>
      </div>
    </button>
  );
}

/* -------------------------------- spotlight -------------------------------- */

export function SpotlightDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [ready, setReady] = useState(false);

  const mask = useMotionTemplate`radial-gradient(150px circle at ${x}px ${y}px, #000 25%, transparent 78%)`;

  function move(e: React.PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    if (!ready) setReady(true);
  }

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={() => setReady(false)}
      className="group relative h-full w-full overflow-hidden bg-ink-900"
    >
      <div className="absolute inset-0">
        <Image
          src="/worlds/in3.webp"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover brightness-[0.22]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="display text-[76px] leading-none text-white/30">404</span>
          <span className="font-mono text-[10px] text-white/30">
            nothing here either
          </span>
        </div>
      </div>

      <motion.div
        className="absolute inset-0"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
          opacity: ready ? 1 : 0,
        }}
      >
        <Image
          src="/worlds/in3.webp"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover brightness-100"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="display text-[76px] leading-none text-fg">404</span>
          <span className="font-mono text-[10px] text-white/70">
            nothing here either
          </span>
        </div>
      </motion.div>

      <Caption label="404 / spotlight" />
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-4 pb-3">
        <HomeLink />
        <span className="font-mono text-[10px] text-white/35">move to look</span>
      </div>
    </div>
  );
}

/* ---------------------------------- orbit ---------------------------------- */

export function OrbitDemo() {
  const reduce = useReducedMotion();

  return (
    <div className="group relative h-full w-full overflow-hidden bg-ink-900">
      <Image
        src="/worlds/px6.webp"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.2)_0%,rgba(8,9,10,0.55)_60%,rgba(8,9,10,0.92)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,9,10,0.45)_0%,transparent_70%)]" />
      <Caption label="404 / orbit" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
        <div className="flex items-baseline">
          <span className="display text-[72px] leading-none text-fg">4</span>
          <span className="relative inline-block">
            <span className="display relative z-10 text-[72px] leading-none text-fg">
              0
            </span>
            <motion.span
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[74px] w-[104px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-amber/45"
              style={{ rotate: -18 }}
              animate={reduce ? undefined : { rotate: [-18, 342] }}
              transition={{ duration: 22, ease: "linear", repeat: Infinity }}
            >
              <span className="absolute -top-[3px] left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-amber" />
            </motion.span>
          </span>
          <span className="display text-[72px] leading-none text-fg">4</span>
        </div>
        <p className="font-mono text-[10px] text-white/60">you have left the map</p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-4 pb-3">
        <HomeLink />
        <span className="font-mono text-[10px] text-white/35">22s loop</span>
      </div>
    </div>
  );
}

/* ----------------------------------- tear ---------------------------------- */

const TEAR_TOP =
  "polygon(0 0, 100% 0, 100% 46%, 92% 51%, 85% 47%, 78% 53%, 70% 48%, 62% 52%, 54% 47%, 46% 52%, 38% 48%, 30% 53%, 22% 47%, 14% 52%, 7% 48%, 0 51%)";
const TEAR_BOTTOM =
  "polygon(0 51%, 7% 48%, 14% 52%, 22% 47%, 30% 53%, 38% 48%, 46% 52%, 54% 47%, 62% 52%, 70% 48%, 78% 53%, 85% 47%, 92% 51%, 100% 46%, 100% 100%, 0 100%)";

function TearHalf({ clip }: { clip: string }) {
  return (
    <div className="absolute inset-0" style={{ clipPath: clip }}>
      <Image
        src="/worlds/px2.webp"
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover brightness-[0.9]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.35)_0%,rgba(8,9,10,0.15)_50%,rgba(8,9,10,0.75)_100%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span className="display text-[72px] leading-none text-fg drop-shadow-[0_2px_10px_rgba(8,9,10,0.6)]">
          404
        </span>
        <span className="font-mono text-[10px] text-white/70">
          this page was torn out
        </span>
      </div>
    </div>
  );
}

export function TearDemo() {
  return (
    <div className="group relative h-full w-full overflow-hidden bg-ink-950">
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:-translate-y-[7px]">
        <TearHalf clip={TEAR_TOP} />
      </div>
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:translate-y-[7px]">
        <TearHalf clip={TEAR_BOTTOM} />
      </div>

      <Caption label="404 / tear" />
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-4 pb-3">
        <HomeLink />
        <span className="font-mono text-[10px] text-white/35">clip-path</span>
      </div>
    </div>
  );
}

/* ----------------------------------- parts --------------------------------- */

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

  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  return (
    <span
      onMouseEnter={run}
      onClick={run}
      className="cursor-default font-mono text-[13px] text-fg/80"
    >
      {out}
    </span>
  );
}

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
      className="flex cursor-default items-center gap-1 font-mono text-[13px] text-fg/80"
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

export function MagneticButton() {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 22 });
  const y = useSpring(my, { stiffness: 260, damping: 22 });

  return (
    <motion.button
      ref={ref}
      type="button"
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(Math.max(-7, Math.min(7, (e.clientX - (r.left + r.width / 2)) * 0.18)));
        my.set(Math.max(-5, Math.min(5, (e.clientY - (r.top + r.height / 2)) * 0.22)));
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="rounded-[6px] border border-line-2 bg-ink-850 px-3 py-1.5 font-mono text-[11px] text-fg/85 transition-colors duration-200 hover:border-fg/25"
    >
      take me home
    </motion.button>
  );
}

export function ElasticArrow() {
  return (
    <span className="group/arrow inline-flex items-center gap-2 font-mono text-[11px] text-fg/70">
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

export function TypeLine() {
  const text = "you took a wrong turn";
  const [n, setN] = useState(0);
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!on) return;
    if (reduce) {
      setN(text.length);
      return;
    }
    if (n >= text.length) return;
    const t = setTimeout(() => setN((v) => v + 1), 46);
    return () => clearTimeout(t);
  }, [on, n, reduce, text.length]);

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
      className="cursor-default font-mono text-[11px] text-fg/70"
    >
      {text.slice(0, n) || "tap to type"}
      <span className="caret ml-0.5 inline-block h-3 w-[3px] translate-y-0.5 bg-amber/80" />
    </span>
  );
}

/* ------------------------------- copy command ------------------------------ */

export function CopyCommand({
  command,
  className = "",
}: {
  command: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      setDone(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${command}`}
      className={`group/copy flex w-full items-center justify-between gap-4 rounded-[6px] border border-line bg-ink-900 px-3 py-2.5 text-left transition-colors duration-200 hover:border-line-2 ${className}`}
    >
      <code className="truncate font-mono text-[10.5px] text-fg-2 sm:text-[12px]">
        <span className="mr-1.5 text-amber/80">$</span>
        {command}
      </code>
      <span className="shrink-0 text-fg-3 transition-colors duration-200 group-hover/copy:text-fg">
        {done ? (
          <Check className="size-3.5" strokeWidth={1.5} />
        ) : (
          <Copy className="size-3.5" strokeWidth={1.5} />
        )}
      </span>
    </button>
  );
}

/* ---------------------------------- reveal --------------------------------- */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
