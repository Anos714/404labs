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
} from "@/components/site/sections";

export default function Home() {
  return (
    <PageSearchProvider>
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
              <Closing />
            </main>
            <LandingFooter />
          </div>
        </div>
      </div>
    </PageSearchProvider>
  );
}
