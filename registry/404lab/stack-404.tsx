"use client";

// stack-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Caption, Foot, Screen } from "./chrome";

/* ---------------------------------- stack ---------------------------------- */

const LAYERS = [0, 1, 2, 3, 4];

export function StackDemo() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <Screen
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      className="bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,237,227,0.05),transparent_65%)]" />
      <div className="absolute inset-0 [perspective:720px]">
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
          animate={
            open || reduce
              ? { rotateX: 0, rotateY: 0 }
              : { rotateX: 2, rotateY: -8 }
          }
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            {LAYERS.map((i) => (
              <motion.span
                key={i}
                aria-hidden={i > 0}
                className="display absolute text-[66px] leading-none text-fg"
                animate={
                  open || reduce
                    ? { z: 0, opacity: 1 }
                    : { z: -i * 18, opacity: 1 - i * 0.06 }
                }
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 20,
                  delay: i * 0.02,
                }}
              >
                404
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute left-4 top-1/2 flex -translate-y-1/2 flex-col gap-1.5">
        {LAYERS.map((i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="h-px w-3 bg-white/25" />
            <span className="lab-mono text-[8px] text-white/35">
              {String(i).padStart(2, "0")}
            </span>
          </span>
        ))}
      </div>

      <Caption label="404 / stack" />
      <Foot method="5 layers · z" />
    </Screen>
  );
}
