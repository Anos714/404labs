"use client";

// tide-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useRef, useState } from "react";
import { Screen, clamp } from "./chrome";

/* ----------------------------------- tide ---------------------------------- */

type TidePalette = {
  skyTop: string;
  skyBottom: string;
  seaTop: string;
  seaDeep: string;
  block: string;
  sand: string;
};

const TIDE_DAY: TidePalette = {
  skyTop: "#b7d4cb",
  skyBottom: "#e9e5d1",
  seaTop: "#8fc0b4",
  seaDeep: "#437a78",
  block: "#253630",
  sand: "#c9bb98",
};

const TIDE_DUSK: TidePalette = {
  skyTop: "#d9a27c",
  skyBottom: "#f0d9b8",
  seaTop: "#ad8a7c",
  seaDeep: "#556a70",
  block: "#2c3730",
  sand: "#c0a987",
};

const TIDE_NIGHT: TidePalette = {
  skyTop: "#0f1a24",
  skyBottom: "#263746",
  seaTop: "#2d4652",
  seaDeep: "#14242d",
  block: "#c8d3c4",
  sand: "#7c7d6c",
};

function mixHex(a: string, b: string, t: number) {
  const pa = [
    parseInt(a.slice(1, 3), 16),
    parseInt(a.slice(3, 5), 16),
    parseInt(a.slice(5, 7), 16),
  ];
  const pb = [
    parseInt(b.slice(1, 3), 16),
    parseInt(b.slice(3, 5), 16),
    parseInt(b.slice(5, 7), 16),
  ];
  const n = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${n[0]}, ${n[1]}, ${n[2]})`;
}

function tideTone(t: number): TidePalette {
  const a = t < 0.55 ? TIDE_DAY : TIDE_DUSK;
  const b = t < 0.55 ? TIDE_DUSK : TIDE_NIGHT;
  const k = t < 0.55 ? t / 0.55 : (t - 0.55) / 0.45;
  return {
    skyTop: mixHex(a.skyTop, b.skyTop, k),
    skyBottom: mixHex(a.skyBottom, b.skyBottom, k),
    seaTop: mixHex(a.seaTop, b.seaTop, k),
    seaDeep: mixHex(a.seaDeep, b.seaDeep, k),
    block: mixHex(a.block, b.block, k),
    sand: mixHex(a.sand, b.sand, k),
  };
}

const TIDE_FONT: Record<string, string[]> = {
  "4": ["10001", "10001", "11111", "00001", "00001"],
  "0": ["01110", "10001", "10001", "10001", "01110"],
};

const TIDE_BLOCKS: { x: number; y: number }[] = [];
["4", "0", "4"].forEach((digit, d) => {
  TIDE_FONT[digit].forEach((line, r) => {
    line.split("").forEach((bit, c) => {
      if (bit !== "1") return;
      TIDE_BLOCKS.push({ x: 25 + (d * 6 + c) * 4, y: 34 + r * 3.8 });
    });
  });
});

const STARS = [
  [7, 12], [13, 20], [19, 9], [26, 17], [33, 12], [39, 22], [46, 8],
  [53, 16], [59, 11], [66, 20], [73, 13], [80, 9], [87, 18], [93, 12],
  [10, 26], [31, 27], [49, 24], [70, 26], [89, 27], [23, 6], [57, 5],
  [77, 4],
];

const CRAB = [
  "#...........#",
  "##..#####..##",
  "..#########..",
  ".###########.",
  "..#########..",
  "..#.#.#.#.#..",
];

const MOON = [
  "..###..",
  ".#####.",
  "#######",
  "#######",
  "#######",
  ".#####.",
  "..###..",
];

export function TideDemo() {
  const host = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const [tide, setTide] = useState(0.3);
  const [moving, setMoving] = useState(false);

  const tone = tideTone(tide);
  const waterY = 60 - tide * 26;
  const beachTop = 34;
  const crabTop = clamp(waterY - 8, 34, 52);
  const depth = (tide * 2.4 + 0.2).toFixed(1);
  const word =
    tide < 0.22 ? "EBB" : tide < 0.5 ? "FLOOD" : tide < 0.8 ? "HIGH" : "SPRING";
  const chromeInk =
    tide > 0.58 ? "rgba(235,238,224,0.74)" : "rgba(20,32,30,0.68)";
  const seaInk =
    tide > 0.55 ? "rgba(240,244,232,0.82)" : "rgba(18,44,40,0.76)";

  function set(clientY: number) {
    const el = host.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const y = ((clientY - r.top) / r.width) * 100;
    setTide(clamp((60 - y) / 26, 0, 1));
  }

  function down(e: React.PointerEvent<HTMLDivElement>) {
    drag.current = true;
    setMoving(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    set(e.clientY);
  }

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (drag.current) set(e.clientY);
  }

  function up() {
    drag.current = false;
    setMoving(false);
  }

  function key(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      setTide((v) => clamp(v + 0.05, 0, 1));
    }
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      setTide((v) => clamp(v - 0.05, 0, 1));
    }
    if (e.key === "Home") setTide(0);
    if (e.key === "End") setTide(1);
  }

  return (
    <Screen
      role="slider"
      tabIndex={0}
      aria-label="Tide level"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(tide * 100)}
      aria-valuetext={`${depth} metres, ${word.toLowerCase()}`}
      onKeyDown={key}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      className="touch-none select-none outline-none focus-visible:[outline:1px_solid_#e9b871] focus-visible:outline-offset-[-3px]"
      style={{ background: `linear-gradient(${tone.skyTop}, ${tone.skyBottom})` }}
    >
      <div ref={host} className="absolute inset-0 cursor-ns-resize">
        {STARS.map(([x, y], i) => (
          <span
            key={i}
            className="pointer-events-none absolute bg-white"
            style={{
              left: `${x}%`,
              top: `${(y / 75) * 100}%`,
              width: i % 4 === 0 ? "0.5cqw" : "0.3cqw",
              height: i % 4 === 0 ? "0.5cqw" : "0.3cqw",
              opacity: clamp((tide - 0.52) / 0.4, 0, 0.9) * (i % 3 === 0 ? 1 : 0.7),
            }}
          />
        ))}

        <div
          className="pointer-events-none absolute left-[14%] top-[10%] flex gap-[0.35cqw]"
          style={{ opacity: clamp(1 - tide * 1.8, 0, 0.9) }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <span
              key={i}
              className="bg-white"
              style={{
                width: "2.5cqw",
                height: "1.1cqw",
                marginTop: i === 0 || i === 7 ? "1.1cqw" : 0,
              }}
            />
          ))}
        </div>
        <div
          className="pointer-events-none absolute left-[62%] top-[19%] flex gap-[0.35cqw]"
          style={{ opacity: clamp(0.85 - tide * 1.5, 0, 0.8) }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="bg-white"
              style={{
                width: "2cqw",
                height: "1cqw",
                marginTop: i === 0 || i === 5 ? "1cqw" : 0,
              }}
            />
          ))}
        </div>

        <div
          className="pointer-events-none absolute right-[8%] top-[8%] z-[3] grid"
          style={{
            width: "5.4cqw",
            gridTemplateColumns: "repeat(7, 1fr)",
            opacity: clamp((tide - 0.42) / 0.35, 0, 1),
          }}
        >
          {MOON.map((row, r) =>
            row.split("").map((bit, c) => (
              <span
                key={`${r}-${c}`}
                className="aspect-square"
                style={{
                  background: bit === "#" ? "#ece7d4" : "transparent",
                  boxShadow:
                    bit === "#" ? "inset 0 -0.08cqw 0 rgba(120,118,96,0.3)" : "none",
                }}
              />
            )),
          )}
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 z-[4]"
          style={{
            top: `${(beachTop / 75) * 100}%`,
            height: `${(Math.max(0, waterY - beachTop) / 75) * 100}%`,
            backgroundColor: tone.sand,
            backgroundImage:
              "repeating-linear-gradient(0deg,rgba(58,48,30,0.08) 0 1px,transparent 1px 4px)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 z-[6]"
          style={{
            top: `${((waterY - 3.2) / 75) * 100}%`,
            height: `${(3.2 / 75) * 100}%`,
            background:
              "linear-gradient(transparent, rgba(34,44,36,0.3))",
          }}
        />

        <div className="pointer-events-none absolute inset-0 z-[8]">
          {TIDE_BLOCKS.map((b, i) => (
            <span
              key={i}
              className="absolute"
              style={{
                left: `${b.x}%`,
                top: `${(b.y / 75) * 100}%`,
                width: "3.7cqw",
                height: "3.1cqw",
                background: tone.block,
                boxShadow: "inset 0 -0.3cqw 0 rgba(0,0,0,0.22)",
              }}
            />
          ))}
        </div>

        <div
          className="pointer-events-none absolute left-0 z-[24] w-[21%]"
          style={{
            top: "36%",
            height: "64%",
            background: "#48503f",
            clipPath:
              "polygon(0 100%, 0 16%, 12% 8%, 32% 11%, 52% 25%, 70% 28%, 86% 44%, 100% 100%)",
            boxShadow: "inset -2cqw 0 0 rgba(0,0,0,0.18)",
          }}
        >
          <span
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(118deg,rgba(0,0,0,0.16) 0 1px,transparent 1px 5px)",
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute z-[28]"
          style={{
            left: "9%",
            top: `${(crabTop / 75) * 100}%`,
            width: "12cqw",
            transform: "translateX(-50%)",
          }}
        >
          <div
            className="relative grid"
            style={{ gridTemplateColumns: "repeat(13, 1fr)" }}
          >
            {CRAB.map((row, r) =>
              row.split("").map((bit, c) => (
                <span
                  key={`${r}-${c}`}
                  className="aspect-square"
                  style={{
                    background: bit === "#" ? "#d76a5e" : "transparent",
                    boxShadow:
                      bit === "#" ? "inset 0 -0.12cqw 0 rgba(80,26,22,0.45)" : "none",
                  }}
                />
              )),
            )}
            <span
              className="absolute left-[22%] top-[44%] size-[1.5%] rounded-full bg-[#1a1d16]"
              style={{ width: "2%", height: "8%" }}
            />
            <span
              className="absolute left-[74%] top-[44%] size-[1.5%] rounded-full bg-[#1a1d16]"
              style={{ width: "2%", height: "8%" }}
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 overflow-hidden"
          style={{
            top: `${(waterY / 75) * 100}%`,
            background: `linear-gradient(${tone.seaTop}, ${tone.seaDeep})`,
            opacity: 0.9,
          }}
        >
          <div className="absolute inset-x-0 top-0 flex items-end">
            {[...Array(44)].map((_, i) => (
              <span
                key={`foam-${i}`}
                style={{
                  width: `${100 / 44}%`,
                  height: i % 4 === 0 ? "1.9cqw" : i % 2 === 0 ? "1.2cqw" : "0.65cqw",
                  background:
                    i % 4 === 0
                      ? "rgba(255,255,255,0.72)"
                      : i % 2 === 0
                        ? "rgba(255,255,255,0.32)"
                        : tone.seaTop,
                  opacity: i % 2 === 0 ? 1 : 0.92,
                }}
              />
            ))}
          </div>
          <div className="absolute inset-x-0 top-[1.1cqw] flex">
            {[...Array(30)].map((_, i) => (
              <span
                key={`riffle-${i}`}
                style={{
                  width: `${100 / 30}%`,
                  height: "0.5cqw",
                  background:
                    i % 3 === 0 ? "rgba(255,255,255,0.2)" : "transparent",
                }}
              />
            ))}
          </div>
          {[12, 24, 38, 56, 74].map((n, i) => (
            <span
              key={n}
              className="absolute h-[0.22cqw]"
              style={{
                top: `${n}%`,
                left: `${6 + i * 9}%`,
                width: `${14 - i * 1.5}%`,
                background:
                  i % 2 === 0
                    ? "rgba(255,255,255,0.16)"
                    : "rgba(0,0,0,0.12)",
              }}
            />
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 z-30 h-px"
          style={{
            top: `${(waterY / 75) * 100}%`,
            background: moving ? "#e9b871" : "rgba(242,237,227,0.4)",
          }}
        />
        <div
          className="pointer-events-none absolute z-30 flex items-center gap-1.5"
          style={{
            top: `${(waterY / 75) * 100}%`,
            right: "6%",
            transform: "translateY(-100%)",
          }}
        >
          <span
            className="lab-mono text-[5.8px] tracking-[0.18em]"
            style={{ color: seaInk }}
          >
            TIDE
          </span>
          <span className="grid grid-cols-2 gap-[0.15cqw]">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="size-[0.55cqw] bg-[#e9b871]" />
            ))}
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-[5%] top-[3.6%] flex items-center justify-between lab-mono text-[6.5px] tracking-[0.2em]">
          <span style={{ color: chromeInk }}>TIDAL STATION 404</span>
          <span className="tabular-nums" style={{ color: chromeInk }}>
            {depth} M · {word}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-[5%] bottom-[3%] flex items-end justify-between gap-3 lab-mono text-[6px] tracking-[0.16em]">
          <span style={{ color: seaInk }}>DRAG THE WATERLINE</span>
          <span style={{ color: seaInk }}>THE NUMBER IS STILL NOT HERE</span>
        </div>
      </div>
    </Screen>
  );
}
