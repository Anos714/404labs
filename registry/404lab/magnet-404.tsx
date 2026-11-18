"use client";

// magnet-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Caption, Foot, Screen, clamp } from "./chrome";

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
