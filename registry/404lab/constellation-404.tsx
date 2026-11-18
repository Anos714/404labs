"use client";

// constellation-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { motion, useReducedMotion } from "motion/react";
import { Caption, Foot, Screen, useReplay } from "./chrome";

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
