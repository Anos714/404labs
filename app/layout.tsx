import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";
import {
  Archivo,
  Bodoni_Moda,
  Bricolage_Grotesque,
  DM_Serif_Display,
  Fragment_Mono,
  Fraunces,
  Geist,
  Geist_Mono,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Instrument_Serif,
  JetBrains_Mono,
  Manrope,
  Newsreader,
  Sora,
  Source_Serif_4,
  Space_Grotesk,
  Space_Mono,
  Spectral,
  Syne,
} from "next/font/google";
import "./globals.css";

/* The three faces the site itself uses. */
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  subsets: ["latin"],
});

/*
 * Specimen faces for the typeface switch above the page grid. They are not
 * preloaded: the browser fetches each subset when the rail first renders it.
 * A project still ships only the two tokens, not these fonts.
 */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  preload: false,
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  preload: false,
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  preload: false,
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  preload: false,
});

const spectral = Spectral({
  variable: "--font-spectral",
  weight: ["400", "600"],
  subsets: ["latin"],
  preload: false,
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
  preload: false,
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  preload: false,
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  preload: false,
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  preload: false,
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  preload: false,
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  weight: ["400", "500"],
  subsets: ["latin"],
  preload: false,
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  preload: false,
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  preload: false,
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  preload: false,
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  preload: false,
});

const fragment = Fragment_Mono({
  variable: "--font-fragment",
  weight: "400",
  subsets: ["latin"],
  preload: false,
});

const fontVars = [
  geist.variable,
  geistMono.variable,
  instrument.variable,
  fraunces.variable,
  newsreader.variable,
  bodoniModa.variable,
  sourceSerif.variable,
  spectral.variable,
  dmSerif.variable,
  spaceGrotesk.variable,
  archivo.variable,
  sora.variable,
  manrope.variable,
  plexSans.variable,
  bricolage.variable,
  syne.variable,
  jetbrains.variable,
  plexMono.variable,
  spaceMono.variable,
  fragment.variable,
].join(" ");

export const viewport: Viewport = {
  themeColor: "#08090a",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "404lab · fifty-six not-found pages for Next.js",
    template: "%s · 404lab",
  },
  description:
    "Fifty-six animated not-found pages and the parts they are built from. Next.js, Motion, Tailwind v4. Installed via shadcn, MCP, or agent skills, owned by you.",
  keywords: [
    "404 page",
    "Next.js 404",
    "not-found.tsx",
    "shadcn registry",
    "Motion",
    "Tailwind CSS v4",
    "animated 404",
    "MCP server",
    "agent skills",
  ],
  authors: [{ name: "404lab", url: "https://github.com/Anos714/404labs" }],
  creator: "404lab",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/mascot.jpg",
    apple: "/mascot.jpg",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "404lab · fifty-six not-found pages for Next.js",
    description:
      "Not-found pages you install with one command, then edit like your own code. Scenes, type and interactive pieces.",
    url: SITE_URL,
    siteName: "404lab",
    type: "website",
    images: ["/mascot.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "404lab · fifty-six not-found pages for Next.js",
    description:
      "Fifty-six animated not-found pages for Next.js, Motion, and Tailwind v4. Install via shadcn, MCP, or agent skills.",
    images: ["/mascot.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fontVars} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink-950 text-fg">
        {children}
      </body>
    </html>
  );
}
