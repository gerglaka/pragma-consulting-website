export type Partner = {
  id: string;
  /** Displayed as a text wordmark until a logo file is provided. */
  name: string;
  /** Path under /public, e.g. "/partners/acme.svg". */
  logo?: string;
  /** Optional link to the partner's site. */
  url?: string;
};

// PLACEHOLDERS — replace with real partners. To add a logo: put the file in
// public/partners/ and set `logo: "/partners/<file>"`. Add more entries freely;
// the section wraps automatically.
export const partners: Partner[] = [
  { id: "p1", name: "Partner 1" },
  { id: "p2", name: "Partner 2" },
  { id: "p3", name: "Partner 3" },
];
