"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/demos";
import { FACES } from "@/lib/faces";
import {
  CATEGORIES,
  PAGES,
  categoryCount,
  type Category,
  type PageEntry,
} from "@/lib/pages";

type Filter = Category | "all";

function FaceRail({
  faceId,
  onPick,
}: {
  faceId: string;
  onPick: (id: string) => void;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = rail.current;
    if (!el) return;

    const read = () =>
      setEdges({
        start: el.scrollLeft <= 1,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
      });

    read();
    el.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      el.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  const nudge = (direction: number) =>
    rail.current?.scrollBy({ left: direction * 340, behavior: "smooth" });

  return (
    <div className="order-3 flex w-full min-w-0 items-center gap-1.5 sm:order-none sm:flex-1">
      <div className="relative min-w-0 flex-1">
        <div
          ref={rail}
          role="group"
          aria-labelledby="face-label"
          className="flex min-w-0 items-center gap-1 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {FACES.map((face) => {
            const on = face.id === faceId;
            return (
              <button
                key={face.id}
                type="button"
                onClick={() => onPick(face.id)}
                aria-pressed={on}
                style={{ fontFamily: face.display }}
                className={`shrink-0 rounded-control border px-2.5 py-1 text-[11.5px] leading-none transition-colors duration-200 ${
                  on
                    ? "border-line-2 bg-ink-850 text-fg"
                    : "border-transparent text-fg-3 hover:border-line hover:text-fg-2"
                }`}
              >
                {face.label}
              </button>
            );
          })}
        </div>
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 left-0 w-7 bg-gradient-to-r from-ink-950 to-transparent transition-opacity duration-200 ${
            edges.start ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 w-7 bg-gradient-to-l from-ink-950 to-transparent transition-opacity duration-200 ${
            edges.end ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      <div className="hidden shrink-0 items-center gap-0.5 sm:flex">
        <button
          type="button"
          onClick={() => nudge(-1)}
          disabled={edges.start}
          aria-label="Previous typeface"
          className="grid size-7 place-items-center rounded-control border border-line text-fg-3 transition-colors duration-200 hover:border-line-2 hover:text-fg disabled:opacity-30 disabled:hover:border-line disabled:hover:text-fg-3"
        >
          <ChevronLeft className="size-3.5" strokeWidth={1.6} />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          disabled={edges.end}
          aria-label="Next typeface"
          className="grid size-7 place-items-center rounded-control border border-line text-fg-3 transition-colors duration-200 hover:border-line-2 hover:text-fg disabled:opacity-30 disabled:hover:border-line disabled:hover:text-fg-3"
        >
          <ChevronRight className="size-3.5" strokeWidth={1.6} />
        </button>
      </div>
    </div>
  );
}

function PageCard({ page, index }: { page: PageEntry; index: number }) {
  return (
    <article className="group flex h-full flex-col rounded-panel border border-line bg-ink-900 p-1.5 transition-[border-color] duration-300 hover:border-line-2 focus-within:border-line-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-tile bg-ink-950">
        {page.demo}
        <Link
          href={`/p/${page.slug}`}
          aria-label={`Open ${page.slug}`}
          className="absolute right-2 top-2 z-30 grid size-7 place-items-center rounded-control border border-white/15 bg-ink-950/90 text-white/75 transition-[opacity,color,background-color,border-color] duration-200 hover:border-white/30 hover:bg-ink-950 hover:text-fg sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
        >
          <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
        </Link>
      </div>

      <Link
        href={`/p/${page.slug}`}
        className="flex flex-1 flex-col px-1.5 pt-3"
      >
        <span className="flex items-baseline justify-between gap-3">
          <h3 className="lab-mono text-[12.5px] leading-none text-fg">
            {page.slug}
          </h3>
          <span className="shrink-0 lab-mono text-[10px] tabular-nums text-fg-3">
            {String(index + 1).padStart(2, "0")}
          </span>
        </span>
        <p className="mt-1.5 text-[12px] leading-snug text-fg-3">
          {page.desc}
        </p>
      </Link>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line px-1.5 pb-1 pt-2 lab-mono text-[10px] leading-none text-fg-3">
        <span className="shrink-0">{page.category}</span>
        <span className="truncate text-right">{page.method}</span>
      </div>
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
      <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4">
        <div className="flex shrink-0 items-center gap-2.5">
          <span id="face-label" className="font-mono text-[10px] text-fg-3">
            typeface
          </span>
          <span className="lab-mono text-[10px] tabular-nums text-fg-3/80">
            {String(FACES.findIndex((f) => f.id === faceId) + 1).padStart(2, "0")}
            /{FACES.length}
          </span>
        </div>

        <FaceRail faceId={faceId} onPick={setFaceId} />

        <p className="order-4 w-full font-mono text-[10px] leading-snug text-fg-3 sm:order-none sm:ml-auto sm:w-auto sm:shrink-0 sm:text-right">
          {face.kind} · previews only
          <span className="hidden sm:inline">
            {" "}
            · your project sets{" "}
            <span className="text-fg-2">--lab-font-display</span>
          </span>
        </p>
      </div>

      <div className="sticky top-16 z-40 -mx-5 mt-3 border-y border-line bg-ink-950 sm:-mx-8">
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-2.5 sm:px-6">
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
                className={`relative shrink-0 rounded-control px-2.5 py-1.5 font-mono text-[11px] transition-colors duration-200 ${
                  on ? "text-fg" : "text-fg-3 hover:text-fg-2"
                }`}
              >
                {on && (
                  <span className="absolute inset-0 rounded-control border border-line-2 bg-ink-850" />
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

      <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES.map((page, i) => (
          <div
            key={page.slug}
            className={
              filter === "all" || page.category === filter ? "block" : "hidden"
            }
          >
            <Reveal delay={0.04 * (i % 3)} className="h-full">
              <PageCard page={page} index={i} />
            </Reveal>
          </div>
        ))}
      </div>

      <p className="mt-6 font-mono text-[10.5px] text-fg-3">
        showing <span className="tabular-nums">{shown}</span> of{" "}
        <span className="tabular-nums">{PAGES.length}</span>
        <span className="ml-2 text-fg-3/60">
          hover to run, open for the method
        </span>
      </p>
    </div>
  );
}
