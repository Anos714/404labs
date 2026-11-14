"use client";

import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useRef, useState } from "react";
import { Caption, EASE, Foot, Plate, Screen, useReplay } from "./chrome";

/* ---------------------------------- mosaic --------------------------------- */

const TILES = Array.from({ length: 12 }, (_, i) => ({
  c: i % 4,
  r: Math.floor(i / 4),
}));

export function MosaicDemo() {
  const reduce = useReducedMotion();
  const { run, replay } = useReplay();

  return (
    <Screen onPointerEnter={replay} onClick={replay}>
      {TILES.map(({ c, r }, i) => (
        <motion.div
          key={`${run}-${i}`}
          className="absolute h-1/3 w-1/4"
          style={{
            left: `${c * 25}%`,
            top: `${r * 33.3333}%`,
            backgroundImage: "url(/worlds/w-dark-ridge.webp)",
            backgroundSize: "400% 300%",
            backgroundPosition: `${c * 33.3333}% ${r * 50}%`,
            boxShadow: "inset 0 0 0 1px rgba(8,9,10,0.85)",
          }}
          initial={reduce ? false : { opacity: 0, scale: 0.78 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.55,
            ease: EASE,
            delay: (Math.abs(c - 1.5) + Math.abs(r - 1)) * 0.06,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.35)_0%,rgba(8,9,10,0.05)_40%,rgba(8,9,10,0.85)_100%)]" />
      <Caption label="404 / mosaic" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2">
        <span className="display text-[68px] leading-none text-fg drop-shadow-[0_2px_14px_rgba(8,9,10,0.7)]">
          404
        </span>
        <span className="lab-mono text-[10px] text-white/75">
          assembled from twelve tiles
        </span>
      </div>

      <Foot method="mosaic · 12 tiles" />
    </Screen>
  );
}

/* --------------------------------- shatter --------------------------------- */

const LATTICE: [number, number][][] = [
  [
    [0, 0],
    [31, 0],
    [67, 0],
    [100, 0],
  ],
  [
    [0, 26],
    [28, 31],
    [70, 24],
    [100, 29],
  ],
  [
    [0, 65],
    [33, 59],
    [66, 68],
    [100, 61],
  ],
  [
    [0, 100],
    [30, 100],
    [69, 100],
    [100, 100],
  ],
];

const SHARDS = (() => {
  const out: { clip: string; x: number; y: number; rot: number }[] = [];
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      const p = [
        LATTICE[r][c],
        LATTICE[r][c + 1],
        LATTICE[r + 1][c + 1],
        LATTICE[r + 1][c],
      ];
      out.push({
        clip: `polygon(${p.map(([x, y]) => `${x}% ${y}%`).join(", ")})`,
        x: (c - 1) * 20 + (r - 1) * 3,
        y: (r - 1) * 16,
        rot: (c - 1) * 3 + (r - 1) * 2,
      });
    }
  }
  return out;
})();

export function ShatterDemo() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <Screen
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
    >
      {SHARDS.map((s, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{ clipPath: s.clip }}
          animate={
            open && !reduce ? { x: s.x, y: s.y, rotate: s.rot } : { x: 0, y: 0, rotate: 0 }
          }
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 18,
            delay: i * 0.012,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url(/worlds/w-dark-range.webp)" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.3)_0%,rgba(8,9,10,0.1)_50%,rgba(8,9,10,0.85)_100%)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="display text-[66px] leading-none text-fg drop-shadow-[0_2px_12px_rgba(8,9,10,0.7)]">
              404
            </span>
            <span className="lab-mono text-[10px] text-white/70">
              the page broke apart
            </span>
          </div>
        </motion.div>
      ))}

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(8,9,10,0.55)_100%)]" />
      <Caption label="404 / shatter" />
      <Foot method="9 shards · clip-path" />
    </Screen>
  );
}

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

/* ----------------------------------- fog ----------------------------------- */

export function FogDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px" });

  const drift = (dx: string) =>
    inView && !reduce
      ? {
          x: [dx, `-${dx}`],
          opacity: [0.45, 0.85, 0.45],
        }
      : undefined;

  return (
    <Screen ref={ref}>
      <Plate
        src="/worlds/w-cloud-platform.webp"
        className="scale-105 blur-[1.5px] brightness-[0.62]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.4)_0%,rgba(8,9,10,0.05)_45%,rgba(8,9,10,0.8)_100%)]" />

      <motion.div
        className="absolute -inset-x-1/3 top-[-25%] h-[150%] bg-[radial-gradient(closest-side,rgba(242,237,227,0.16),transparent)] blur-2xl"
        animate={drift("6%")}
        transition={{ duration: 16, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -inset-x-1/2 top-[10%] h-[110%] bg-[radial-gradient(closest-side,rgba(242,237,227,0.12),transparent)] blur-2xl"
        animate={drift("9%")}
        transition={{ duration: 22, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -inset-x-1/3 bottom-[-20%] h-[90%] bg-[radial-gradient(closest-side,rgba(242,237,227,0.1),transparent)] blur-2xl"
        animate={drift("5%")}
        transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
        <span
          className="display text-[70px] leading-none text-fg"
          style={{
            maskImage:
              "linear-gradient(180deg, transparent 0%, #000 28%, #000 72%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, #000 28%, #000 72%, transparent 100%)",
          }}
        >
          404
        </span>
        <span className="lab-mono text-[10px] text-white/70">
          visibility 20 m
        </span>
      </div>

      <Caption label="404 / fog" />
      <Foot method="drift · blur" />
    </Screen>
  );
}

/* ----------------------------------- tilt ---------------------------------- */

export function TiltDemo() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 140, damping: 16 });
  const ry = useSpring(0, { stiffness: 140, damping: 16 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const sheen = useMotionTemplate`radial-gradient(220px circle at ${gx}% ${gy}%, rgba(242,237,227,0.12), transparent 70%)`;

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(-py * 12);
    ry.set(px * 14);
    gx.set(px * 100 + 50);
    gy.set(py * 100 + 50);
  }

  function reset() {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  }

  return (
    <Screen ref={ref} onPointerMove={move} onPointerLeave={reset}>
      <div className="absolute inset-0 [perspective:900px]">
        <motion.div
          className="absolute inset-0"
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0"
            style={{ transform: "translateZ(-48px) scale(1.14)" }}
          >
            <Plate src="/worlds/w-desert-dusk.webp" className="brightness-[0.85]" />
          </div>
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.25)_0%,rgba(8,9,10,0.1)_45%,rgba(8,9,10,0.88)_100%)]"
            style={{ transform: "translateZ(16px)" }}
          />
          <div
            className="absolute inset-x-0 top-1/2 flex items-center gap-3 px-6"
            style={{ transform: "translateZ(34px)" }}
          >
            <span className="h-px flex-1 bg-[repeating-linear-gradient(to_right,rgba(242,237,227,0.35)_0_4px,transparent_4px_9px)]" />
            <span className="lab-mono text-[9px] text-white/55">×</span>
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ transform: "translateZ(54px)" }}
          >
            <span className="display text-[70px] leading-none text-fg drop-shadow-[0_6px_18px_rgba(8,9,10,0.7)]">
              404
            </span>
            <span className="lab-mono text-[10px] text-white/70">
              flat page, deep field
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: sheen }}
      />

      <Caption label="404 / tilt" />
      <Foot method="perspective · pointer" />
    </Screen>
  );
}

/* ------------------------------- constellation ----------------------------- */

const STARS: [number, number][] = [
  [18, 26],
  [42, 12],
  [88, 30],
  [118, 8],
  [150, 132],
  [176, 18],
  [206, 40],
  [252, 12],
  [278, 30],
  [300, 120],
  [12, 118],
  [102, 138],
  [242, 136],
  [296, 78],
];

const TRACES = [
  "62,116 62,24 34,84 78,84",
  "140,36 159,52 159,96 140,112 121,96 121,52 140,36",
  "216,116 216,24 188,84 232,84",
];

function tracePoints(path: string): [number, number][] {
  return path.split(" ").map((p) => {
    const [x, y] = p.split(",").map(Number);
    return [x, y];
  });
}

export function ConstellationDemo() {
  const { run, replay } = useReplay();
  const reduce = useReducedMotion();

  return (
    <Screen
      onPointerEnter={replay}
      onClick={replay}
      className="bg-[#07080a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(242,237,227,0.05),transparent_65%)]" />

      <svg
        viewBox="0 0 320 150"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="404 drawn as a constellation"
      >
        <g stroke="#f2ede3" strokeWidth="0.5" opacity="0.11">
          {[40, 80, 120].map((y) => (
            <line key={`h-${y}`} x1={0} x2={320} y1={y} y2={y} />
          ))}
          {[80, 160, 240].map((x) => (
            <line key={`v-${x}`} x1={x} x2={x} y1={0} y2={150} />
          ))}
        </g>
        <g key={run} transform="translate(6 2)">
          {STARS.map(([x, y], i) => (
            <motion.circle
              key={`s-${i}`}
              cx={x}
              cy={y}
              r={i % 4 === 0 ? 0.9 : 0.6}
              fill="#f2ede3"
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 0.4 }}
              transition={{ duration: 0.6, delay: 0.02 * i }}
            />
          ))}

          {TRACES.map((d, i) => (
            <motion.polyline
              key={`t-${i}`}
              points={d}
              fill="none"
              stroke="#f2ede3"
              strokeWidth={1.2}
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.85 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.25 + i * 0.35, ease: "easeInOut" }}
            />
          ))}

          {TRACES.flatMap((d, i) =>
            tracePoints(d).map(([x, y], j) => (
              <motion.circle
                key={`n-${i}-${j}`}
                cx={x}
                cy={y}
                r={2}
                fill="#f2ede3"
                initial={reduce ? false : { scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.3 + i * 0.35 + j * 0.06 }}
              />
            )),
          )}
        </g>
      </svg>

      <div className="pointer-events-none absolute bottom-9 left-4 z-10 lab-mono text-[9.5px] leading-relaxed text-white/45">
        <p>04h 04m / +00° 00′</p>
      </div>

      <Caption label="404 / constellation" />
      <Foot method="svg · dashoffset" />
    </Screen>
  );
}

/* -------------------------------- viewfinder ------------------------------- */

export function ViewfinderDemo() {
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();
  const blur = on && !reduce;

  const bracket = "absolute size-5 transition-all duration-500 ease-out";

  return (
    <Screen
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
      onClick={() => setOn((v) => !v)}
    >
      <div
        className={`absolute inset-0 transition-[filter,transform] duration-700 ease-out ${
          blur ? "scale-[1.03] blur-none" : "scale-[1.08] blur-[7px]"
        }`}
      >
        <Plate src="/worlds/w-bench-blossom.webp" className="brightness-[0.72]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.3)_0%,rgba(8,9,10,0.1)_50%,rgba(8,9,10,0.8)_100%)]" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2">
        <span className="display text-[66px] leading-none text-fg drop-shadow-[0_3px_14px_rgba(8,9,10,0.8)]">
          404
        </span>
        <span className="lab-mono text-[10px] text-white/75">
          subject not found
        </span>
      </div>

      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border transition-all duration-700 ease-out ${
          blur
            ? "h-[104px] w-[176px] border-amber/70"
            : "h-[120px] w-[196px] border-amber/30"
        }`}
      >
        <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute left-1/2 top-0 h-full w-px bg-amber/60" />
          <span className="absolute left-0 top-1/2 h-px w-full bg-amber/60" />
        </span>
      </div>

      <span className={`${bracket} left-3 top-3 border-l border-t ${blur ? "border-white/70" : "border-white/30"}`} />
      <span className={`${bracket} right-3 top-3 border-r border-t ${blur ? "border-white/70" : "border-white/30"}`} />
      <span className={`${bracket} bottom-9 left-3 border-b border-l ${blur ? "border-white/70" : "border-white/30"}`} />
      <span className={`${bracket} bottom-9 right-3 border-b border-r ${blur ? "border-white/70" : "border-white/30"}`} />

      <div className="pointer-events-none absolute left-4 top-9 z-20 flex items-center gap-1.5 lab-mono text-[9.5px] text-white/65">
        <span className="size-1.5 rounded-full bg-amber" />
        REC 00:04:04
      </div>
      <div className="pointer-events-none absolute right-4 top-9 z-20 lab-mono text-[9.5px] text-white/55">
        f/4.0 · ISO 400
      </div>
      <div className="pointer-events-none absolute bottom-9 right-4 z-20 lab-mono text-[9.5px] text-white/45">
        AF-S
      </div>

      <Caption label="404 / viewfinder" />
      <Foot method="focus hunt" />
    </Screen>
  );
}
