import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

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

export const viewport: Viewport = {
  themeColor: "#08090a",
};

export const metadata: Metadata = {
  title: "404lab · twenty-six animated 404 pages for Next.js",
  description:
    "Twenty-six animated not-found pages and the parts they are built from. Next.js, Motion, Tailwind. Installed with shadcn, owned by you.",
  openGraph: {
    title: "404lab",
    description:
      "Animated 404 pages you install with one command, then edit like your own code. Scenes, type and interactive pieces.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink-950 text-fg">
        {children}
      </body>
    </html>
  );
}
