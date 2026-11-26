"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

export function HeroMascot() {
  const reduce = useReducedMotion();

  return (
    <div className="mx-auto mb-6 flex justify-center">
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.92, y: 6 }}
        animate={
          reduce
            ? { opacity: 1 }
            : {
                opacity: 1,
                scale: 1,
                y: [0, -4, 0],
              }
        }
        transition={
          reduce
            ? undefined
            : {
                opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                y: {
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
        whileHover={reduce ? undefined : { scale: 1.06, rotate: -2 }}
        whileTap={reduce ? undefined : { scale: 0.96 }}
        className="relative size-22 overflow-hidden rounded-[22px] shadow-[0_12px_36px_rgba(233,184,113,0.16)] ring-1 ring-amber/20"
      >
        <Image
          src="/mascot.jpg"
          alt="404lab mascot — amber explorer at a dashed dead end"
          width={256}
          height={256}
          priority
          unoptimized
          className="size-full scale-[1.28] object-cover"
        />
      </motion.div>
    </div>
  );
}
