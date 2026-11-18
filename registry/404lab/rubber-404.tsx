"use client";

// rubber-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef, useState } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { Caption, Foot, Screen, clamp } from "./chrome";

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
