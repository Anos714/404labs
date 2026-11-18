"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Screen, ScreenButton, clamp } from "./chrome";

/* ---------------------------------- brick ---------------------------------- */

const BRICK_FONT: Record<string, string[]> = {
  "4": ["10001", "10001", "11111", "00001", "00001"],
  "0": ["01110", "10001", "10001", "10001", "01110"],
};

const B_GAP = 0.8;
const B_W = 4.3;
const B_H = 3.3;
const WALL_X = (100 - (17 * B_W + 16 * B_GAP)) / 2;
const WALL_Y = 12.5;

const BRICKS: { x: number; y: number; key: string }[] = [];
["4", "0", "4"].forEach((digit, d) => {
  BRICK_FONT[digit].forEach((line, r) => {
    line.split("").forEach((bit, c) => {
      if (bit !== "1") return;
      BRICKS.push({
        x: WALL_X + (d * 6 + c) * (B_W + B_GAP),
        y: WALL_Y + r * (B_H + B_GAP),
        key: `${d}-${r}-${c}`,
      });
    });
  });
});

const PADDLE_Y = 66;
const BALL_R = 1.15;

export function BrickDemo() {
  const reduce = useReducedMotion() ?? false;
  const ballEl = useRef<HTMLDivElement>(null);
  const paddleEl = useRef<HTMLDivElement>(null);
  const aliveRef = useRef<boolean[]>(BRICKS.map(() => true));
  const ballRef = useRef({ x: 50, y: 59, vx: 0, vy: 0 });
  const paddleRef = useRef(50);
  const ballsRef = useRef(3);
  const phaseRef = useRef<"ready" | "live" | "over" | "clear">("ready");
  const keys = useRef({ left: false, right: false });
  const [alive, setAlive] = useState<boolean[]>(aliveRef.current);
  const [hits, setHits] = useState(0);
  const [balls, setBalls] = useState(3);
  const [phase, setPhase] = useState<"ready" | "live" | "over" | "clear">(
    "ready",
  );

  const over = phase === "over" || phase === "clear";

  useEffect(() => {
    let raf = 0;
    let last = 0;
    let idle = 0;

    const serve = () => {
      const b = ballRef.current;
      b.x = paddleRef.current;
      b.y = PADDLE_Y - 6;
      b.vx = (Math.random() - 0.5) * 26;
      b.vy = -47;
      phaseRef.current = "live";
      setPhase("live");
    };

    const lose = () => {
      if (ballsRef.current <= 1) {
        ballsRef.current = 0;
        setBalls(0);
        phaseRef.current = "over";
        setPhase("over");
      } else {
        ballsRef.current -= 1;
        setBalls(ballsRef.current);
        idle = 0;
        phaseRef.current = "ready";
        setPhase("ready");
      }
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000 || 0.016, 0.032);
      last = now;

      if (keys.current.left)
        paddleRef.current = clamp(paddleRef.current - 48 * dt, 9, 91);
      if (keys.current.right)
        paddleRef.current = clamp(paddleRef.current + 48 * dt, 9, 91);

      if (phaseRef.current === "ready" && !reduce) {
        idle += dt;
        ballRef.current.x = paddleRef.current;
        ballRef.current.y = PADDLE_Y - 6;
        if (idle > 1.1) serve();
      }

      if (phaseRef.current === "live") {
        const b = ballRef.current;
        const steps = 3;
        for (let s = 0; s < steps; s++) {
          const h = dt / steps;
          b.x += b.vx * h;
          b.y += b.vy * h;

          if (b.x < BALL_R) {
            b.x = BALL_R;
            b.vx = Math.abs(b.vx);
          }
          if (b.x > 100 - BALL_R) {
            b.x = 100 - BALL_R;
            b.vx = -Math.abs(b.vx);
          }
          if (b.y < BALL_R) {
            b.y = BALL_R;
            b.vy = Math.abs(b.vy);
          }

          if (
            b.vy > 0 &&
            b.y + BALL_R >= PADDLE_Y &&
            b.y - BALL_R <= PADDLE_Y + 2 &&
            Math.abs(b.x - paddleRef.current) < 9.5
          ) {
            b.y = PADDLE_Y - BALL_R;
            b.vy = -Math.abs(b.vy);
            b.vx = clamp(b.vx + (b.x - paddleRef.current) * 1.7, -58, 58);
          }

          for (let i = 0; i < BRICKS.length; i++) {
            if (!aliveRef.current[i]) continue;
            const k = BRICKS[i];
            if (
              b.x + BALL_R > k.x &&
              b.x - BALL_R < k.x + B_W &&
              b.y + BALL_R > k.y &&
              b.y - BALL_R < k.y + B_H
            ) {
              const ox = Math.min(
                b.x + BALL_R - k.x,
                k.x + B_W - (b.x - BALL_R),
              );
              const oy = Math.min(
                b.y + BALL_R - k.y,
                k.y + B_H - (b.y - BALL_R),
              );
              if (ox < oy) b.vx = -b.vx;
              else b.vy = -b.vy;
              aliveRef.current[i] = false;
              setAlive([...aliveRef.current]);
              setHits((n) => n + 1);
              if (aliveRef.current.every((v) => !v)) {
                phaseRef.current = "clear";
                setPhase("clear");
              }
              break;
            }
          }

          if (b.y - BALL_R > 71) {
            lose();
            break;
          }
        }
      }

      if (ballEl.current) {
        ballEl.current.style.left = `${ballRef.current.x}%`;
        ballEl.current.style.top = `${(ballRef.current.y / 75) * 100}%`;
      }
      if (paddleEl.current) {
        paddleEl.current.style.left = `${paddleRef.current}%`;
        paddleEl.current.style.top = `${(PADDLE_Y / 75) * 100}%`;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  function aim(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    paddleRef.current = clamp(((e.clientX - r.left) / r.width) * 100, 9, 91);
  }

  function retry() {
    aliveRef.current = BRICKS.map(() => true);
    setAlive([...aliveRef.current]);
    setHits(0);
    ballsRef.current = 3;
    setBalls(3);
    ballRef.current = { x: 50, y: 59, vx: 0, vy: 0 };
    paddleRef.current = 50;
    phaseRef.current = "ready";
    setPhase("ready");
  }

  function press() {
    if (phaseRef.current === "ready") {
      const b = ballRef.current;
      b.x = paddleRef.current;
      b.y = PADDLE_Y - 6;
      b.vx = (Math.random() - 0.5) * 26;
      b.vy = -47;
      phaseRef.current = "live";
      setPhase("live");
    }
  }

  return (
    <Screen
      role="application"
      aria-label="Breakout wall. Move the pointer or use arrow keys to steer. Press space to serve."
      tabIndex={0}
      onPointerMove={aim}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        aim(e);
        press();
      }}
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        if (e.key === "ArrowLeft") keys.current.left = true;
        if (e.key === "ArrowRight") keys.current.right = true;
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          press();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === "ArrowLeft") keys.current.left = false;
        if (e.key === "ArrowRight") keys.current.right = false;
      }}
      className="touch-none select-none bg-[#090907] outline-none focus-visible:[outline:1px_solid_#e9b871] focus-visible:outline-offset-[-3px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(233,184,113,0.06),transparent_68%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:linear-gradient(90deg,rgba(233,184,113,0.16)_0_1px,transparent_1px)] [background-size:10cqw_100%]" />

      <div className="pointer-events-none absolute inset-x-[7%] top-[4%] flex items-center justify-between lab-mono text-[7.5px] tracking-[0.16em] text-[#8a8171]">
        <span className="text-[#e3dccb]">404LAB ARCADE</span>
        <span>TABLE 01</span>
      </div>
      <div
        className="pointer-events-none absolute inset-x-[7%] top-[8.4%] h-px"
        style={{ background: "rgba(227,220,203,0.14)" }}
      />
      <div className="pointer-events-none absolute inset-x-[7%] top-[9.6%] flex items-center justify-between lab-mono text-[7px] tracking-[0.14em] text-[#8a8171]">
        <span className="tabular-nums">
          {String(Math.min(balls, 3)).padStart(2, "0")} BALLS
          <span className="mx-2 text-[#4a463d]">/</span>
          <span className="tabular-nums text-[#c9bfa9]">
            {String(hits).padStart(2, "0")} HIT
          </span>
        </span>
        <span className="tabular-nums text-[#6f695c]">
          {String(BRICKS.length - hits).padStart(2, "0")} BRICK
        </span>
      </div>

      {BRICKS.map((b, i) => (
        <div
          key={b.key}
          className="pointer-events-none absolute rounded-[1.5px] transition-[opacity,transform] duration-200 ease-out"
          style={{
            left: `${b.x}%`,
            top: `${(b.y / 75) * 100}%`,
            width: `${B_W}cqw`,
            height: `${(B_H / 100) * 100}cqw`,
            opacity: alive[i] ? 1 : 0,
            transform: alive[i] ? "scale(1)" : "scale(0.35)",
            background:
              i % 3 === 0
                ? "linear-gradient(#efe7d4,#ded4be)"
                : "linear-gradient(#e5dcc8,#d2c7b0)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -2px 0 rgba(48,40,28,0.28), 0 1px 2px rgba(0,0,0,0.5)",
          }}
        />
      ))}

      {!over && (
        <div className="pointer-events-none absolute inset-x-0 top-[45.5%] flex flex-col items-center text-center">
          <p className="lab-mono text-[7px] tracking-[0.24em] text-[#7d7566]">
            THE NUMBER IS THE WALL
          </p>
          <p className="mt-1.5 max-w-[58%] text-[clamp(8px,1.55cqw,11px)] leading-[1.5] text-[#a39a88]">
            Take it apart one brick at a time. The page is not in there.
          </p>
        </div>
      )}

      <div
        ref={ballEl}
        className="pointer-events-none absolute z-10 size-[2.3cqw] rounded-full bg-[#f4eddd]"
        style={{
          left: "50%",
          top: "78.6%",
          transform: "translate(-50%,-50%)",
          boxShadow: "0 0 0 1px rgba(9,9,7,0.5), 0 2px 6px rgba(233,184,113,0.28)",
        }}
      />
      <div
        ref={paddleEl}
        className="pointer-events-none absolute z-10 h-[1.8cqw] w-[17cqw] rounded-full bg-[#e9b871]"
        style={{
          left: "50%",
          top: `${(PADDLE_Y / 75) * 100}%`,
          transform: "translate(-50%,-50%)",
          boxShadow: "0 2px 0 #8d6b39, 0 6px 12px rgba(0,0,0,0.45)",
        }}
      />

      <div className="pointer-events-none absolute inset-x-[7%] bottom-[2.2%] flex items-center justify-between lab-mono text-[6.5px] tracking-[0.16em] text-[#6a6558]">
        <span>MOVE THE PADDLE</span>
        <span className="text-[#8a8171]">
          {over ? "TABLE CLOSED" : reduce ? "PRESS SPACE TO SERVE" : "SPACE TO SERVE"}
        </span>
      </div>

      {over && (
        <div className="absolute inset-x-0 top-[48%] z-30 flex flex-col items-center gap-2.5">
          <p className="display text-[clamp(13px,2.9cqw,20px)] text-[#efe7d4]">
            {phase === "clear" ? "Nothing behind it." : "No balls left."}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              retry();
            }}
            className="cursor-pointer rounded-control border border-[#4a463d] bg-[#141310] px-3 py-1.5 lab-mono text-[8px] tracking-[0.12em] text-[#e9b871] transition-colors duration-200 hover:border-[#e9b871]"
          >
            REBUILD THE WALL
          </button>
        </div>
      )}
    </Screen>
  );
}

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

/* --------------------------------- watcher --------------------------------- */

const WATCH_LOGS = [
  "it saw you arrive",
  "it saw no page",
  "it looked again",
  "still nothing",
];

const WATCH_EYE = "#181a14";
const WATCH_LINE = "rgba(233,184,113,0.17)";

function WatchEye({
  blink,
  left,
  top,
}: {
  blink: boolean;
  left: MotionValue<string>;
  top: MotionValue<string>;
}) {
  return (
    <motion.div
      className="relative shrink-0 overflow-hidden rounded-[50%] border border-[#4a4d3d] bg-[#0c0d0a]"
      style={{
        width: "17.4cqw",
        height: "10.2cqw",
        boxShadow:
          "inset 0 2.4cqw 3.4cqw rgba(0,0,0,0.9), inset 0 -0.5cqw 1.2cqw rgba(233,184,113,0.12), 0 0 4cqw rgba(233,184,113,0.07)",
      }}
      animate={{ scaleY: blink ? 0.045 : 1 }}
      transition={{ duration: 0.13, ease: "easeInOut" }}
    >
      <div
        className="absolute inset-[8%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, #4e5341 0%, #2b3023 54%, #0d0f0a 100%)",
        }}
      />
      {[...Array(16)].map((_, i) => (
        <span
          key={i}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[0.12cqw] w-[40%] origin-left"
          style={{
            transform: `rotate(${i * 22.5}deg) translateX(6%)`,
            background:
              "linear-gradient(90deg, rgba(233,184,113,0.3), rgba(233,184,113,0.03) 70%, transparent)",
          }}
        />
      ))}
      <motion.span
        className="absolute z-10 block rounded-[50%]"
        style={{
          left,
          top,
          width: "3.1cqw",
          height: "5.3cqw",
          translate: "-50% -50%",
          border: "1px solid #d3a862",
          background:
            "radial-gradient(circle at 42% 34%, #ffe8bd 0%, #e1b473 32%, #a3722f 66%, #5a3c18 100%)",
          boxShadow:
            "0 0 1.2cqw rgba(224,176,106,0.35), inset 0 0 0 0.18cqw rgba(26,18,8,0.35)",
        }}
      >
        <span className="absolute left-1/2 top-1/2 h-[68%] w-[0.85cqw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0a0b07]" />
        <span className="absolute left-[18%] top-[14%] size-[0.75cqw] rounded-full bg-[#fffaf0]" />
        <span className="absolute bottom-[20%] right-[17%] size-[0.32cqw] rounded-full bg-[#fff4dc]/70" />
      </motion.span>
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[24%] rounded-b-[50%] bg-[#080905]" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] rounded-t-[50%] bg-[#080905]/85" />
      <motion.span
        className="pointer-events-none absolute inset-0 origin-top bg-[#0b0c09]"
        animate={{ scaleY: blink ? 1 : 0 }}
        transition={{ duration: 0.11 }}
      />
      <span
        className="pointer-events-none absolute inset-0 rounded-[50%]"
        style={{ boxShadow: `inset 0 0 0 1px ${WATCH_LINE}` }}
      />
    </motion.div>
  );
}

export function WatcherDemo() {
  const reduce = useReducedMotion() ?? false;
  const mx = useSpring(0, { stiffness: 150, damping: 20 });
  const my = useSpring(0, { stiffness: 150, damping: 20 });
  const left = useTransform(mx, (v) => `${50 + v * 19}%`);
  const top = useTransform(my, (v) => `${50 + v * 24}%`);
  const [blink, setBlink] = useState(false);
  const [blinks, setBlinks] = useState(0);
  const [log, setLog] = useState(0);
  const busy = useRef(false);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 150);
    }, 6400);
    return () => window.clearInterval(id);
  }, [reduce]);

  function move(e: React.PointerEvent<HTMLButtonElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1));
    my.set(clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1));
  }

  function blinkOnce() {
    if (busy.current) return;
    busy.current = true;
    setBlink(true);
    setBlinks((n) => n + 1);
    setLog((n) => (n + 1) % WATCH_LOGS.length);
    window.setTimeout(() => {
      busy.current = false;
      setBlink(false);
    }, 180);
  }

  return (
    <ScreenButton
      aria-label="A single eye set inside the number 404. Move the pointer to make it look. Click to blink."
      onPointerMove={move}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      onClick={blinkOnce}
      className="select-none bg-[#070806] text-[#e6ddc8] outline-none focus-visible:[outline:1px_solid_#e9b871] focus-visible:outline-offset-[-3px]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(90deg,rgba(233,184,113,0.055)_0_1px,transparent_1px),linear-gradient(0deg,rgba(233,184,113,0.045)_0_1px,transparent_1px)] [background-size:5cqw_5cqw]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_46%,rgba(0,0,0,0)_35%,rgba(3,4,2,0.78)_100%)]" />

      <div className="pointer-events-none absolute inset-x-[7%] top-[4%] flex items-center justify-between lab-mono text-[7px] tracking-[0.2em] text-[#7e7865]">
        <span className="text-[#d8ceb6]">NIGHT WATCH</span>
        <span>SECTOR 404</span>
      </div>
      <div
        className="pointer-events-none absolute inset-x-[7%] top-[8.6%] h-px"
        style={{ background: "rgba(233,184,113,0.13)" }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[19%] size-[52cqw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,184,113,0.11)_0%,rgba(233,184,113,0.035)_42%,transparent_68%)]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[21%] flex items-center justify-center gap-[1.8cqw]">
        <span
          className="display select-none text-[29cqw] leading-[0.72]"
          style={{ color: "transparent", WebkitTextStroke: "1.5px #4a4c3c" }}
        >
          4
        </span>
        <WatchEye blink={blink} left={left} top={top} />
        <span
          className="display select-none text-[29cqw] leading-[0.72]"
          style={{ color: "transparent", WebkitTextStroke: "1.5px #4a4c3c" }}
        >
          4
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[51.5%] flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span className="h-px w-5" style={{ background: WATCH_LINE }} />
          <span className="lab-mono text-[6.5px] tracking-[0.22em] text-[#8b836e]">
            THE ZERO OPENED ONE EYE
          </span>
          <span className="h-px w-5" style={{ background: WATCH_LINE }} />
        </div>
        <p className="display mt-[2.6cqw] max-w-[70%] text-center text-[clamp(13px,3.5cqw,25px)] leading-[1.12] text-[#efe6d1]">
          It watched the empty slot all night.
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-[8%] bottom-[11%]">
        <div
          className="h-px w-full"
          style={{ background: "rgba(233,184,113,0.12)" }}
        />
        <div className="mt-[1.6cqw] flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="lab-mono text-[6px] tracking-[0.2em] text-[#6f6a59]">
              WATCH LOG
            </p>
            <p
              role="status"
              aria-live="polite"
              className="mt-1 lab-mono text-[7.5px] tracking-[0.1em] text-[#bdb39b]"
            >
              {WATCH_LOGS[log]}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 lab-mono text-[6.5px] tracking-[0.14em] text-[#7e7865]">
            <span className="tabular-nums">
              {String(blinks).padStart(2, "0")} BLINKS
            </span>
            <span className="text-[#c9bfa5]">CLICK TO BLINK</span>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-[7%] bottom-[4.5%] flex items-center justify-between lab-mono text-[6.5px] tracking-[0.18em] text-[#5f5b4c]"
      >
        <span>NO ASSIGNMENT · NO RELIEF</span>
        <span className="flex items-center gap-1.5">
          <span className="size-[0.9cqw] bg-[#a2681f]" />
          REC
        </span>
      </div>
    </ScreenButton>
  );
}

/* -------------------------------- wireframe -------------------------------- */

export function WireframeDemo() {
  const reduce = useReducedMotion() ?? false;
  const [p, setP] = useState(58);
  const [pen, setPen] = useState(58);
  const [hover, setHover] = useState(false);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const grow = (a: number, b: number) => clamp((p - a) / (b - a), 0, 1);

  function scrub(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = clamp(((e.clientX - r.left) / r.width) * 100, 0, 100);
    setPen(x);
    setP(x);
    setHover(true);
  }

  function walk() {
    cancelAnimationFrame(raf.current);
    if (reduce) {
      setP(100);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = clamp((now - start) / 1500, 0, 1);
      setP(t * 100);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }

  return (
    <Screen className="select-none bg-[#08090a] text-[#e9e4d7]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(242,237,227,0.055),transparent_66%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(90deg,rgba(242,237,227,0.04)_0_1px,transparent_1px),linear-gradient(0deg,rgba(242,237,227,0.04)_0_1px,transparent_1px)] [background-size:6cqw_6cqw]" />

      <div
        className="absolute left-1/2 top-[6%] w-[78cqw] -translate-x-1/2 rounded-[6px] border border-dashed border-[#2d3336] bg-[#0a0b0c] shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
        style={{ height: "63cqw" }}
      >
        <div className="absolute inset-x-[3.6cqw] top-[3.2cqw] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={walk}
              aria-label="Rebuild the layout from the start"
              className="group/icon grid size-[4.6cqw] cursor-pointer place-items-center rounded-full border border-[#2c3235] text-[#7d8178] transition-colors duration-200 hover:border-[#e9b871] hover:text-[#e9b871]"
            >
              <svg viewBox="0 0 16 16" className="size-[2.2cqw]" aria-hidden>
                <rect
                  x="2.5"
                  y="2.5"
                  width="11"
                  height="11"
                  rx="1.6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M4 10.5 L7 7 L9 9 L12 5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10.8" cy="4.6" r="0.8" fill="currentColor" />
              </svg>
            </button>
            <span className="lab-mono text-[6.5px] tracking-[0.2em] text-[#a29d8e]">
              TEMPLATE 01
            </span>
          </div>
          <span className="lab-mono text-[6px] tracking-[0.18em] text-[#656960]">
            {p > 96 ? "MISSING PAGE" : `LAYOUT ${Math.round(p).toString().padStart(3, "0")}`}
          </span>
        </div>

        <div
          onPointerMove={scrub}
          onPointerDown={scrub}
          onPointerLeave={() => setHover(false)}
          className="absolute left-[3.6cqw] top-[9.4cqw] h-[28cqw] w-[70.8cqw] cursor-ew-resize touch-none overflow-hidden border border-[#202528] bg-[#090a0b]"
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:linear-gradient(90deg,rgba(242,237,227,0.05)_0_1px,transparent_1px),linear-gradient(0deg,rgba(242,237,227,0.05)_0_1px,transparent_1px)] [background-size:3.2cqw_3.2cqw]" />

          <div
            className="pointer-events-none absolute left-[5%] top-[7%] h-[7%] rounded-[1px] bg-[#3c4446]"
            style={{ width: `${grow(3, 18) * 42}%` }}
          />
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="pointer-events-none absolute top-[9.5%] size-[1.1cqw] rounded-full bg-[#3c4446]"
              style={{
                right: `${16 - i * 4}%`,
                opacity: grow(8, 18),
              }}
            />
          ))}

          <div
            className="pointer-events-none absolute left-[5%] top-[19%] w-[17%] border border-[#252b2e] bg-[#0c0e0f]"
            style={{ height: `${grow(12, 30) * 44}%` }}
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="absolute left-[12%] h-[4%] bg-[#2b3235]"
                style={{
                  top: `${16 + i * 17}%`,
                  width: `${50 + (i % 2) * 18}%`,
                  opacity: grow(20 + i * 3, 30 + i * 3),
                }}
              />
            ))}
          </div>

          <div
            className="pointer-events-none absolute left-[26%] top-[19%] border border-[#2c3336] bg-[#0b0d0e]"
            style={{ height: "40%", width: `${grow(24, 54) * 69}%` }}
          >
            <span
              className="display absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[9cqw] leading-none text-[#d9d2c0]"
              style={{ opacity: grow(46, 60) }}
            >
              404
            </span>
            <span
              className="absolute bottom-[9%] left-[7%] h-[3%] w-[38%] bg-[#2c3336]"
              style={{ opacity: grow(50, 62) }}
            />
          </div>

          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="pointer-events-none absolute top-[64%] border border-[#252b2e] bg-[#0b0d0e]"
              style={{
                left: `${26 + i * 17}%`,
                width: "14%",
                height: `${grow(58 + i * 4, 74 + i * 4) * 18}%`,
              }}
            />
          ))}

          <div
            className="pointer-events-none absolute bottom-[8%] left-[5%] h-[1px] bg-[#394144]"
            style={{ width: `${grow(82, 95) * 62}%` }}
          />

          {hover && (
            <>
              <span
                className="pointer-events-none absolute inset-y-0 z-20 w-px"
                style={{
                  left: `${pen}%`,
                  background:
                    "repeating-linear-gradient(180deg,rgba(233,184,113,0.65) 0 4px,transparent 4px 8px)",
                }}
              />
              <span
                className="pointer-events-none absolute z-20 -translate-x-1/2 rounded-[1px] bg-[#e9b871] px-1 py-0.5 lab-mono text-[5.5px] text-[#17120a]"
                style={{ left: `${pen}%`, top: "4%" }}
              >
                {Math.round(p)}
              </span>
            </>
          )}
        </div>

        <p className="absolute left-[4.2cqw] right-[4.2cqw] top-[39.6cqw] text-[clamp(11px,2.9cqw,21px)] leading-[1.15] text-[#efe8d8]">
          This layout was never filed.
        </p>
        <p className="absolute left-[4.2cqw] right-[4.2cqw] top-[45.4cqw] text-[clamp(7px,1.6cqw,11px)] leading-[1.5] text-[#8c8d83]">
          The frame is here. The page is not. Sweep across the frame to lay it
          out, and sweep back to take it apart.
        </p>

        <div className="absolute inset-x-[4.2cqw] top-[52.6cqw] flex items-center gap-2.5">
          <span className="lab-mono text-[5.8px] tracking-[0.18em] text-[#6d7169]">
            LAYOUT
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(p)}
            aria-label="Layout progress"
            onChange={(e) => {
              setP(Number(e.target.value));
              setPen(Number(e.target.value));
            }}
            className="h-[1.1cqw] w-full cursor-pointer appearance-none rounded-full bg-[#242a2d] accent-[#e9b871]"
          />
          <span className="w-[5cqw] shrink-0 text-right lab-mono text-[5.8px] tabular-nums text-[#a49f90]">
            {Math.round(p)}
          </span>
        </div>

        <div className="absolute inset-x-[4.2cqw] top-[57.6cqw] flex items-center justify-between">
          <span className="lab-mono text-[5.8px] tracking-[0.16em] text-[#5e6359]">
            NO TEMPLATE BEHIND IT
          </span>
          <button
            type="button"
            onClick={walk}
            className="cursor-pointer border-b border-[#3a4144] pb-px lab-mono text-[5.8px] tracking-[0.16em] text-[#b5afa0] transition-colors duration-200 hover:text-[#e9b871]"
          >
            WALK THE FRAME
          </button>
        </div>

        {p > 95 && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none absolute right-[4.2cqw] top-[9.4cqw] z-30 rounded-[2px] border border-[#8c3a2c]/70 bg-[#120d0b] px-1.5 py-0.5 lab-mono text-[5.5px] tracking-[0.14em] text-[#c47a63]"
          >
            PAGE MISSING
          </motion.span>
        )}
      </div>
    </Screen>
  );
}
