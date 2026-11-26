"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { PAGES } from "@/lib/pages";
import { SponsorBadge } from "@/components/site/sponsor-badge";
import { usePageSearch } from "@/components/site/search";

const NAV = [
  ["Catalogue", "#pages"],
  ["Parts", "#parts"],
  ["Install", "#install"],
  ["Sponsor", "#sponsor"],
] as const;

export function LandingTopBar() {
  const { query, setQuery } = usePageSearch();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function key(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey)
        return;
      const el = document.activeElement;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      )
        return;
      event.preventDefault();
      input.current?.focus();
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  function go(event: React.FormEvent) {
    event.preventDefault();
    document.getElementById("pages")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-dashed border-line-2 bg-ink-950">
      <div className="flex h-15 items-center gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-control px-2.5 py-1.5 text-[12.5px] text-fg-2 transition-colors duration-200 hover:bg-ink-850 hover:text-fg"
            >
              {label}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={go}
          role="search"
          className="relative ml-auto min-w-0 flex-1 md:mx-auto md:max-w-[330px]"
        >
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-fg-3"
            strokeWidth={1.7}
          />
          <input
            ref={input}
            value={query}
            onChange={(event) => {
              const next = event.target.value;
              setQuery(next);
              if (next.length === 1) {
                document
                  .getElementById("pages")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            placeholder={`Search ${PAGES.length} pages`}
            aria-label="Search pages"
            className="h-9 w-full rounded-full border border-line bg-ink-900 pl-9 pr-9 text-[12.5px] text-fg outline-none transition-colors duration-200 placeholder:text-fg-3 hover:border-line-2 focus:border-line-2"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                input.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-full text-fg-3 transition-colors duration-200 hover:bg-ink-800 hover:text-fg"
            >
              <X className="size-3.5" strokeWidth={1.8} />
            </button>
          ) : (
            <span
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line px-1 font-mono text-[10px] leading-4 text-fg-3 sm:block"
            >
              /
            </span>
          )}
        </form>

        <SponsorBadge />

        <a
          href="https://github.com/Anos714/404labs"
          target="_blank"
          rel="noreferrer"
          className="hidden items-center gap-1 rounded-control px-2.5 py-1.5 text-[12.5px] text-fg-2 transition-colors duration-200 hover:bg-ink-850 hover:text-fg sm:flex"
        >
          GitHub
          <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
        </a>

        <Link
          href="#install"
          className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-fg px-3.5 py-2 text-[12px] font-medium leading-none text-ink-950 transition-colors duration-200 hover:bg-white sm:ml-0"
        >
          Install
          <ArrowUpRight className="size-3.5" strokeWidth={1.9} />
        </Link>
      </div>
    </header>
  );
}
