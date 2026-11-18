"use client";

// holo-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Caption, Foot, Plate, Screen } from "./chrome";

/* ----------------------------------- holo ---------------------------------- */

export function HoloDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });

  return (
    <Screen ref={ref}>
      <Plate
        src="/worlds/w-aurora-rock.webp"
        className="grayscale-[0.55] brightness-[0.5] contrast-[1.15]"
      />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.055)_0_1px,transparent_1px_3px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,9,10,0.2)_0%,rgba(8,9,10,0.75)_100%)]" />

      <motion.div
        className="absolute inset-x-0 top-0 h-14 bg-[linear-gradient(180deg,transparent,rgba(127,209,200,0.10),rgba(242,237,227,0.18),transparent)]"
        animate={inView && !reduce ? { y: ["-60%", "1250%"] } : undefined}
        transition={{ duration: 4.8, ease: "linear", repeat: Infinity }}
      />

      <motion.div
        className="absolute inset-0 z-10 grid place-items-center"
        animate={inView && !reduce ? { x: [0, -1.5, 1, 0] } : undefined}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 2.6,
          ease: "linear",
        }}
      >
        <span className="display relative text-[70px] leading-none text-fg">
          404
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-[3px] text-[#7fd1c8]/35 [clip-path:inset(0_0_54%_0)]"
          >
            404
          </span>
          <span
            aria-hidden
            className="absolute inset-0 translate-x-[3px] text-[#e9b871]/35 [clip-path:inset(46%_0_0_0)]"
          >
            404
          </span>
        </span>
      </motion.div>

      <div className="absolute left-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="block h-px bg-white/20"
            style={{ width: 10 + i * 6 }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute right-4 top-10 z-20 text-right lab-mono text-[9.5px] leading-relaxed text-white/55">
        <p>CH 04</p>
        <p className="text-amber/80">NO CARRIER</p>
      </div>

      <Caption label="404 / holo" />
      <Foot method="scanlines · signal" />
    </Screen>
  );
}
