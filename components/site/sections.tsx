import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  AnimatedDigits,
  CopyCommand,
  ElasticArrow,
  MagneticButton,
  Reveal,
  ScrambleText,
  TypeLine,
} from "@/components/demos";
import { PAGES } from "@/lib/pages";

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

function PageCard({
  slug,
  name,
  desc,
  demo,
  index,
}: {
  slug: string;
  name: string;
  desc: string;
  demo: React.ReactNode;
  index: number;
}) {
  return (
    <Reveal delay={0.04 * (index % 3)}>
      <article className="group relative rounded-[14px] border border-line bg-ink-900 p-2 transition-[border-color] duration-300 hover:border-line-2 focus-within:border-line-2">
        <Link
          href={`/p/${slug}`}
          aria-label={`${name}, ${desc}`}
          className="absolute inset-0 z-20 rounded-[14px]"
        />
        <div className="relative z-30 aspect-[4/3] overflow-hidden rounded-[6px]">
          {demo}
        </div>
        <div className="relative z-10 flex items-start justify-between gap-3 px-2 pb-1.5 pt-4">
          <div>
            <h3 className="font-mono text-[13px] text-fg">{name}</h3>
            <p className="mt-1 text-[12px] text-fg-3">{desc}</p>
          </div>
          <ArrowUpRight
            className="mt-0.5 size-4 shrink-0 text-fg-3 transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
            strokeWidth={1.5}
          />
        </div>
      </article>
    </Reveal>
  );
}

export function PagesSection() {
  return (
    <section id="pages" className="mx-auto max-w-[1320px] scroll-mt-16 px-5 py-24 sm:px-8 lg:py-32">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <Reveal>
            <p className="font-mono text-[11px] text-fg-3">01 / pages</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,4vw,3.4rem)]">
              Six ways to be lost
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.7] text-fg-2">
              Each one is a small scene, not a layout with a shake on it. Hover
              a card to run it.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="font-mono text-[11px] text-fg-3 sm:text-right">
            6 pages
            <br />
            <span className="text-fg-3">404 · 500 · 403 · offline</span>
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES.map((page, i) => (
          <PageCard
            key={page.slug}
            slug={page.slug}
            name={page.slug}
            desc={page.desc}
            demo={page.demo}
            index={i}
          />
        ))}
      </div>
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
];

export function PartsSection() {
  return (
    <section
      id="parts"
      className="scroll-mt-16 border-y border-line bg-ink-900/40"
    >
      <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:py-32">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="font-mono text-[11px] text-fg-3">02 / parts</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,4vw,3.4rem)]">
              Or build your
              <br />
              own dead end
            </h2>
            <p className="mt-5 max-w-[40ch] text-[15px] leading-[1.7] text-fg-2">
              The pages are made from these. Take a part on its own and it will
              sit inside whatever you already have.
            </p>
            <p className="mt-6 font-mono text-[11px] text-fg-3">
              5 parts · same tokens · no assets
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <ul className="border-t border-line">
            {PARTS.map((part, i) => (
              <Reveal key={part.name} delay={0.03 * i}>
                <li className="flex items-center justify-between gap-6 border-b border-line py-5">
                  <div>
                    <p className="font-mono text-[13px] text-fg">{part.name}</p>
                    <p className="mt-1 text-[12px] text-fg-3">{part.desc}</p>
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

function CodeBlock() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-ink-950">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="font-mono text-[11px] text-fg-3">terminal</span>
        <span className="font-mono text-[10px] text-fg-3">bash</span>
      </div>

      <div className="p-3">
        <CopyCommand
          command="npx shadcn@latest add @404lab/glitch-404"
          className="border-transparent bg-ink-900"
        />
      </div>

      <div className="border-t border-line px-4 py-4">
        <p className="mb-3 font-mono text-[10px] text-fg-3">
          then, in your app
        </p>
        <pre className="overflow-x-auto font-mono text-[12px] leading-[1.85] text-fg-2">
          <code>
            <span className="text-fg-3">{"// app/not-found.tsx"}</span>
            {"\n"}
            <span className="text-fg-2">import</span>
            {" { Glitch } "}
            <span className="text-fg-2">from</span>{" "}
            <span className="text-amber/85">
              &quot;@/components/404lab/glitch-404&quot;
            </span>
            {"\n\n"}
            <span className="text-fg-2">export default function</span>{" "}
            <span className="text-fg">NotFound</span>() {"{"}
            {"\n  "}
            <span className="text-fg-2">return</span> {"<"}
            <span className="text-fg">Glitch</span> home=
            <span className="text-amber/85">&quot;/&quot;</span> {" />"}
            {"\n}"}
          </code>
        </pre>
      </div>

      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        <span className="font-mono text-[10px] text-fg-3">
          the file lands in your repo
        </span>
        <span className="font-mono text-[10px] text-fg-3">MIT</span>
      </div>
    </div>
  );
}

export function InstallSection() {
  return (
    <section id="install" className="mx-auto max-w-[1320px] scroll-mt-16 px-5 py-24 sm:px-8 lg:py-32">
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
              into your project, with its parts and its Motion import, and you
              edit it like code you wrote.
            </p>
            <p className="mt-6 max-w-[42ch] text-[13px] leading-[1.7] text-fg-3">
              Works with any App Router project that already uses Tailwind. If
              you have shadcn set up, you are one line away.
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

        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <CodeBlock />
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 font-mono text-[11px] text-fg-3">
              registry: {"404lab.dev/r/{name}.json"}
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
    body: "Real buttons under the effects, visible focus, and a way out without a mouse.",
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
