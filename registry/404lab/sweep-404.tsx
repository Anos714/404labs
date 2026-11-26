"use client";

// sweep-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Caption, Foot, Screen } from "./chrome";

/* ---------------------------------- sweep ---------------------------------- */

export function SweepDemo() {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  const active = Boolean(reduce) || on;

  return (
    <Screen
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
      onClick={() => setOn((v) => !v)}
      className="bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,237,227,0.045)_0_1px,transparent_1px_24px)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.2)_0%,rgba(8,9,10,0.65)_100%)]" />

      <div className="absolute inset-0 grid place-items-center">
        <div className="relative">
          <span
            className="display text-[70px] leading-none"
            style={{
              color: "transparent",
              WebkitTextStroke: "1.3px rgba(242,237,227,0.78)",
            }}
          >
            404
          </span>

          <motion.div
            className="absolute inset-y-0 left-0 overflow-hidden"
            animate={{ width: active ? "100%" : "0%" }}
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
          >
            <span className="display absolute left-0 top-0 whitespace-nowrap text-[70px] leading-none text-fg">
              404
            </span>
            <span className="absolute right-0 top-0 h-full w-px bg-amber" />
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-6 top-[74%] flex items-center justify-between lab-mono text-[9px] text-white/40">
        <span>0</span>
        <span>sweep</span>
        <span>100</span>
      </div>

      <Caption label="404 / sweep" />
      <Foot method="mask · wipe" />
    </Screen>
  );
}
