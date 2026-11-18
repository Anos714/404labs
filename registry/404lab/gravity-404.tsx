"use client";

// gravity-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Caption, Foot, Plate, ScreenButton } from "./chrome";

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
