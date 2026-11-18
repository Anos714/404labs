"use client";

import { useState } from "react";
import { CopyCommand } from "@/components/demos";
import { REGISTRY_TEMPLATE, SITE_URL } from "@/lib/site";

const TABS = [
  { id: "cli", label: "shadcn cli", lang: "bash" },
  { id: "registry", label: "direct url", lang: "bash" },
  { id: "fonts", label: "fonts", lang: "css" },
  { id: "manual", label: "by hand", lang: "text" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function CodeLine({ children }: { children: React.ReactNode }) {
  return <span className="block">{children}</span>;
}

function SampleCode() {
  return (
    <pre className="overflow-x-auto font-mono text-[11.5px] leading-[1.85] text-fg-2">
      <code>
        <CodeLine>
          <span className="text-fg-3">{"// app/not-found.tsx"}</span>
        </CodeLine>
        <CodeLine>
          <span className="text-fg-2">import</span>
          {" { Glitch } "}
          <span className="text-fg-2">from</span>
        </CodeLine>
        <CodeLine>
          {"  "}
          <span className="text-amber/85">
            &quot;@/components/404lab/glitch-404&quot;
          </span>
        </CodeLine>
        <CodeLine>&nbsp;</CodeLine>
        <CodeLine>
          <span className="text-fg-2">export default function</span>{" "}
          <span className="text-fg">NotFound</span>() {"{"}
        </CodeLine>
        <CodeLine>
          {"  "}
          <span className="text-fg-2">return</span> {"<"}
          <span className="text-fg">Glitch</span> home=
          <span className="text-amber/85">&quot;/&quot;</span> {" />"}
        </CodeLine>
        <CodeLine>{"}"}</CodeLine>
      </code>
    </pre>
  );
}

export function InstallTabs() {
  const [tab, setTab] = useState<TabId>("cli");
  const lang = TABS.find((t) => t.id === tab)?.lang;

  return (
    <div className="overflow-hidden rounded-panel border border-line bg-ink-900">
      <div className="flex items-center justify-between gap-4 border-b border-line px-3 py-2">
        <div
          role="tablist"
          aria-label="Install method"
          className="flex min-w-0 items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.id)}
                className={`relative shrink-0 rounded-full px-2.5 py-1.5 font-mono text-[10.5px] transition-colors duration-200 ${
                  on ? "text-fg" : "text-fg-3 hover:text-fg-2"
                }`}
              >
                {on && (
                  <span className="absolute inset-0 rounded-full bg-ink-800" />
                )}
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>
        <span className="hidden shrink-0 font-mono text-[10px] text-fg-3 sm:inline">
          {lang}
        </span>
      </div>

      <div className="min-h-[318px] p-3">
        {tab === "cli" && (
          <>
            <div className="rounded-tile bg-ink-950 px-4 py-3">
              <p className="mb-2 font-mono text-[10px] text-fg-3">
                once, in components.json
              </p>
              <pre className="overflow-x-auto font-mono text-[11px] leading-[1.85] text-fg-2">
                <code>
                  <CodeLine>{"{"}</CodeLine>
                  <CodeLine>
                    {"  "}
                    <span className="text-fg-2">&quot;registries&quot;</span>: {"{"}
                  </CodeLine>
                  <CodeLine>
                    {"    "}
                    <span className="text-fg-2">&quot;@404lab&quot;</span>:{" "}
                  </CodeLine>
                  <CodeLine>
                    {"      "}
                    <span className="text-amber/85">
                      &quot;{REGISTRY_TEMPLATE}&quot;
                    </span>
                  </CodeLine>
                  <CodeLine>{"  }"}</CodeLine>
                  <CodeLine>{"}"}</CodeLine>
                </code>
              </pre>
            </div>

            <div className="mt-4 border-t border-line px-1 pt-4">
              <p className="mb-2 font-mono text-[10px] text-fg-3">
                then, for a page
              </p>
              <CopyCommand
                command="npx shadcn@latest add @404lab/glitch-404"
                className="border-transparent bg-ink-950"
              />
            </div>

            <div className="mt-4 border-t border-line px-1 pt-4">
              <p className="mb-3 font-mono text-[10px] text-fg-3">
                then, in your app
              </p>
              <SampleCode />
            </div>
          </>
        )}

        {tab === "registry" && (
          <>
            <CopyCommand
              command={`npx shadcn@latest add ${SITE_URL}/r/glitch-404.json`}
              className="border-transparent bg-ink-950"
            />
            <div className="mt-4 border-t border-line px-1 pt-4">
              <p className="max-w-[50ch] text-[13px] leading-[1.7] text-fg-2">
                The direct url needs no setup. The item carries the page, the
                shared chrome and the token block, so the file lands complete.
              </p>
              <div className="mt-4 grid gap-px overflow-hidden rounded-tile border border-line bg-line">
                {[
                  ["glitch-404.tsx", "the page"],
                  ["chrome.tsx", "shared frame · replay"],
                  ["tokens", "colors · radii · type"],
                ].map(([name, note]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between gap-3 bg-ink-900 px-3 py-2.5 font-mono text-[10.5px]"
                  >
                    <span className="text-fg-2">{name}</span>
                    <span className="text-fg-3">{note}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] text-fg-3">
                <span className="rounded-control border border-line-2 px-1.5 py-1">
                  /r/&#123;name&#125;.json
                </span>
                <span>one file per page</span>
              </div>
            </div>
          </>
        )}

        {tab === "fonts" && (
          <>
            <div className="rounded-tile bg-ink-950 px-4 py-3">
              <pre className="overflow-x-auto font-mono text-[11px] leading-[1.9] text-fg-2">
                <code>
                  <CodeLine>
                    <span className="text-fg-3">
                      {"/* app/globals.css */"}
                    </span>
                  </CodeLine>
                  <CodeLine>{":root {"}</CodeLine>
                  <CodeLine>
                    {"  "}
                    <span className="text-fg-2">--lab-font-display</span>
                    {": "}
                    <span className="text-amber/85">
                      &quot;Your Display&quot;
                    </span>
                    {", Georgia, serif;"}
                  </CodeLine>
                  <CodeLine>
                    {"  "}
                    <span className="text-fg-2">--lab-font-mono</span>
                    {": "}
                    <span className="text-amber/85">&quot;Your Mono&quot;</span>
                    {", ui-monospace, monospace;"}
                  </CodeLine>
                  <CodeLine>{"}"}</CodeLine>
                </code>
              </pre>
            </div>
            <div className="mt-4 border-t border-line px-1 pt-4">
              <p className="max-w-[48ch] text-[13px] leading-[1.7] text-fg-2">
                Load the faces the way you already load fonts: next/font, a
                local @font-face, or a hosted stylesheet. Every page reads these
                two variables, so the change lands everywhere without touching a
                component.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] text-fg-3">
                <span className="rounded-control border border-line-2 px-1.5 py-1">
                  --lab-font-display
                </span>
                <span className="rounded-control border border-line-2 px-1.5 py-1">
                  --lab-font-mono
                </span>
                <span>set on :root or one wrapper</span>
              </div>
            </div>
          </>
        )}

        {tab === "manual" && (
          <>
            <div className="rounded-tile bg-ink-950 px-4 py-4 font-mono text-[11.5px] leading-[2] text-fg-3">
              <p className="text-fg-2">components/404lab/</p>
              <p>├─ glitch-404.tsx</p>
              <p>├─ mosaic-404.tsx</p>
              <p>├─ chrome.tsx</p>
              <p>└─ 404lab-tokens.css</p>
            </div>
            <div className="mt-4 border-t border-line px-1 pt-4">
              <p className="max-w-[46ch] text-[13px] leading-[1.7] text-fg-2">
                Every page is one file plus chrome.tsx. Copy both out of the
                repository, keep the Motion import, and merge the token block
                into your CSS once. Nothing calls home.
              </p>
              <p className="mt-3 font-mono text-[10px] text-fg-3">
                no package · no runtime wrapper
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        <span className="font-mono text-[10px] text-fg-3">
          the file lands in your repo
        </span>
        <span className="font-mono text-[10px] text-fg-3">MIT</span>
      </div>
    </div>
  );
}
