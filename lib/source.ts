import fs from "node:fs";
import path from "node:path";

/**
 * Reads the demo modules at build time and lifts each page's section out of the
 * shared files, so every detail page can show the real component source.
 */

export type SourceFile = {
  name: string;
  lang: string;
  note: string;
  lines: number;
  code: string;
};

export type PageSource = {
  component: SourceFile;
  files: SourceFile[];
};

const TOKENS = `/* 404lab tokens, Tailwind v4. Merge into app/globals.css. */
@theme inline {
  --color-ink-950: #08090a;
  --color-ink-900: #0b0d0f;
  --color-ink-850: #101317;
  --color-ink-800: #15181c;
  --color-fg: #f2ede3;
  --color-fg-2: #b0aba1;
  --color-fg-3: #8b867d;
  --color-line: #1d2125;
  --color-line-2: #2a2f34;
  --color-amber: #e9b871;

  /* Public type tokens. Override these two to reskin the library. */
  --lab-font-display: var(--font-instrument), Georgia, "Times New Roman", serif;
  --lab-font-mono: var(--font-geist-mono), ui-monospace, monospace;

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --default-transition-duration: 180ms;
  --default-transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

@utility display {
  font-family: var(
    --lab-font-display,
    var(--font-display, Georgia, "Times New Roman", serif)
  );
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 0.94;
  text-wrap: balance;
}

@utility lab-mono {
  font-family: var(
    --lab-font-mono,
    var(--font-mono, ui-monospace, SFMono-Regular, monospace)
  );
}
`;

const ROOT = process.cwd();
const DEMOS_DIR = path.join(ROOT, "components/demos");

const used = (code: string, name: string) =>
  new RegExp(`\\b${name}\\b`).test(code);

function importsFor(code: string) {
  const react = ["useEffect", "useRef", "useState"].filter((n) =>
    used(code, n),
  );
  const motion = [
    "motion",
    "useInView",
    "useMotionTemplate",
    "useMotionValue",
    "useReducedMotion",
    "useSpring",
    "useTransform",
  ].filter((n) => used(code, n));
  if (used(code, "MotionValue")) motion.push("type MotionValue");
  const chrome = [
    "Caption",
    "EASE",
    "Foot",
    "HomeLink",
    "Plate",
    "Screen",
    "ScreenButton",
    "clamp",
    "useReplay",
    "useStill",
  ].filter((n) => used(code, n));

  return { react, motion, chrome };
}

function importLine(names: string[], from: string) {
  const single = `import { ${names.join(", ")} } from "${from}";`;
  if (single.length <= 80) return single;
  return `import {\n  ${names.join(",\n  ")},\n} from "${from}";`;
}

function componentSource(slug: string, chunk: string) {
  const { react, motion, chrome } = importsFor(chunk);
  const head = [`"use client";`, "", `// ${slug} · 404lab`];
  head.push(`// Requires ./chrome.tsx and the 404lab tokens.`, "");

  if (react.length) head.push(importLine(react, "react"));
  if (motion.length) head.push(importLine(motion, "motion/react"));
  if (chrome.length) head.push(importLine(chrome, "./chrome"));
  head.push("");

  return `${head.join("\n")}\n${chunk.trim()}\n`;
}

function readSourceFiles() {
  const entries = [
    ...fs
      .readFileSync(path.join(ROOT, "lib/pages.tsx"), "utf8")
      .matchAll(/\{\s*slug: "([^"]+)",[\s\S]*?demo: <(\w+)\s*\/>/g),
  ].map((match) => ({ slug: match[1], demo: match[2] }));

  const chunks = new Map<string, { file: string; chunk: string }>();

  for (const file of fs.readdirSync(DEMOS_DIR)) {
    if (!file.endsWith(".tsx")) continue;
    const content = fs.readFileSync(path.join(DEMOS_DIR, file), "utf8");
    const marks = [...content.matchAll(/\/\* -{3,}[^\n]*?-{3,} \*\//g)];

    for (let i = 0; i < marks.length; i++) {
      const start = marks[i].index ?? 0;
      const end = marks[i + 1]?.index ?? content.length;
      const chunk = content.slice(start, end);
      const fn = chunk.match(/export function (\w+Demo)\(/);
      if (fn) chunks.set(fn[1], { file, chunk });
    }
  }

  const chrome = fs.readFileSync(
    path.join(DEMOS_DIR, "chrome.tsx"),
    "utf8",
  );

  const sources = new Map<string, PageSource>();

  for (const entry of entries) {
    const hit = chunks.get(entry.demo);
    const code = hit
      ? componentSource(entry.slug, hit.chunk)
      : `"use client";\n\n// Source for ${entry.slug} is not available in this build.\n`;

    const files: SourceFile[] = [
      {
        name: `${entry.slug}.tsx`,
        lang: "tsx",
        note: "the page itself. copy it into components/404lab.",
        lines: code.split("\n").length,
        code,
      },
      {
        name: "chrome.tsx",
        lang: "tsx",
        note: "shared frame, captions and replay helpers. copy once.",
        lines: chrome.split("\n").length,
        code: chrome,
      },
      {
        name: "tokens.css",
        lang: "css",
        note: "palette and type utilities. merge into globals once.",
        lines: TOKENS.split("\n").length,
        code: TOKENS,
      },
    ];

    sources.set(entry.slug, { component: files[0], files });
  }

  return sources;
}

let cache: Map<string, PageSource> | null = null;

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
