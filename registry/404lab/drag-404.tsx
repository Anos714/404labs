"use client";

// drag-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Caption, Foot, Screen } from "./chrome";

/* ----------------------------------- drag ---------------------------------- */

export function DragDemo() {
  const [moved, setMoved] = useState(false);
  const reduce = useReducedMotion();

  return (
    <Screen className="bg-[#07080a]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,237,227,0.04)_0_1px,transparent_1px_26px),linear-gradient(0deg,rgba(242,237,227,0.04)_0_1px,transparent_1px_26px)]" />

      <div className="absolute inset-0 grid place-items-center">
        <div className="relative">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[112px] w-[186px] -translate-x-1/2 -translate-y-1/2 rounded-[4px] border border-dashed border-white/20">
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 lab-mono text-[8.5px] text-white/35">
              origin
            </span>
          </div>

          <motion.div
            drag={!reduce}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.75}
            dragMomentum={false}
            onDragStart={() => setMoved(true)}
            whileDrag={{ scale: 1.04 }}
            className="relative cursor-grab active:cursor-grabbing"
          >
            <span className="display block text-[64px] leading-none text-fg">
              404
            </span>
            <span className="absolute -right-2 -top-2 size-1.5 rounded-full bg-amber" />
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-11 text-center lab-mono text-[10px] text-white/45">
        {moved ? "let go, it knows the way back" : "drag me off the map"}
      </div>

      <Caption label="404 / drag" />
      <Foot method="drag · elastic" />
    </Screen>
  );
}
