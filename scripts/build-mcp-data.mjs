import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readLibrary } from "../lib/source-data.mjs";

/**
 * Builds the data file the MCP server serves. Keeps the server self-contained:
 * it can be pointed at from any client without reading this repository.
 *
 * node scripts/build-mcp-data.mjs          writes mcp/data/pages.json
 * node scripts/build-mcp-data.mjs --check  exits 1 when the file is stale
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "mcp/data/pages.json");
const { pages, shared } = readLibrary(root);
const version = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8"),
).version;

const data = {
  name: "404lab",
  version,
  dataVersion: 1,
  count: pages.length,
  categories: [
    { id: "scene", label: "scenes", blurb: "a place, then a hole in it" },
    { id: "type", label: "type", blurb: "the number does the work" },
    {
      id: "interactive",
      label: "interactive",
      blurb: "the page answers your hand",
    },
  ],
  install: {
    command: "npx shadcn@latest add @404lab/{slug}",
    requires: ["Next.js App Router", "Tailwind CSS v4", "Motion"],
    usage: 'import { <Export> } from "@/components/404lab/<slug>";',
  },
  pages: pages.map((page) => ({
    slug: page.slug,
    title: page.title,
    desc: page.desc,
    note: page.note,
    method: page.method,
    category: page.category,
    export: page.demo,
    command: `npx shadcn@latest add @404lab/${page.slug}`,
    source: page.source,
  })),
  shared,
};

const serialized = `${JSON.stringify(data, null, 2)}\n`;

if (process.argv.includes("--check")) {
  const current = fs.existsSync(target)
    ? fs.readFileSync(target, "utf8")
    : "";
  if (current !== serialized) {
    console.error("mcp/data/pages.json is stale. run: npm run mcp:data");
    process.exit(1);
  }
  console.log("mcp data is current");
} else {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, serialized);
  const kb = (Buffer.byteLength(serialized) / 1024).toFixed(1);
  console.log(`mcp/data/pages.json · ${pages.length} pages · ${kb} kB`);
}
