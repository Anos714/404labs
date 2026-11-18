"use client";

// stroke-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { motion, useReducedMotion } from "motion/react";
import { Caption, Foot, Screen, useReplay } from "./chrome";

/* ---------------------------------- stroke --------------------------------- */

export function StrokeDemo() {
  const reduce = useReducedMotion();
  const { run, replay } = useReplay();

  return (
    <Screen onPointerEnter={replay} onClick={replay} className="bg-[#07080a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,237,227,0.06),transparent_70%)]" />
      <div className="absolute inset-0 grid place-items-center">
        <svg viewBox="0 0 320 160" className="w-[88%]">
          <motion.text
            key={run}
            x="160"
            y="122"
            textAnchor="middle"
            fill="#f2ede3"
            stroke="#f2ede3"
            strokeWidth="1.1"
            strokeDasharray="820 820"
            style={{
              fontFamily: "var(--lab-font-display, var(--font-display))",
              fontSize: 118,
              letterSpacing: "-3px",
            }}
            initial={
              reduce
                ? false
                : { strokeDashoffset: 820, fillOpacity: 0, strokeOpacity: 0.75 }
            }
            whileInView={{ strokeDashoffset: 0, fillOpacity: 0.94 }}
            viewport={{ once: true }}
            transition={{
              strokeDashoffset: { duration: 1.7, ease: "easeInOut" },
              fillOpacity: { duration: 0.5, delay: 1.2 },
            }}
          >
            404
          </motion.text>
        </svg>
      </div>

      <div className="absolute inset-x-8 top-[70%] h-px bg-[repeating-linear-gradient(to_right,rgba(242,237,227,0.28)_0_3px,transparent_3px_9px)]" />
      <div className="absolute bottom-9 left-4 lab-mono text-[9.5px] text-white/45">
        drawn, not typed
      </div>

      <Caption label="404 / stroke" />
      <Foot method="svg · stroke draw" />
    </Screen>
  );
}
