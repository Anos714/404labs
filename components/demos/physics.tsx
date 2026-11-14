"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Caption, clamp, Foot, Plate, Screen } from "./chrome";

/* --------------------------------- magnetic -------------------------------- */

function MagDigit({
  px,
  py,
  k,
  children,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  k: number;
  children: React.ReactNode;
}) {
  const x = useTransform(px, (v) => v * k);
  const y = useTransform(py, (v) => v * k * 0.55);
  const rotate = useTransform(px, (v) => v * k * 0.06);
  return (
    <motion.span
      style={{ x, y, rotate }}
      className="display inline-block text-[70px] leading-none text-fg"
    >
      {children}
    </motion.span>
  );
}

export function MagnetDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useSpring(0, { stiffness: 180, damping: 18 });
  const py = useSpring(0, { stiffness: 180, damping: 18 });

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set(clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1));
    py.set(clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1));
  }

  function reset() {
    px.set(0);
    py.set(0);
  }

  return (
    <Screen
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      className="bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,237,227,0.06),transparent_66%)]" />
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute rounded-full border border-dashed border-white/10"
            style={{ width: 170 + i * 70, height: 120 + i * 54 }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center gap-1">
        <MagDigit px={px} py={py} k={15}>
          4
        </MagDigit>
        <MagDigit px={px} py={py} k={24}>
          0
        </MagDigit>
        <MagDigit px={px} py={py} k={15}>
          4
        </MagDigit>
      </div>

      <div className="absolute inset-x-0 bottom-11 text-center lab-mono text-[10px] text-white/45">
        the number leans toward you
      </div>

      <Caption label="404 / magnet" />
      <Foot method="spring · pointer" />
    </Screen>
  );
}

/* ----------------------------------- drag ---------------------------------- */

export function DragDemo() {
  const [moved, setMoved] = useState(false);
  const reduce = useReducedMotion();

  return (
    <Screen className="bg-[#07080a]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,237,227,0.04)_0_1px,transparent_1px_26px),linear-gradient(0deg,rgba(242,237,227,0.04)_0_1px,transparent_1px_26px)]" />

      <div className="absolute inset-0 grid place-items-center">
        <div className="relative">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[112px] w-[186px] -translate-x-1/2 -translate-y-1/2 rounded-[4px] border border-dashed border-white/20">
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 lab-mono text-[8.5px] text-white/35">
              origin
            </span>
          </div>

          <motion.div
            drag={!reduce}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.75}
            dragMomentum={false}
            onDragStart={() => setMoved(true)}
            whileDrag={{ scale: 1.04 }}
            className="relative cursor-grab active:cursor-grabbing"
          >
            <span className="display block text-[64px] leading-none text-fg">
              404
            </span>
            <span className="absolute -right-2 -top-2 size-1.5 rounded-full bg-amber" />
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-11 text-center lab-mono text-[10px] text-white/45">
        {moved ? "let go, it knows the way back" : "drag me off the map"}
      </div>

      <Caption label="404 / drag" />
      <Foot method="drag · elastic" />
    </Screen>
  );
}

/* --------------------------------- rubber ---------------------------------- */

const GRID =
  "bg-[linear-gradient(90deg,rgba(242,237,227,0.05)_0_1px,transparent_1px_22px),linear-gradient(0deg,rgba(242,237,227,0.05)_0_1px,transparent_1px_22px)]";

export function RubberDemo() {
  const [pull, setPull] = useState(false);
  const origin = useRef({ x: 0, y: 0 });
  const reduce = useReducedMotion();
  const sx = useSpring(1, { stiffness: 320, damping: 16 });
  const sy = useSpring(1, { stiffness: 320, damping: 16 });

  function down(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    setPull(true);
    origin.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (!pull || reduce) return;
    const dx = e.clientX - origin.current.x;
    const dy = e.clientY - origin.current.y;
    sx.set(clamp(1 + dx * 0.0028, 0.55, 1.55));
    sy.set(clamp(1 - dy * 0.0024, 0.55, 1.55));
  }

  function up() {
    setPull(false);
    sx.set(1);
    sy.set(1);
  }

  return (
    <Screen
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onPointerLeave={up}
      className={`${GRID} touch-none select-none`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(8,9,10,0.6)_100%)]" />

      <div className="absolute inset-0 grid place-items-center">
        <motion.span
          style={{ scaleX: sx, scaleY: sy }}
          className="display block text-[68px] leading-none text-fg"
        >
          404
        </motion.span>
      </div>

      <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 flex-col gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="h-px w-4 bg-white/20" />
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-9 right-4 lab-mono text-[9.5px] text-white/40">
        0.40 MPa
      </div>

      <Caption label="404 / rubber" />
      <Foot method="press + pull" />
    </Screen>
  );
}

/* --------------------------------- domino ---------------------------------- */

type Block = { w: number; h: number; digit?: string };

const BLOCKS: Block[] = [
  { w: 6, h: 40 },
  { w: 6, h: 46 },
  { w: 6, h: 42 },
  { w: 6, h: 50 },
  { w: 6, h: 44 },
  { w: 6, h: 48 },
  { w: 44, h: 74, digit: "4" },
  { w: 44, h: 74, digit: "0" },
  { w: 44, h: 74, digit: "4" },
];

export function DominoDemo() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <Screen
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      className="bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_35%,rgba(242,237,227,0.07),transparent_65%)]" />

      <div className="absolute inset-x-0 bottom-[24%] top-[14%] flex items-end justify-center">
        <div className="flex items-end gap-[7px]">
          {BLOCKS.map((b, i) => (
            <motion.div
              key={i}
              className={`relative shrink-0 rounded-[2px] ${
                b.digit ? "bg-fg/90" : "bg-fg/55"
              }`}
              style={{
                width: b.w,
                height: b.h,
                transformOrigin: "bottom left",
              }}
              animate={{
                rotate: open && !reduce ? 74 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 18,
                delay: open ? i * 0.055 : 0,
              }}
            >
              {b.digit && (
                <span className="absolute inset-0 grid place-items-center lab-mono text-[26px] font-medium text-ink-950">
                  {b.digit}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-6 bottom-[24%] h-px bg-white/15" />
      <div className="pointer-events-none absolute inset-x-0 bottom-11 text-center lab-mono text-[10px] text-white/45">
        one small push
      </div>

      <Caption label="404 / domino" />
      <Foot method="chain · 55ms" />
    </Screen>
  );
}

/* ----------------------------------- door ---------------------------------- */

export function DoorDemo() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  const door =
    "absolute inset-0 [backface-visibility:hidden] will-change-transform";

  return (
    <Screen
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      className="bg-ink-950 [perspective:1200px]"
    >
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center gap-1.5">
          <span className="lab-mono text-[10px] text-white/40">no further</span>
          <span className="lab-mono text-[13px] text-amber/70">×</span>
        </div>
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-[linear-gradient(180deg,transparent,rgba(233,184,113,0.55),transparent)]"
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      <motion.div
        className={door}
        style={{ clipPath: "inset(0 50% 0 0)", transformOrigin: "left center" }}
        animate={{ rotateY: open && !reduce ? -104 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 19 }}
      >
        <Plate src="/worlds/w-dusk-light.webp" className="brightness-[0.8]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.35)_0%,rgba(8,9,10,0.1)_45%,rgba(8,9,10,0.88)_100%)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span className="display text-[64px] leading-none text-fg drop-shadow-[0_3px_12px_rgba(8,9,10,0.7)]">
            404
          </span>
          <span className="lab-mono text-[10px] text-white/75">
            the door was never here
          </span>
        </div>
      </motion.div>

      <motion.div
        className={door}
        style={{ clipPath: "inset(0 0 0 50%)", transformOrigin: "right center" }}
        animate={{ rotateY: open && !reduce ? 104 : 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 19 }}
      >
        <Plate src="/worlds/w-dusk-light.webp" className="brightness-[0.8]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.35)_0%,rgba(8,9,10,0.1)_45%,rgba(8,9,10,0.88)_100%)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span className="display text-[64px] leading-none text-fg drop-shadow-[0_3px_12px_rgba(8,9,10,0.7)]">
            404
          </span>
          <span className="lab-mono text-[10px] text-white/75">
            the door was never here
          </span>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-4 z-10 border border-white/10">
        <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40" />
      </div>

      <Caption label="404 / door" />
      <Foot method="rotateY · 104°" />
    </Screen>
  );
}

/* ----------------------------------- trail --------------------------------- */

const DOTS = 14;

function TrailDot({
  tx,
  ty,
  i,
}: {
  tx: MotionValue<number>;
  ty: MotionValue<number>;
  i: number;
}) {
  const x = useSpring(tx, { stiffness: 420 - i * 24, damping: 28 });
  const y = useSpring(ty, { stiffness: 420 - i * 24, damping: 28 });
  const size = i === 0 ? 16 : Math.max(3, 7 - i * 0.32);
  return (
    <motion.span
      aria-hidden
      style={{
        x,
        y,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      className={`absolute left-0 top-0 grid place-items-center rounded-full ${
        i === 0
          ? "border border-amber/70 text-[9px] text-amber/90"
          : "bg-fg/70"
      }`}
    >
      {i === 0 ? "×" : null}
    </motion.span>
  );
}

export function TrailDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  const rest = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    rest.current = { x: r.width / 2, y: r.height * 0.56 };
    tx.set(rest.current.x);
    ty.set(rest.current.y);
    setReady(true);
  }, [tx, ty]);

  function move(e: React.PointerEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    tx.set(e.clientX - r.left);
    ty.set(e.clientY - r.top);
  }

  function leave() {
    setActive(false);
    tx.set(rest.current.x);
    ty.set(rest.current.y);
  }

  return (
    <Screen
      ref={ref}
      onPointerEnter={() => setActive(true)}
      onPointerMove={move}
      onPointerLeave={leave}
      className="bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(242,237,227,0.05),transparent_65%)]" />

      <div className="absolute inset-x-0 bottom-[22%] flex items-center justify-center gap-2">
        <span className="h-px w-16 bg-[repeating-linear-gradient(to_right,rgba(242,237,227,0.3)_0_3px,transparent_3px_8px)]" />
        <span className="lab-mono text-[9px] text-amber/70">×</span>
        <span className="h-px w-16 bg-[repeating-linear-gradient(to_right,rgba(242,237,227,0.3)_0_3px,transparent_3px_8px)]" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative grid place-items-center">
          <span
            aria-hidden
            className="absolute h-[128px] w-[236px] rounded-[50%] border border-dashed border-white/10"
          />
          <span
            aria-hidden
            className="absolute left-1/2 top-0 size-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/50"
          />
          <span
            aria-hidden
            className="absolute bottom-0 left-1/2 size-[3px] -translate-x-1/2 translate-y-1/2 rounded-full bg-white/25"
          />
          <span className="display text-[68px] leading-none text-fg/90">404</span>
        </div>
      </div>

      {ready && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {Array.from({ length: DOTS }).map((_, i) => (
            <TrailDot key={i} tx={tx} ty={ty} i={i} />
          ))}
        </motion.div>
      )}

      <div className="pointer-events-none absolute bottom-11 left-4 lab-mono text-[9.5px] text-white/40">
        move, then let go
      </div>

      <Caption label="404 / trail" />
      <Foot method="trail · spring" />
    </Screen>
  );
}
