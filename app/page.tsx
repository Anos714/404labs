import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import {
  InstallSection,
  MapEnd,
  PagesSection,
  PartsSection,
  Principles,
} from "@/components/site/sections";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <MapEnd />
        <PagesSection />
        <PartsSection />
        <InstallSection />
        <Principles />
      </main>
      <Footer />
    </>
  );
}
