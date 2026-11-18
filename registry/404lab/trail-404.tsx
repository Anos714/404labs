"use client";

// trail-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "motion/react";
import { Caption, Foot, Screen } from "./chrome";

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
