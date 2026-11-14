#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

/**
 * 404lab MCP server.
 *
 * Serves the library catalog and the real component source over stdio, so an
 * assistant can search the set, pick a page, and write it into a project.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(here, "data/pages.json");

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  process.stdout.write(
    [
      "404lab MCP server (stdio)",
      "",
      "  node mcp/server.mjs        start the server",
      "  npm run mcp                same, from the repo root",
      "  npm run mcp:data           rebuild mcp/data/pages.json",
      "",
      "Point Claude Code, Codex, Cursor or OpenCode at this file.",
      "Setup notes: mcp/README.md",
      "",
    ].join("\n"),
  );
  process.exit(0);
}

if (!fs.existsSync(dataPath)) {
  process.stderr.write(
    "404lab mcp: data/pages.json is missing. run `npm run mcp:data` first.\n",
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const pages = data.pages;
const bySlug = new Map(pages.map((page) => [page.slug, page]));
const sharedByName = new Map(data.shared.map((file) => [file.name, file]));

const toolResult = (text, isError = false) => ({
  content: [{ type: "text", text }],
  ...(isError ? { isError: true } : {}),
});

const NOT_FOUND = (slug) =>
  toolResult(
    `No page with slug "${slug}". Call list_pages to see all ${data.count} slugs, or search_pages with a word from the title.`,
    true,
  );

function catalogLine(page) {
  return `- ${page.slug} · ${page.title} · ${page.category} · ${page.method} · ${page.desc}`;
}

function catalog() {
  const groups = data.categories.map((category) => {
    const list = pages.filter((page) => page.category === category.id);
    return [
      `## ${category.label} (${list.length})`,
      category.blurb,
      "",
      ...list.map(catalogLine),
    ].join("\n");
  });

  return [
    `# 404lab · ${data.count} animated 404 pages`,
    "",
    "Every page is a standalone Next.js component, installed as source. Categories: scenes, type, interactive.",
    "",
    ...groups,
    "",
    "Call get_page with a slug for the component source and the install command.",
  ].join("\n");
}

function pageHeader(page) {
  return [
    `# ${page.title} · ${page.slug}`,
    `${page.category} · ${page.method}`,
    "",
    page.note,
  ].join("\n");
}

function pageBody(page, includeSource) {
  const parts = [
    pageHeader(page),
    "",
    "install",
    page.command,
    "",
    "use it",
    'in app/not-found.tsx:',
    `import { ${page.export} } from "@/components/404lab/${page.slug}";`,
    `export default function NotFound() { return <${page.export} />; }`,
    "",
    "shared files",
    ...data.shared.map(
      (file) =>
        `- ${file.name} · ${file.lines} lines · ${file.note} Fetch it with get_shared_file.`,
    ),
  ];

  if (includeSource) {
    parts.push(
      "",
      `${page.source.name} · ${page.source.lines} lines`,
      "```tsx",
      page.source.code.trimEnd(),
      "```",
    );
  } else {
    parts.push("", "Call get_page with includeSource true for the component code.");
  }

  return parts.join("\n");
}

const server = new McpServer(
  { name: "404lab", version: data.version },
  {
    instructions:
      "404lab is a library of 46 animated 404 pages for Next.js, Motion and Tailwind. Use list_pages or search_pages to find a page, get_page to read its source and install command, and get_shared_file for the shared chrome and tokens. Copy the returned code into the user's project, or run the shadcn command.",
  },
);

server.registerTool(
  "list_pages",
  {
    title: "List 404 pages",
    description:
      "List every 404 page in 404lab, optionally filtered by category. Returns slug, title, category, animation method and a one-line description.",
    inputSchema: {
      category: z
        .enum(["scene", "type", "interactive"])
        .optional()
        .describe("Limit the list to one category."),
      limit: z
        .number()
        .int()
        .min(1)
        .max(46)
        .optional()
        .describe("How many pages to return. Defaults to all."),
      offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Skip this many pages, for paging."),
    },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  },
  async ({ category, limit, offset }) => {
    const pool = category
      ? pages.filter((page) => page.category === category)
      : pages;
    const start = offset ?? 0;
    const end = Math.min(start + (limit ?? pool.length), pool.length);
    const slice = pool.slice(start, end);

    if (!slice.length) {
      return toolResult(
        `No pages in ${category ?? "the library"} at offset ${start}. There are ${pool.length} in this ${category ? "category" : "library"}.`,
      );
    }

    return toolResult(
      [
        `${pool.length} pages${category ? ` in ${category}` : ""}, showing ${start + 1} to ${end}`,
        "",
        ...slice.map(catalogLine),
        "",
        end < pool.length
          ? `More: call list_pages with offset ${end}.`
          : "Call get_page with a slug for the source.",
      ].join("\n"),
    );
  },
);

server.registerTool(
  "search_pages",
  {
    title: "Search 404 pages",
    description:
      "Search titles, slugs, descriptions, notes, animation methods and categories. Use this when the user describes a feeling or effect rather than a slug.",
    inputSchema: {
      query: z
        .string()
        .min(1)
        .describe("Words to look for, for example water, reels, cursor, glitch."),
      limit: z
        .number()
        .int()
        .min(1)
        .max(46)
        .optional()
        .describe("Maximum matches. Defaults to 10."),
    },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  },
  async ({ query, limit }) => {
    const words = query
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 1);

    const scored = pages
      .map((page) => {
        const haystack = [
          page.slug,
          page.title,
          page.desc,
          page.note,
          page.method,
          page.category,
        ]
          .join(" ")
          .toLowerCase();

        let score = 0;
        if (page.slug === query.toLowerCase()) score += 80;
        if (page.title.toLowerCase() === query.toLowerCase()) score += 60;
        if (page.slug.includes(query.toLowerCase())) score += 30;
        if (page.title.toLowerCase().includes(query.toLowerCase())) score += 20;
        for (const word of words) {
          if (page.title.toLowerCase().includes(word)) score += 8;
          if (page.slug.includes(word)) score += 5;
          if (page.method.toLowerCase().includes(word)) score += 4;
          if (haystack.includes(word)) score += 2;
        }
        return { page, score };
      })
      .filter((hit) => hit.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit ?? 10);

    if (!scored.length) {
      return toolResult(
        `No page matches "${query}". Try a broader word, or call list_pages for the full set.`,
      );
    }

    return toolResult(
      [
        `${scored.length} ${scored.length === 1 ? "match" : "matches"} for "${query}"`,
        "",
        ...scored.map(({ page }) => catalogLine(page)),
        "",
        "Call get_page with a slug for the source.",
      ].join("\n"),
    );
  },
);

server.registerTool(
  "get_page",
  {
    title: "Get a 404 page",
    description:
      "Return one page: category, method, description, the install command, the export name and the full component source. Use includeSource false to read only the metadata.",
    inputSchema: {
      slug: z
        .string()
        .min(1)
        .describe("Page slug, for example flood-404. Call list_pages if unsure."),
      includeSource: z
        .boolean()
        .optional()
        .describe("Include the component code. Defaults to true."),
    },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  },
  async ({ slug, includeSource }) => {
    const page = bySlug.get(slug.trim().toLowerCase());
    if (!page) return NOT_FOUND(slug);
    return toolResult(pageBody(page, includeSource ?? true));
  },
);

server.registerTool(
  "get_shared_file",
  {
    title: "Get shared source",
    description:
      "Return a shared file that every page imports. chrome.tsx is the frame, captions and replay helpers. tokens.css is the palette and type utilities for globals.css. Both are one-time copies.",
    inputSchema: {
      name: z
        .enum(["chrome.tsx", "tokens.css"])
        .describe("Which shared file to return."),
    },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  },
  async ({ name }) => {
    const file = sharedByName.get(name);
    if (!file) return toolResult(`Unknown shared file "${name}".`, true);

    return toolResult(
      [
        `${file.name} · ${file.lines} lines`,
        file.note,
        "",
        "```" + file.lang,
        file.code.trimEnd(),
        "```",
      ].join("\n"),
    );
  },
);

server.registerTool(
  "get_install_guide",
  {
    title: "How to install 404lab",
    description:
      "Explain how a 404lab page lands in a Next.js project, with or without the shadcn CLI, and list the prerequisites. Pass a slug for a ready command.",
    inputSchema: {
      slug: z
        .string()
        .optional()
        .describe("Page slug. Omit to get the generic command."),
    },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  },
  async ({ slug }) => {
    let command = "npx shadcn@latest add @404lab/<slug>";
    let picked = null;

    if (slug) {
      picked = bySlug.get(slug.trim().toLowerCase());
      if (!picked) return NOT_FOUND(slug);
      command = picked.command;
    }

    return toolResult(
      [
        "# Installing 404lab",
        "",
        "requires",
        ...data.install.requires.map((item) => `- ${item}`),
        "",
        "with the shadcn cli",
        command,
        "",
        "The command writes the page into components/404lab with its imports. If the project is not on shadcn yet, run `npx shadcn@latest init` once first.",
        "",
        "by hand",
        `1. get_page for ${picked ? picked.slug : "the page"} and save the tsx file as components/404lab/<slug>.tsx.`,
        "2. get_shared_file chrome.tsx and save it beside the page.",
        "3. get_shared_file tokens.css and merge it into app/globals.css.",
        "4. install motion if it is missing: npm install motion",
        "",
        "then",
        'import the export from "@/components/404lab/<slug>" in app/not-found.tsx and render it. The component needs no props.',
        "",
        "The font tokens --lab-font-display and --lab-font-mono can be overridden anywhere in the tree, so the type can change without editing the page.",
      ].join("\n"),
    );
  },
);

server.registerResource(
  "library",
  "lab404://library",
  {
    title: "404lab catalog",
    description: "All 46 pages grouped by category.",
    mimeType: "text/markdown",
  },
  async (uri) => ({
    contents: [{ uri: uri.href, mimeType: "text/markdown", text: catalog() }],
  }),
);

server.registerResource(
  "page",
  new ResourceTemplate("lab404://pages/{slug}", {
    list: async () => ({
      resources: pages.map((page) => ({
        uri: `lab404://pages/${page.slug}`,
        name: page.slug,
        title: `${page.title} · ${page.slug}`,
        mimeType: "text/markdown",
      })),
    }),
    complete: {
      slug: (value) =>
        pages
          .map((page) => page.slug)
          .filter((slug) => slug.startsWith(value)),
    },
  }),
  {
    title: "404lab page",
    description: "One page with its install command and source.",
    mimeType: "text/markdown",
  },
  async (uri, variables) => {
    const slug = String(variables.slug ?? "");
    const page = bySlug.get(slug);
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: page
            ? pageBody(page, true)
            : `No page with slug "${slug}". Read lab404://library for the list.`,
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write(
  `404lab mcp · ${pages.length} pages · stdio ready\n`,
);
