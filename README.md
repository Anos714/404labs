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

- `app/page.tsx` — landing page: hero, page grid, parts, install
- `app/p/[slug]/page.tsx` — per-page detail and live preview
- `components/demos.tsx` — all animated previews, reduced-motion aware
- `components/site/` — nav, hero, sections, footer
- `lib/pages.tsx` — page registry (slug, copy, demo)
- `public/worlds/` — pixel landscapes used as scene art

## Design notes

- Ink surfaces, one amber accent, cream type
- Instrument Serif for display, Geist for UI, Geist Mono for labels
- One signature device: a dashed route line ending in a small x
- Motion only where it explains something; every demo has a still state
- All animation runs through Motion or a single CSS keyframe set, no assets

## Credits

Landscape art from [Imageory](https://imageory.in/gallery). Check the terms on
that site before using the images in a public launch; the gallery does not
publish an explicit license on its pages.

Pages are original work, MIT once the library is published.
