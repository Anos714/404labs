export type FaceKind = "serif" | "sans" | "mono";

export type Face = {
  id: string;
  label: string;
  kind: FaceKind;
  display: string;
  mono: string;
};

const SERIF = 'Georgia, "Times New Roman", serif';
const SANS = "ui-sans-serif, system-ui, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, monospace";

const GEIST_MONO = `var(--font-geist-mono), ${MONO}`;

/**
 * Specimen faces for the switch above the page grid. The site ships tokens,
 * not fonts: a project keeps its own faces and only reads the two variables.
 */
export const FACES: Face[] = [
  {
    id: "instrument",
    label: "Instrument",
    kind: "serif",
    display: `var(--font-instrument), ${SERIF}`,
    mono: GEIST_MONO,
  },
  {
    id: "fraunces",
    label: "Fraunces",
    kind: "serif",
    display: `var(--font-fraunces), ${SERIF}`,
    mono: GEIST_MONO,
  },
  {
    id: "newsreader",
    label: "Newsreader",
    kind: "serif",
    display: `var(--font-newsreader), ${SERIF}`,
    mono: GEIST_MONO,
  },
  {
    id: "bodoni",
    label: "Bodoni",
    kind: "serif",
    display: `var(--font-bodoni), ${SERIF}`,
    mono: GEIST_MONO,
  },
  {
    id: "source-serif",
    label: "Source Serif",
    kind: "serif",
    display: `var(--font-source-serif), ${SERIF}`,
    mono: GEIST_MONO,
  },
  {
    id: "spectral",
    label: "Spectral",
    kind: "serif",
    display: `var(--font-spectral), ${SERIF}`,
    mono: GEIST_MONO,
  },
  {
    id: "dm-serif",
    label: "DM Serif",
    kind: "serif",
    display: `var(--font-dm-serif), ${SERIF}`,
    mono: GEIST_MONO,
  },
  {
    id: "geist",
    label: "Geist",
    kind: "sans",
    display: `var(--font-geist), ${SANS}`,
    mono: GEIST_MONO,
  },
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    kind: "sans",
    display: `var(--font-space-grotesk), ${SANS}`,
    mono: GEIST_MONO,
  },
  {
    id: "archivo",
    label: "Archivo",
    kind: "sans",
    display: `var(--font-archivo), ${SANS}`,
    mono: GEIST_MONO,
  },
  {
    id: "sora",
    label: "Sora",
    kind: "sans",
    display: `var(--font-sora), ${SANS}`,
    mono: GEIST_MONO,
  },
  {
    id: "manrope",
    label: "Manrope",
    kind: "sans",
    display: `var(--font-manrope), ${SANS}`,
    mono: GEIST_MONO,
  },
  {
    id: "plex-sans",
    label: "Plex Sans",
    kind: "sans",
    display: `var(--font-plex-sans), ${SANS}`,
    mono: "var(--font-plex-mono), ui-monospace, monospace",
  },
  {
    id: "bricolage",
    label: "Bricolage",
    kind: "sans",
    display: `var(--font-bricolage), ${SANS}`,
    mono: GEIST_MONO,
  },
  {
    id: "syne",
    label: "Syne",
    kind: "sans",
    display: `var(--font-syne), ${SANS}`,
    mono: GEIST_MONO,
  },
  {
    id: "geist-mono",
    label: "Geist Mono",
    kind: "mono",
    display: GEIST_MONO,
    mono: GEIST_MONO,
  },
  {
    id: "jetbrains",
    label: "JetBrains",
    kind: "mono",
    display: "var(--font-jetbrains), ui-monospace, monospace",
    mono: "var(--font-jetbrains), ui-monospace, monospace",
  },
  {
    id: "plex-mono",
    label: "Plex Mono",
    kind: "mono",
    display: "var(--font-plex-mono), ui-monospace, monospace",
    mono: "var(--font-plex-mono), ui-monospace, monospace",
  },
  {
    id: "space-mono",
    label: "Space Mono",
    kind: "mono",
    display: "var(--font-space-mono), ui-monospace, monospace",
    mono: "var(--font-space-mono), ui-monospace, monospace",
  },
  {
    id: "fragment",
    label: "Fragment",
    kind: "mono",
    display: "var(--font-fragment), ui-monospace, monospace",
    mono: "var(--font-fragment), ui-monospace, monospace",
  },
];
