"use client";

// tilt-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { Caption, Foot, Plate, Screen } from "./chrome";

/* ----------------------------------- tilt ---------------------------------- */

export function TiltDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 140, damping: 16 });
  const ry = useSpring(0, { stiffness: 140, damping: 16 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const sheen = useMotionTemplate`radial-gradient(220px circle at ${gx}% ${gy}%, rgba(242,237,227,0.12), transparent 70%)`;

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(-py * 12);
    ry.set(px * 14);
    gx.set(px * 100 + 50);
    gy.set(py * 100 + 50);
  }

  function reset() {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  }

  return (
    <Screen ref={ref} onPointerMove={move} onPointerLeave={reset}>
      <div className="absolute inset-0 [perspective:900px]">
        <motion.div
          className="absolute inset-0"
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0"
            style={{ transform: "translateZ(-48px) scale(1.14)" }}
          >
            <Plate src="/worlds/w-desert-dusk.webp" className="brightness-[0.85]" />
          </div>
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.25)_0%,rgba(8,9,10,0.1)_45%,rgba(8,9,10,0.88)_100%)]"
            style={{ transform: "translateZ(16px)" }}
          />
          <div
            className="absolute inset-x-0 top-1/2 flex items-center gap-3 px-6"
            style={{ transform: "translateZ(34px)" }}
          >
            <span className="h-px flex-1 bg-[repeating-linear-gradient(to_right,rgba(242,237,227,0.35)_0_4px,transparent_4px_9px)]" />
            <span className="lab-mono text-[9px] text-white/55">×</span>
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ transform: "translateZ(54px)" }}
          >
            <span className="display text-[70px] leading-none text-fg drop-shadow-[0_6px_18px_rgba(8,9,10,0.7)]">
              404
            </span>
            <span className="lab-mono text-[10px] text-white/70">
              flat page, deep field
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: sheen }}
      />

      <Caption label="404 / tilt" />
      <Foot method="perspective · pointer" />
    </Screen>
  );
}
