import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GitBranch, Plus } from "lucide-react";
import {
  AnimatedDigits,
  CopyCommand,
  ElasticArrow,
  FlipDigit,
  MagneticButton,
  MorseLamp,
  Reveal,
  ScanSweep,
  ScrambleText,
  TypeLine,
} from "@/components/demos";
import { InstallTabs } from "@/components/site/install";
import { PagesGrid } from "@/components/site/pages-grid";
import { PAGES, pageCountWord } from "@/lib/pages";
import { REGISTRY_HOST, SPONSORS } from "@/lib/site";

/* ---------------------------------- pages ---------------------------------- */

export function PagesSection() {
  return (
    <section
      id="pages"
      className="scroll-mt-16 border-b border-line px-5 pb-14 pt-10 sm:px-8 sm:pb-16 lg:px-10 lg:pb-20 lg:pt-12"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <div>
          <Reveal>
            <p className="font-mono text-[10.5px] text-fg-3">01 / catalogue</p>
            <h2 className="mt-3 text-[clamp(1.45rem,2.2vw,1.85rem)] font-medium leading-tight tracking-[-0.03em] text-fg">
              {pageCountWord(true)} ways to be lost
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.06}>
          <p className="max-w-[46ch] text-[12.5px] leading-[1.7] text-fg-3 sm:text-right">
            Each page is one mechanic, not a template with a shake on it. Search
            the set, hover to run one, open it for the method and the source.
          </p>
        </Reveal>
      </div>

      <PagesGrid />
    </section>
  );
}

/* ---------------------------------- parts ---------------------------------- */

const PARTS = [
  {
    name: "scramble-text",
    desc: "Letters resolve from noise",
    demo: <ScrambleText />,
  },
  {
    name: "flip-digit",
    desc: "A split-flap cell finds its value",
    demo: <FlipDigit />,
  },
  {
    name: "animated-digits",
    desc: "Numbers roll to place",
    demo: <AnimatedDigits />,
  },
  {
    name: "magnetic-button",
    desc: "The action leans toward you",
    demo: <MagneticButton />,
  },
  {
    name: "elastic-arrow",
    desc: "The back link stretches",
    demo: <ElasticArrow />,
  },
  {
    name: "typewriter-line",
    desc: "A sentence types itself",
    demo: <TypeLine />,
  },
  {
    name: "morse-lamp",
    desc: "One light says the whole thing",
    demo: <MorseLamp />,
  },
  {
    name: "scan-sweep",
    desc: "A line fills what it crosses",
    demo: <ScanSweep />,
  },
];

export function PartsSection() {
  return (
    <section
      id="parts"
      className="scroll-mt-16 border-b border-line px-5 py-14 sm:px-8 lg:px-10 lg:py-20"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <Reveal>
          <p className="font-mono text-[10.5px] text-fg-3">02 / parts</p>
          <h2 className="mt-3 text-[clamp(1.45rem,2.2vw,1.85rem)] font-medium leading-tight tracking-[-0.03em] text-fg">
            Take the mechanism, leave the scene
          </h2>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="max-w-[48ch] text-[12.5px] leading-[1.7] text-fg-3 sm:text-right">
            The pages are assembled from these eight pieces. Each one is a single
            file with its own state, small enough to lift into a project that
            already exists.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.08}>
        <ul className="mt-8 divide-y divide-line overflow-hidden rounded-panel border border-line bg-ink-850">
          {PARTS.map((part, i) => (
            <li
              key={part.name}
              className="flex items-center gap-4 px-4 py-4 transition-colors duration-200 hover:bg-ink-800 sm:px-5"
            >
              <span className="w-5 shrink-0 font-mono text-[10px] tabular-nums text-fg-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[12.5px] text-fg">{part.name}</p>
                <p className="mt-1 text-[12px] leading-snug text-fg-3">
                  {part.desc}
                </p>
              </div>
              <div className="flex shrink-0 items-center justify-end">
                {part.demo}
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-fg-3">
        <span>8 parts · same tokens · no image assets</span>
        <span className="text-fg-3/60">each part ships as its own file</span>
      </div>
    </section>
  );
}

/* --------------------------------- install --------------------------------- */

export function InstallSection() {
  return (
    <section
      id="install"
      className="scroll-mt-16 border-b border-line px-5 py-14 sm:px-8 lg:px-10 lg:py-20"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
        <div>
          <Reveal>
            <p className="font-mono text-[10.5px] text-fg-3">03 / install</p>
            <h2 className="mt-3 text-[clamp(1.45rem,2.2vw,1.85rem)] font-medium leading-tight tracking-[-0.03em] text-fg">
              One line, then it is your file
            </h2>
            <p className="mt-5 max-w-[42ch] text-[14px] leading-[1.75] text-fg-2">
              The shadcn registry copies the page into your repo with its parts
              and its Motion import. Point components.json at the registry once,
              then every page is one command. No package version to track, no
              provider to mount, nothing left pointing back here.
            </p>
            <p className="mt-5 max-w-[42ch] text-[12.5px] leading-[1.75] text-fg-3">
              Any App Router project with Tailwind works. If you would rather
              not configure a namespace, the direct url needs no setup. If you
              would rather not run the CLI, the file is in the repository.
            </p>
            <Link
              href="#pages"
              className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] text-fg-2 transition-colors duration-200 hover:text-fg"
            >
              see what is inside
              <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
            </Link>
          </Reveal>
        </div>

        <div className="min-w-0">
          <Reveal delay={0.1} className="min-w-0">
            <InstallTabs />
          </Reveal>
          <Reveal delay={0.16} className="min-w-0">
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-fg-3">
              <span>registry: {REGISTRY_HOST}</span>
              <span>
                {PAGES.length} pages · 8 parts · one namespace
              </span>
            </div>
            <p className="mt-3 font-mono text-[10px] leading-relaxed text-fg-3">
              mcp: the repo ships a stdio server for Claude Code, Codex, Cursor
              and OpenCode
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- principles ------------------------------- */

const PRINCIPLES = [
  {
    label: "Reduced motion",
    body: "Every page has a still frame worth shipping. Nothing important depends on the animation.",
  },
  {
    label: "Keyboard first",
    body: "Real controls under the effects, visible focus, and a way out without a mouse.",
  },
  {
    label: "Light and dark",
    body: "Tokens only, so the page follows your theme instead of fighting it.",
  },
  {
    label: "Small",
    body: "Motion is the only animation dependency. No image assets, no shared provider, no wrapper.",
  },
];

export function Principles() {
  return (
    <section
      id="notes"
      className="scroll-mt-16 border-b border-line px-5 py-14 sm:px-8 lg:px-10 lg:py-16"
    >
      <Reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10.5px] text-fg-3">
              04 / what holds up
            </p>
            <h2 className="mt-3 text-[clamp(1.45rem,2.2vw,1.85rem)] font-medium leading-tight tracking-[-0.03em] text-fg">
              The parts you never see
            </h2>
          </div>
          <p className="max-w-[40ch] text-[12.5px] leading-[1.7] text-fg-3 sm:text-right">
            The trick is the part people notice. These are the parts that keep it
            from breaking.
          </p>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {PRINCIPLES.map((p, i) => (
          <Reveal key={p.label} delay={0.04 * i} className="h-full">
            <div className="flex h-full flex-col rounded-panel border border-line bg-ink-850 p-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-[11px] text-fg-2">{p.label}</p>
                <span className="font-mono text-[10px] tabular-nums text-fg-3/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 text-[13px] leading-[1.7] text-fg-3">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- sponsor --------------------------------- */

const OPEN_SLOTS = 5;

export function SponsorSection() {
  const sponsor = SPONSORS[0];

  return (
    <section
      id="sponsor"
      className="scroll-mt-16 border-b border-line px-5 py-14 sm:px-8 lg:px-10 lg:py-16"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14">
        <Reveal>
          <p className="font-mono text-[10.5px] text-amber/90">
            05 / sponsors
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,2.8vw,2.25rem)] font-medium leading-tight tracking-[-0.03em] text-fg">
            Sponsors<span className="text-amber">.</span>
          </h2>
          <p className="mt-4 max-w-[42ch] text-[13.5px] leading-[1.75] text-fg-2">
            404lab is built independently and stays free &amp; MIT-licensed for
            everyone. Sponsors cover the time that goes into new pages, parts,
            and maintenance.
          </p>
          <p className="mt-4 font-mono text-[10.5px] text-fg-3">
            <span className="text-amber/90">logo tile</span> · navbar +
            sponsor strip with backlink
          </p>
          <a
            href="https://github.com/Anos714/404labs"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 border-b border-amber/60 pb-1 font-mono text-[11.5px] text-amber transition-colors duration-200 hover:border-amber hover:text-fg"
          >
            Become a sponsor
            <ArrowUpRight className="size-3.5" strokeWidth={1.7} />
          </a>
        </Reveal>

        <Reveal delay={0.08} className="min-w-0">
          <div className="flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.06em] text-fg-3">
            <span>{OPEN_SLOTS} SLOTS OPEN</span>
            <span>your logo goes here</span>
          </div>

          <div className="mt-3.5 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {sponsor && (
              <a
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${sponsor.name} — ${sponsor.tagline}`}
                className="group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-[14px] border border-line-2 bg-ink-900 p-2.5 text-center transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-amber/60 hover:bg-ink-850"
              >
                <Image
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  width={36}
                  height={36}
                  unoptimized
                  className="size-9 rounded-[9px] object-cover"
                />
                <span className="w-full truncate font-mono text-[9.5px] text-fg-2 group-hover:text-fg">
                  {sponsor.name}
                </span>
              </a>
            )}

            {Array.from({ length: OPEN_SLOTS }).map((_, i) => (
              <a
                key={i}
                href="https://github.com/Anos714/404labs"
                target="_blank"
                rel="noreferrer"
                aria-label="Claim sponsor slot"
                className="group flex aspect-square items-center justify-center rounded-[14px] border border-dashed border-line-2 bg-ink-900/35 text-fg-3 transition-[transform,border-color,background-color,color] duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:bg-ink-900 hover:text-amber"
              >
                <Plus
                  className="size-4 transition-transform duration-200 group-hover:rotate-90"
                  strokeWidth={1.5}
                />
              </a>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.06em] text-fg-3">
              SUPPORT THE PROJECT
            </span>
            <a
              href="https://github.com/Anos714/404labs"
              target="_blank"
              rel="noreferrer"
              aria-label="404lab on GitHub"
              className="grid size-8 place-items-center rounded-control border border-line bg-ink-900 text-fg-3 transition-colors duration-200 hover:border-line-2 hover:text-fg"
            >
              <GitBranch className="size-3.5" strokeWidth={1.6} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------- closing --------------------------------- */

export function Closing() {
  return (
    <section className="px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <Reveal>
        <div className="grid gap-10 rounded-panel border border-line bg-ink-850 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-14">
          <div>
            <p className="font-mono text-[10.5px] text-fg-3">
              06 / the way out
            </p>
            <h2 className="mt-3 text-[clamp(1.8rem,3.2vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.04em] text-fg">
              Pick a dead end.
            </h2>
            <p className="mt-4 max-w-[42ch] text-[13.5px] leading-[1.75] text-fg-2">
              Copy a page, open it in your editor, change the words. The 404 is
              the one screen nobody plans, which is exactly why it can be the
              best one you ship.
            </p>
          </div>

          <div className="min-w-0">
            <CopyCommand command="npx shadcn@latest add @404lab/glitch-404" />
            <div className="mt-3 flex items-center justify-between gap-4">
              <Link
                href="#pages"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-fg-2 transition-colors duration-200 hover:text-fg"
              >
                browse all {PAGES.length} pages
                <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
              </Link>
              <span className="font-mono text-[10px] text-fg-3">MIT</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
