"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/* Every card shares the same framing so the grid reads as one set. */

export function Caption({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`pointer-events-none absolute left-4 top-3 z-20 lab-mono text-[10px] tracking-[0.02em] text-white/75 [text-shadow:0_1px_3px_rgba(8,9,10,0.6)] ${className}`}
    >
      {label}
    </span>
  );
}

export function HomeLink({ label = "back home" }: { label?: string }) {
  return (
    <span className="pointer-events-none inline-flex items-center gap-1 lab-mono text-[10px] text-white/70">
      {label}
      <ArrowUpRight className="size-3" strokeWidth={1.5} />
    </span>
  );
}

export function Foot({
  method,
  label,
}: {
  method: string;
  label?: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-4 pb-3">
      <HomeLink label={label} />
      <span className="lab-mono text-[10px] text-white/50">{method}</span>
    </div>
  );
}

const SCREEN =
  "group @container relative h-full w-full overflow-hidden bg-ink-900";

export function Screen({
  className = "",
  children,
  ...rest
}: React.ComponentProps<"div">) {
  return (
    <div {...rest} className={`${SCREEN} ${className}`}>
      {children}
    </div>
  );
}

export function ScreenButton({
  className = "",
  children,
  ...rest
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...rest}
      className={`${SCREEN} cursor-default text-left ${className}`}
    >
      {children}
    </button>
  );
}

export function Plate({
  src,
  className = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
  opacity,
  position = "center",
}: {
  src: string;
  className?: string;
  sizes?: string;
  opacity?: number;
  position?: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      className={`object-cover ${className}`}
      style={{ opacity, objectPosition: position }}
    />
  );
}

/* --------------------------------- helpers -------------------------------- */

export function useReplay() {
  const [run, setRun] = useState(0);
  return { run, replay: () => setRun((n) => n + 1) };
}

export function useStill() {
  return useReducedMotion() ?? false;
}

export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/* ------------------------------- install bits ------------------------------ */

export function CopyCommand({
  command,
  className = "",
}: {
  command: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      setDone(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${command}`}
      className={`group/copy flex w-full items-center justify-between gap-4 rounded-control border border-line bg-ink-900 px-3 py-2.5 text-left transition-colors duration-200 hover:border-line-2 active:translate-y-px ${className}`}
    >
      <code className="min-w-0 break-all lab-mono text-[10px] text-fg-2 sm:truncate lg:text-[12px]">
        <span className="mr-1.5 text-amber/80">$</span>
        {command}
      </code>
      <span className="shrink-0 text-fg-3 transition-colors duration-200 group-hover/copy:text-fg">
        {done ? (
          <Check className="size-4" strokeWidth={1.5} />
        ) : (
          <Copy className="size-4" strokeWidth={1.5} />
        )}
      </span>
    </button>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
