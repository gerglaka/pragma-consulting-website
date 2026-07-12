export type Partner = {
  id: string;
  /** Used as the logo alt text (and as a text wordmark if no logo is set). */
  name: string;
  /** Path under /public, e.g. "/partners/acme.svg". */
  logo?: string;
  /** Intrinsic pixel size of the logo file (required when `logo` is set). */
  width?: number;
  height?: number;
  /** Optional link to the partner's site. */
  url?: string;
};

// Source files live in partner_logos/ (originals); processed, transparent
// versions in public/partners/. Add more entries freely; the strip wraps.
export const partners: Partner[] = [
  {
    id: "palace-bar",
    name: "Palace Café & Bar",
    logo: "/partners/palace-bar.png",
    width: 211,
    height: 212,
    url: "https://palacebar.sk/",
  },
  {
    id: "world-experience",
    name: "World Experience",
    logo: "/partners/world-experience.png",
    width: 502,
    height: 435,
    url: "https://mastersoffice.sk/",
  },
  {
    id: "simab",
    name: "Šimab Work&Montage",
    logo: "/partners/simab.png",
    width: 726,
    height: 368,
  },
  {
    id: "virtualne-sidlo",
    name: "Virtuálne sídlo Komárno",
    logo: "/partners/virtualne-sidlo.svg",
    width: 665,
    height: 497,
    url: "https://www.sidlokomarno.sk/",
  },
];
