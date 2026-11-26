import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SponsorBadge } from "@/components/site/sponsor-badge";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink-950">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-control py-1 text-fg"
        >
          <Image
            src="/mascot.jpg"
            alt="404lab mascot"
            width={64}
            height={64}
            unoptimized
            className="size-6 rounded-[7px] border border-line object-cover"
          />
          <span className="flex items-baseline gap-[5px]">
            <span className="font-display text-[20px] leading-none">404</span>
            <span className="font-mono text-[12px] text-fg-2">lab</span>
          </span>
          <span className="ml-2 hidden font-mono text-[11px] text-fg-3 sm:inline">
            v0.1
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#pages"
            className="rounded-control px-2.5 py-1.5 font-mono text-[12px] text-fg-2 transition-colors duration-200 hover:text-fg sm:px-3"
          >
            Pages
          </Link>
          <Link
            href="/#parts"
            className="hidden rounded-control px-2.5 py-1.5 font-mono text-[12px] text-fg-2 transition-colors duration-200 hover:text-fg sm:block sm:px-3"
          >
            Parts
          </Link>
          <Link
            href="/#install"
            className="rounded-control px-2.5 py-1.5 font-mono text-[12px] text-fg-2 transition-colors duration-200 hover:text-fg sm:px-3"
          >
            Install
          </Link>
          <Link
            href="/#sponsor"
            className="rounded-control px-2.5 py-1.5 font-mono text-[12px] text-amber/90 transition-colors duration-200 hover:text-amber sm:px-3"
          >
            Sponsor
          </Link>
          <SponsorBadge />
          <a
            href="https://github.com/Anos714/404labs"
            target="_blank"
            rel="noreferrer"
            className="ml-1 flex items-center gap-1.5 rounded-control border border-line-2 px-3 py-1.5 font-mono text-[12px] text-fg transition-colors duration-200 hover:border-fg/25"
          >
            GitHub
            <ArrowUpRight className="size-4" strokeWidth={1.5} />
          </a>
        </nav>
      </div>
    </header>
  );
}
