"use client";

// tear-404 · 404lab
// Requires ./chrome.tsx and the 404lab tokens.

import { Caption, Foot, Plate, Screen } from "./chrome";

/* ----------------------------------- tear ---------------------------------- */

const TEAR_TOP =
  "polygon(0 0, 100% 0, 100% 48.6%, 92% 51.4%, 85% 48.5%, 78% 52.2%, 70% 49%, 62% 51.6%, 54% 48.8%, 46% 52%, 38% 49.2%, 30% 52.4%, 22% 48.9%, 14% 51.7%, 7% 49%, 0 51.2%)";
const TEAR_BOTTOM =
  "polygon(0 51.2%, 7% 49%, 14% 51.7%, 22% 48.9%, 30% 52.4%, 38% 49.2%, 46% 52%, 54% 48.8%, 62% 51.6%, 70% 49%, 78% 52.2%, 85% 48.5%, 92% 51.4%, 100% 48.6%, 100% 100%, 0 100%)";

const SEAM =
  "0,51.2 7,49 14,51.7 22,48.9 30,52.4 38,49.2 46,52 54,48.8 62,51.6 70,49 78,52.2 85,48.5 92,51.4 100,48.6";

function TearHalf({ clip, caption }: { clip: string; caption?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ clipPath: clip }}>
      <Plate src="/worlds/px2.webp" className="brightness-[0.9]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.35)_0%,rgba(8,9,10,0.15)_50%,rgba(8,9,10,0.75)_100%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span className="display text-[72px] leading-none text-fg drop-shadow-[0_2px_10px_rgba(8,9,10,0.6)]">
          404
        </span>
      </div>
      {caption && (
        <span className="absolute inset-x-0 top-[63%] text-center lab-mono text-[10px] text-white/70">
          this page was torn out
        </span>
      )}
    </div>
  );
}

function TearSeam() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <polyline
        points={SEAM}
        fill="none"
        stroke="rgba(242,237,227,0.36)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function TearDemo() {
  return (
    <Screen className="bg-ink-950">
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:-translate-y-[5px]">
        <TearHalf clip={TEAR_TOP} />
        <TearSeam />
      </div>
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:translate-y-[5px]">
        <TearHalf clip={TEAR_BOTTOM} caption />
        <TearSeam />
      </div>

      <Caption label="404 / tear" />
      <Foot method="clip-path" />
    </Screen>
  );
}
