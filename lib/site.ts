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
