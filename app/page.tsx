import {
  LandingFooter,
  LandingIntro,
  LandingRail,
} from "@/components/site/landing";
import { LandingTopBar } from "@/components/site/top-bar";
import { PageSearchProvider } from "@/components/site/search";
import {
  Closing,
  InstallSection,
  PagesSection,
  PartsSection,
  Principles,
  SponsorSection,
} from "@/components/site/sections";
import { PAGES } from "@/lib/pages";
import { SITE_URL } from "@/lib/site";

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "404lab",
      url: SITE_URL,
      description:
        "Fifty-six animated not-found pages for Next.js, Motion, and Tailwind CSS v4.",
    },
    {
      "@type": "CollectionPage",
      name: "404lab Catalogue",
      url: SITE_URL,
      numberOfItems: PAGES.length,
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I install a 404lab page in Next.js?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Run `npx shadcn@latest add @404lab/glitch-404` (or use the direct registry URL), then import the exported component in `app/not-found.tsx`.",
          },
        },
        {
          "@type": "Question",
          name: "Does 404lab support AI coding agents?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. 404lab ships both an installable SKILL.md for Antigravity, Claude Code, Codex, and Cursor, and a stdio MCP server (`mcp/server.mjs`).",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <PageSearchProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />
      <div className="min-h-screen bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:16px_16px]">
        <div className="mx-auto flex w-full max-w-[1300px] flex-col border-line bg-ink-950 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:border-x">
          <LandingRail />
          <div className="flex min-w-0 flex-col">
            <LandingTopBar />
            <main className="min-w-0 flex-1">
              <LandingIntro />
              <PagesSection />
              <PartsSection />
              <InstallSection />
              <Principles />
              <SponsorSection />
              <Closing />
            </main>
            <LandingFooter />
          </div>
        </div>
      </div>
    </PageSearchProvider>
  );
}
