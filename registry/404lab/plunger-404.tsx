"use client";

// plunger-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Caption, Foot, Screen, clamp } from "./chrome";

/* --------------------------------- plunger --------------------------------- */

export function PlungerDemo() {
  const reduce = useReducedMotion();
  const [pull, setPull] = useState(0);
  const [launch, setLaunch] = useState(false);
  const dragging = useRef<{ y: number } | null>(null);

  function down(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    dragging.current = { y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    setPull(clamp(e.clientY - dragging.current.y, 0, 62));
  }

  function up() {
    if (!dragging.current) return;
    dragging.current = null;
    if (pull > 16) setLaunch(true);
    setPull(0);
  }

  return (
    <Screen
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      className="touch-none select-none bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(242,237,227,0.055),transparent_66%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,237,227,0.035)_0_1px,transparent_1px_24px),linear-gradient(0deg,rgba(242,237,227,0.035)_0_1px,transparent_1px_24px)]" />

      <div className="absolute inset-x-[32%] top-[10%] h-[64%] border-x border-white/10">
        <div className="absolute inset-y-0 left-[18%] w-px bg-white/[0.05]" />
        <div className="absolute inset-y-0 right-[18%] w-px bg-white/[0.05]" />
      </div>

      {[
        { left: "39%", top: "21%", size: 22 },
        { left: "61%", top: "32%", size: 17 },
      ].map((b) => (
        <motion.span
          key={b.left}
          aria-hidden
          className="absolute z-10 rounded-full border border-amber/50 bg-[radial-gradient(circle_at_35%_30%,rgba(233,184,113,0.3),rgba(8,9,10,0.9))]"
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            marginLeft: -b.size / 2,
            marginTop: -b.size / 2,
          }}
          animate={launch ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, delay: 0.18 }}
        />
      ))}

      <div className="absolute left-4 top-9 lab-mono text-[8.5px] leading-relaxed text-white/40">
        <p>BALL 404</p>
        <p className="text-amber/70">{launch ? "IN PLAY" : "READY"}</p>
      </div>
      <div className="absolute right-4 top-9 lab-mono text-[8.5px] text-white/35">
        TILT
      </div>

      <motion.div
        aria-hidden
        className="absolute z-20 grid size-[6.75cqw] place-items-center rounded-full border border-white/40 bg-[radial-gradient(circle_at_35%_28%,#8b8f94,#2a2f34_58%,#121519)] shadow-[0_3px_10px_rgba(0,0,0,0.6)]"
        style={{
          left: "50%",
          marginLeft: "-3.375cqw",
          marginTop: "-3.375cqw",
        }}
        animate={
          launch
            ? {
                top: ["72%", "22%", "48%", "22%", "64%", "72%"],
                left: ["50%", "43%", "57%", "50%", "47%", "50%"],
                rotate: [0, -18, 14, -10, 5, 0],
              }
            : { top: "72%" }
        }
        transition={
          launch
            ? {
                duration: 1.45,
                times: [0, 0.28, 0.46, 0.62, 0.86, 1],
                ease: "easeOut",
              }
            : { duration: 0 }
        }
        onAnimationComplete={() => {
          if (launch) setLaunch(false);
        }}
      >
        <span className="lab-mono text-[6px] tracking-[-0.02em] text-fg/70">
          404
        </span>
      </motion.div>

      <div className="absolute inset-x-0 bottom-[9%] flex flex-col items-center gap-1">
        <div className="h-[7px] w-[74px] rounded-[2px] bg-[linear-gradient(180deg,#3a4045,#1b1f23)]" />
        <div
          className="h-6 w-3 rounded-b-[2px] bg-[linear-gradient(180deg,#555b61,#24292e)] shadow-[0_6px_10px_rgba(0,0,0,0.4)] transition-transform duration-150"
          style={{ transform: `translateY(${pull}px)` }}
        />
        <span className="lab-mono text-[7.5px] tracking-[0.14em] text-white/30">
          PLUNGER
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[78px] text-center lab-mono text-[9px] text-white/45">
        {launch ? "one bad bounce" : "pull down, let go"}
      </div>

      <Caption label="404 / plunger" />
      <Foot method="plunger · spring" />
    </Screen>
  );
}
