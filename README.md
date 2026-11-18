# 404lab

Catalogue and source for 56 animated not-found pages: 17 scenes, 16 type
studies and 23 interactive pages.

Stack: Next.js (App Router), Tailwind CSS v4, Motion, lucide-react.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

- `app/page.tsx` - catalogue landing: rail, search, page grid, parts, install
- `app/p/[slug]/page.tsx` - detail page with the live demo, install command and
  the real component source
- `components/demos/` - the demos, grouped by kind and re-exported by
  `components/demos.tsx`
- `components/site/` - landing rail, top bar, catalogue, detail chrome
- `lib/pages.tsx` - the page registry: slug, copy, category, demo
- `lib/source-data.mjs` - reads the registry and demos, builds each page's
  standalone source, including small helpers shared inside a demo file
- `registry/404lab/` - generated source files used by the shadcn registry
- `public/r/` - generated registry items served to the shadcn CLI
- `mcp/` - stdio MCP server and its generated data, see
  [mcp/README.md](mcp/README.md)
- `scripts/` - MCP data, registry build and smoke tests
- `public/worlds/` - photographs used by a few scene demos

## shadcn registry

The site serves a shadcn registry at `/r/{name}.json`. Each page item carries
the component, the shared `chrome.tsx` and the token block, so a single install
lands a working file. `registry.json` is the build input; `registry/404lab/` and
`public/r/` are generated.

```bash
npm run registry:build   # rebuild registry/ and public/r
npm run registry:check   # fail when the generated files are stale
```

Point `components.json` at the registry once:

```json
{
  "registries": {
    "@404lab": "https://404lab.dev/r/{name}.json"
  }
}
```

Then install a page by name:

```bash
npx shadcn@latest add @404lab/glitch-404
```

Or skip the namespace and install from the item URL:

```bash
npx shadcn@latest add https://404lab.dev/r/glitch-404.json
```

Replace the host with wherever the site is deployed. The site reads
`NEXT_PUBLIC_SITE_URL` at build time (default `https://404lab.dev`), so set it
once and every command, snippet and registry `homepage` follows. In local
development the template is `http://localhost:3000/r/{name}.json`.

The item adds `motion` and `lucide-react`, writes both files into
`components/404lab/`, and merges the colors, radius scale and the `display` and
`lab-mono` utilities into the project CSS. Some scene demos use a photograph
from `public/worlds/`; the install output says so, and the `src` can be swapped
for your own image.

## MCP server

`mcp/server.mjs` is a stdio MCP server for the library. It lists and searches
the 56 pages, returns a page's real component source, and hands over the shared
`chrome.tsx` and `tokens.css`. It works with Claude Code, Codex, Cursor and
OpenCode.

```bash
npm run mcp:data   # rebuild mcp/data/pages.json from the demos
npm run mcp:test   # handshake, tool list, one page read
npm run mcp        # start the server on stdio
```

Point a client at the absolute path. A project `.mcp.json` looks like this:

```json
{
  "mcpServers": {
    "404lab": {
      "command": "node",
      "args": ["/path/to/404lab/mcp/server.mjs"]
    }
  }
}
```

Per-client setup, tool list and examples are in
[`mcp/README.md`](mcp/README.md). `npm run build` regenerates the MCP data and
the registry before the Next build, so the site, the server and the CLI items
stay in step.

## Fonts

Every page reads two public tokens, so you can change the type without editing a
component:

```css
:root {
  --lab-font-display: "Your Display", Georgia, serif;
  --lab-font-mono: "Your Mono", ui-monospace, monospace;
}
```

Load the faces with `next/font`, a local `@font-face`, or a hosted stylesheet,
then set the variables on `:root` or on a single wrapper. The `.display` and
`.lab-mono` utilities in `app/globals.css` resolve through these tokens, with
fallbacks so the pages still render before a font is chosen.

The typeface rail above the catalogue previews 20 faces listed in
`lib/faces.ts` and loaded in `app/layout.tsx`: seven serifs, eight sans, five
mono. They are preview-only and not preloaded, so the library still ships just
the two tokens. Add a face by importing it there and adding one entry to
`FACES`.

## Design notes

- Neutral ink surfaces, one amber accent, near-white type
- One radius scale: 20px panels, 12px tiles, 8px controls
- Dashed dividers, mono metadata, tabular numbers for counts
- Instrument Serif for display, Geist for UI, Geist Mono for labels
- Motion only where it explains something; every demo has a still state
- All animation runs through Motion or a small CSS keyframe set

## Credits

Landscape photographs from [Imageory](https://imageory.in/gallery). Check the
terms on that site before using the images in a public launch; the gallery does
not publish an explicit license on its pages.

Pages are original work, MIT once the library is published.
