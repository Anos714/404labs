import fs from "node:fs";
import path from "node:path";

/**
 * Plain ESM reader for the library. Shared by the Next detail pages and by the
 * MCP data build, so both always describe the same source.
 */

export const TOKENS = `/* 404lab tokens, Tailwind v4. Merge into app/globals.css. */
@theme inline {
  --color-ink-950: #121212;
  --color-ink-900: #17171a;
  --color-ink-850: #1b1b1e;
  --color-ink-800: #232327;
  --color-fg: #fafafa;
  --color-fg-2: #b3b3b9;
  --color-fg-3: #7c7c84;
  --color-line: #26262a;
  --color-line-2: #35353b;
  --color-amber: #e9b871;

  /* One radius scale: panels, media tiles, controls. */
  --radius-panel: 20px;
  --radius-tile: 12px;
  --radius-control: 8px;

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
  font-variant-numeric: tabular-nums;
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

function word(name) {
  return new RegExp(`(^|[^\\w$])${name.replace(/\$/g, "\\$")}($|[^\\w$])`);
}

/**
 * Top-level declarations in a demo file. The section markers split one file
 * into many demos, but small helpers (a DIGITS list, an event table) often sit
 * above them and are shared. The source panel needs those helpers too.
 */
function topLevelStatements(content) {
  const statements = [];
  let current = null;

  for (const line of content.split("\n")) {
    const match = line.match(
      /^(?:export\s+)?(?:const|let|var|function|type|interface|class|enum)\s+([A-Za-z_$][\w$]*)/,
    );
    if (match) {
      if (current) statements.push(current);
      current = { name: match[1], lines: [line] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) statements.push(current);

  return statements.map((statement, order) => {
    const lines = [...statement.lines];
    while (
      lines.length > 1 &&
      /^\s*(?:\/\*|\*|\/\/|$)/.test(lines[lines.length - 1])
    ) {
      lines.pop();
    }
    return {
      name: statement.name,
      text: lines.join("\n").trimEnd(),
      order,
    };
  });
}

function helpersFor(content, start, end) {
  const outside = [
    ...topLevelStatements(content.slice(0, start)),
    ...topLevelStatements(content.slice(end)),
  ]
    .filter((statement) => !/^export function \w+Demo/m.test(statement.text))
    .map((statement, order) => ({ ...statement, order }));

  const chosen = [];
  let text = content.slice(start, end);
  let changed = true;

  while (changed) {
    changed = false;
    for (const statement of outside) {
      if (chosen.includes(statement)) continue;
      if (word(statement.name).test(text)) {
        chosen.push(statement);
        text += `\n${statement.text}`;
        changed = true;
      }
    }
  }

  return chosen
    .sort((a, b) => a.order - b.order)
    .map((statement) => statement.text);
}

function componentSource(slug, chunk, helpers) {
  const body = [...helpers, chunk.trim()].filter(Boolean).join("\n\n");
  const { react, motion, chrome } = importsFor(body);
  const head = [`"use client";`, "", `// ${slug} · 404lab`];
  head.push(`// Requires ./chrome.tsx and the 404lab tokens.`, "");

  if (react.length) head.push(importLine(react, "react"));
  if (motion.length) head.push(importLine(motion, "motion/react"));
  if (chrome.length) head.push(importLine(chrome, "./chrome"));
  head.push("");

  return `${head.join("\n")}\n${body}\n`;
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
      if (fn) chunks.set(fn[1], { file: name, chunk, content, start, end });
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
      ? componentSource(
          entry.slug,
          hit.chunk,
          helpersFor(hit.content, hit.start, hit.end),
        )
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
