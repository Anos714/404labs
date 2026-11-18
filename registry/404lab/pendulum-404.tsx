"use client";

// pendulum-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Caption, Foot, Screen } from "./chrome";

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
