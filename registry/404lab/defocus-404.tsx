"use client";

// defocus-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Caption, EASE, Foot, Screen } from "./chrome";

/* --------------------------------- defocus --------------------------------- */

const SLICES = 14;

export function DefocusDemo() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <Screen
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      className="bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,237,227,0.07),transparent_68%)]" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative">
          <motion.span
            aria-hidden
            className="display absolute inset-0 text-[68px] leading-none text-fg blur-[6px]"
            animate={{ opacity: open && !reduce ? 0 : 0.5 }}
            transition={{ duration: 0.45 }}
          >
            404
          </motion.span>

          {Array.from({ length: SLICES }).map((_, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="display absolute inset-0 text-[68px] leading-none text-fg"
              style={{
                clipPath: `inset(${i * (100 / SLICES)}% 0 ${
                  100 - (i + 1) * (100 / SLICES)
                }% 0)`,
              }}
              animate={{
                x: open || reduce ? 0 : (i - (SLICES - 1) / 2) * 2.4,
              }}
              transition={{
                duration: 0.5,
                ease: EASE,
                delay: reduce ? 0 : i * 0.012,
              }}
            >
              404
            </motion.span>
          ))}

          <span className="display text-[68px] leading-none text-transparent">
            404
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-14 flex items-center justify-center gap-1.5">
        {Array.from({ length: 17 }).map((_, i) => (
          <span
            key={i}
            className={`block w-px bg-white/25 ${
              i % 4 === 0 ? "h-2.5" : "h-1.5"
            }`}
          />
        ))}
      </div>
      <div className="absolute bottom-9 left-4 lab-mono text-[9.5px] text-white/45">
        diopter −0.4
      </div>

      <Caption label="404 / defocus" />
      <Foot method="slices · focus" />
    </Screen>
  );
}
