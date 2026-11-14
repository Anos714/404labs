import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { CopyCommand } from "@/components/demos";
import { PAGES, getPage } from "@/lib/pages";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return { title: "Not found · 404lab" };
  return {
    title: `${page.title} 404 · 404lab`,
    description: page.note,
  };
}

const DETAILS = (slug: string, method: string, category: string) => [
  ["File", `${slug}.tsx`],
  ["Category", category],
  ["Animation", method],
  ["Status codes", "404 · 500 · 403 · offline"],
  ["Requires", "Motion · Tailwind"],
];

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  const index = PAGES.findIndex((p) => p.slug === page.slug);
  const next = PAGES[(index + 1) % PAGES.length];

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1320px] px-5 pb-24 pt-10 sm:px-8 lg:pb-32">
        <Link
          href="/#pages"
          className="inline-flex items-center gap-2 font-mono text-[11px] text-fg-3 transition-colors duration-200 hover:text-fg"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} />
          all pages
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-5 lg:row-start-1">
            <p className="flex items-center gap-2.5 font-mono text-[11px] text-fg-3">
              <span>
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(PAGES.length).padStart(2, "0")}
              </span>
              <span className="h-px w-4 bg-line-2" />
              <span className="text-amber/75">{page.category}</span>
            </p>
            <h1 className="display mt-4 text-[clamp(2.8rem,5vw,4.2rem)]">
              {page.title}
            </h1>
            <p className="mt-5 max-w-[42ch] text-[15px] leading-[1.7] text-fg-2">
              {page.note}
            </p>
          </div>

          <div className="lg:col-span-7 lg:row-span-2 lg:row-start-1">
            <figure className="rounded-[14px] border border-line bg-ink-900 p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[6px]">
                {page.demo}
              </div>
              <figcaption className="flex items-center justify-between px-2 pb-1 pt-3">
                <span className="font-mono text-[10px] text-fg-3">
                  live preview
                </span>
                <span className="font-mono text-[10px] text-fg-3">
                  hover or tap to run
                </span>
              </figcaption>
            </figure>

            <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-[46ch] font-mono text-[11px] leading-relaxed text-fg-3">
                source is yours after install. no props are required.
              </p>
              <Link
                href={`/p/${next.slug}`}
                className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-[12px] text-fg-2 transition-colors duration-200 hover:text-fg"
              >
                next: {next.title.toLowerCase()}
                <ArrowUpRight
                  className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 lg:row-start-2">
            <dl className="max-w-[420px] border-t border-line">
              {DETAILS(page.slug, page.method, page.category).map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-6 border-b border-line py-3"
                >
                  <dt className="font-mono text-[11px] text-fg-3">{k}</dt>
                  <dd className="text-right font-mono text-[12px] text-fg-2">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 max-w-[420px]">
              <p className="mb-3 font-mono text-[11px] text-fg-3">install</p>
              <CopyCommand
                command={`npx shadcn@latest add @404lab/${page.slug}`}
              />
              <p className="mt-3 font-mono text-[11px] text-fg-3">
                then render it from app/not-found.tsx
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
