import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
import { PAGES, categoryCount } from "@/lib/pages";

/* --------------------------------- divider --------------------------------- */

export function MapEnd() {
  return (
    <div aria-hidden className="mx-auto max-w-[1320px] px-5 sm:px-8">
      <div className="relative h-px w-full bg-[repeating-linear-gradient(to_right,#2a2f34_0_6px,transparent_6px_12px)]">
        <span className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 bg-ink-950 px-3 font-mono text-[10px] text-fg-3">
          <span className="text-amber/80">×</span> end of the map
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------- pages ---------------------------------- */

export function PagesSection() {
  return (
    <section
      id="pages"
      className="mx-auto max-w-[1320px] scroll-mt-16 px-5 py-24 sm:px-8 lg:py-28"
    >
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <Reveal>
            <p className="font-mono text-[11px] text-fg-3">01 / pages</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,4vw,3.4rem)]">
              Twenty-six ways to be lost
            </h2>
            <p className="mt-4 max-w-[54ch] text-[15px] leading-[1.7] text-fg-2">
              Each page is a small scene with one mechanic, not a layout with a
              shake on it. Filter the set, hover to run it, open one for the
              method and the source.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="font-mono text-[11px] leading-relaxed text-fg-3 sm:text-right">
            {PAGES.length} pages
            <br />
            <span className="whitespace-nowrap">
              {categoryCount("scene")} scenes · {categoryCount("type")} type ·{" "}
              {categoryCount("interactive")} interactive
            </span>
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
    <section id="parts" className="scroll-mt-16 border-y border-line bg-ink-900/40">
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="min-w-0 lg:col-span-5">
          <Reveal>
            <p className="font-mono text-[11px] text-fg-3">02 / parts</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,4vw,3.4rem)]">
              Or build your
              <br />
              own dead end
            </h2>
            <p className="mt-5 max-w-[40ch] text-[15px] leading-[1.7] text-fg-2">
              The pages are assembled from these. Take one on its own and it will
              sit inside whatever you already have.
            </p>
            <p className="mt-6 font-mono text-[11px] text-fg-3">
              8 parts · same tokens · no assets
            </p>
            <p className="mt-2 max-w-[38ch] text-[13px] leading-[1.7] text-fg-3">
              Each one is a single file with its own state. No shared provider,
              no context to wire up.
            </p>
          </Reveal>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <ul className="border-t border-line">
            {PARTS.map((part, i) => (
              <Reveal key={part.name} delay={0.02 * i}>
                <li className="flex items-center gap-4 border-b border-line py-4">
                  <span className="w-5 shrink-0 font-mono text-[10px] tabular-nums text-fg-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[12.5px] text-fg">{part.name}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-fg-3">
                      {part.desc}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center justify-end">
                    {part.demo}
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.12}>
            <p className="mt-5 font-mono text-[11px] text-fg-3">
              each part ships as its own file
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- install --------------------------------- */

export function InstallSection() {
  return (
    <section
      id="install"
      className="mx-auto max-w-[1320px] scroll-mt-16 px-5 py-24 sm:px-8 lg:py-28"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="font-mono text-[11px] text-fg-3">03 / install</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,4vw,3.4rem)]">
              One command,
              <br />
              then it is yours
            </h2>
            <p className="mt-5 max-w-[42ch] text-[15px] leading-[1.7] text-fg-2">
              No package to keep upgrading. The shadcn registry copies the page
              into your project with its parts and its Motion import, and you
              edit it like code you wrote.
            </p>
            <p className="mt-6 max-w-[42ch] text-[13px] leading-[1.7] text-fg-3">
              Works with any App Router project that already uses Tailwind. If
              you have shadcn set up, you are one line away. If you would rather
              not use the CLI, the same file is in the repository.
            </p>
            <Link
              href="#pages"
              className="mt-7 inline-flex items-center gap-1.5 font-mono text-[11px] text-fg-2 transition-colors duration-200 hover:text-fg"
            >
              see what is inside
              <ArrowUpRight className="size-4" strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <Reveal delay={0.1} className="min-w-0">
            <InstallTabs />
          </Reveal>
          <Reveal delay={0.16} className="min-w-0">
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[10.5px] text-fg-3">
              <span>registry: {"404lab.dev/r/{name}.json"}</span>
              <span>26 pages · 8 parts · one namespace</span>
            </div>
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
    body: "A small surface. Motion is the only animation dependency, and the pages ship without image assets.",
  },
];

export function Principles() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.label} delay={0.04 * i}>
              <div className="border-t border-line-2 pt-5">
                <p className="font-mono text-[11px] text-fg-3">{p.label}</p>
                <p className="mt-3 text-[13px] leading-[1.7] text-fg-2">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- closing --------------------------------- */

export function Closing() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 lg:py-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="font-mono text-[11px] text-fg-3">04 / end of the line</p>
            <h2 className="display mt-4 text-[clamp(2.6rem,5vw,4.4rem)]">
              Pick a dead end
            </h2>
            <p className="mt-4 max-w-[40ch] text-[15px] leading-[1.7] text-fg-2">
              One command copies a page into your project. Then it is just a
              component you can break, rewrite or leave alone.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="w-full max-w-[430px]">
            <CopyCommand command="npx shadcn@latest add @404lab/glitch-404" />
            <div className="mt-3 flex items-center justify-between gap-4">
              <Link
                href="#pages"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-fg-2 transition-colors duration-200 hover:text-fg"
              >
                browse all {PAGES.length} pages
                <ArrowUpRight className="size-4" strokeWidth={1.5} />
              </Link>
              <span className="font-mono text-[10px] text-fg-3">MIT</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
