"use client";

import { motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Caption, Foot, Plate, Screen, ScreenButton } from "./chrome";

/* ---------------------------------- glitch --------------------------------- */

export function GlitchDemo() {
  const [run, setRun] = useState(false);
  const reduce = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

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
    <ScreenButton
      onMouseEnter={fire}
      onClick={fire}
      onFocus={fire}
      aria-label="Replay the glitch 404 demo"
    >
      <Plate
        src="/worlds/px1.webp"
        className="opacity-70 transition-opacity duration-500 group-hover:opacity-85"
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
        <p className="lab-mono text-[10px] text-white/60">
          this path was never built
        </p>
      </div>

      <Foot method="clip-path" />
    </ScreenButton>
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
    <ScreenButton
      onMouseEnter={fire}
      onClick={fire}
      onFocus={fire}
      aria-label="Replay the gravity 404 demo"
    >
      <Plate src="/worlds/px3.webp" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.15)_0%,rgba(8,9,10,0.35)_50%,rgba(8,9,10,0.9)_100%)]" />
      <Caption label="404 / gravity" />

      <div className="absolute inset-x-0 bottom-16 z-10 flex items-end justify-center gap-1">
        {["4", "0", "4"].map((d, i) => (
          <motion.span
            key={`${drop}-${i}`}
            initial={
              reduce
                ? false
                : { y: -170, rotate: i === 1 ? 10 : -6, opacity: 0 }
            }
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

      <Foot method="spring" />
    </ScreenButton>
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
    <ScreenButton
      ref={ref}
      onMouseEnter={() => {
        setTyped(0);
        setStarted(true);
      }}
      onClick={() => {
        setTyped(0);
        setStarted(true);
      }}
      aria-label="Replay the terminal 404 demo"
    >
      <Plate
        src="/worlds/px5.webp"
        className="opacity-45 grayscale-[0.35]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.55)_0%,rgba(8,9,10,0.75)_100%)]" />
      <Caption label="404 / terminal" />

      <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-5">
        <div className="rounded-[6px] border border-white/10 bg-[#08090a]/80 p-3 backdrop-blur-[2px]">
          <p className="lab-mono text-[10px] leading-5 text-white/45">
            <span className="text-amber/80">$</span> cd /pricing
          </p>
          <p className="lab-mono text-[10px] leading-5 text-white/80">
            <span className="text-amber/80">&gt;</span>{" "}
            {TERM_LINE.slice(0, typed)}
            <span className="caret ml-0.5 inline-block h-3 w-1 translate-y-0.5 bg-fg/80" />
          </p>
          <p className="mt-2 lab-mono text-[10px] leading-5 text-white/45">
            exit 404 · layers 0
          </p>
        </div>
      </div>

      <Foot method="typewriter" label="cd ~" />
    </ScreenButton>
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
    <Screen
      ref={ref}
      onPointerMove={move}
      onPointerLeave={() => setReady(false)}
    >
      <div className="absolute inset-0">
        <Plate src="/worlds/in3.webp" className="brightness-[0.22]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="display text-[76px] leading-none text-white/45">
            404
          </span>
          <span className="lab-mono text-[10px] text-white/45">
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
        <Plate src="/worlds/in3.webp" className="brightness-100" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="display text-[76px] leading-none text-fg">404</span>
          <span className="lab-mono text-[10px] text-white/70">
            nothing here either
          </span>
        </div>
      </motion.div>

      <Caption label="404 / spotlight" />
      <Foot method="move to look" />
    </Screen>
  );
}

/* ---------------------------------- orbit ---------------------------------- */

export function OrbitDemo() {
  const reduce = useReducedMotion();

  return (
    <Screen>
      <Plate src="/worlds/px6.webp" className="opacity-80" />
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
        <p className="lab-mono text-[10px] text-white/60">
          you have left the map
        </p>
      </div>

      <Foot method="22s loop" />
    </Screen>
  );
}

/* ----------------------------------- tear ---------------------------------- */

const TEAR_TOP =
  "polygon(0 0, 100% 0, 100% 48.6%, 92% 51.4%, 85% 48.5%, 78% 52.2%, 70% 49%, 62% 51.6%, 54% 48.8%, 46% 52%, 38% 49.2%, 30% 52.4%, 22% 48.9%, 14% 51.7%, 7% 49%, 0 51.2%)";
const TEAR_BOTTOM =
  "polygon(0 51.2%, 7% 49%, 14% 51.7%, 22% 48.9%, 30% 52.4%, 38% 49.2%, 46% 52%, 54% 48.8%, 62% 51.6%, 70% 49%, 78% 52.2%, 85% 48.5%, 92% 51.4%, 100% 48.6%, 100% 100%, 0 100%)";

const SEAM =
  "0,51.2 7,49 14,51.7 22,48.9 30,52.4 38,49.2 46,52 54,48.8 62,51.6 70,49 78,52.2 85,48.5 92,51.4 100,48.6";

function TearHalf({ clip, caption }: { clip: string; caption?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ clipPath: clip }}>
      <Plate src="/worlds/px2.webp" className="brightness-[0.9]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.35)_0%,rgba(8,9,10,0.15)_50%,rgba(8,9,10,0.75)_100%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span className="display text-[72px] leading-none text-fg drop-shadow-[0_2px_10px_rgba(8,9,10,0.6)]">
          404
        </span>
      </div>
      {caption && (
        <span className="absolute inset-x-0 top-[63%] text-center lab-mono text-[10px] text-white/70">
          this page was torn out
        </span>
      )}
    </div>
  );
}

function TearSeam() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <polyline
        points={SEAM}
        fill="none"
        stroke="rgba(242,237,227,0.36)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function TearDemo() {
  return (
    <Screen className="bg-ink-950">
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:-translate-y-[5px]">
        <TearHalf clip={TEAR_TOP} />
        <TearSeam />
      </div>
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:translate-y-[5px]">
        <TearHalf clip={TEAR_BOTTOM} caption />
        <TearSeam />
      </div>

      <Caption label="404 / tear" />
      <Foot method="clip-path" />
    </Screen>
  );
}
