"use client";

import { useEffect, useRef, useState } from "react";
import { Screen, clamp } from "./chrome";

/* ---------------------------------- bloom ---------------------------------- */

const PAPER = "#f2eee3";
const BOTANIC = "#1f2b22";
const BOTANIC_RED = "#9a4b32";

type Stem = {
  x: number;
  y: number;
  s: number;
  tilt: number;
  petals: number;
};

const STEMS: Stem[] = [
  { x: 7, y: 45, s: 9.2, tilt: -9, petals: 6 },
  { x: 17, y: 39, s: 11.6, tilt: 5, petals: 5 },
  { x: 27, y: 48, s: 8.2, tilt: -5, petals: 6 },
  { x: 38, y: 41, s: 10.4, tilt: 7, petals: 6 },
  { x: 50, y: 49, s: 8.8, tilt: -4, petals: 5 },
  { x: 62, y: 40, s: 12.2, tilt: 5, petals: 6 },
  { x: 73, y: 47, s: 8.6, tilt: -7, petals: 5 },
  { x: 83, y: 41, s: 11.2, tilt: 8, petals: 6 },
  { x: 93, y: 49, s: 9, tilt: -4, petals: 6 },
];

function Flower({
  stem,
  open,
  pinned,
  onToggle,
}: {
  stem: Stem;
  open: boolean;
  pinned: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="absolute"
      style={{
        left: `${stem.x}%`,
        top: `${(stem.y / 75) * 100}%`,
        width: `${stem.s}cqw`,
        height: `${stem.s}cqw`,
        transform: "translate(-50%,-50%)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={pinned}
        aria-label={`Flower ${stem.x}. ${pinned ? "Pinned open." : "Pin it open."}`}
        className="group/flower relative block h-full w-full cursor-pointer rounded-full focus-visible:[outline:1.5px_solid_#9a4b32] focus-visible:outline-offset-4"
      >
        {[...Array(stem.petals)].map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-[50%] border"
            style={{
              width: "31%",
              height: "60%",
              borderColor: open ? BOTANIC : "rgba(31,43,34,0.8)",
              background: open
                ? "rgba(250,247,238,0.92)"
                : "rgba(242,238,227,0.95)",
              transformOrigin: "50% 50%",
              transform: `translate(-50%,-50%) rotate(${
                open ? i * (360 / stem.petals) : i * (360 / stem.petals) + 14
              }deg) translateY(${open ? -64 : -22}%) scaleY(${
                open ? 1 : 0.52
              }) scaleX(${open ? (i % 2 ? 0.86 : 1) : 0.82})`,
              transition: "transform 620ms cubic-bezier(0.22,1,0.36,1)",
              boxShadow: open ? "inset 0 0 0 0.5px rgba(31,43,34,0.08)" : "none",
            }}
          />
        ))}
        <span
          className="absolute left-1/2 top-1/2 size-[19%] -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            borderColor: BOTANIC,
            background: open ? BOTANIC_RED : "rgba(242,238,227,0.95)",
            transition: "background 400ms ease-out",
          }}
        >
          <span
            className="absolute left-1/2 top-1/2 size-[32%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: open ? PAPER : BOTANIC }}
          />
        </span>
        <span
          className="absolute bottom-[-13%] left-1/2 size-[1.1cqw] -translate-x-1/2 rounded-full transition-opacity duration-300"
          style={{ background: BOTANIC_RED, opacity: pinned ? 1 : 0 }}
        />
      </button>
    </div>
  );
}

export function BotanicDemo() {
  const [pinned, setPinned] = useState<boolean[]>(STEMS.map(() => false));
  const [near, setNear] = useState<boolean[]>(STEMS.map(() => false));

  const pinnedCount = pinned.filter(Boolean).length;
  const all = pinnedCount === STEMS.length;

  function aim(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.width) * 100;
    setNear((prev) => {
      const next = STEMS.map((f) => Math.hypot(x - f.x, y - f.y) < 13);
      return next.some((v, i) => v !== prev[i]) ? next : prev;
    });
  }

  function rest() {
    setNear((prev) =>
      prev.some(Boolean) ? STEMS.map(() => false) : prev,
    );
  }

  function toggle(i: number) {
    setPinned((prev) => prev.map((v, j) => (i === j ? !v : v)));
  }

  return (
    <Screen
      onPointerMove={aim}
      onPointerLeave={rest}
      className="select-none text-[#1f2b22]"
      style={{ backgroundColor: PAPER }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_24%,rgba(255,253,246,0.85),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:repeating-linear-gradient(0deg,rgba(31,43,34,0.035)_0_1px,transparent_1px_3px)]" />
      <div className="pointer-events-none absolute inset-[3%] border border-[rgba(31,43,34,0.14)]" />

      <div className="pointer-events-none absolute inset-x-[6%] top-[4%] flex items-center justify-between lab-mono text-[6.5px] tracking-[0.2em] text-[#6c766b]">
        <span className="text-[#1f2b22]">404LAB · BOTANICAL REGISTER</span>
        <span>PLATE 404</span>
      </div>
      <div className="pointer-events-none absolute inset-x-[6%] top-[7.8%] h-px bg-[rgba(31,43,34,0.18)]" />

      <div className="pointer-events-none absolute inset-x-0 top-[10%] text-center">
        <p className="display text-[24cqw] leading-[0.76] tracking-[-0.05em] text-[#1f2b22]">
          404
        </p>
        <p className="display mt-[2.4cqw] text-[3cqw] leading-none text-[#1f2b22]">
          {all ? "All nine open. The page still did not grow." : "Nine stems, no page."}
        </p>
        <p className="mt-[1.4cqw] lab-mono text-[6px] tracking-[0.16em] text-[#6c766b]">
          MOVE ACROSS THE PLATE TO OPEN · TAP TO PIN
        </p>
      </div>

      <svg
        viewBox="0 0 100 75"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        {STEMS.map((f) => {
          const top = f.y + f.s * 0.32;
          const mid = (f.y + 70) / 2;
          return (
            <g key={f.x}>
              <path
                d={`M ${f.x} 70 C ${f.x + f.tilt} ${mid + 7}, ${f.x + f.tilt * 0.4} ${mid - 2}, ${f.x} ${top}`}
                fill="none"
                stroke={BOTANIC}
                strokeWidth={0.24}
                strokeLinecap="round"
              />
              <ellipse
                cx={f.x + f.tilt * 0.5 - 1.4}
                cy={mid + 2}
                rx={2.2}
                ry={0.72}
                fill="none"
                stroke={BOTANIC}
                strokeWidth={0.2}
                transform={`rotate(${f.tilt * 2.4} ${f.x + f.tilt * 0.5 - 1.4} ${mid + 2})`}
              />
              <ellipse
                cx={f.x + f.tilt * 0.2 + 1.2}
                cy={mid - 3}
                rx={1.7}
                ry={0.58}
                fill="none"
                stroke={BOTANIC}
                strokeWidth={0.18}
                transform={`rotate(${f.tilt * -2} ${f.x + f.tilt * 0.2 + 1.2} ${mid - 3})`}
              />
            </g>
          );
        })}
      </svg>

      {STEMS.map((f, i) => (
        <Flower
          key={f.x}
          stem={f}
          open={near[i] || pinned[i]}
          pinned={pinned[i]}
          onToggle={() => toggle(i)}
        />
      ))}

      <div className="pointer-events-none absolute inset-x-0 top-[70cqw] bottom-0 bg-[#ece6d8]" />
      <div className="pointer-events-none absolute inset-x-[6%] top-[70cqw] h-px bg-[rgba(31,43,34,0.24)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[70cqw] bottom-0 opacity-[0.16] [background-image:repeating-linear-gradient(112deg,rgba(31,43,34,0.28)_0_0.5px,transparent_0.5px_3.4px)]" />

      <div className="pointer-events-none absolute inset-x-[6%] bottom-[2.4%] flex items-end justify-between gap-3">
        <p className="lab-mono text-[6.5px] tracking-[0.16em] text-[#3a463b]">
          {all ? "THE REGISTER IS FULL" : "NO FLOWER IS THE PAGE"}
        </p>
        <p className="lab-mono text-[6.5px] tracking-[0.16em] tabular-nums text-[#1f2b22]">
          PINNED {String(pinnedCount).padStart(2, "0")} / 09
        </p>
      </div>
    </Screen>
  );
}

/* ------------------------------- setting out ------------------------------- */

const MEASURE = 210;
const SHEET = "#0a0a09";
const SHEET_INK = "#e9e4d5";
const SHEET_DIM = "#736f64";

export function SettingOutDemo() {
  const host = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const [w, setW] = useState(0);
  const [col, setCol] = useState(300);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const read = () => {
      const width = el.getBoundingClientRect().width;
      if (width < 1) return;
      setW(width);
      setCol((c) => clamp(c, width * 0.24, width * 0.82));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const base = w || 720;
  const min = Math.max(60, base * 0.24);
  const max = Math.max(min + 40, base * 0.82);
  const target = Math.min(MEASURE, max);
  const snapped = Math.abs(col - target) < 1.2;
  const status = snapped ? "SET" : col > target ? "OVER SET" : "UNDER SET";

  function place(clientX: number) {
    const el = host.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const raw = clientX - r.left - r.width * 0.08;
    const next = clamp(raw, min, max);
    setCol(Math.abs(next - MEASURE) <= 6 && MEASURE <= max ? MEASURE : next);
  }

  function down(e: React.PointerEvent<HTMLDivElement>) {
    drag.current = true;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    place(e.clientX);
  }

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    place(e.clientX);
  }

  function up() {
    drag.current = false;
    setDragging(false);
  }

  function key(e: React.KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 24 : 6;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      setCol((c) =>
        clamp(c + (e.key === "ArrowLeft" ? -step : step), min, max),
      );
    }
    if (e.key === "Home") setCol(min);
    if (e.key === "End") setCol(max);
    if (e.key === "Enter") setCol(target);
  }

  return (
    <Screen
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      className="touch-none select-none"
      style={{ backgroundColor: SHEET, color: SHEET_INK }}
    >
      <div
        ref={host}
        className="absolute inset-0 cursor-ew-resize"
        style={{
          backgroundImage:
            "linear-gradient(90deg,rgba(233,228,213,0.05) 0 1px,transparent 1px),linear-gradient(0deg,rgba(233,228,213,0.05) 0 1px,transparent 1px)",
          backgroundSize: "2.5cqw 2.5cqw",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg,rgba(233,228,213,0.055) 0 1px,transparent 1px),linear-gradient(0deg,rgba(233,228,213,0.055) 0 1px,transparent 1px)",
            backgroundSize: "10cqw 10cqw",
          }}
        />

        <div className="pointer-events-none absolute inset-x-[6%] top-[4.2%] flex items-center justify-between lab-mono text-[6.5px] tracking-[0.2em]">
          <span style={{ color: SHEET_INK }}>SHEET 01 · SETTING OUT</span>
          <span style={{ color: SHEET_DIM }}>ISSUE 01 · 210 PX COLUMN</span>
        </div>
        <div
          className="pointer-events-none absolute inset-x-[6%] top-[8.4%] h-px"
          style={{ background: "rgba(233,228,213,0.14)" }}
        />

        {[0, 100, 200].map((n) => (
          <div
            key={n}
            className="pointer-events-none absolute top-[9.4%] h-[1.4cqw] w-px"
            style={{
              left: `calc(8% + ${n}px)`,
              background: "rgba(233,228,213,0.35)",
            }}
          >
            <span
              className="absolute left-0 top-[1.6cqw] lab-mono text-[5.5px] tracking-[0.1em]"
              style={{ color: SHEET_DIM }}
            >
              {n}
            </span>
          </div>
        ))}

        <div
          className="pointer-events-none absolute bottom-[13%] top-[12%] w-px"
          style={{ left: "8%", background: "rgba(233,228,213,0.2)" }}
        />
        <div
          className="pointer-events-none absolute bottom-[13%] top-[12%] w-px"
          style={{ left: "8%", transform: "translateX(-4px)", background: "rgba(233,228,213,0.08)" }}
        />

        <div
          className="pointer-events-none absolute top-[24%]"
          style={{ left: "8%", width: col }}
        >
          <p
            className="display"
            style={{
              fontSize: col / 1.78,
              lineHeight: 0.78,
              letterSpacing: "-0.045em",
              color: SHEET_INK,
            }}
          >
            404
          </p>
          <div
            className="mt-[2.2cqw] h-px w-full"
            style={{ background: "rgba(233,228,213,0.3)" }}
          />
          <p
            className="mt-[1.6cqw] text-[clamp(8.5px,2.05cqw,14px)] leading-[1.55]"
            style={{ color: "#b6b0a1" }}
          >
            No page was set in this measure. The type was ready. The column was
            not.
          </p>
        </div>

        <div
          role="slider"
          tabIndex={0}
          aria-label="Column measure in pixels"
          aria-valuemin={Math.round(min)}
          aria-valuemax={Math.round(max)}
          aria-valuenow={Math.round(col)}
          aria-valuetext={`${Math.round(col)} pixels, ${status.toLowerCase()}`}
          onKeyDown={key}
          onPointerDown={down}
          className="absolute z-20 top-[11%] h-[66%] w-[4cqw] -translate-x-1/2 cursor-ew-resize touch-none outline-none focus-visible:[outline:1px_solid_#e9b871]"
          style={{ left: `calc(8% + ${col}px)` }}
        >
          <span
            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
            style={{
              background: dragging
                ? "#e9b871"
                : "repeating-linear-gradient(180deg,rgba(233,184,113,0.72) 0 5px,transparent 5px 10px)",
            }}
          />
          <span
            className="absolute bottom-0 left-1/2 size-[1.9cqw] -translate-x-1/2 rounded-[1px]"
            style={{ background: "#e9b871" }}
          />
          <span
            className="absolute left-1/2 top-[-1cqw] -translate-x-full whitespace-nowrap rounded-[2px] px-1.5 py-0.5 lab-mono text-[5.8px] tracking-[0.14em]"
            style={{
              background: "#e9b871",
              color: "#12100b",
              transform: "translate(-100%,-100%)",
            }}
          >
            {Math.round(col)} PX
          </span>
        </div>

        <div
          className="pointer-events-none absolute top-[15%] h-[4cqw] w-px"
          style={{ left: `calc(8% + ${MEASURE}px)`, background: "rgba(233,184,113,0.22)" }}
        />

        <div className="pointer-events-none absolute inset-x-[6%] bottom-[9%] h-px bg-[rgba(233,228,213,0.14)]" />
        <div className="pointer-events-none absolute inset-x-[6%] bottom-[3.4%] flex items-end justify-between gap-3 lab-mono text-[6.5px] tracking-[0.16em]">
          <span className="tabular-nums" style={{ color: SHEET_DIM }}>
            MEASURE{" "}
            <span style={{ color: SHEET_INK }}>
              {String(Math.round(col)).padStart(3, "0")} PX
            </span>
            <span className="mx-2 opacity-40">/</span>
            DRAG THE GUIDE
          </span>
          <span
            className="tabular-nums"
            style={{ color: snapped ? "#e9b871" : SHEET_DIM }}
          >
            {status} · TARGET {MEASURE}
          </span>
        </div>
      </div>
    </Screen>
  );
}

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

/* ---------------------------------- launch --------------------------------- */

const PAD_X = 18;

const GROUND = (x: number) =>
  Math.min(
    66,
    56.5 +
      Math.sin((x + 6) / 13) * 2.4 +
      Math.sin((x - 28) / 6.4) * 0.9 +
      x * 0.045,
  );

const HILL_POINTS = Array.from({ length: 51 }, (_, i) => {
  const x = i * 2;
  return `${x} ${GROUND(x).toFixed(2)}`;
}).join(" L ");

const HILL_PATH = `M 0 75 L 0 ${GROUND(0).toFixed(2)} L ${HILL_POINTS} L 100 75 Z`;
const BACK_POINTS = Array.from({ length: 51 }, (_, i) => {
  const x = i * 2;
  return `${x} ${(GROUND(x) - 7 - Math.sin(x / 9) * 1.2).toFixed(2)}`;
}).join(" L ");
const BACK_PATH = `M 0 75 L 0 ${(GROUND(0) - 7).toFixed(2)} L ${BACK_POINTS} L 100 75 Z`;
const FAR_PATH = `M 0 75 L 0 45 L 22 41 L 44 44 L 68 38 L 88 42 L 100 39 L 100 75 Z`;

export function LaunchDemo() {
  const plane = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const charge = useRef(0);
  const charging = useRef(false);
  const flying = useRef(false);
  const start = useRef(0);
  const chargeRaf = useRef(0);
  const flightRaf = useRef(0);
  const throwCount = useRef(0);
  const [throws, setThrows] = useState(0);
  const [best, setBest] = useState(0);
  const [note, setNote] = useState("hold anywhere to pull it back");
  const [arc, setArc] = useState<[number, number][]>([]);
  const [landed, setLanded] = useState<{ x: number; y: number; d: number } | null>(
    null,
  );
  const [pulling, setPulling] = useState(false);

  useEffect(
    () => () => {
      cancelAnimationFrame(chargeRaf.current);
      cancelAnimationFrame(flightRaf.current);
    },
    [],
  );

  function restPlane() {
    if (!plane.current) return;
    plane.current.style.left = `${PAD_X}%`;
    plane.current.style.top = `${((GROUND(PAD_X) - 2.4) / 75) * 100}%`;
    plane.current.style.transform = "translate(-50%,-50%) rotate(0deg)";
  }

  function begin() {
    if (flying.current || throwCount.current >= 3) return;
    cancelAnimationFrame(chargeRaf.current);
    charging.current = true;
    setPulling(true);
    restPlane();
    charge.current = 0;
    start.current = performance.now();
    setNote("keep holding, then let go");

    const tick = (now: number) => {
      if (!charging.current) return;
      const c = clamp((now - start.current) / 1050, 0, 1);
      charge.current = c;
      if (fill.current) fill.current.style.width = `${c * 100}%`;
      if (plane.current) {
        plane.current.style.left = `${PAD_X - c * 5}%`;
        plane.current.style.top = `${((GROUND(PAD_X) - 2.4 + c * 1.2) / 75) * 100}%`;
        plane.current.style.transform = `translate(-50%,-50%) rotate(${-c * 14}deg)`;
      }
      chargeRaf.current = requestAnimationFrame(tick);
    };
    chargeRaf.current = requestAnimationFrame(tick);
  }

  function release() {
    if (!charging.current) return;
    charging.current = false;
    setPulling(false);
    cancelAnimationFrame(chargeRaf.current);
    launch(charge.current);
  }

  function launch(c: number) {
    if (flying.current) return;
    flying.current = true;
    setLanded(null);
    setArc([]);
    setNote("in the air");

    let x = PAD_X;
    let y = GROUND(PAD_X) - 2.4;
    const vx = 34 + 44 * c;
    let vy = -(44 + 22 * c);
    const pts: [number, number][] = [[x, y]];
    let last = performance.now();
    let mark = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000 || 0.016, 0.032);
      last = now;
      const steps = 3;
      for (let s = 0; s < steps; s++) {
        const h = dt / steps;
        vy += 96 * h;
        x += vx * h;
        y += vy * h;
        if (x > 98) {
          x = 98;
          break;
        }
        if (y >= GROUND(x)) break;
      }
      pts.push([x, y]);
      mark += 1;
      if (mark % 2 === 0) setArc([...pts]);
      if (plane.current) {
        plane.current.style.left = `${x}%`;
        plane.current.style.top = `${(y / 75) * 100}%`;
        plane.current.style.transform = `translate(-50%,-50%) rotate(${
          (Math.atan2(vy, vx) * 180) / Math.PI
        }deg)`;
      }
      if (x >= 98 || y >= GROUND(x)) {
        const gy = GROUND(x);
        if (plane.current) {
          plane.current.style.top = `${(gy / 75) * 100}%`;
          plane.current.style.transform = "translate(-50%,-50%) rotate(8deg)";
        }
        const d = Math.max(1, Math.round((x - PAD_X) * 2.2));
        const next = throwCount.current + 1;
        throwCount.current = next;
        setThrows(next);
        setBest((b) => Math.max(b, d));
        setLanded({ x, y: gy, d });
        setArc(pts);
        setNote(
          next >= 3
            ? "three throws, still no page at the end of any of them"
            : `${d} m and no page at the end of it`,
        );
        if (fill.current) fill.current.style.width = "0%";
        flying.current = false;
        return;
      }
      flightRaf.current = requestAnimationFrame(tick);
    };

    flightRaf.current = requestAnimationFrame(tick);
  }

  function reset() {
    cancelAnimationFrame(flightRaf.current);
    cancelAnimationFrame(chargeRaf.current);
    flying.current = false;
    charging.current = false;
    throwCount.current = 0;
    setThrows(0);
    setBest(0);
    setArc([]);
    setLanded(null);
    setPulling(false);
    setNote("hold anywhere to pull it back");
    if (fill.current) fill.current.style.width = "0%";
    restPlane();
  }

  return (
    <Screen
      role="application"
      tabIndex={0}
      aria-label="Paper plane launch. Hold the page to pull back, release to throw."
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        begin();
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
      onKeyDown={(e) => {
        if (e.key === " " && !e.repeat) {
          e.preventDefault();
          begin();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === " ") {
          e.preventDefault();
          release();
        }
      }}
      className="touch-none select-none outline-none focus-visible:[outline:1px_solid_#e9b871] focus-visible:outline-offset-[-3px]"
      style={{ background: "linear-gradient(#f1e8d5, #e5cfac)" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_74%_18%,rgba(255,250,235,0.7),transparent_58%)]" />

      <div className="pointer-events-none absolute inset-x-[6%] top-[4%] flex items-center justify-between lab-mono text-[6.5px] tracking-[0.2em] text-[#4a584a]">
        <span>THROW {String(Math.min(throws + (throws < 3 ? 1 : 0), 3)).padStart(2, "0")} / 03</span>
        <span className="tabular-nums">
          BEST {best ? `${String(best).padStart(3, "0")} M` : "--- M"}
        </span>
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-[8.4%] flex w-[30cqw] -translate-x-1/2 items-center gap-2"
        style={{ opacity: pulling ? 1 : 0.55 }}
      >
        <span className="lab-mono text-[5.5px] tracking-[0.18em] text-[#4a584a]">
          PULL
        </span>
        <span className="relative h-[0.7cqw] flex-1 overflow-hidden bg-[rgba(46,58,44,0.18)]">
          <span
            ref={fill}
            className="absolute inset-y-0 left-0 bg-[#9a4b32]"
            style={{ width: 0 }}
          />
        </span>
      </div>

      <p
        className="display pointer-events-none absolute inset-x-0 top-[12%] text-center text-[30cqw] leading-none"
        style={{ color: "rgba(58,74,56,0.13)" }}
      >
        404
      </p>

      <svg
        viewBox="0 0 100 75"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        <path d={FAR_PATH} fill="#b9c0a8" />
        <path d={BACK_PATH} fill="#9aa78c" />
        <path d={HILL_PATH} fill="#5f7259" />
      </svg>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[10%]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(105deg,rgba(28,40,28,0.18) 0 1px,transparent 1px 6px)",
        }}
      />

      {arc.length > 1 && (
        <svg
          viewBox="0 0 100 75"
          className="pointer-events-none absolute inset-0 z-[8] h-full w-full"
          aria-hidden
        >
          <polyline
            points={arc.map(([x, y]) => `${x},${y}`).join(" ")}
            fill="none"
            stroke="#9a4b32"
            strokeWidth="0.32"
            strokeDasharray="0.9 1.4"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      )}

      {landed && (
        <div
          className="pointer-events-none absolute z-[9] flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${landed.x}%`, top: `${(landed.y / 75) * 100}%` }}
        >
          <span className="lab-mono text-[6px] tracking-[0.12em] text-[#f4eeda]">
            {String(landed.d).padStart(3, "0")} M
          </span>
          <span className="mt-0.5 h-[2.2cqw] w-px bg-[#f4eeda]/70" />
          <span className="size-[0.8cqw] rounded-full bg-[#9a4b32]" />
        </div>
      )}

      <div
        ref={plane}
        className="pointer-events-none absolute z-10"
        style={{
          left: `${PAD_X}%`,
          top: `${((GROUND(PAD_X) - 2.4) / 75) * 100}%`,
          width: "5.4cqw",
          transform: "translate(-50%,-50%)",
        }}
      >
        <svg viewBox="0 0 26 18" className="h-auto w-full overflow-visible">
          <path
            d="M1.5 8.6 L24.5 1.4 L14.4 16.6 L11.8 9.8 Z"
            fill="#f7f1e2"
            stroke="#33412f"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />
          <path
            d="M11.8 9.8 L24.5 1.4"
            fill="none"
            stroke="#33412f"
            strokeWidth="0.7"
            opacity="0.65"
          />
          <path
            d="M11.8 9.8 L13.4 15.6"
            fill="none"
            stroke="#9a4b32"
            strokeWidth="0.9"
          />
        </svg>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[5%] z-20 flex items-end justify-between px-[6%]">
        <p
          role="status"
          aria-live="polite"
          className="max-w-[62%] text-[clamp(7px,1.55cqw,10.5px)] leading-[1.5] text-[#f7f1e2] [text-shadow:0_1px_3px_rgba(28,40,28,0.7)]"
        >
          {note}
        </p>
        <span className="lab-mono text-[5.5px] tracking-[0.14em] text-[#f7f1e2]/75 [text-shadow:0_1px_3px_rgba(28,40,28,0.6)]">
          HOLD · RELEASE
        </span>
      </div>

      {throws >= 3 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            reset();
          }}
          className="absolute bottom-[11%] left-1/2 z-20 -translate-x-1/2 cursor-pointer rounded-control border border-[#33412f]/60 bg-[#f4eeda]/70 px-3 py-1.5 lab-mono text-[6.5px] tracking-[0.14em] text-[#2f3d30] transition-colors duration-200 hover:bg-[#f4eeda]"
        >
          THREE MORE THROWS
        </button>
      )}
    </Screen>
  );
}
