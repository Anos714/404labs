import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { SourcePanel } from "@/components/site/source-panel";
import { CopyCommand } from "@/components/demos";
import { getPageSource } from "@/lib/source";
import { PAGES, getPage } from "@/lib/pages";
import { SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return { title: "Not found · 404lab" };
  return {
    title: `${page.title} 404`,
    description: page.note,
    alternates: {
      canonical: `/p/${page.slug}`,
    },
    openGraph: {
      title: `${page.title} 404 · 404lab`,
      description: page.note,
      url: `${SITE_URL}/p/${page.slug}`,
      type: "article",
    },
  };
}

function relatedPages(slug: string, category: string) {
  const pool = PAGES.filter(
    (p) => p.slug !== slug && p.category === category,
  );
  const at = PAGES.findIndex((p) => p.slug === slug);
  const after = pool.filter((p) => PAGES.indexOf(p) > at);
  return [...after, ...pool].slice(0, 3);
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  const index = PAGES.findIndex((p) => p.slug === page.slug);
  const prev = PAGES[(index - 1 + PAGES.length) % PAGES.length];
  const next = PAGES[(index + 1) % PAGES.length];
  const source = getPageSource(page.slug);
  const related = relatedPages(page.slug, page.category);

  const details = [
    ["file", `${page.slug}.tsx`],
    ["category", page.category],
    ["motion", page.method],
    ["needs", "Next · Motion · Tailwind"],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareSourceCode",
        name: `${page.title} 404`,
        description: page.note,
        programmingLanguage: "TypeScript",
        runtimePlatform: "Next.js",
        license: "https://opensource.org/licenses/MIT",
        url: `${SITE_URL}/p/${page.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "404lab", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "pages", item: `${SITE_URL}/#pages` },
          { "@type": "ListItem", position: 3, name: page.slug, item: `${SITE_URL}/p/${page.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:16px_16px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto flex w-full max-w-[1300px] flex-col border-line bg-ink-950 lg:border-x">
        <Nav />
        <main className="mx-auto w-full min-w-0 max-w-[1180px] flex-1 px-5 pb-24 pt-6 sm:px-8 lg:pb-28">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-line-2 pb-3">
            <nav
              aria-label="Breadcrumb"
              className="flex min-w-0 items-center gap-2 font-mono text-[10.5px] text-fg-3"
            >
              <Link
                href="/"
                className="transition-colors duration-200 hover:text-fg"
              >
                404lab
              </Link>
              <span aria-hidden className="text-line-2">
                /
              </span>
              <Link
                href="/#pages"
                className="transition-colors duration-200 hover:text-fg"
              >
                pages
              </Link>
              <span aria-hidden className="text-line-2">
                /
              </span>
              <span className="truncate text-fg-2">{page.slug}</span>
            </nav>

            <div className="flex items-center gap-3 font-mono text-[10.5px] text-fg-3">
              <span className="tabular-nums">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(PAGES.length).padStart(2, "0")}
              </span>
              <span aria-hidden className="h-3 w-px bg-line" />
              <Link
                href={`/p/${prev.slug}`}
                aria-label={`Previous page: ${prev.title}`}
                className="grid size-7 place-items-center rounded-full text-fg-3 transition-colors duration-200 hover:bg-ink-850 hover:text-fg"
              >
                <ArrowLeft className="size-3.5" strokeWidth={1.7} />
              </Link>
              <Link
                href={`/p/${next.slug}`}
                aria-label={`Next page: ${next.title}`}
                className="grid size-7 place-items-center rounded-full text-fg-3 transition-colors duration-200 hover:bg-ink-850 hover:text-fg"
              >
                <ArrowRight className="size-3.5" strokeWidth={1.7} />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-9 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
            <div className="flex min-w-0 flex-col">
              <p className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] leading-none text-amber/85">
                  {page.category}
                </span>
                <span className="font-mono text-[10.5px] text-fg-3">
                  {page.method}
                </span>
              </p>

              <h1 className="display mt-5 text-[clamp(3.1rem,6.4vw,5.2rem)]">
                {page.title}
              </h1>
              <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.75] text-fg-2">
                {page.note}
              </p>

              <div className="mt-auto pt-9">
                <p className="mb-2 font-mono text-[10px] text-fg-3">
                  install this page
                </p>
                <CopyCommand
                  command={`npx shadcn@latest add @404lab/${page.slug}`}
                />
                <p className="mt-2 font-mono text-[10px] leading-relaxed text-fg-3">
                  one command brings the page, chrome and tokens.{" "}
                  <Link
                    href="/#install"
                    className="text-fg-2 underline decoration-line-2 underline-offset-4 transition-colors hover:text-fg"
                  >
                    set up @404lab once
                  </Link>
                </p>
              </div>
            </div>

            <figure className="min-w-0 rounded-panel border border-line bg-ink-900 p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-tile bg-ink-950">
                {page.demo}
              </div>
              <figcaption className="flex items-center justify-between gap-3 px-2 pb-1 pt-3 font-mono text-[10px] text-fg-3">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-amber/80"
                  />
                  live preview
                </span>
                <span>hover or tap to run</span>
              </figcaption>
            </figure>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-4">
            {details.map(([key, value]) => (
              <div key={key} className="min-w-0 bg-ink-900 px-4 py-4">
                <dt className="font-mono text-[10px] text-fg-3">{key}</dt>
                <dd className="mt-2 break-words font-mono text-[11.5px] leading-snug text-fg-2">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-3 font-mono text-[10px] leading-relaxed text-fg-3">
            drop it on 404, 500, 403 or an offline screen. nothing depends on
            the route it is rendered from.
          </p>

          <section className="mt-14 border-t border-line pt-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10.5px] text-fg-3">
                  same room
                </p>
                <h2 className="mt-2 text-[clamp(1.35rem,2.2vw,1.75rem)] font-medium leading-tight tracking-[-0.03em] text-fg">
                  More {page.category} pages
                </h2>
              </div>
              <Link
                href="/#pages"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-fg-2 transition-colors duration-200 hover:text-fg"
              >
                all {PAGES.length} pages
                <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {related.map((item) => {
                const itemIndex = PAGES.indexOf(item);
                return (
                  <Link
                    key={item.slug}
                    href={`/p/${item.slug}`}
                    aria-label={`Open ${item.slug}`}
                    className="group relative flex min-h-[172px] min-w-0 flex-col justify-between overflow-hidden rounded-panel border border-line bg-ink-850 p-4 transition-colors duration-200 hover:border-line-2"
                  >
                    <span
                      aria-hidden
                      className="display pointer-events-none absolute -right-1 -top-3 text-[88px] leading-none text-fg/[0.045]"
                    >
                      {String(itemIndex + 1).padStart(2, "0")}
                    </span>

                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full border border-line px-2 py-1 font-mono text-[9.5px] leading-none text-fg-3">
                        {item.category}
                      </span>
                    </div>

                    <div className="mt-6">
                      <p className="truncate font-mono text-[12.5px] text-fg">
                        {item.slug}
                      </p>
                      <p className="mt-1.5 line-clamp-2 text-[12px] leading-[1.55] text-fg-3">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-3">
                      <span className="truncate font-mono text-[9.5px] text-fg-3">
                        {item.method}
                      </span>
                      <ArrowUpRight
                        className="size-3.5 shrink-0 text-fg-3 transition-colors duration-200 group-hover:text-fg"
                        strokeWidth={1.7}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section
            id="source"
            className="mt-14 min-w-0 scroll-mt-24 border-t border-line pt-8"
          >
            <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end lg:gap-12">
              <div className="min-w-0">
                <p className="font-mono text-[10.5px] text-fg-3">
                  source / install
                </p>
                <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.3rem)] font-medium leading-[1.08] tracking-[-0.04em] text-fg">
                  Take the file, keep the method.
                </h2>
                <p className="mt-3 max-w-[48ch] text-[13.5px] leading-[1.75] text-fg-2">
                  One page file, no props. The shared chrome and the token block
                  are a one time copy, and the command brings both along
                  instead.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2 font-mono text-[10px] text-fg-3">
                  <li className="rounded-full border border-line px-2.5 py-1">
                    {source.files.length} files
                  </li>
                  <li className="rounded-full border border-line px-2.5 py-1">
                    {source.component.lines} lines
                  </li>
                  <li className="rounded-full border border-line px-2.5 py-1">
                    no runtime wrapper
                  </li>
                </ul>
              </div>

              <div className="min-w-0">
                <p className="mb-2 font-mono text-[10px] text-fg-3">
                  one command
                </p>
                <CopyCommand
                  command={`npx shadcn@latest add @404lab/${page.slug}`}
                />
                <p className="mt-2 font-mono text-[10px] leading-relaxed text-fg-3">
                  then render it from app/not-found.tsx, or copy the files
                  below by hand
                </p>
              </div>
            </div>

            <div className="mt-6 min-w-0">
              <SourcePanel files={source.files} />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
