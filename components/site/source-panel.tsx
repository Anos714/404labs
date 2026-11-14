"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { SourceFile } from "@/lib/source";

export function SourcePanel({ files }: { files: SourceFile[] }) {
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(false);
  const [more, setMore] = useState(false);
  const [beside, setBeside] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const file = files[active] ?? files[0];

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const check = () => {
      setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
      setBeside(el.scrollWidth - el.scrollLeft - el.clientWidth > 4);
    };
    el.scrollTop = 0;
    el.scrollLeft = 0;
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [active]);

  function select(index: number) {
    setActive(index);
    setDone(false);
    if (timer.current) clearTimeout(timer.current);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(file.code);
      setDone(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setDone(false), 1600);
    } catch {
      setDone(false);
    }
  }

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-panel border border-line bg-ink-950">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line p-2">
        <div
          role="group"
          aria-label="Source files"
          className="flex min-w-0 items-center gap-0.5 overflow-x-auto"
        >
          {files.map((f, i) => {
            const on = i === active;
            return (
              <button
                key={f.name}
                type="button"
                onClick={() => select(i)}
                aria-pressed={on}
                className={`relative shrink-0 rounded-control px-2.5 py-1.5 lab-mono text-[10.5px] transition-colors duration-200 ${
                  on ? "text-fg" : "text-fg-3 hover:text-fg-2"
                }`}
              >
                {on && (
                  <span className="absolute inset-0 rounded-control border border-line-2 bg-ink-850" />
                )}
                <span className="relative">{f.name}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${file.name}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-control border border-line-2 bg-ink-900 px-2.5 py-1.5 lab-mono text-[10.5px] text-fg-2 transition-colors duration-200 hover:border-fg-3/40 hover:text-fg"
        >
          {done ? (
            <Check className="size-3.5 text-amber" strokeWidth={1.6} />
          ) : (
            <Copy className="size-3.5" strokeWidth={1.6} />
          )}
          <span aria-live="polite">{done ? "copied" : "copy file"}</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2">
        <p className="lab-mono text-[10px] leading-relaxed text-fg-3">
          {file.note}
        </p>
        <p className="shrink-0 lab-mono text-[10px] tabular-nums text-fg-3">
          {file.lines} lines
        </p>
      </div>

      <div className="relative">
        <div
          ref={scroller}
          role="region"
          aria-label={`${file.name} source`}
          tabIndex={0}
          className="max-h-[460px] overflow-auto overscroll-contain outline-none focus-visible:ring-1 focus-visible:ring-amber/50"
        >
          <pre className="p-4 lab-mono text-[11.5px] leading-[1.8] text-fg-2">
            <code>{file.code}</code>
          </pre>
        </div>
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink-950 to-transparent transition-opacity duration-200 ${
            beside ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent transition-opacity duration-200 ${
            more ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
        <span className="lab-mono text-[10px] text-fg-3">
          component · shared chrome · tokens
        </span>
        <span className="lab-mono text-[10px] text-fg-3">{file.lang}</span>
      </div>
    </div>
  );
}
