import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pageCountWord } from "@/lib/pages";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8">
        <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-start">
          <div>
            <p className="flex items-baseline gap-[5px] text-fg">
              <span className="font-display text-[20px] leading-none">404</span>
              <span className="font-mono text-[12px] text-fg-2">lab</span>
            </p>
            <p className="mt-3 max-w-[34ch] text-[13px] leading-[1.7] text-fg-3">
              {pageCountWord(true)} dead ends, drawn with care and handed over as
              source.
            </p>
          </div>

          <nav className="flex gap-14">
            <div>
              <p className="font-mono text-[11px] text-fg-3">Library</p>
              <ul className="mt-4 space-y-2.5">
                {[
                  ["The pages", "#pages"],
                  ["The parts", "#parts"],
                  ["Install", "#install"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[13px] text-fg-2 transition-colors duration-200 hover:text-fg"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-[11px] text-fg-3">Elsewhere</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[13px] text-fg-2 transition-colors duration-200 hover:text-fg"
                  >
                    GitHub
                    <ArrowUpRight className="size-4" strokeWidth={1.5} />
                  </a>
                </li>
                <li>
                  <Link
                    href="#install"
                    className="text-[13px] text-fg-2 transition-colors duration-200 hover:text-fg"
                  >
                    Registry JSON
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-fg-3">
            Built with Next.js, Motion and Tailwind. Source on{" "}
            <a
              href="https://github.com/Anos714/404labs"
              target="_blank"
              rel="noreferrer"
              className="text-fg-2 underline decoration-line-2 underline-offset-4 transition-colors duration-200 hover:text-fg"
            >
              GitHub
            </a>
            .
          </p>
          <p className="font-mono text-[11px] text-fg-3">MIT · 2026</p>
        </div>
      </div>
    </footer>
  );
}
