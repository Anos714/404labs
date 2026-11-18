"use client";

// dial-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef, useState } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { Caption, Foot, Screen, clamp } from "./chrome";

/* ----------------------------------- dial ---------------------------------- */

const DIAL = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const STEP = 36;

export function DialDemo() {
  const reduce = useReducedMotion();
  const spring = useSpring(0, { stiffness: 150, damping: 18 });
  const drag = useRef<{ start: number; base: number } | null>(null);
  const [entered, setEntered] = useState("");
  const [note, setNote] = useState("dial 404");

  function enter(digit: string) {
    if (entered.length >= 3) return;
    const next = entered + digit;
    setEntered(next);
    if (next.length === 3) {
      if (next === "404") {
        setNote("no answer. of course.");
      } else {
        setNote("wrong number");
        setTimeout(() => {
          setEntered("");
          setNote("dial 404");
        }, 1200);
      }
    } else {
      setNote("keep going");
    }
  }

  function down(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    drag.current = { start: e.clientX, base: spring.get() };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current || reduce) return;
    spring.set(clamp(drag.current.base + (e.clientX - drag.current.start), -170, 170));
  }

  function up() {
    if (!drag.current) return;
    drag.current = null;
    const angle = spring.get();
    if (Math.abs(angle) > 14) {
      const index = ((Math.round(-angle / STEP) % 10) + 10) % 10;
      enter(DIAL[index]);
    }
    spring.set(0);
  }

  return (
    <Screen
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      className="touch-none select-none bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(242,237,227,0.06),transparent_66%)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3cqw]">
        <div className="relative size-[50cqw] cursor-grab active:cursor-grabbing">
          <span className="absolute inset-0 rounded-full border border-line-2" />
          <span className="absolute inset-[2.2cqw] rounded-full border border-white/[0.045]" />

          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 h-px w-[2cqw] bg-white/15"
              style={{
                transform: `rotate(${i * 9}deg) translateY(-24cqw)`,
                transformOrigin: "0 0",
              }}
            />
          ))}

          <span className="absolute left-1/2 top-0 size-[2cqw] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-amber" />

          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ rotate: spring }}
          >
            {DIAL.map((digit, i) => (
              <div
                key={digit}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${i * STEP}deg) translateY(-17cqw) rotate(${
                    -i * STEP
                  }deg)`,
                }}
              >
                <span className="grid size-[9.5cqw] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line-2 bg-ink-850 lab-mono text-[3cqw] text-fg/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  {digit}
                </span>
              </div>
            ))}
          </motion.div>

          <div className="absolute left-1/2 top-1/2 grid size-[17cqw] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line-2 bg-ink-900 shadow-[0_8px_20px_rgba(0,0,0,0.45)]">
            <div className="flex items-baseline gap-0.5 display text-[7.5cqw] leading-none">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={entered[i] ? "text-fg" : "text-fg/20"}
                >
                  {entered[i] ?? "·"}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-none lab-mono text-[9px] text-white/45">
          {note}
        </div>
      </div>

      <Caption label="404 / dial" />
      <Foot method="drag · 3 stops" />
    </Screen>
  );
}
