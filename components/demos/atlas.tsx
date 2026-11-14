"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { Caption, Foot, Plate, Screen } from "./chrome";

/* ---------------------------------- flood ---------------------------------- */

export function FloodDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });

  return (
    <Screen ref={ref} className="bg-ink-950">
      <Plate
        src="/worlds/w-river-dusk.webp"
        className="brightness-[0.82] transition-[filter] duration-700 group-hover:brightness-[0.68]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.18)_0%,rgba(8,9,10,0.35)_55%,rgba(8,9,10,0.82)_100%)]" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 transition-transform duration-700 ease-out group-hover:translate-y-2">
        <span className="display text-[76px] leading-none text-fg drop-shadow-[0_2px_16px_rgba(8,9,10,0.7)]">
          404
        </span>
        <span className="lab-mono text-[10px] text-white/65">
          the path is under water
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 h-[30%] transition-[height] duration-700 ease-out group-hover:h-[39%]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,42,44,0.72)_0%,rgba(7,16,18,0.94)_65%,#07090a_100%)]" />
        <motion.div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px w-[200%] bg-[repeating-linear-gradient(90deg,rgba(242,237,227,0.42)_0_18px,transparent_18px_46px)]"
          animate={inView && !reduce ? { x: ["0%", "-50%"] } : undefined}
          transition={{ duration: 9, ease: "linear", repeat: Infinity }}
        />
        <div className="absolute inset-x-0 top-[18%] h-px bg-white/10" />
        <div className="absolute inset-x-0 bottom-[26%] h-px bg-white/[0.06]" />

        <div
          aria-hidden
          className="absolute -top-[76px] left-1/2 -translate-x-1/2 scale-y-[-1] opacity-[0.16] blur-[1.5px]"
          style={{
            maskImage:
              "linear-gradient(180deg,transparent 0%,#000 55%,transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg,transparent 0%,#000 55%,transparent 100%)",
          }}
        >
          <span className="display text-[68px] leading-none text-fg">404</span>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-9 right-4 z-30 lab-mono text-[9.5px] text-white/45">
        + 2.40 m
      </div>

      <Caption label="404 / flood" />
      <Foot method="waterline · 2 layers" />
    </Screen>
  );
}

/* ---------------------------------- bloom ---------------------------------- */

export function BloomDemo() {
  return (
    <Screen className="bg-[#07080a]">
      <Plate
        src="/worlds/w-bench-blossom.webp"
        className="brightness-[0.52] saturate-[0.85] transition-[filter] duration-[900ms] group-hover:brightness-[0.8]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.45)_0%,rgba(8,9,10,0.08)_45%,rgba(8,9,10,0.86)_100%)]" />

      <div
        aria-hidden
        className="absolute -right-16 -top-20 size-[290px] rounded-full bg-[radial-gradient(circle,rgba(255,238,206,0.34)_0%,rgba(233,184,113,0.13)_38%,transparent_70%)] blur-xl transition-all duration-[1100ms] ease-out group-hover:-right-8 group-hover:-top-10 group-hover:scale-125 group-hover:opacity-90"
      />
      <div
        aria-hidden
        className="absolute -left-24 bottom-0 size-[220px] rounded-full bg-[radial-gradient(circle,rgba(233,184,113,0.16)_0%,transparent_66%)] blur-2xl transition-opacity duration-700 group-hover:opacity-40"
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
        <span className="display text-[76px] leading-none text-fg transition-[text-shadow] duration-700 group-hover:[text-shadow:0_0_34px_rgba(255,238,206,0.35)]">
          404
        </span>
        <span className="lab-mono text-[10px] text-white/70">
          the frame gave up
        </span>
      </div>

      <div className="pointer-events-none absolute right-4 top-9 z-20 text-right lab-mono text-[9px] leading-relaxed text-white/50">
        <p>f/1.4</p>
        <p className="text-amber/75 group-hover:text-amber">+2 EV</p>
      </div>

      <Caption label="404 / bloom" />
      <Foot method="light leak · +2 EV" />
    </Screen>
  );
}

/* ----------------------------------- ash ----------------------------------- */

const EDGE =
  "0,8 3,3 6,7 9,2 12,8 15,4 18,7 21,1 24,8 27,3 30,7 33,2 36,8 39,4 42,7 45,2 48,8 51,3 54,7 57,1 60,8 63,4 66,7 69,2 72,8 75,3 78,7 81,2 84,8 87,4 90,7 93,2 96,8 100,4";

const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  delay: (i % 7) * 0.36,
  size: 1 + (i % 3),
  drift: (i % 2 === 0 ? 1 : -1) * (5 + (i % 4) * 3),
}));

export function AshDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const reduce = useReducedMotion();

  return (
    <Screen ref={ref} className="bg-[#060707]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(233,184,113,0.08)_0%,transparent_62%)]" />
      <div className="absolute inset-0 grid place-items-center opacity-[0.06]">
        <span className="display text-[76px] leading-none text-fg">404</span>
      </div>

      <div className="absolute inset-0 transition-[clip-path] duration-[900ms] ease-out [clip-path:inset(0_0_29%_0)] group-hover:[clip-path:inset(0_0_50%_0)]">
        <Plate
          src="/worlds/w-bay-burn.webp"
          className="brightness-[0.72] saturate-[0.9]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.2)_0%,rgba(8,9,10,0.12)_45%,rgba(8,9,10,0.72)_100%)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="display text-[76px] leading-none text-fg drop-shadow-[0_2px_14px_rgba(8,9,10,0.6)]">
            404
          </span>
          <span className="lab-mono text-[10px] text-white/70">
            it started at the edge
          </span>
        </div>
      </div>

      <svg
        aria-hidden
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-[29%] z-20 h-3 w-full overflow-visible transition-[bottom] duration-[900ms] ease-out group-hover:bottom-[50%]"
      >
        <polyline
          points={EDGE}
          fill="none"
          stroke="rgba(233,184,113,0.9)"
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={EDGE}
          fill="none"
          stroke="rgba(255,238,206,0.55)"
          strokeWidth={0.6}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="pointer-events-none absolute inset-x-0 bottom-[28%] z-10 h-16 bg-[linear-gradient(0deg,rgba(233,184,113,0.16),transparent)] blur-md transition-[bottom] duration-[900ms] group-hover:bottom-[49%]" />

      {EMBERS.map((e, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute bottom-[31%] z-20 rounded-full bg-amber"
          style={{ left: `${e.left}%`, width: e.size, height: e.size }}
          animate={
            inView && !reduce
              ? {
                  y: [0, -16, -32],
                  x: [0, e.drift, e.drift * 0.4],
                  opacity: [0, 0.85, 0],
                }
              : { opacity: 0.4 }
          }
          transition={{
            duration: 3.2,
            delay: e.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      <div className="pointer-events-none absolute bottom-9 left-4 z-30 lab-mono text-[9.5px] text-white/45">
        412 °C
      </div>

      <Caption label="404 / ash" />
      <Foot method="burn line · clip-path" />
    </Screen>
  );
}

/* ---------------------------------- parcel --------------------------------- */

function Barcode({ className = "" }: { className?: string }) {
  const bars = [1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 1];
  return (
    <div className={`flex h-5 items-stretch gap-[1.5px] ${className}`}>
      {bars.map((w, i) => (
        <span
          key={i}
          className="block bg-current"
          style={{ width: w, opacity: i % 3 === 0 ? 0.9 : 0.55 }}
        />
      ))}
    </div>
  );
}

export function ParcelDemo() {
  return (
    <Screen className="bg-ink-950">
      <Plate
        src="/worlds/w-desert-dusk.webp"
        className="brightness-[0.62] saturate-[0.8] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.5)_0%,rgba(8,9,10,0.3)_55%,rgba(8,9,10,0.8)_100%)]" />

      <div className="absolute inset-y-0 left-[27%] z-20 w-7 -translate-x-1/2 rotate-[1deg] border-x border-[#e8dfcc]/15 bg-[#e8dfcc]/12 backdrop-blur-[1px] transition-transform duration-500 group-hover:-translate-x-[3px] group-hover:rotate-0">
        <div className="h-full w-full bg-[repeating-linear-gradient(45deg,rgba(232,223,204,0.16)_0_2px,transparent_2px_7px)]" />
      </div>
      <div className="absolute inset-x-0 top-[61%] z-20 h-7 -translate-y-1/2 rotate-[-1deg] border-y border-[#e8dfcc]/15 bg-[#e8dfcc]/12 backdrop-blur-[1px] transition-transform duration-500 group-hover:translate-y-[2px] group-hover:rotate-0">
        <div className="h-full w-full bg-[repeating-linear-gradient(45deg,rgba(232,223,204,0.16)_0_2px,transparent_2px_7px)]" />
      </div>

      <div className="absolute left-1/2 top-[60%] z-10 -translate-x-1/2 -translate-y-1/2">
        <span className="display block text-[18.5cqw] leading-none tracking-[0.04em] text-[#eee7d7] drop-shadow-[0_3px_16px_rgba(8,9,10,0.55)]">
          404
        </span>
      </div>

      <div className="absolute left-4 top-10 z-20 w-[44%] -rotate-[3deg] rounded-[1px] bg-[#e9e1cf] px-3 py-2.5 text-[#171310] shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:-rotate-[1deg] group-hover:-translate-y-0.5">
        <div className="flex items-baseline justify-between lab-mono text-[7.5px] leading-none">
          <span className="tracking-[0.14em]">404LAB POST</span>
          <span className="opacity-60">NO. 0004</span>
        </div>
        <div className="my-2 h-px bg-[#171310]/20" />
        <p className="lab-mono text-[8px] leading-[1.7] opacity-80">
          to: unknown recipient
          <br />
          route: not on file
        </p>
        <Barcode className="mt-2 text-[#171310]" />
      </div>

      <div className="absolute bottom-[13%] right-4 z-20 -rotate-[6deg] border-2 border-amber/70 px-[2cqw] py-[1.2cqw] text-right transition-transform duration-500 group-hover:-rotate-[3deg]">
        <p className="lab-mono text-[2.1cqw] leading-[1.5] tracking-[0.16em] text-amber">
          RETURN TO
          <br />
          SENDER
        </p>
      </div>

      <div className="pointer-events-none absolute inset-3 z-20 border border-white/10" />
      <div className="pointer-events-none absolute right-4 top-10 z-20 lab-mono text-[9px] text-white/50">
        04 / 04
      </div>

      <Caption label="404 / parcel" />
      <Foot method="kraft tape · label" />
    </Screen>
  );
}

/* ---------------------------------- window --------------------------------- */

const RAIN = [
  { left: 14, delay: 0, dur: 2.4, len: 22, op: 0.35 },
  { left: 27, delay: 0.9, dur: 3.1, len: 34, op: 0.22 },
  { left: 42, delay: 0.35, dur: 2.7, len: 18, op: 0.4 },
  { left: 58, delay: 1.4, dur: 3.4, len: 28, op: 0.2 },
  { left: 71, delay: 0.55, dur: 2.2, len: 24, op: 0.32 },
  { left: 84, delay: 1.1, dur: 2.9, len: 38, op: 0.26 },
];

export function WindowDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });

  return (
    <Screen ref={ref} className="bg-[#07080a]">
      <Plate src="/worlds/w-night-light.webp" className="brightness-[0.7]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.28)_0%,rgba(8,9,10,0.12)_50%,rgba(8,9,10,0.78)_100%)]" />

      <div className="absolute inset-5 z-10 overflow-hidden border-[7px] border-[#08090a] shadow-[inset_0_0_36px_rgba(8,9,10,0.8)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_20%,rgba(8,9,10,0.45)_100%)]" />
        <div className="absolute inset-x-0 top-1/2 h-[6px] -translate-y-1/2 bg-[#08090a]" />
        <div className="absolute inset-y-0 left-[58%] w-[6px] -translate-x-1/2 bg-[#08090a]" />

        {RAIN.map((r, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute top-0 w-px rounded-full bg-[linear-gradient(180deg,transparent,rgba(242,237,227,0.9),transparent)]"
            style={{ left: `${r.left}%`, height: r.len, opacity: r.op }}
            animate={inView && !reduce ? { y: ["-12%", "520%"] } : undefined}
            transition={{
              duration: r.dur,
              delay: r.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#f4ecd9]"
          animate={
            inView && !reduce
              ? { opacity: [0, 0, 0.16, 0, 0] }
              : { opacity: 0 }
          }
          transition={{
            duration: 7.5,
            times: [0, 0.62, 0.65, 0.69, 1],
            repeat: Infinity,
            repeatDelay: 3.2,
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span className="display text-[70px] leading-none text-fg/85 blur-[0.4px] drop-shadow-[0_2px_12px_rgba(8,9,10,0.7)]">
            404
          </span>
          <span className="lab-mono text-[10px] text-white/55">
            nobody is coming back
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-3 bottom-2 lab-mono text-[8px] text-white/35">
          condensation / 04:04
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-2 left-5 z-20 h-2 w-16 bg-[#08090a]" />
      <div className="pointer-events-none absolute bottom-2 right-5 z-20 h-2 w-16 bg-[#08090a]" />

      <Caption label="404 / window" className="left-6 top-6" />
      <Foot method="rain · condensation" />
    </Screen>
  );
}

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

/* ----------------------------------- dust ---------------------------------- */

const MOTES = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 41 + 7) % 100,
  top: (i * 53 + 19) % 82,
  size: i % 7 === 0 ? 2.5 : 1 + (i % 3) * 0.5,
  delay: (i % 9) * 0.55,
  dur: 8 + (i % 6) * 2,
  drift: (i % 2 === 0 ? 1 : -1) * (4 + (i % 5) * 3),
}));

export function DustDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });
  const [open, setOpen] = useState(false);

  return (
    <Screen
      ref={ref}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      className="bg-[#07080a]"
    >
      <Plate
        src="/worlds/w-dark-range.webp"
        className="brightness-[0.38] blur-[1px]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.35)_0%,rgba(8,9,10,0.15)_50%,rgba(8,9,10,0.9)_100%)]" />
      <div
        aria-hidden
        className="absolute -left-[18%] -top-[30%] h-[150%] w-[70%] rotate-[18deg] bg-[linear-gradient(90deg,transparent,rgba(242,237,227,0.09),transparent)] blur-2xl"
      />

      {MOTES.map((m, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-fg"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            opacity: 0.35,
          }}
          animate={
            inView && !reduce
              ? {
                  y: [0, -14, 4, 0],
                  x: [0, m.drift, m.drift * 0.2, 0],
                  opacity: open ? [0.15, 0.7, 0.1] : [0.2, 0.5, 0.2],
                }
              : undefined
          }
          transition={{
            duration: m.dur,
            delay: m.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
        <span
          className={`display text-[76px] leading-none text-fg transition-all duration-700 ${
            open ? "blur-[2px] opacity-60" : "blur-0 opacity-100"
          }`}
        >
          404
        </span>
        <span className="lab-mono text-[10px] text-white/60">
          the air keeps the shape
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-9 left-4 lab-mono text-[9.5px] text-white/40">
        0.4 µm · still air
      </div>

      <Caption label="404 / dust" />
      <Foot method="motes · drift" />
    </Screen>
  );
}
