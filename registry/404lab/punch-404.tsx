"use client";

// punch-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useState } from "react";
import { motion } from "motion/react";
import { Screen } from "./chrome";

/* ---------------------------------- punch ---------------------------------- */

const PUNCH_FONT: Record<string, string[]> = {
  "4": ["10001", "10001", "11111", "00001", "00001"],
  "0": ["01110", "10001", "10001", "10001", "01110"],
};

const PUNCH_CELLS: { r: number; c: number; on: boolean }[] = [];
for (let r = 0; r < 5; r++) {
  for (let c = 0; c < 17; c++) {
    const digit = c < 5 ? "4" : c < 11 ? "0" : "4";
    const local = c < 5 ? c : c < 11 ? c - 6 : c - 12;
    PUNCH_CELLS.push({ r, c, on: PUNCH_FONT[digit][r][local] === "1" });
  }
}
const PUNCH_TOTAL = PUNCH_CELLS.filter((c) => c.on).length;

const CARD_INK = "#241f18";
const CARD_MUTED = "#6d6353";

export function PunchDemo() {
  const [punched, setPunched] = useState<boolean[]>(
    PUNCH_CELLS.map(() => false),
  );
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);
  const [done, setDone] = useState(false);

  const count = punched.filter(Boolean).length;
  const left = PUNCH_TOTAL - count;

  function punch(r: number, c: number, on: boolean) {
    if (!on) return;
    const index = r * 17 + c;
    if (punched[index]) return;
    const next = [...punched];
    next[index] = true;
    setPunched(next);
    if (next.filter(Boolean).length === PUNCH_TOTAL) setDone(true);
  }

  function reset() {
    setPunched(PUNCH_CELLS.map(() => false));
    setDone(false);
    setHover(null);
  }

  return (
    <Screen
      className="select-none bg-[#131109] text-[#241f18]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 50% 30%, #1c1911 0%, #100e08 72%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:repeating-linear-gradient(92deg,rgba(255,240,205,0.05)_0_1px,transparent_1px_6px)]" />

      <div
        className="absolute left-1/2 top-[47%] w-[88%] -translate-x-1/2 -translate-y-1/2 bg-[#e6ddc6] shadow-[0_14px_40px_rgba(0,0,0,0.55)]"
        style={{ aspectRatio: "88 / 56" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,rgba(36,31,24,0.035) 0 1px,transparent 1px 3px)",
            clipPath: "polygon(0 0, 96% 0, 100% 7%, 100% 100%, 0 100%)",
          }}
        />

        {/* header */}
        <div className="absolute inset-x-[4.5%] top-[4%] flex items-start justify-between">
          <div>
            <p
              className="lab-mono text-[6.5px] tracking-[0.2em]"
              style={{ color: CARD_MUTED }}
            >
              404LAB DATA PROCESSING
            </p>
            <p
              className="mt-1 lab-mono text-[8px] tracking-[0.12em]"
              style={{ color: CARD_INK }}
            >
              PAGE RECORD · CARD 01
            </p>
          </div>
          <div className="text-right">
            <p
              className="lab-mono text-[6.5px] tracking-[0.2em]"
              style={{ color: CARD_MUTED }}
            >
              FORM 404
            </p>
            <p
              className="mt-1 lab-mono text-[6.5px] tracking-[0.14em]"
              style={{ color: CARD_MUTED }}
            >
              DO NOT FOLD
            </p>
          </div>
        </div>

        <div
          className="absolute inset-x-[4.5%] top-[13.5%] h-px"
          style={{ background: "rgba(36,31,24,0.24)" }}
        />

        {/* field */}
        <div
          className="absolute left-1/2 top-[47%] w-[70%] -translate-x-1/2 -translate-y-1/2"
          onPointerLeave={() => setHover(null)}
        >
          <div
            className="relative grid gap-[0.5cqw]"
            style={{ gridTemplateColumns: "repeat(17, 1fr)" }}
          >
            {hover && (
              <>
                <span
                  className="pointer-events-none absolute bottom-[-6%] top-[-6%] z-10 w-px"
                  style={{
                    left: `${((hover.c + 0.5) / 17) * 100}%`,
                    background:
                      "repeating-linear-gradient(180deg,rgba(140,58,44,0.75) 0 3px,transparent 3px 6px)",
                  }}
                />
                <span
                  className="pointer-events-none absolute left-[-3%] right-[-3%] z-10 h-px"
                  style={{
                    top: `${((hover.r + 0.5) / 5) * 100}%`,
                    background:
                      "repeating-linear-gradient(90deg,rgba(140,58,44,0.75) 0 3px,transparent 3px 6px)",
                  }}
                />
              </>
            )}

            {PUNCH_CELLS.map((cell) => {
              const index = cell.r * 17 + cell.c;
              const cut = punched[index];
              if (!cell.on) {
                return (
                  <span
                    key={index}
                    className="aspect-square opacity-[0.08]"
                    style={{ background: CARD_INK }}
                  />
                );
              }
              return (
                <button
                  key={index}
                  type="button"
                  aria-label={`Punch row ${cell.r + 1}, column ${cell.c + 1}`}
                  aria-pressed={cut}
                  disabled={cut}
                  onPointerEnter={() => setHover({ r: cell.r, c: cell.c })}
                  onFocus={() => setHover({ r: cell.r, c: cell.c })}
                  onBlur={() => setHover(null)}
                  onClick={() => punch(cell.r, cell.c, cell.on)}
                  className="group/cell relative aspect-square cursor-pointer transition-transform duration-150 hover:scale-[1.16] focus-visible:[outline:1.5px_solid_#8c3a2c] focus-visible:outline-offset-2 disabled:cursor-default disabled:hover:scale-100"
                  style={{
                    background: cut ? "#191509" : CARD_INK,
                    boxShadow: cut
                      ? "inset 0 1.5px 2.5px rgba(0,0,0,0.85), 0 1px 0 rgba(255,248,226,0.55)"
                      : "inset 0 1px 0 rgba(255,248,226,0.14)",
                  }}
                >
                  {cut && (
                    <motion.span
                      initial={{ y: -2, opacity: 0.9, rotate: 0 }}
                      animate={{ y: 22, opacity: 0, rotate: 18 }}
                      transition={{ duration: 0.55, ease: "easeIn" }}
                      className="pointer-events-none absolute inset-0 bg-[#f1e8d2] shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {done && (
          <motion.div
            initial={{ opacity: 0, scale: 1.5, rotate: -13 }}
            animate={{ opacity: 1, scale: 1, rotate: -7 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute left-1/2 top-[46%] z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ mixBlendMode: "multiply" }}
          >
            <div
              className="border-[2.5px] px-4 py-2 text-center"
              style={{ borderColor: "#8c3a2c", color: "#8c3a2c" }}
            >
              <p className="lab-mono text-[13px] font-semibold tracking-[0.18em]">
                NO RECORD
              </p>
              <p className="mt-0.5 lab-mono text-[6.5px] tracking-[0.16em]">
                THIS PAGE WAS NEVER FILED
              </p>
            </div>
          </motion.div>
        )}

        {/* footer */}
        <div
          className="absolute inset-x-[4.5%] bottom-[4%] flex items-end justify-between"
        >
          <div>
            <p
              className="lab-mono text-[6.5px] tracking-[0.14em]"
              style={{ color: CARD_MUTED }}
            >
              {hover
                ? `ROW ${String(hover.r + 1).padStart(2, "0")} · COL ${String(
                    hover.c + 1,
                  ).padStart(2, "0")}`
                : "CROSSHAIR ON HOVER"}
            </p>
            <p
              className="mt-1.5 lab-mono text-[9px] tracking-[0.1em] tabular-nums"
              style={{ color: CARD_INK }}
            >
              {String(count).padStart(2, "0")} / {PUNCH_TOTAL} PUNCHED
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className="lab-mono text-[6.5px] tracking-[0.14em]"
              style={{ color: done ? "#8c3a2c" : CARD_MUTED }}
            >
              {done ? "CARD VOID" : `${String(left).padStart(2, "0")} CELLS LEFT`}
            </span>
            <button
              type="button"
              onClick={reset}
              disabled={count === 0}
              className="cursor-pointer border-b pb-px lab-mono text-[6.5px] tracking-[0.14em] transition-opacity duration-200 disabled:cursor-default disabled:opacity-35"
              style={{ borderColor: "rgba(36,31,24,0.35)", color: CARD_INK }}
            >
              NEW CARD
            </button>
          </div>
        </div>

        <span
          className="pointer-events-none absolute bottom-[4%] left-1/2 -translate-x-1/2 lab-mono text-[5.5px] tracking-[0.22em]"
          style={{ color: "rgba(36,31,24,0.28)" }}
        >
          ▮ ▮ ▮ ▮
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[6.5%] flex justify-center">
        <p className="lab-mono text-[7px] tracking-[0.16em] text-[#6c6455]">
          ONE CARD, ONE MISSING PAGE
        </p>
      </div>
    </Screen>
  );
}
