"use client";

// beacon-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { motion, useReducedMotion } from "motion/react";
import { Caption, Foot, Plate, Screen } from "./chrome";

/* ---------------------------------- beacon --------------------------------- */

export function BeaconDemo() {
  const reduce = useReducedMotion();

  return (
    <Screen className="bg-[#060708]">
      <Plate src="/worlds/w-star-trails.webp" className="brightness-[0.52]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.3)_0%,rgba(8,9,10,0.08)_50%,rgba(8,9,10,0.86)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[34%] bg-[linear-gradient(180deg,transparent,rgba(8,9,10,0.95))]" />

      <div className="absolute bottom-[18%] left-[70%] z-10 h-[74px] w-[22px] -translate-x-1/2">
        <div className="absolute bottom-0 left-1/2 h-full w-[3px] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(242,237,227,0.38),rgba(242,237,227,0.08))]" />
        <div className="absolute bottom-0 left-1/2 h-2 w-7 -translate-x-1/2 rounded-t-[1px] bg-[#0c0e10]" />
        <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber shadow-[0_0_14px_3px_rgba(233,184,113,0.35)]" />
        <motion.div
          aria-hidden
          className="absolute bottom-0 left-1/2 h-[240px] w-[240px] -translate-x-1/2 origin-bottom"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 12, ease: "linear", repeat: Infinity }}
        >
          {[0, 180].map((turn) => (
            <div
              key={turn}
              className="absolute inset-0 opacity-80 mix-blend-screen"
              style={{
                transform: `rotate(${turn}deg)`,
                clipPath: "polygon(50% 100%, 0 0, 24% 0)",
                background:
                  "linear-gradient(180deg,rgba(255,225,177,0.5),rgba(233,184,113,0.06) 78%)",
                filter: "blur(1.5px)",
                transformOrigin: "bottom center",
              }}
            />
          ))}
        </motion.div>
        <span
          aria-hidden
          className="absolute left-1/2 top-0 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/20 blur-md"
        />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5">
        <span className="display text-[72px] leading-none text-fg drop-shadow-[0_2px_16px_rgba(8,9,10,0.8)]">
          404
        </span>
        <span className="lab-mono text-[10px] text-white/65">
          a signal with no receiver
        </span>
      </div>

      <div className="pointer-events-none absolute left-4 top-9 z-20 lab-mono text-[9px] leading-relaxed text-white/45">
        <p>51°30′N</p>
        <p>0°07′W</p>
      </div>
      <div className="pointer-events-none absolute right-4 top-9 z-20 text-right lab-mono text-[9px] leading-relaxed text-white/45">
        <p>BEAM 04</p>
        <p className="text-amber/70">NO ANSWER</p>
      </div>

      <Caption label="404 / beacon" />
      <Foot method="beam · 12s sweep" />
    </Screen>
  );
}
