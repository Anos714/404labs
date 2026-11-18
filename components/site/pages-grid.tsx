"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { Reveal } from "@/components/demos";
import { FACES } from "@/lib/faces";
import { usePageSearch } from "@/components/site/search";
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
    <>
      <div className="relative min-w-0 flex-1">
        <div
          ref={rail}
          className="flex items-center gap-1 overflow-x-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] leading-none transition-colors duration-200 ${
                  on
                    ? "bg-ink-800 text-fg"
                    : "text-fg-3 hover:bg-ink-900 hover:text-fg-2"
                }`}
              >
                {face.label}
              </button>
            );
          })}
        </div>
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-ink-950 to-transparent transition-opacity duration-200 ${
            edges.start ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-ink-950 to-transparent transition-opacity duration-200 ${
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
          className="grid size-7 place-items-center rounded-full text-fg-3 transition-colors duration-200 hover:bg-ink-850 hover:text-fg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg-3"
        >
          <ChevronLeft className="size-3.5" strokeWidth={1.6} />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          disabled={edges.end}
          aria-label="Next typeface"
          className="grid size-7 place-items-center rounded-full text-fg-3 transition-colors duration-200 hover:bg-ink-850 hover:text-fg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg-3"
        >
          <ChevronRight className="size-3.5" strokeWidth={1.6} />
        </button>
      </div>
    </>
  );
}

function PageCard({ page, index }: { page: PageEntry; index: number }) {
  const router = useRouter();
  const href = `/p/${page.slug}`;

  /**
   * The whole card is the target, not just the title. The handler runs in the
   * capture phase so a demo control inside the preview cannot swallow the
   * click, and real links keep their own behaviour.
   */
  function open(event: React.MouseEvent<HTMLElement>) {
    if (event.defaultPrevented || event.button !== 0) return;

    const target = event.target as HTMLElement;
    if (target.closest("a")) return;

    if (event.metaKey || event.ctrlKey) {
      event.preventDefault();
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    if (event.shiftKey || event.altKey) return;

    const selection = window.getSelection();
    if (selection && selection.toString().trim()) return;

    event.preventDefault();
    event.stopPropagation();
    router.push(href);
  }

  return (
    <article
      onClickCapture={open}
      className="group flex h-full cursor-pointer flex-col rounded-panel border border-line bg-ink-850 p-2 transition-[border-color,background-color] duration-300 hover:border-line-2 focus-within:border-line-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-tile bg-ink-950">
        {page.demo}
        <Link
          href={`/p/${page.slug}`}
          aria-label={`Open ${page.slug}`}
          className="absolute right-2 top-2 z-30 grid size-7 place-items-center rounded-full border border-white/15 bg-ink-950/90 text-white/75 transition-[opacity,color,background-color,border-color] duration-200 hover:border-white/30 hover:bg-ink-950 hover:text-fg sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
        >
          <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
        </Link>
      </div>

      <Link
        href={`/p/${page.slug}`}
        className="flex flex-1 flex-col px-2 pb-1.5 pt-3"
      >
        <span className="flex items-baseline justify-between gap-3">
          <h3 className="lab-mono text-[12.5px] leading-none text-fg">
            {page.slug}
          </h3>
          <span className="shrink-0 lab-mono text-[10px] tabular-nums text-fg-3">
            {String(index + 1).padStart(2, "0")}
          </span>
        </span>
        <p className="mt-2 flex-1 text-[12px] leading-[1.5] text-fg-3">
          {page.desc}
        </p>
        <span className="mt-3 flex items-center gap-1.5 lab-mono text-[10px] leading-none text-fg-3">
          <span className="text-fg-3/80">{page.category}</span>
          <span aria-hidden className="text-line-2">
            /
          </span>
          <span className="truncate">{page.method}</span>
        </span>
      </Link>
    </article>
  );
}

export function PagesGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const [faceId, setFaceId] = useState(FACES[0].id);
  const { query, setQuery } = usePageSearch();
  const face = FACES.find((f) => f.id === faceId) ?? FACES[0];
  const active = CATEGORIES.find((c) => c.id === filter);
  const needle = query.trim().toLowerCase();

  const shown = useMemo(() => {
    return PAGES.filter((page) => {
      if (!needle && filter !== "all" && page.category !== filter) return false;
      if (!needle) return true;
      return [page.slug, page.title, page.desc, page.method, page.category]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [filter, needle]);

  return (
    <div
      style={
        {
          "--lab-font-display": face.display,
          "--lab-font-mono": face.mono,
        } as CSSProperties
      }
    >
      <div className="mt-7 flex flex-wrap items-center gap-1.5">
        {CATEGORIES.map((c) => {
          const on = needle ? c.id === "all" : filter === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setFilter(c.id);
                setQuery("");
              }}
              aria-pressed={on}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] leading-none transition-colors duration-200 ${
                on
                  ? "bg-fg text-ink-950"
                  : "border border-line bg-ink-900 text-fg-2 hover:border-line-2 hover:text-fg"
              }`}
            >
              {c.label === "all" ? "All pages" : c.label}
              <span
                className={`ml-1.5 font-mono text-[10px] tabular-nums ${
                  on ? "text-ink-950/55" : "text-fg-3"
                }`}
              >
                {categoryCount(c.id)}
              </span>
            </button>
          );
        })}
        <p className="ml-auto hidden font-mono text-[10.5px] text-fg-3 md:block">
          {needle
            ? `${shown.length} ${shown.length === 1 ? "match" : "matches"} for “${query.trim()}”`
            : active?.blurb}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-line py-2 sm:flex-nowrap">
        <div className="flex shrink-0 items-center gap-2">
          <span className="font-mono text-[10px] text-fg-3">typeface</span>
          <span className="font-mono text-[10px] tabular-nums text-fg-3/70">
            {String(FACES.findIndex((f) => f.id === faceId) + 1).padStart(2, "0")}
            /{FACES.length}
          </span>
          <span className="hidden font-mono text-[10px] text-fg-3/70 sm:inline">
            {face.kind}
          </span>
        </div>

        <FaceRail faceId={faceId} onPick={setFaceId} />
      </div>

      {shown.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((page, i) => (
            <div key={page.slug}>
              <Reveal delay={0.035 * (i % 3)} className="h-full">
                <PageCard page={page} index={PAGES.indexOf(page)} />
              </Reveal>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center rounded-panel border border-dashed border-line-2 px-6 py-16 text-center">
          <SearchX className="size-5 text-fg-3" strokeWidth={1.5} />
          <p className="mt-4 text-[14px] text-fg-2">
            Nothing in the catalogue matches “{query.trim()}”.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="mt-4 rounded-full border border-line px-3.5 py-1.5 font-mono text-[11px] text-fg-2 transition-colors duration-200 hover:border-line-2 hover:text-fg"
          >
            clear the search
          </button>
        </div>
      )}

      <p className="mt-7 flex flex-wrap items-center gap-x-2 font-mono text-[10.5px] text-fg-3">
        <span>
          showing <span className="tabular-nums text-fg-2">{shown.length}</span>{" "}
          of <span className="tabular-nums">{PAGES.length}</span>
        </span>
        <span className="text-fg-3/50">·</span>
        <span className="text-fg-3/70">
          hover to run a page, open it for the method
        </span>
      </p>
    </div>
  );
}
