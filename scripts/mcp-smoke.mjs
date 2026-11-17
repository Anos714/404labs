import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * Minimal MCP handshake: starts the server, lists tools, reads one page and one
 * shared file. Exits non-zero on the first broken response.
 *
 * node scripts/mcp-smoke.mjs
 */

const root = path.resolve(import.meta.dirname, "..");
const library = JSON.parse(
  fs.readFileSync(path.join(root, "mcp/data/pages.json"), "utf8"),
);
const child = spawn(process.execPath, [path.join(root, "mcp/server.mjs")], {
  cwd: root,
  stdio: ["pipe", "pipe", "pipe"],
});

let buffer = "";
const waiting = new Map();
let nextId = 1;
let stderr = "";

child.stderr.on("data", (chunk) => {
  stderr += chunk;
});

child.stdout.on("data", (chunk) => {
  buffer += chunk;
  let index;
  while ((index = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, index).trim();
    buffer = buffer.slice(index + 1);
    if (!line) continue;
    const message = JSON.parse(line);
    const resolve = waiting.get(message.id);
    if (resolve) {
      waiting.delete(message.id);
      resolve(message);
    }
  }
});

function request(method, params) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`timed out on ${method}`)),
      15000,
    );
    waiting.set(id, (message) => {
      clearTimeout(timer);
      if (message.error) reject(new Error(`${method}: ${message.error.message}`));
      else resolve(message.result);
    });
    child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
  });
}

function notify(method, params) {
  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method, params })}\n`);
}

const failures = [];
const check = (label, ok, detail = "") => {
  if (ok) console.log(`ok    ${label}`);
  else {
    failures.push(label);
    console.log(`fail  ${label}${detail ? ` · ${detail}` : ""}`);
  }
};

try {
  const init = await request("initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "404lab-smoke", version: "1" },
  });
  check("initialize", init.serverInfo?.name === "404lab", init.serverInfo?.name);
  notify("notifications/initialized", {});

  const tools = await request("tools/list", {});
  const names = tools.tools.map((tool) => tool.name);
  check(
    "tools",
    ["get_install_guide", "get_page", "get_shared_file", "list_pages", "search_pages"].every(
      (name) => names.includes(name),
    ),
    names.join(", "),
  );

  const call = async (name, args) => {
    const result = await request("tools/call", { name, arguments: args });
    return { text: result.content?.[0]?.text ?? "", isError: !!result.isError };
  };

  const list = await call("list_pages", {});
  check(
    "list_pages",
    list.text.includes(`${library.count} pages`),
    list.text.split("\n")[0],
  );

  const page = await call("get_page", { slug: "flood-404" });
  check("get_page source", page.text.includes("export function FloodDemo"));
  check(
    "get_page install",
    page.text.includes("npx shadcn@latest add @404lab/flood-404"),
  );

  const tokens = await call("get_shared_file", { name: "tokens.css" });
  check("tokens", tokens.text.includes("@theme inline"));

  const missing = await call("get_page", { slug: "missing-404" });
  check("unknown slug is an error", missing.isError);

  const resources = await request("resources/list", {});
  check("resources", resources.resources.length > 1, String(resources.resources.length));

  const catalog = await request("resources/read", { uri: "lab404://library" });
  check(
    "read catalog",
    catalog.contents?.[0]?.text?.startsWith("# 404lab"),
  );
} catch (error) {
  failures.push(error.message);
  console.log(`fail  ${error.message}`);
} finally {
  child.kill();
}

if (failures.length) {
  const log = stderr.trim().split("\n").slice(-3).join("\n");
  console.error(`\n${failures.length} failed${log ? `\nserver: ${log}` : ""}`);
  process.exit(1);
}

console.log("\nmcp smoke passed");
