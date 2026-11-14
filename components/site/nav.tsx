import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink-950">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-baseline gap-[5px] rounded-control py-1 text-fg"
        >
          <span className="font-display text-[20px] leading-none">404</span>
          <span className="font-mono text-[12px] text-fg-2">lab</span>
          <span className="ml-2 hidden font-mono text-[11px] text-fg-3 sm:inline">
            v0.1
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="#pages"
            className="rounded-control px-2.5 py-1.5 font-mono text-[12px] text-fg-2 transition-colors duration-200 hover:text-fg sm:px-3"
          >
            Pages
          </Link>
          <Link
            href="#parts"
            className="hidden rounded-control px-2.5 py-1.5 font-mono text-[12px] text-fg-2 transition-colors duration-200 hover:text-fg sm:block sm:px-3"
          >
            Parts
          </Link>
          <Link
            href="#install"
            className="rounded-control px-2.5 py-1.5 font-mono text-[12px] text-fg-2 transition-colors duration-200 hover:text-fg sm:px-3"
          >
            Install
          </Link>
          <a
            href="https://github.com"
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
