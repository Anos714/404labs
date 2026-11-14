export type SourceFile = {
  name: string;
  lang: string;
  note: string;
  lines: number;
  code: string;
};

export type PageMeta = {
  slug: string;
  title: string;
  desc: string;
  note: string;
  method: string;
  category: "scene" | "type" | "interactive";
  demo: string;
};

export type LibraryPage = PageMeta & { source: SourceFile };

export type Library = {
  pages: LibraryPage[];
  shared: SourceFile[];
};

export function readLibrary(root: string): Library;

export const TOKENS: string;
