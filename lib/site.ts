/**
 * Where this site is served. The registry paths below are absolute, so a
 * deploy sets NEXT_PUBLIC_SITE_URL once and every command and snippet follows.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://404lab.dev"
).replace(/\/+$/, "");

/** The template shadcn resolves a namespace against. */
export const REGISTRY_TEMPLATE = `${SITE_URL}/r/{name}.json`;

/** The same template without the protocol, for small labels. */
export const REGISTRY_HOST = REGISTRY_TEMPLATE.replace(/^https?:\/\//, "");

export type Sponsor = {
  name: string;
  url: string;
  host: string;
  tagline: string;
  logo: string;
};

export const SPONSORS: Sponsor[] = [
  {
    name: "Designeer",
    url: "https://designeer.xyz/",
    host: "designeer.xyz",
    tagline: "Inspiration, resources, tools & portfolios",
    logo: "https://www.google.com/s2/favicons?domain=designeer.xyz&sz=64",
  },
];
