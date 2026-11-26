"use client";

// brick-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Screen, clamp } from "./chrome";

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
  const [alive, setAlive] = useState<boolean[]>(() => BRICKS.map(() => true));
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
