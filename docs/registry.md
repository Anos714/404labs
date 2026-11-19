# Registering 404lab with shadcn

The registry is built, served and testable. This note covers the three steps
that are left to a person: give it a public origin, install from a consumer
project, and optionally list it in the shadcn Directory.

## What already exists

- `registry.json` at the repo root is the build input. It lists the token
  style, the shared chrome and all 56 pages.
- `scripts/build-registry.mjs` writes `registry/404lab/` (the flat source
  files) and `public/r/` (the served JSON).
- `public/r/registry.json` is the index. `public/r/{slug}.json` is one page,
  `public/r/chrome.json` and `public/r/tokens.json` are the shared pieces.
- Every page item carries the page file, `chrome.tsx`, the CSS variables and
  the `display` and `lab-mono` utilities. A direct URL install therefore lands
  a complete file even if the project has never configured a namespace.

Rebuild after a change:

```bash
npm run registry:build
npm run registry:check   # fails when the generated files are stale
```

`npm run build` runs both the MCP data build and the registry build before
Next, so a deploy cannot ship stale JSON.

## 1. Give the registry a public origin

The install commands are absolute. The site reads `NEXT_PUBLIC_SITE_URL` at
build time and falls back to `https://404lab.dev`:

```bash
NEXT_PUBLIC_SITE_URL=https://your-origin.example npm run build
```

That value feeds the hero command, the install panel, the install footer label
and `homepage` in both registry indexes. It does not rewrite this README, so
update the host there by hand if you quote a command.

Check the deployed registry:

```bash
curl -s https://your-origin.example/r/registry.json | head
curl -s https://your-origin.example/r/glitch-404.json | head
```

Both must return JSON. If the second returns HTML, the host is rewriting the
path, and the CLI will treat the item as invalid.

## 2. Install into a project

Namespace setup, once per project, in `components.json`:

```json
{
  "registries": {
    "@404lab": "https://your-origin.example/r/{name}.json"
  }
}
```

Then:

```bash
npx shadcn@latest add @404lab/glitch-404
```

Or skip the namespace and install from the item URL:

```bash
npx shadcn@latest add https://your-origin.example/r/glitch-404.json
```

What lands:

- `components/404lab/glitch-404.tsx`, the page itself
- `components/404lab/chrome.tsx`, the shared frame and replay helpers
- the palette, radius scale and type utilities, merged into the project CSS
- `motion` and `lucide-react` in `package.json`

Scene pages that use a photograph from `public/worlds/` print a note during
install. Copy that image into the project, or change the `src` to your own.

Render it:

```tsx
// app/not-found.tsx
import { GlitchDemo } from "@/components/404lab/glitch-404";

export default function NotFound() {
  return <GlitchDemo />;
}
```

Every page exports a single `<Name>Demo` component that takes no props, and
nothing in the file points back at 404lab.

## 3. List it in the shadcn Directory

This is optional. The registry already works for anyone who has the URL. The
Directory only makes `@404lab` resolvable without the one line in
`components.json`.

The process, from the shadcn docs:

1. Add one entry to `apps/v4/registry/directory.json` in the shadcn-ui/ui repo.
2. Run `pnpm validate:registries`.
3. Open a pull request.

The entry shape:

```json
{
  "name": "@404lab",
  "homepage": "https://your-origin.example",
  "url": "https://your-origin.example/r/{name}.json",
  "description": "Fifty-six animated not-found pages, one mechanic each, with the source you install and keep.",
  "author": "404lab",
  "logo": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='var(--foreground)'><rect x='3' y='3' width='11' height='11'/><rect x='18' y='3' width='11' height='11'/><rect x='3' y='18' width='11' height='11'/><rect x='21' y='21' width='5' height='5'/></svg>"
}
```

Requirements that already hold:

- open source and publicly reachable
- a flat registry: `/r/registry.json` plus `/r/{name}.json`, no nested paths
- the root index lists items without `content`; the item files carry content,
  which is what other listed registries do too

After the merge, `npx shadcn@latest add @404lab/<name>` works with no local
configuration. Registry Health starts monitoring the origin and will report a
failed item without blocking publication.

## Fonts

The pages fall back to Georgia and the system monospace. To match the site,
load Instrument Serif and Geist Mono, then set:

```css
:root {
  --lab-font-display: "Instrument Serif", Georgia, serif;
  --lab-font-mono: "Geist Mono", ui-monospace, monospace;
}
```

Both are read by the `display` and `lab-mono` utilities that the registry
merges into the project CSS.
