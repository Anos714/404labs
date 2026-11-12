import type { ReactNode } from "react";
import {
  GlitchDemo,
  GravityDemo,
  OrbitDemo,
  SpotlightDemo,
  TearDemo,
  TerminalDemo,
} from "@/components/demos";

export type PageEntry = {
  slug: string;
  title: string;
  desc: string;
  note: string;
  method: string;
  demo: ReactNode;
};

export const PAGES: PageEntry[] = [
  {
    slug: "glitch-404",
    title: "Glitch",
    desc: "RGB split on the numerals",
    note: "The number takes a short hit of colour separation, sliced into bands, then settles. Three stacked copies and a clipped keyframe, no canvas.",
    method: "keyframes · clip-path",
    demo: <GlitchDemo />,
  },
  {
    slug: "gravity-404",
    title: "Gravity",
    desc: "Digits fall, then settle",
    note: "Each digit drops on its own spring and lands with a small rotation. The ground takes the weight, so the offset is not perfectly even.",
    method: "motion · spring",
    demo: <GravityDemo />,
  },
  {
    slug: "terminal-404",
    title: "Terminal",
    desc: "The shell gives up on you",
    note: "A shell that types its own failure, once when it comes into view and again when you ask it to.",
    method: "typewriter · caret",
    demo: <TerminalDemo />,
  },
  {
    slug: "spotlight-404",
    title: "Spotlight",
    desc: "Only the cursor lights the page",
    note: "The scene sits in the dark. A soft mask follows the pointer and brings back the part of the page you are looking at.",
    method: "mask · pointer",
    demo: <SpotlightDemo />,
  },
  {
    slug: "orbit-404",
    title: "Orbit",
    desc: "A small planet keeps turning",
    note: "The zero becomes a planet with one moon on a slow orbit. Under reduced motion the moon holds still and the page still reads.",
    method: "motion · 22s loop",
    demo: <OrbitDemo />,
  },
  {
    slug: "tear-404",
    title: "Tear",
    desc: "The page splits down the middle",
    note: "The scene is cut on a jagged line and the halves pull apart on hover, taking the numerals with them.",
    method: "clip-path · transform",
    demo: <TearDemo />,
  },
];

export function getPage(slug: string) {
  return PAGES.find((p) => p.slug === slug);
}
