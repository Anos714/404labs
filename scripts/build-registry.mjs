import fs from "node:fs";
import path from "node:path";
import { readLibrary } from "../lib/source-data.mjs";

/**
 * Builds the shadcn registry served from public/r.
 *
 * node scripts/build-registry.mjs          writes registry/ and public/r
 * node scripts/build-registry.mjs --check  exits 1 when anything is stale
 */

const root = path.resolve(import.meta.dirname, "..");
const check = process.argv.includes("--check");
const { pages, shared } = readLibrary(root);
const chrome = shared.find((file) => file.name === "chrome.tsx");
const tokens = shared.find((file) => file.name === "tokens.css");

const pkg = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
);

/** Same origin the site prints. Set it once per deploy. */
const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://404lab.dev").replace(
  /\/+$/,
  "",
);

const CSS_VARS = {
  theme: {
    "color-ink-950": "#121212",
    "color-ink-900": "#17171a",
    "color-ink-850": "#1b1b1e",
    "color-ink-800": "#232327",
    "color-fg": "#fafafa",
    "color-fg-2": "#b3b3b9",
    "color-fg-3": "#7c7c84",
    "color-line": "#26262a",
    "color-line-2": "#35353b",
    "color-amber": "#e9b871",
    "radius-panel": "20px",
    "radius-tile": "12px",
    "radius-control": "8px",
    "lab-font-display":
      'var(--font-instrument), Georgia, "Times New Roman", serif',
    "lab-font-mono": "var(--font-geist-mono), ui-monospace, monospace",
    "ease-out": "cubic-bezier(0.22, 1, 0.36, 1)",
  },
};

const CSS = {
  "@utility display": {
    "font-family":
      'var(--lab-font-display, var(--font-display, Georgia, "Times New Roman", serif))',
    "font-weight": "400",
    "letter-spacing": "-0.025em",
    "line-height": "0.94",
    "text-wrap": "balance",
  },
  "@utility lab-mono": {
    "font-family":
      "var(--lab-font-mono, var(--font-mono, ui-monospace, SFMono-Regular, monospace))",
    "font-variant-numeric": "tabular-nums",
  },
};

const target = (file) => `@components/404lab/${file}`;
const sourcePath = (file) => `registry/404lab/${file}`;

function pageItem(page) {
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: page.slug,
    type: "registry:block",
    title: `${page.title} 404`,
    description: page.desc,
    author: "404lab",
    categories: [page.category],
    dependencies: ["motion", "lucide-react"],
    files: [
      {
        path: sourcePath(`${page.slug}.tsx`),
        type: "registry:component",
        target: target(`${page.slug}.tsx`),
        content: page.source.code,
      },
      {
        path: sourcePath("chrome.tsx"),
        type: "registry:component",
        target: target("chrome.tsx"),
        content: chrome.code,
      },
    ],
    cssVars: CSS_VARS,
    css: CSS,
    meta: {
      category: page.category,
      method: page.method,
      note: page.note,
      version: pkg.version,
    },
  };

  if (/src="\/(worlds|ver)\//.test(page.source.code)) {
    item.docs =
      "This page uses a demo photograph from the 404lab public/worlds folder. Copy that file into your public folder, or change the src to your own image.";
  }

  return item;
}

function chromeItem() {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "chrome",
    type: "registry:component",
    title: "404lab chrome",
    description: "The shared frame, captions and replay helpers.",
    author: "404lab",
    dependencies: ["motion", "lucide-react"],
    files: [
      {
        path: sourcePath("chrome.tsx"),
        type: "registry:component",
        target: target("chrome.tsx"),
        content: chrome.code,
      },
    ],
  };
}

function tokensItem() {
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "tokens",
    type: "registry:style",
    title: "404lab tokens",
    description: "The palette, radius scale and type utilities.",
    author: "404lab",
    files: [
      {
        path: sourcePath("tokens.css"),
        type: "registry:file",
        target: target("404lab-tokens.css"),
        content: tokens.code,
      },
    ],
    cssVars: CSS_VARS,
    css: CSS,
  };
}

function indexFile() {
  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "404lab",
    homepage: site,
    items: [
      {
        name: "tokens",
        type: "registry:style",
        title: "404lab tokens",
        description: "The palette, radius scale and type utilities.",
      },
      {
        name: "chrome",
        type: "registry:component",
        title: "404lab chrome",
        description: "The shared frame, captions and replay helpers.",
      },
      ...pages.map((page) => ({
        name: page.slug,
        type: "registry:block",
        title: `${page.title} 404`,
        description: page.desc,
        categories: [page.category],
      })),
    ],
  };
}

const registryItems = pages.map((page) => {
  const item = pageItem(page);
  delete item.$schema;
  delete item.files[0].content;
  delete item.files[1].content;
  return item;
});

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "404lab",
  homepage: site,
  items: [
    {
      name: "tokens",
      type: "registry:style",
      title: "404lab tokens",
      description: "The palette, radius scale and type utilities.",
      files: [
        {
          path: sourcePath("tokens.css"),
          type: "registry:file",
          target: target("404lab-tokens.css"),
        },
      ],
      cssVars: CSS_VARS,
      css: CSS,
    },
    {
      name: "chrome",
      type: "registry:component",
      title: "404lab chrome",
      description: "The shared frame, captions and replay helpers.",
      files: [
        {
          path: sourcePath("chrome.tsx"),
          type: "registry:component",
          target: target("chrome.tsx"),
        },
      ],
    },
    ...registryItems,
  ],
};

const writes = new Map();

writes.set(sourcePath("chrome.tsx"), chrome.code);
writes.set(sourcePath("tokens.css"), tokens.code);
for (const page of pages) {
  writes.set(sourcePath(`${page.slug}.tsx`), page.source.code);
}

writes.set("registry.json", `${JSON.stringify(registry, null, 2)}\n`);
writes.set("public/r/registry.json", `${JSON.stringify(indexFile(), null, 2)}\n`);
writes.set("public/r/chrome.json", `${JSON.stringify(chromeItem(), null, 2)}\n`);
writes.set("public/r/tokens.json", `${JSON.stringify(tokensItem(), null, 2)}\n`);

for (const page of pages) {
  writes.set(
    `public/r/${page.slug}.json`,
    `${JSON.stringify(pageItem(page), null, 2)}\n`,
  );
}

const stale = [];
for (const [relative, content] of writes) {
  const absolute = path.join(root, relative);
  if (check) {
    const current = fs.existsSync(absolute)
      ? fs.readFileSync(absolute, "utf8")
      : null;
    if (current !== content) stale.push(relative);
    continue;
  }
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content);
}

if (check) {
  if (stale.length) {
    console.error(
      `registry is stale (${stale.length} files). run npm run registry:build`,
    );
    for (const file of stale.slice(0, 8)) console.error(`  ${file}`);
    process.exit(1);
  }
  console.log(`registry is current (${pages.length} pages)`);
} else {
  console.log(
    `wrote registry.json and ${pages.length + 4} files in registry/ and public/r`,
  );
}
