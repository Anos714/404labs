import { readLibrary } from "./source-data.mjs";

/**
 * Reads the demo modules at build time and lifts each page's section out of the
 * shared files, so every detail page can show the real component source.
 */

export type { SourceFile } from "./source-data.mjs";
import type { SourceFile } from "./source-data.mjs";

export type PageSource = {
  component: SourceFile;
  files: SourceFile[];
};

let cache: Map<string, PageSource> | null = null;

function readSourceFiles() {
  const { pages, shared } = readLibrary(process.cwd());
  const sources = new Map<string, PageSource>();

  for (const page of pages) {
    sources.set(page.slug, {
      component: page.source,
      files: [page.source, ...shared],
    });
  }

  return sources;
}

export function getPageSource(slug: string): PageSource {
  cache ??= readSourceFiles();
  const source = cache.get(slug);
  if (source) return source;

  const fallback: SourceFile = {
    name: `${slug}.tsx`,
    lang: "tsx",
    note: "source is not available in this build.",
    lines: 1,
    code: `// Source for ${slug} is not available in this build.`,
  };
  return { component: fallback, files: [fallback] };
}
