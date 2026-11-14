"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/demos";
import {
  CATEGORIES,
  PAGES,
  categoryCount,
  type Category,
  type PageEntry,
} from "@/lib/pages";

type Filter = Category | "all";

type Face = {
  id: string;
  label: string;
  display: string;
  mono: string;
};

const FACES: Face[] = [
  {
    id: "instrument",
    label: "Instrument",
    display:
      'var(--font-instrument), Georgia, "Times New Roman", serif',
    mono: "var(--font-geist-mono), ui-monospace, monospace",
  },
  {
    id: "grotesk",
    label: "Grotesk",
    display: "var(--font-geist), ui-sans-serif, system-ui, sans-serif",
    mono: "var(--font-geist), ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "mono",
    label: "Mono",
    display: "var(--font-geist-mono), ui-monospace, monospace",
    mono: "var(--font-geist-mono), ui-monospace, monospace",
  },
];

function PageCard({ page }: { page: PageEntry }) {
  return (
    <article className="group flex h-full flex-col rounded-[14px] border border-line bg-ink-900 p-2 transition-[border-color] duration-300 hover:border-line-2 focus-within:border-line-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-ink-950">
        {page.demo}
        <Link
          href={`/p/${page.slug}`}
          aria-label={`Open ${page.slug}`}
          className="absolute right-2 top-2 z-30 grid size-7 place-items-center rounded-[5px] border border-white/15 bg-ink-950/70 text-white/75 backdrop-blur-[3px] transition-colors duration-200 hover:bg-ink-950 hover:text-fg"
        >
          <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
        </Link>
      </div>

      <Link
        href={`/p/${page.slug}`}
        className="flex flex-1 items-start justify-between gap-3 px-2 pb-1 pt-4"
      >
        <div>
          <h3 className="font-mono text-[13px] text-fg">{page.slug}</h3>
          <p className="mt-1 text-[12px] text-fg-3">{page.desc}</p>
        </div>
        <span className="mt-0.5 shrink-0 font-mono text-[10px] text-fg-3">
          {page.category}
        </span>
      </Link>
    </article>
  );
}

export function PagesGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const [faceId, setFaceId] = useState(FACES[0].id);
  const face = FACES.find((f) => f.id === faceId) ?? FACES[0];
  const active = CATEGORIES.find((c) => c.id === filter);
  const shown = filter === "all" ? PAGES.length : categoryCount(filter);

  return (
    <div
      style={
        {
          "--lab-font-display": face.display,
          "--lab-font-mono": face.mono,
        } as CSSProperties
      }
    >
      <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-line pt-4">
        <span id="face-label" className="font-mono text-[10px] text-fg-3">
          typeface
        </span>
        <div
          role="group"
          aria-labelledby="face-label"
          className="flex items-center gap-1"
        >
          {FACES.map((f) => {
            const on = f.id === faceId;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFaceId(f.id)}
                aria-pressed={on}
                style={{ fontFamily: f.display }}
                className={`rounded-[5px] border px-2.5 py-1 text-[11px] transition-colors duration-200 ${
                  on
                    ? "border-line-2 bg-ink-850 text-fg"
                    : "border-transparent text-fg-3 hover:text-fg-2"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <p className="w-full font-mono text-[10px] leading-snug text-fg-3 sm:ml-auto sm:w-auto sm:text-right">
          previews only · your project sets{" "}
          <span className="text-fg-2">--lab-font-display</span>
        </p>
      </div>

      <div className="sticky top-16 z-40 -mx-5 mt-4 border-y border-line bg-ink-950/96 backdrop-blur-[10px] sm:-mx-8">
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-3 sm:px-6">
          <span className="mr-1 hidden shrink-0 font-mono text-[10px] text-fg-3 lg:block">
            filter
          </span>
          {CATEGORIES.map((c) => {
            const on = filter === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                aria-pressed={on}
                className={`relative shrink-0 rounded-[6px] px-2.5 py-1.5 font-mono text-[11px] transition-colors duration-200 ${
                  on ? "text-fg" : "text-fg-3 hover:text-fg-2"
                }`}
              >
                {on && (
                  <span className="absolute inset-0 rounded-[6px] border border-line-2 bg-ink-850" />
                )}
                <span className="relative">{c.label}</span>
                <span
                  className={`relative ml-1.5 tabular-nums ${
                    on ? "text-amber/80" : "text-fg-3"
                  }`}
                >
                  {categoryCount(c.id)}
                </span>
              </button>
            );
          })}
          <span className="ml-auto hidden shrink-0 pl-4 font-mono text-[10px] text-fg-3 sm:block">
            {active?.blurb}
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES.map((page, i) => (
          <div
            key={page.slug}
            className={
              filter === "all" || page.category === filter ? "block" : "hidden"
            }
          >
            <Reveal delay={0.04 * (i % 3)} className="h-full">
              <PageCard page={page} />
            </Reveal>
          </div>
        ))}
      </div>

      <p className="mt-6 font-mono text-[10.5px] text-fg-3">
        showing {shown} of {PAGES.length}
        <span className="ml-2 text-fg-3/60">hover to run, open for the method</span>
      </p>
    </div>
  );
}
