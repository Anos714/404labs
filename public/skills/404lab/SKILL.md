---
name: 404lab
description: Install, customize, and wire animated Next.js 404 (not-found) pages from 404lab into App Router projects. Use when the user asks for a custom 404 page, not-found screen, 500/offline fallback, or wants to browse/install a 404lab component via shadcn or source copy.
---

# 404lab Agent Skill

404lab is a collection of 56 animated not-found pages for Next.js (App Router), Tailwind CSS v4, and Motion (`motion/react`). Every page exports a single zero-prop `<Name>Demo` component.

## Categories

- **scene** (17): Atmospheric scenes and spatial metaphors (e.g., `mosaic-404`, `spotlight-404`, `window-404`, `flood-404`, `fog-404`, `terminal-404`).
- **type** (16): Kinetic typography and numeral studies (e.g., `glitch-404`, `odometer-404`, `morse-404`, `ticker-404`, `sweep-404`, `braille-404`).
- **interactive** (23): Pointer, keyboard, and physics-driven pages (e.g., `brick-404`, `snake-404`, `gravity-404`, `magnet-404`, `dial-404`, `shatter-404`).

## Install a Page

### Option 1: Direct URL (zero config)

```bash
npx shadcn@latest add https://404lab.dev/r/glitch-404.json
```

### Option 2: Namespace (once in `components.json`)

```json
{
  "registries": {
    "@404lab": "https://404lab.dev/r/{name}.json"
  }
}
```

Then install any slug:

```bash
npx shadcn@latest add @404lab/glitch-404
```

## Wire into Next.js App Router

```tsx
// app/not-found.tsx
import { GlitchDemo } from "@/components/404lab/glitch-404";

export default function NotFound() {
  return <GlitchDemo />;
}
```

## Customize Fonts & Assets

1. **Typography**: Override `--lab-font-display` and `--lab-font-mono` on `:root` in `app/globals.css`:
   ```css
   :root {
     --lab-font-display: "Your Display", Georgia, serif;
     --lab-font-mono: "Your Mono", ui-monospace, monospace;
   }
   ```
2. **Scene Images**: Some `scene` pages reference `/worlds/*.webp`. Either copy the image into `public/worlds/` or replace the `src` prop on `<Plate />` with your own image.
3. **Reduced Motion**: All pages respect `prefers-reduced-motion` via `useStill()` / `useReducedMotion()`. Keep still-state fallbacks intact when editing.
