# 404lab

Landing page and preview site for a small library of animated not-found pages.

Stack: Next.js (App Router), Tailwind CSS v4, Motion, lucide-react.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

- `app/page.tsx` - landing page: hero, page grid, parts, install
- `app/p/[slug]/page.tsx` - per-page detail, live preview, command and source
- `components/demos/` - all animated previews, grouped by kind and re-exported by `components/demos.tsx`
- `components/site/` - nav, hero, sections, footer
- `lib/pages.tsx` - page registry (slug, copy, demo)
- `lib/source-data.mjs` - reads the registry and demos, builds each page's source
- `mcp/` - stdio MCP server and its generated data, see [mcp/README.md](mcp/README.md)
- `scripts/` - MCP data build and smoke test
- `public/worlds/` - pixel landscapes used as scene art

## MCP server

`mcp/server.mjs` is a stdio MCP server for the library. It lists and searches
the 46 pages, returns a page's real component source, and hands over the shared
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
[`mcp/README.md`](mcp/README.md). `npm run build` regenerates the MCP data
before the Next build, so the site and the server stay in step.

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

The switch above the page grid previews 20 faces listed in `lib/faces.ts` and
loaded in `app/layout.tsx`: seven serifs, eight sans, five mono. They are
preview-only and not preloaded, so the library still ships just the two tokens.
Add a face by importing it there and adding one entry to `FACES`.

## Design notes

- Ink surfaces, one amber accent, cream type
- One radius scale: 10px panels, 6px tiles, 4px controls
- Hairline borders, mono metadata, tabular numbers for counts
- Instrument Serif for display, Geist for UI, Geist Mono for labels
- One signature device: a dashed route line ending in a small x
- Motion only where it explains something; every demo has a still state
- All animation runs through Motion or a single CSS keyframe set, no assets

## Credits

Landscape art from [Imageory](https://imageory.in/gallery). Check the terms on
that site before using the images in a public launch; the gallery does not
publish an explicit license on its pages.

Pages are original work, MIT once the library is published.
