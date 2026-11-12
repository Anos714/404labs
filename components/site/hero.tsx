"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { CopyCommand } from "@/components/demos";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const [run, setRun] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function fire() {
    if (reduce) return;
    if (timer.current) clearTimeout(timer.current);
    setRun(false);
    timer.current = setTimeout(() => {
      setRun(true);
      timer.current = setTimeout(() => setRun(false), 460);
    }, 20);
  }

  const fade = (delay: number) => ({
    initial: reduce ? undefined : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <section className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-12 px-5 pb-16 pt-12 sm:px-8 lg:min-h-[calc(100svh-64px)] lg:grid-cols-12 lg:gap-10 lg:pb-20 lg:pt-16">
      <div className="lg:col-span-7 lg:pr-6">
        <motion.div {...fade(0.05)} className="flex items-center gap-2.5">
          <span className="size-1.5 rounded-full bg-amber" aria-hidden />
          <span className="font-mono text-[11px] text-fg-3">
            Not-found pages, animated
          </span>
        </motion.div>

        <motion.h1
          {...fade(0.12)}
          className="display mt-7 text-[clamp(3.4rem,7vw,6rem)] text-fg"
        >
          A good place
          <br />
          to get lost<span className="text-amber">.</span>
        </motion.h1>

        <motion.p
          {...fade(0.2)}
          className="mt-7 max-w-[46ch] text-[15.5px] leading-[1.7] text-fg-2 sm:text-[16.5px]"
        >
          Six animated 404 pages and the parts they are built from. Next.js,
          Motion, Tailwind. You get the source, not a dependency.
        </motion.p>

        <motion.div {...fade(0.28)} className="mt-9 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
          <Link
            href="#pages"
            className="group inline-flex items-center gap-2 rounded-[8px] bg-fg px-4 py-2.5 text-[13.5px] font-medium text-ink-950 transition-colors duration-200 hover:bg-white"
          >
            Browse the pages
            <ArrowDown
              className="size-3.5 transition-transform duration-200 group-hover:translate-y-0.5"
              strokeWidth={1.8}
            />
          </Link>
          <Link
            href="#install"
            className="inline-flex items-center gap-1.5 rounded-[8px] px-0 py-2.5 font-mono text-[12px] text-fg-2 transition-colors duration-200 hover:text-fg sm:px-2"
          >
            or copy one command
            <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
          </Link>
        </motion.div>

        <motion.div {...fade(0.34)} className="mt-8 max-w-[430px]">
          <CopyCommand command="npx shadcn@latest add @404lab/glitch-404" />
        </motion.div>

        <motion.p {...fade(0.4)} className="mt-6 font-mono text-[10.5px] text-fg-3">
          MIT · six pages · five parts · no tracking
        </motion.p>
      </div>

      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.18 }}
        className="lg:col-span-5"
      >
        <figure
          onMouseEnter={fire}
          className="group/poster relative rounded-[14px] border border-line bg-ink-900 p-2"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-ink-950 sm:aspect-[5/5] lg:aspect-[4/5]">
            <Image
              src="/worlds/hero.webp"
              alt="Pixel art of a lighthouse on a cliff at dusk, light sweeping over the sea"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover object-left"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,0.05)_0%,rgba(8,9,10,0.1)_45%,rgba(8,9,10,0.85)_100%)]" />

            <span className="absolute left-4 top-3 font-mono text-[10px] text-white/70">
              fig. 01
            </span>
            <span className="absolute right-4 top-3 font-mono text-[10px] text-white/45">
              51.9° N, 5.6° W
            </span>

            <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
              <div
                className="glitch-digits display text-[clamp(3.6rem,7vw,5rem)] leading-[0.8] text-fg"
                data-run={run}
              >
                404
                <span aria-hidden>404</span>
                <span aria-hidden>404</span>
              </div>
              <p className="mt-3 max-w-[26ch] font-mono text-[10.5px] leading-relaxed text-white/70">
                the page you asked for is not on this coast
              </p>
            </div>

            <span className="absolute left-3 top-1/2 hidden -translate-y-1/2 -rotate-90 font-mono text-[9px] tracking-[0.14em] text-white/25 sm:block">
              EDGE OF MAP
            </span>
          </div>

          <figcaption className="flex items-center justify-between px-2 pb-1 pt-3">
            <span className="font-mono text-[10px] text-fg-3">
              lighthouse, off the map
            </span>
            <span className="font-mono text-[10px] text-fg-3">hover 404</span>
          </figcaption>
        </figure>
      </motion.div>
    </section>
  );
}
