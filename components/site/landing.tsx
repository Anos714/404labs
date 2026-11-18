import Link from "next/link";
import {
  ArrowUpRight,
  Blocks,
  GitBranch,
  Info,
  LayoutGrid,
  Terminal,
} from "lucide-react";
import { CopyCommand } from "@/components/demos";
import { PAGES, categoryCount, pageCountWord } from "@/lib/pages";

const BROWSE = [
  {
    label: "The catalogue",
    href: "#pages",
    icon: LayoutGrid,
    count: String(PAGES.length),
  },
  { label: "The parts", href: "#parts", icon: Blocks, count: "8" },
  { label: "Install", href: "#install", icon: Terminal, count: null },
  { label: "How it holds up", href: "#notes", icon: Info, count: null },
] as const;

export function LandingRail() {
  return (
    <aside className="border-b border-dashed border-line-2 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r lg:[scrollbar-width:none]">
      <div className="flex h-15 items-center justify-between gap-3 px-5 sm:px-6 lg:h-16 lg:px-6">
        <Link
          href="/"
          className="flex items-baseline gap-[5px] rounded-control text-fg"
        >
          <span className="font-display text-[26px] leading-none tracking-[-0.02em]">
            404
          </span>
          <span className="font-mono text-[12px] text-fg-2">lab</span>
        </Link>
        <span className="rounded-full border border-line px-2 py-[3px] font-mono text-[9.5px] leading-none text-fg-3">
          v0.1
        </span>
      </div>

      <div className="px-5 pb-5 pt-4 sm:px-6 lg:pb-6">
        <p className="max-w-[32ch] text-[13px] leading-[1.7] text-fg-2">
          Not-found pages, drawn like real screens. Source you can take apart
          and keep.
        </p>
      </div>

      <nav aria-label="Sections" className="px-2.5 sm:px-3.5 lg:min-h-0 lg:flex-1">
        <p className="hidden px-2.5 pb-2 font-mono text-[10.5px] text-fg-3 lg:block">
          Browse
        </p>
        <ul className="grid grid-cols-2 gap-1 pb-1 lg:flex lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0">
          {BROWSE.map((item) => (
            <li key={item.href} className="lg:shrink">
              <Link
                href={item.href}
                className="group flex items-center gap-2.5 rounded-control px-2.5 py-2 text-[13px] text-fg-2 transition-colors duration-200 hover:bg-ink-850 hover:text-fg"
              >
                <item.icon
                  className="size-4 shrink-0 text-fg-3 transition-colors duration-200 group-hover:text-fg-2"
                  strokeWidth={1.6}
                />
                <span className="truncate">{item.label}</span>
                {item.count && (
                  <span className="ml-auto hidden font-mono text-[10px] tabular-nums text-fg-3 lg:block">
                    {item.count}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hidden px-3.5 pb-2 lg:block">
        <p className="px-2.5 pb-2 font-mono text-[10.5px] text-fg-3">Elsewhere</p>
        <a
          href="https://github.com/Anos714/404labs"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2.5 rounded-control px-2.5 py-2 text-[13px] text-fg-2 transition-colors duration-200 hover:bg-ink-850 hover:text-fg"
        >
          <GitBranch
            className="size-4 shrink-0 text-fg-3 transition-colors duration-200 group-hover:text-fg-2"
            strokeWidth={1.6}
          />
          <span>GitHub</span>
          <ArrowUpRight className="ml-auto size-3.5 text-fg-3" strokeWidth={1.6} />
        </a>
      </div>

      <div className="hidden px-5 pb-5 pt-6 lg:block">
        <div className="rounded-panel border border-line bg-ink-850 p-4">
          <p className="font-mono text-[10.5px] text-fg-3">Start here</p>
          <p className="mt-2 text-[12.5px] leading-[1.65] text-fg-2">
            One command copies a page into your repo, with its parts and its
            imports.
          </p>
          <Link
            href="#install"
            className="mt-4 flex items-center justify-between gap-2 rounded-full bg-fg px-3.5 py-2 text-[12px] font-medium leading-none text-ink-950 transition-colors duration-200 hover:bg-white"
          >
            Install the library
            <ArrowUpRight className="size-3.5" strokeWidth={1.9} />
          </Link>
          <p className="mt-3 font-mono text-[9.5px] leading-none text-fg-3">
            MIT · no package to track
          </p>
        </div>
      </div>

      <div className="hidden border-t border-line px-6 py-4 lg:block">
        <p className="font-mono text-[10px] leading-relaxed text-fg-3">
          {pageCountWord(true)} pages · 8 parts
        </p>
        <p className="mt-1 font-mono text-[10px] text-fg-3/60">MIT · 2026</p>
      </div>
    </aside>
  );
}

export function LandingIntro() {
  return (
    <section className="border-b border-line px-5 pb-12 pt-11 sm:px-8 sm:pb-14 sm:pt-16 lg:px-10 lg:pb-16 lg:pt-20">
      <div className="mx-auto max-w-[700px] text-center">
        <p className="font-mono text-[10.5px] text-fg-3">
          not-found pages, kept in the open
        </p>
        <h1 className="mt-5 text-balance font-sans text-[clamp(2rem,3.8vw,2.9rem)] font-medium leading-[1.08] tracking-[-0.04em] text-fg">
          A missing page still has a design.
        </h1>
        <p className="mx-auto mt-5 max-w-[56ch] text-pretty text-[14.5px] leading-[1.75] text-fg-2">
          {pageCountWord(true)} not-found pages, each built around one small
          idea. {categoryCount("scene")} scenes, {categoryCount("type")} type
          studies and {categoryCount("interactive")} that answer your hand. Take
          the source for your own project, then change anything that does not
          sound like you.
        </p>
        <div className="mx-auto mt-8 max-w-[430px]">
          <CopyCommand command="npx shadcn@latest add @404lab/glitch-404" />
        </div>
        <p className="mt-4 font-mono text-[10.5px] text-fg-3">
          or browse the catalogue below
        </p>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="border-t border-line px-5 py-10 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-baseline gap-[5px] text-fg">
            <span className="font-display text-[22px] leading-none">404</span>
            <span className="font-mono text-[11px] text-fg-2">lab</span>
          </p>
          <p className="mt-2 max-w-[42ch] text-[12.5px] leading-relaxed text-fg-3">
            {pageCountWord(true)} dead ends, drawn with care and handed over as
            source.
          </p>
        </div>
        <nav
          aria-label="Elsewhere"
          className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-fg-3"
        >
          <Link href="#pages" className="transition-colors hover:text-fg">
            Pages
          </Link>
          <Link href="#parts" className="transition-colors hover:text-fg">
            Parts
          </Link>
          <Link href="#install" className="transition-colors hover:text-fg">
            Install
          </Link>
          <a
            href="https://github.com/Anos714/404labs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-fg"
          >
            GitHub
            <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
          </a>
        </nav>
      </div>
      <div className="mt-8 flex flex-col gap-2 border-t border-line pt-4 font-mono text-[10px] text-fg-3 sm:flex-row sm:items-center sm:justify-between">
        <span>MIT · 2026</span>
        <span>Next.js · Motion · Tailwind</span>
      </div>
    </footer>
  );
}
