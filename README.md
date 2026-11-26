<div align="center">
  <img src="./public/mascot.jpg" alt="404lab mascot" width="140" style="border-radius: 28px;" />

  <h1>404lab</h1>

  <p>
    <strong>A missing page still has a design.</strong><br />
    Fifty-six animated not-found pages and eight reusable parts for Next.js, Motion, and Tailwind CSS v4.<br />
    Installed via shadcn, MCP, or Agent Skills — owned by you.
  </p>

  <p>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-e9b871?style=flat-square" alt="MIT License" /></a>
    <img src="https://img.shields.io/badge/Next.js-16.4-121212?style=flat-square&logo=next.js" alt="Next.js 16.4" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-121212?style=flat-square&logo=tailwindcss" alt="Tailwind CSS v4" />
    <img src="https://img.shields.io/badge/pages-56-121212?style=flat-square" alt="56 Pages" />
    <img src="https://img.shields.io/badge/MCP_%2B_Skill-ready-121212?style=flat-square" alt="MCP and Agent Skill Ready" />
  </p>
</div>

---

## Overview

**404lab** is an open-source catalogue and source library of **56 handcrafted, animated 404 pages**:
- **17 Scenes** — atmospheric environments and spatial metaphors (`mosaic-404`, `spotlight-404`, `flood-404`, `fog-404`, `terminal-404`, ...)
- **16 Type Studies** — kinetic typography and numeral mechanics (`glitch-404`, `odometer-404`, `morse-404`, `ticker-404`, `sweep-404`, ...)
- **23 Interactive Pages** — pointer, keyboard, and physics-driven dead ends (`brick-404`, `snake-404`, `gravity-404`, `magnet-404`, `dial-404`, ...)
- **8 Reusable Parts** — standalone micro-components (`scramble-text`, `flip-digit`, `animated-digits`, `magnetic-button`, `elastic-arrow`, `typewriter-line`, `morse-lamp`, `scan-sweep`)

Every page exports a single zero-prop `<Name>Demo` component. Nothing calls home, and no runtime wrapper is required.

---

## Key Features

- **Copy-as-Source via shadcn Registry** — served at `/r/{name}.json` with `chrome.tsx` and Tailwind v4 tokens bundled in.
- **Built-in Stdio MCP Server** — `mcp/server.mjs` exposes 6 tools (`list_pages`, `search_pages`, `get_page`, `get_shared_file`, `get_install_guide`, `get_agent_skill`) and 3 resources (`lab404://library`, `lab404://pages/{slug}`, `lab404://skill`).
- **Agent Skill (`SKILL.md`)** — installable directly into Antigravity, Claude Code, Codex, and Cursor from `/skills/404lab/SKILL.md`.
- **20-Typeface Live Specimen Rail** — preview 7 serifs, 8 sans, and 5 mono faces live across the catalogue using just two public CSS tokens.
- **Accessibility & Reduced Motion** — every demo ships a still state respecting `prefers-reduced-motion` via `useStill()` and keyboard-first controls.
- **SEO / AEO / GEO Ready** — dynamic `sitemap.xml`, `robots.txt`, canonicals, OpenGraph/Twitter cards, JSON-LD structured data, and `public/llms.txt`.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js `16.4.6` (App Router, Turbopack) |
| **UI & Language** | React `19.3.0`, TypeScript `5` (`strict: true`) |
| **Styling** | Tailwind CSS `v4`, `@tailwindcss/turbopack` |
| **Animation** | Motion (`motion/react` `^14.13.0`) |
| **Icons** | `lucide-react` |
| **AI Tooling** | `@modelcontextprotocol/sdk`, `zod`, Agent `SKILL.md` |
| **Distribution** | shadcn Registry (`/r/{name}.json`) |

---

## Getting Started (Clone & Run)

**Prerequisites:** Node.js `>= 20.11.0` and `npm` (or `bun`).

```bash
# 1. Clone the repository
git clone https://github.com/Anos714/404labs.git
cd 404labs

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Installing a 404 Page in Your Project

### Option 1: Direct URL (zero config)

```bash
npx shadcn@latest add https://404lab.dev/r/glitch-404.json
```

### Option 2: `@404lab` Namespace

Add the registry once to `components.json`:

```json
{
  "registries": {
    "@404lab": "https://404lab.dev/r/{name}.json"
  }
}
```

Then install any page by slug:

```bash
npx shadcn@latest add @404lab/glitch-404
```

Use it in `app/not-found.tsx`:

```tsx
import { GlitchDemo } from "@/components/404lab/glitch-404";

export default function NotFound() {
  return <GlitchDemo />;
}
```

> **Note on Scene Images:** Some `scene` pages reference photographs from `public/worlds/`. Copy the referenced `.webp` file into your project's `public/worlds/` directory or swap the `src` for your own image. See [`docs/registry.md`](docs/registry.md) for full deployment and shadcn Directory details.

---

## Agent Skill & MCP Server

### Agent Skill (`SKILL.md`)

Install the skill into your project so your coding agent knows all 56 slugs, tokens, and App Router wiring rules:

```bash
curl -sL https://404lab.dev/skills/404lab/SKILL.md -o .agents/skills/404lab/SKILL.md --create-dirs
```

### MCP Server (`mcp/server.mjs`)

Point Claude Code, Cursor, Codex, or OpenCode at `mcp/server.mjs`:

```json
{
  "mcpServers": {
    "404lab": {
      "command": "node",
      "args": ["/path/to/404labs/mcp/server.mjs"]
    }
  }
}
```

See [`mcp/README.md`](mcp/README.md) for client-specific setup instructions and tool documentation.

---

## Typography & Design Tokens

Override two CSS variables on `:root` (or any wrapper) to reskin every page without editing component code:

```css
:root {
  --lab-font-display: "Your Display", Georgia, serif;
  --lab-font-mono: "Your Mono", ui-monospace, monospace;
}
```

---

## Scripts

```bash
npm run dev             # Start Next.js dev server
npm run build           # Rebuild MCP data + registry + Next.js production build
npm run lint            # Run ESLint
npx tsc --noEmit        # Run TypeScript typecheck
npm run registry:build  # Regenerate registry/ and public/r/
npm run registry:check  # Verify generated registry is in sync
npm run mcp:data        # Regenerate mcp/data/pages.json
npm run mcp:check       # Verify MCP data is in sync
npm run mcp:test        # Run MCP stdio smoke tests
npm run mcp             # Start the MCP server on stdio
```

---

## Project Structure

```text
app/                Next.js App Router pages, SEO routes (robots.ts, sitemap.ts), global tokens
components/demos/   All 56 animated 404 demos + shared chrome.tsx
components/site/    Catalogue UI, search, typeface rail, install tabs, mascot, sponsor badges
lib/                Page registry (pages.tsx), typeface list, source extractor (source-data.mjs)
mcp/                Stdio MCP server (server.mjs) and generated pages.json
public/             Static assets, mascot, worlds/, llms.txt, skills/, and generated r/*.json
registry/           Generated standalone component files for shadcn
scripts/            Registry builder, MCP data builder, and MCP smoke tests
```

---

## Sponsors

404lab is independent and free for everyone. Current sponsor:
- **[Designeer](https://designeer.xyz/)** — Inspiration, resources, tools & portfolios

Want your logo in the navbar and sponsor strip? Check the `#sponsor` section on the site or reach out via GitHub.

---

## Author

Built by **Rahul Sain**

- **Portfolio:** [rahulxcode.vercel.app](https://rahulxcode.vercel.app/)
- **Twitter / X:** [@_rahulsain](https://x.com/_rahulsain)
- **LinkedIn:** [linkedin.com/in/rahulsain](https://linkedin.com/in/rahulsain)
- **Medium:** [medium.com/@_rahulsain](https://medium.com/@_rahulsain)
- **GitHub:** [github.com/Anos714/404labs](https://github.com/Anos714/404labs)

---

## Credits & License

- Landscape photographs in `public/worlds/` are from [Imageory](https://imageory.in/gallery). Please review their site terms before using those images in a public launch.
- Released under the **[MIT License](./LICENSE)**.
