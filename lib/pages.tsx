import type { ReactNode } from "react";
import {
  ConstellationDemo,
  DefocusDemo,
  DominoDemo,
  DoorDemo,
  DragDemo,
  FogDemo,
  GlitchDemo,
  GravityDemo,
  HoloDemo,
  MagnetDemo,
  MosaicDemo,
  MorseDemo,
  OdometerDemo,
  OrbitDemo,
  RubberDemo,
  ShatterDemo,
  SpotlightDemo,
  StackDemo,
  StrokeDemo,
  SweepDemo,
  TearDemo,
  TerminalDemo,
  TickerDemo,
  TiltDemo,
  TrailDemo,
  ViewfinderDemo,
} from "@/components/demos";

export type Category = "scene" | "type" | "interactive";

export type PageEntry = {
  slug: string;
  title: string;
  desc: string;
  note: string;
  method: string;
  category: Category;
  demo: ReactNode;
};

export const CATEGORIES: {
  id: Category | "all";
  label: string;
  blurb: string;
}[] = [
  { id: "all", label: "all", blurb: "every page in the set" },
  { id: "scene", label: "scenes", blurb: "a place, then a hole in it" },
  { id: "type", label: "type", blurb: "the number does the work" },
  {
    id: "interactive",
    label: "interactive",
    blurb: "the page answers your hand",
  },
];

export const PAGES: PageEntry[] = [
  {
    slug: "glitch-404",
    title: "Glitch",
    desc: "RGB split on the numerals",
    note: "The number takes a short hit of colour separation, sliced into bands, then settles. Three stacked copies and a clipped keyframe, no canvas.",
    method: "keyframes · clip-path",
    category: "type",
    demo: <GlitchDemo />,
  },
  {
    slug: "mosaic-404",
    title: "Mosaic",
    desc: "The scene arrives in twelve tiles",
    note: "Twelve tiles of one photograph reassemble from their own centre. Hover to take the picture apart and put it back in a different order.",
    method: "mosaic · 12 tiles",
    category: "scene",
    demo: <MosaicDemo />,
  },
  {
    slug: "odometer-404",
    title: "Odometer",
    desc: "Three reels spin to a stop",
    note: "Mechanical reels overshoot their target and settle into 404. The middle reel always arrives last, which is the only joke in the mechanism.",
    method: "reels · 3 digits",
    category: "type",
    demo: <OdometerDemo />,
  },
  {
    slug: "spotlight-404",
    title: "Spotlight",
    desc: "Only the cursor lights the page",
    note: "The scene sits in the dark. A soft mask follows the pointer and brings back the part of the page you are looking at.",
    method: "mask · pointer",
    category: "scene",
    demo: <SpotlightDemo />,
  },
  {
    slug: "shatter-404",
    title: "Shatter",
    desc: "Nine pieces, one bad step",
    note: "The scene is cut on a nine-piece lattice. On hover the pieces spring apart, carrying the numerals with them, and fall back into place.",
    method: "9 shards · clip-path",
    category: "scene",
    demo: <ShatterDemo />,
  },
  {
    slug: "ticker-404",
    title: "Ticker",
    desc: "A board that never departs",
    note: "A split-flap board shuffles random characters before it settles on the number. The rows underneath are honest about the destination.",
    method: "split-flap · 92ms",
    category: "type",
    demo: <TickerDemo />,
  },
  {
    slug: "gravity-404",
    title: "Gravity",
    desc: "Digits fall, then settle",
    note: "Each digit drops on its own spring and lands with a small rotation. The ground takes the weight, so the offset is not perfectly even.",
    method: "motion · spring",
    category: "interactive",
    demo: <GravityDemo />,
  },
  {
    slug: "holo-404",
    title: "Holo",
    desc: "A transmission that will not lock",
    note: "Scanlines, a rolling refresh bar and a colour split that keeps slipping. The signal has been coming from nowhere for a long time.",
    method: "scanlines · signal",
    category: "scene",
    demo: <HoloDemo />,
  },
  {
    slug: "stroke-404",
    title: "Stroke",
    desc: "The number draws itself",
    note: "The numerals are drawn by a single stroke and then filled in behind the line. It is dash offset all the way down, no font trick.",
    method: "svg · stroke draw",
    category: "type",
    demo: <StrokeDemo />,
  },
  {
    slug: "magnet-404",
    title: "Magnet",
    desc: "The number leans toward you",
    note: "Each digit has its own pull, so the number leans unevenly toward the pointer. Let go and the springs put it back.",
    method: "spring · pointer",
    category: "interactive",
    demo: <MagnetDemo />,
  },
  {
    slug: "fog-404",
    title: "Fog",
    desc: "A platform, mostly gone",
    note: "Three layers of mist drift across a scene that is already half erased. Hover and the number sinks a little further into it.",
    method: "drift · blur",
    category: "scene",
    demo: <FogDemo />,
  },
  {
    slug: "terminal-404",
    title: "Terminal",
    desc: "The shell gives up on you",
    note: "A shell that types its own failure, once when it comes into view and again when you ask it to.",
    method: "typewriter · caret",
    category: "type",
    demo: <TerminalDemo />,
  },
  {
    slug: "domino-404",
    title: "Domino",
    desc: "One push, nine slabs",
    note: "Nine slabs stand in a row. The thin ones fall first and the three numerals follow, then the whole line stands back up on its own.",
    method: "chain · 55ms",
    category: "interactive",
    demo: <DominoDemo />,
  },
  {
    slug: "constellation-404",
    title: "Constellation",
    desc: "The number, charted",
    note: "404 drawn as a constellation: edges first, then the stars arrive. Hover and the survey is charted again from the beginning.",
    method: "svg · dashoffset",
    category: "scene",
    demo: <ConstellationDemo />,
  },
  {
    slug: "stack-404",
    title: "Stack",
    desc: "Five copies deep",
    note: "Five copies of the number recede into depth on a shared perspective. Hover and the corridor collapses into one clean mark.",
    method: "6 layers · z",
    category: "type",
    demo: <StackDemo />,
  },
  {
    slug: "drag-404",
    title: "Drag",
    desc: "A loose number",
    note: "The number is an object you can pull off its origin. It stretches away under your hand and the spring walks it back when you let go.",
    method: "drag · elastic",
    category: "interactive",
    demo: <DragDemo />,
  },
  {
    slug: "tilt-404",
    title: "Tilt",
    desc: "A small stage with three depths",
    note: "The card is built from three planes: scene, route line and number. The pointer tilts the whole thing and the light moves with it.",
    method: "perspective · pointer",
    category: "scene",
    demo: <TiltDemo />,
  },
  {
    slug: "defocus-404",
    title: "Defocus",
    desc: "A lens that will not resolve",
    note: "Fourteen slices of the same numeral, offset like a lens with the wrong diopter. Hover and the slices line up long enough to read.",
    method: "slices · focus",
    category: "type",
    demo: <DefocusDemo />,
  },
  {
    slug: "door-404",
    title: "Door",
    desc: "It opens onto nothing",
    note: "A door in the middle of the page, with the number printed across it. It opens onto nothing, which is the correct answer.",
    method: "rotateY · 104°",
    category: "interactive",
    demo: <DoorDemo />,
  },
  {
    slug: "viewfinder-404",
    title: "Viewfinder",
    desc: "The camera cannot find it",
    note: "A camera hunting for a subject that is not there. Hover and it focuses on the number anyway, then flags the frame as empty.",
    method: "focus hunt",
    category: "scene",
    demo: <ViewfinderDemo />,
  },
  {
    slug: "sweep-404",
    title: "Sweep",
    desc: "An outline fills from the left",
    note: "An outline of the number fills behind a moving hairline. It only ever fills on the way in, so the page is briefly complete.",
    method: "mask · wipe",
    category: "type",
    demo: <SweepDemo />,
  },
  {
    slug: "rubber-404",
    title: "Rubber",
    desc: "Pull it out of shape",
    note: "Press and pull the number out of proportion. The spring puts it back harder than you took it, which is the whole interaction.",
    method: "press + pull",
    category: "interactive",
    demo: <RubberDemo />,
  },
  {
    slug: "orbit-404",
    title: "Orbit",
    desc: "A small planet keeps turning",
    note: "The zero becomes a planet with one moon on a slow orbit. Under reduced motion the moon holds still and the page still reads.",
    method: "motion · 22s loop",
    category: "scene",
    demo: <OrbitDemo />,
  },
  {
    slug: "morse-404",
    title: "Morse",
    desc: "One lamp, five characters",
    note: "A single lamp blinks 404 in Morse. The digits only arrive after the signal has finished, which takes longer than you expect.",
    method: "signal · 115ms",
    category: "type",
    demo: <MorseDemo />,
  },
  {
    slug: "trail-404",
    title: "Trail",
    desc: "The pointer leaves a comet",
    note: "A line of dots follows the pointer with growing lag, then collapses back onto the route line when you stop moving.",
    method: "trail · spring",
    category: "interactive",
    demo: <TrailDemo />,
  },
  {
    slug: "tear-404",
    title: "Tear",
    desc: "The page splits down the middle",
    note: "The scene is cut on a jagged line and the halves pull apart on hover, taking the numerals with them.",
    method: "clip-path · transform",
    category: "scene",
    demo: <TearDemo />,
  },
];

export function getPage(slug: string) {
  return PAGES.find((p) => p.slug === slug);
}

export function categoryCount(id: Category | "all") {
  return id === "all"
    ? PAGES.length
    : PAGES.filter((p) => p.category === id).length;
}
