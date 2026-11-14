import fs from "node:fs";
import path from "node:path";

/**
 * Plain ESM reader for the library. Shared by the Next detail pages and by the
 * MCP data build, so both always describe the same source.
 */

export const TOKENS = `/* 404lab tokens, Tailwind v4. Merge into app/globals.css. */
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

const ENTRY =
  /\{\s*slug: "([^"]+)",\s*title: "([^"]*)",\s*desc: "([^"]*)",\s*note: "([^"]*)",\s*method: "([^"]*)",\s*category: "([^"]+)",\s*demo: <(\w+)\s*\/>/g;

const used = (code, name) => new RegExp(`\\b${name}\\b`).test(code);

function importsFor(code) {
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

function importLine(names, from) {
  const single = `import { ${names.join(", ")} } from "${from}";`;
  if (single.length <= 80) return single;
  return `import {\n  ${names.join(",\n  ")},\n} from "${from}";`;
}

function componentSource(slug, chunk) {
  const { react, motion, chrome } = importsFor(chunk);
  const head = [`"use client";`, "", `// ${slug} · 404lab`];
  head.push(`// Requires ./chrome.tsx and the 404lab tokens.`, "");

  if (react.length) head.push(importLine(react, "react"));
  if (motion.length) head.push(importLine(motion, "motion/react"));
  if (chrome.length) head.push(importLine(chrome, "./chrome"));
  head.push("");

  return `${head.join("\n")}\n${chunk.trim()}\n`;
}

const file = (name, lang, note, code) => ({
  name,
  lang,
  note,
  lines: code.split("\n").length,
  code,
});

function readChunks(demosDir) {
  const chunks = new Map();

  for (const name of fs.readdirSync(demosDir)) {
    if (!name.endsWith(".tsx")) continue;
    const content = fs.readFileSync(path.join(demosDir, name), "utf8");
    const marks = [...content.matchAll(/\/\* -{3,}[^\n]*?-{3,} \*\//g)];

    for (let i = 0; i < marks.length; i++) {
      const start = marks[i].index ?? 0;
      const end = marks[i + 1]?.index ?? content.length;
      const chunk = content.slice(start, end);
      const fn = chunk.match(/export function (\w+Demo)\(/);
      if (fn) chunks.set(fn[1], { file: name, chunk });
    }
  }

  return chunks;
}

/**
 * @param {string} root repository root
 */
export function readLibrary(root) {
  const demoDir = path.join(root, "components/demos");
  const chunks = readChunks(demoDir);

  const entries = [
    ...fs
      .readFileSync(path.join(root, "lib/pages.tsx"), "utf8")
      .matchAll(ENTRY),
  ].map((m) => ({
    slug: m[1],
    title: m[2],
    desc: m[3],
    note: m[4],
    method: m[5],
    category: m[6],
    demo: m[7],
  }));

  const chrome = fs.readFileSync(path.join(demoDir, "chrome.tsx"), "utf8");

  const pages = entries.map((entry) => {
    const hit = chunks.get(entry.demo);
    const code = hit
      ? componentSource(entry.slug, hit.chunk)
      : `"use client";\n\n// Source for ${entry.slug} is not available in this build.\n`;

    return {
      ...entry,
      source: file(
        `${entry.slug}.tsx`,
        "tsx",
        "the page itself. copy it into components/404lab.",
        code,
      ),
    };
  });

  const shared = [
    file(
      "chrome.tsx",
      "tsx",
      "shared frame, captions and replay helpers. copy once.",
      chrome,
    ),
    file(
      "tokens.css",
      "css",
      "palette and type utilities. merge into globals once.",
      TOKENS,
    ),
  ];

  return { pages, shared };
}
