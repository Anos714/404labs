"use client";

// spotlight-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { Caption, Foot, Plate, Screen } from "./chrome";

/* -------------------------------- spotlight -------------------------------- */

export function SpotlightDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [ready, setReady] = useState(false);

  const mask = useMotionTemplate`radial-gradient(150px circle at ${x}px ${y}px, #000 25%, transparent 78%)`;

  useEffect(() => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(r.width / 2);
    y.set(r.height / 2);
  }, [x, y]);

  function move(e: React.PointerEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    if (!ready) setReady(true);
  }

  function leave() {
    setReady(false);
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(r.width / 2);
    y.set(r.height / 2);
  }

  return (
    <Screen ref={ref} onPointerMove={move} onPointerLeave={leave}>
      <div className="absolute inset-0">
        <Plate src="/worlds/in3.webp" className="brightness-[0.22]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="display text-[76px] leading-none text-white/55">
            404
          </span>
          <span className="lab-mono text-[10px] text-white/55">
            nothing here either
          </span>
        </div>
      </div>

      <motion.div
        className="absolute inset-0"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
        animate={{ opacity: ready ? 1 : 0.42 }}
        transition={{ duration: 0.35 }}
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
