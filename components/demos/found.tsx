"use client";

import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useState } from "react";
import { Screen, clamp } from "./chrome";

/* ------------------------------ lost property ------------------------------ */

const INK = "#1a1510";
const MUTED = "#6b6154";
const AMBER = "#a2681f";
const RULE = "rgba(26,21,16,0.16)";

type Id = "umbrella" | "watch" | "key" | "plane";

const RECORDS: Record<Id, { no: string; name: string; note: string }> = {
  umbrella: {
    no: "01",
    name: "Umbrella",
    note: "Left open somewhere above the fold. Still dripping.",
  },
  watch: {
    no: "02",
    name: "Pocket watch",
    note: "Stopped at 4:04 and refused to say why.",
  },
  key: {
    no: "03",
    name: "Brass key",
    note: "Fits a door that is no longer here.",
  },
  plane: {
    no: "04",
    name: "Paper plane",
    note: "Filed under nowhere in particular.",
  },
};

const IDLE = "Hover to read a tag. Tap an item to log it.";
const DONE = "All four accounted for. The page you wanted never arrived.";

// art

type ArtProps = { run: number; reduce: boolean };

const STROKE = {
  fill: "none",
  stroke: INK,
  strokeWidth: 2.1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const THIN = {
  fill: "none",
  stroke: INK,
  strokeWidth: 1.1,
  strokeLinecap: "round",
  opacity: 0.32,
} as const;

function UmbrellaArt({ run, reduce }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
      <motion.g
        key={run}
        animate={
          run > 0 && !reduce ? { rotate: [0, -6, 5, -3, 0] } : undefined
        }
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ transformOrigin: "50px 46px" }}
      >
        <path d="M10 46 C15 24 35 12 50 12 C65 12 85 24 90 46" {...STROKE} />
        <path
          d="M10 46 C18 55 28 55 36 46 C43 55 57 55 64 46 C72 55 82 55 90 46"
          {...STROKE}
        />
        <path d="M50 46 V76" {...STROKE} />
        <path
          d="M50 76 C50 86 44 89 40 85 C36 81 39 75 45 76"
          {...STROKE}
          stroke={AMBER}
        />
        <path d="M50 12 V7" {...STROKE} />
        <path d="M50 14 L27 42 M50 14 L73 42" {...THIN} />
      </motion.g>

      {run > 0 && !reduce && (
        <motion.path
          key={`drop-${run}`}
          d="M72 49 C72 49 68 55 68 58 A4 4 0 0 0 76 58 C76 55 72 49 72 49 Z"
          fill={AMBER}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 20, opacity: [0, 1, 0] }}
          transition={{ duration: 0.9, ease: "easeIn" }}
        />
      )}
    </svg>
  );
}

const TICKS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * 30 * Math.PI) / 180;
  const long = i % 3 === 0;
  const outer = 27.5;
  const inner = long ? 22 : 24.5;
  return {
    x1: Number((50 + Math.sin(angle) * inner).toFixed(2)),
    y1: Number((50 - Math.cos(angle) * inner).toFixed(2)),
    x2: Number((50 + Math.sin(angle) * outer).toFixed(2)),
    y2: Number((50 - Math.cos(angle) * outer).toFixed(2)),
    long,
  };
});

function WatchArt({ run, reduce }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
      <g>
        <path
          d="M45 14 C32 4 18 10 14 24 C11 34 18 41 27 41"
          fill="none"
          stroke={INK}
          strokeWidth={1.4}
          strokeDasharray="2 3"
          opacity={0.45}
        />
        <path d="M45 14 H55 V9 H45 Z" {...STROKE} strokeWidth={1.8} />
        <circle cx="50" cy="5.5" r="3.5" {...STROKE} strokeWidth={1.8} />
        <circle cx="50" cy="50" r="31" {...STROKE} />
        <circle cx="50" cy="50" r="24" {...STROKE} strokeWidth={1} opacity={0.45} />
        {TICKS.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={INK}
            strokeWidth={t.long ? 1.8 : 1}
            strokeLinecap="round"
            opacity={t.long ? 0.85 : 0.4}
          />
        ))}
        <motion.g
          animate={{ rotate: reduce ? 0 : run * 720 }}
          transition={{ type: "spring", stiffness: 42, damping: 13 }}
          style={{ transformOrigin: "50px 50px" }}
        >
          <path d="M50 50 L50 32" {...STROKE} strokeWidth={2.3} />
          <path d="M50 50 L62 58" {...STROKE} strokeWidth={2.5} />
        </motion.g>
        <circle cx="50" cy="50" r="2.6" fill={AMBER} />
        <path
          d="M37 64 C43 68 57 68 63 64"
          fill="none"
          stroke={INK}
          strokeWidth={1}
          opacity={0.18}
        />
      </g>
    </svg>
  );
}

function KeyArt({ run, reduce }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
      <g transform="translate(-6 -4) scale(1.12)">
        <g transform="rotate(-12 50 52)">
          <motion.g
            key={run}
            animate={
              run > 0 && !reduce
                ? { rotate: [0, 92, 92, 0] }
                : { rotate: 0 }
            }
            transition={{ duration: 0.95, ease: "easeInOut" }}
            style={{ transformOrigin: "31px 36px" }}
          >
            <circle cx="31" cy="36" r="14" {...STROKE} />
            <circle cx="31" cy="36" r="6.5" {...STROKE} stroke={AMBER} strokeWidth={1.8} />
            <path d="M45 36 H86" {...STROKE} />
            <path d="M48 31 V41" {...STROKE} strokeWidth={1.6} />
            <path d="M84 36 V47 H77 V36" {...STROKE} />
            <path d="M69 36 V44 H63 V36" {...STROKE} />
          </motion.g>
        </g>
      </g>
    </svg>
  );
}

function PlaneArt({ run, reduce }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
      <path
        d="M6 68 C18 72 28 66 36 61"
        fill="none"
        stroke={MUTED}
        strokeWidth={1.2}
        strokeDasharray="2 4"
        opacity={0.55}
      />
      <motion.g
        key={run}
        animate={
          run > 0 && !reduce
            ? {
                x: [0, 22, 12, -6, 0],
                y: [0, -16, -24, -6, 0],
                rotate: [0, 8, -6, 3, 0],
              }
            : undefined
        }
        transition={{ duration: 1.4, ease: "easeInOut" }}
      >
        <path d="M10 54 L90 20 L60 88 L47 62 Z" {...STROKE} />
        <path d="M10 54 L47 62 L90 20" {...STROKE} strokeWidth={1.4} opacity={0.5} />
        <path d="M47 62 L45 79" {...STROKE} strokeWidth={1.4} opacity={0.5} />
        <path d="M85 27 L54 56" {...STROKE} stroke={AMBER} strokeWidth={1.8} />
      </motion.g>
    </svg>
  );
}

function ItemArt({ id, run, reduce }: { id: Id } & ArtProps) {
  if (id === "umbrella") return <UmbrellaArt run={run} reduce={reduce} />;
  if (id === "watch") return <WatchArt run={run} reduce={reduce} />;
  if (id === "key") return <KeyArt run={run} reduce={reduce} />;
  return <PlaneArt run={run} reduce={reduce} />;
}

// sheet

function Item({
  id,
  run,
  reduce,
  claimed,
  px,
  py,
  className,
  align,
  labelFirst,
  onLog,
  onPeek,
}: {
  id: Id;
  run: number;
  reduce: boolean;
  claimed: boolean;
  px: MotionValue<number>;
  py: MotionValue<number>;
  className: string;
  align: "start" | "end";
  labelFirst: boolean;
  onLog: (id: Id) => void;
  onPeek: (id: Id | null) => void;
}) {
  const record = RECORDS[id];
  const lean = id === "watch" || id === "key" ? 5 : 8;
  const x = useTransform(px, (v) => v * lean);
  const y = useTransform(py, (v) => v * lean);

  const meta = (
    <span
      className={`${labelFirst ? "mb-1.5" : "mt-1.5"} flex items-center gap-1.5 lab-mono text-[7.5px] tracking-[0.12em] ${
        align === "end" ? "justify-end" : ""
      }`}
      style={{ color: claimed ? AMBER : MUTED }}
    >
      NO. {record.no}
      {claimed && (
        <svg viewBox="0 0 10 10" className="size-2" aria-hidden>
          <path
            d="M1 5.4 L3.8 8 L9 1.6"
            fill="none"
            stroke={AMBER}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );

  const name = (
    <span
      className={`display block text-[12.5px] italic leading-none ${
        align === "end" ? "text-right" : ""
      }`}
      style={{ color: INK }}
    >
      {record.name}
    </span>
  );

  const label = (
    <span
      className={`flex flex-col ${
        align === "end" ? "items-end" : "items-start"
      }`}
    >
      {meta}
      {name}
    </span>
  );

  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ x, y }}
      onPointerEnter={() => onPeek(id)}
      onPointerLeave={() => onPeek(null)}
    >
      <button
        type="button"
        onClick={() => onLog(id)}
        onFocus={() => onPeek(id)}
        onBlur={() => onPeek(null)}
        aria-label={`${record.name}. ${record.note} ${
          claimed ? "Logged." : "Log this item."
        }`}
        className={`group/item block w-full cursor-pointer text-left focus-visible:[outline:2px_solid_#a2681f] focus-visible:outline-offset-4 ${
          align === "end" ? "text-right" : ""
        }`}
      >
        {labelFirst && label}
        <span
          className={`block transition-transform duration-300 ease-out group-hover/item:-translate-y-1 ${
            id === "key" ? "group-hover/item:rotate-[3deg]" : ""
          } ${id === "umbrella" ? "group-hover/item:rotate-[-2deg]" : ""}`}
        >
          <span className="block aspect-square w-full">
            <ItemArt id={id} run={run} reduce={reduce} />
          </span>
        </span>
        {!labelFirst && label}
      </button>
    </motion.div>
  );
}

export function LostDemo() {
  const reduce = useReducedMotion() ?? false;
  const [runs, setRuns] = useState<Record<Id, number>>({
    umbrella: 0,
    watch: 0,
    key: 0,
    plane: 0,
  });
  const [claimed, setClaimed] = useState<Id[]>([]);
  const [peek, setPeek] = useState<Id | null>(null);
  const [note, setNote] = useState(IDLE);

  const px = useSpring(0, { stiffness: 170, damping: 20 });
  const py = useSpring(0, { stiffness: 170, damping: 20 });

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1));
    py.set(clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1));
  }

  function rest() {
    px.set(0);
    py.set(0);
  }

  function log(id: Id) {
    const next = claimed.includes(id) ? claimed : [...claimed, id];
    setRuns((r) => ({ ...r, [id]: r[id] + 1 }));
    setClaimed(next);
    setNote(next.length === 4 ? DONE : RECORDS[id].note);
  }

  function reset() {
    setRuns({ umbrella: 0, watch: 0, key: 0, plane: 0 });
    setClaimed([]);
    setNote(IDLE);
    setPeek(null);
    rest();
  }

  const done = claimed.length === 4;
  const shown = peek ? RECORDS[peek].note : note;

  return (
    <Screen
      onPointerMove={move}
      onPointerLeave={rest}
      style={{ backgroundColor: "#ece3d0" }}
      className="select-none text-[#1a1510]"
    >
      {/* paper */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,rgba(255,252,243,0.62),transparent_68%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(120,92,50,0.16),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:radial-gradient(rgba(26,21,16,0.13)_0.5px,transparent_0.7px)] [background-size:3px_3px]" />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(90deg,rgba(26,21,16,0.05)_0_1px,transparent_1px)] [background-size:24cqw_100%] opacity-60" />

      {/* frame + header */}
      <div
        className="pointer-events-none absolute inset-[3.4%] border"
        style={{ borderColor: "rgba(26,21,16,0.14)" }}
      />
      <div className="pointer-events-none absolute inset-x-[6.2%] top-[4.4%] flex items-center justify-between">
        <div className="flex items-center gap-2.5 lab-mono text-[7.5px] tracking-[0.16em]">
          <span className="font-semibold">404LAB</span>
          <span className="h-2 w-px" style={{ background: "rgba(26,21,16,0.3)" }} />
          <span style={{ color: MUTED }}>LOST PROPERTY</span>
          <span className="hidden @[30rem]:inline" style={{ color: MUTED }}>
            / DEPT. 404
          </span>
        </div>
        <span
          className="mr-9 lab-mono text-[7.5px] tracking-[0.16em]"
          style={{ color: done ? AMBER : MUTED }}
        >
          {done ? "SHEET CLOSED" : "SHEET 404"}
        </span>
      </div>
      <div
        className="pointer-events-none absolute inset-x-[6.2%] top-[10.6%] h-px"
        style={{ background: RULE }}
      />

      {/* center copy */}
      <div className="pointer-events-none absolute inset-x-0 top-[25.5%] flex flex-col items-center px-[26%] text-center">
        <p
          className="lab-mono text-[7.5px] tracking-[0.22em]"
          style={{ color: MUTED }}
        >
          PAGE NOT FOUND
        </p>
        <p
          className="display mt-[1.2cqw] text-[clamp(44px,13cqw,132px)] leading-[0.8] tracking-[-0.04em]"
          style={{ color: INK }}
        >
          404
        </p>
        <p className="display mt-[2cqw] text-[clamp(14px,3.4cqw,26px)] leading-[1.06]">
          This one never reached the desk.
        </p>
        <p
          className="mt-[1.5cqw] max-w-[34ch] text-[clamp(8.5px,1.6cqw,12.5px)] leading-[1.55]"
          style={{ color: MUTED }}
        >
          Four things were handed in instead. None of them are the page you
          wanted.
        </p>
        <span
          className="mt-[2.4cqw] inline-flex items-center gap-1.5 border-b pb-0.5 lab-mono text-[8px] tracking-[0.08em]"
          style={{ borderColor: "rgba(26,21,16,0.3)" }}
        >
          back to the index
          <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden>
            <path
              d="M2.5 9.5 L9.5 2.5 M4 2.5 H9.5 V8"
              fill="none"
              stroke={INK}
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/* items */}
      <Item
        id="umbrella"
        run={runs.umbrella}
        reduce={reduce}
        claimed={claimed.includes("umbrella")}
        px={px}
        py={py}
        className="left-[5%] top-[17.5%] w-[16.5cqw]"
        align="start"
        labelFirst={false}
        onLog={log}
        onPeek={setPeek}
      />
      <Item
        id="watch"
        run={runs.watch}
        reduce={reduce}
        claimed={claimed.includes("watch")}
        px={px}
        py={py}
        className="right-[5%] top-[17%] w-[16.5cqw]"
        align="end"
        labelFirst={false}
        onLog={log}
        onPeek={setPeek}
      />
      <Item
        id="key"
        run={runs.key}
        reduce={reduce}
        claimed={claimed.includes("key")}
        px={px}
        py={py}
        className="bottom-[13%] left-[5.5%] w-[16.5cqw]"
        align="start"
        labelFirst
        onLog={log}
        onPeek={setPeek}
      />
      <Item
        id="plane"
        run={runs.plane}
        reduce={reduce}
        claimed={claimed.includes("plane")}
        px={px}
        py={py}
        className="bottom-[13%] right-[5.5%] w-[16.5cqw]"
        align="end"
        labelFirst
        onLog={log}
        onPeek={setPeek}
      />

      {/* status strip */}
      <div className="absolute inset-x-[6.2%] bottom-[3.6%]">
        <div className="h-px" style={{ background: RULE }} />
        <div className="mt-[1.3cqw] flex items-end justify-between gap-3">
          <p
            role="status"
            aria-live="polite"
            className="max-w-[64%] text-[clamp(8px,1.45cqw,11px)] leading-[1.45]"
            style={{ color: MUTED }}
          >
            {shown}
          </p>
          <div className="flex shrink-0 items-center gap-2.5 lab-mono text-[7.5px] tracking-[0.1em]">
            <span className="tabular-nums" style={{ color: done ? AMBER : MUTED }}>
              {String(claimed.length).padStart(2, "0")} / 04 LOGGED
            </span>
            <button
              type="button"
              onClick={reset}
              disabled={claimed.length === 0}
              className="cursor-pointer border-b pb-px tracking-[0.1em] transition-opacity duration-200 disabled:cursor-default disabled:opacity-35"
              style={{ borderColor: "rgba(26,21,16,0.3)", color: INK }}
            >
              reset
            </button>
          </div>
        </div>
      </div>
    </Screen>
  );
}
