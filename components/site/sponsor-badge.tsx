"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SPONSORS } from "@/lib/site";

export function SponsorBadge() {
  const sponsor = SPONSORS[0];
  const reduce = useReducedMotion();
  if (!sponsor) return null;

  return (
    <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
      <div className="group/sponsor relative">
        <motion.a
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Sponsored by ${sponsor.name} — ${sponsor.tagline}`}
          whileHover={reduce ? undefined : { y: -2, scale: 1.07 }}
          whileTap={reduce ? undefined : { scale: 0.95 }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
          className="inline-flex size-8 items-center justify-center overflow-hidden rounded-[9px] border border-line-2 bg-ink-900 shadow-sm transition-colors duration-200 hover:border-amber/50 focus-visible:border-amber/60"
        >
          <Image
            src={sponsor.logo}
            alt={`${sponsor.name} logo`}
            width={32}
            height={32}
            unoptimized
            className="size-full object-cover"
          />
        </motion.a>

        <div
          role="tooltip"
          className="pointer-events-none absolute right-0 top-full z-50 mt-2.5 w-60 origin-top-right translate-y-1 rounded-tile border border-line-2 bg-ink-900/95 p-3 opacity-0 shadow-[0_16px_40px_rgba(0,0,0,0.55)] backdrop-blur-md transition-[opacity,transform] duration-200 ease-out group-hover/sponsor:translate-y-0 group-hover/sponsor:opacity-100 group-focus-within/sponsor:translate-y-0 group-focus-within/sponsor:opacity-100"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Image
                src={sponsor.logo}
                alt=""
                width={16}
                height={16}
                unoptimized
                className="size-4 rounded-[4px] object-cover"
              />
              <span className="text-[12.5px] font-medium text-fg">
                {sponsor.name}
              </span>
            </div>
            <span className="rounded-full border border-line px-1.5 py-0.5 font-mono text-[9px] leading-none text-amber/90">
              sponsor
            </span>
          </div>
          <p className="mt-2 text-[11.5px] leading-[1.5] text-fg-2">
            {sponsor.tagline}
          </p>
          <p className="mt-2 flex items-center justify-between border-t border-line pt-2 font-mono text-[10px] text-fg-3">
            <span>{sponsor.host}</span>
            <ArrowUpRight className="size-3 text-amber/80" strokeWidth={1.6} />
          </p>
        </div>
      </div>

      <div className="group/slot relative">
        <motion.div
          whileHover={reduce ? undefined : { y: -2, scale: 1.07 }}
          whileTap={reduce ? undefined : { scale: 0.95 }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
        >
          <Link
            href="/#sponsor"
            aria-label="Become a sponsor"
            className="inline-flex size-8 items-center justify-center rounded-[9px] border border-dashed border-line-2 bg-ink-900/40 text-fg-3 transition-colors duration-200 hover:border-amber/50 hover:bg-ink-900 hover:text-amber"
          >
            <Plus
              className="size-3.5 transition-transform duration-200 group-hover/slot:rotate-90"
              strokeWidth={1.7}
            />
          </Link>
        </motion.div>

        <div
          role="tooltip"
          className="pointer-events-none absolute right-0 top-full z-50 mt-2.5 w-48 origin-top-right translate-y-1 rounded-tile border border-line-2 bg-ink-900/95 p-2.5 opacity-0 shadow-[0_16px_40px_rgba(0,0,0,0.55)] backdrop-blur-md transition-[opacity,transform] duration-200 ease-out group-hover/slot:translate-y-0 group-hover/slot:opacity-100 group-focus-within/slot:translate-y-0 group-focus-within/slot:opacity-100"
        >
          <p className="font-mono text-[10px] text-amber/90">open slot</p>
          <p className="mt-1 text-[11.5px] leading-snug text-fg-2">
            Your logo in the navbar &amp; sponsor strip.
          </p>
        </div>
      </div>
    </div>
  );
}
