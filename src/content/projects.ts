// Portfolio projects — REAL past work, anonymized (see CLAUDE.md).
// Copy lives in messages/<locale>.json under "projects.<id>".
// `gradient` drives the CSS mockup placeholder until real screenshots arrive.
// `url` (optional): public live site — renders a "view live site" link on the
// references page. Leave unset for private/internal work.

export type ProjectId =
  | "restaurant"
  | "websites"
  | "timetracking"
  | "manufacturing";

export interface Project {
  id: ProjectId;
  gradient: string;
  url?: string;
}

export const projects: Project[] = [
  {
    id: "restaurant",
    gradient: "from-brand-deep via-brand to-[#5b7bc7]",
  },
  {
    id: "websites",
    gradient: "from-[#24488f] via-brand to-[#7d97d6]",
  },
  {
    id: "timetracking",
    gradient: "from-[#122c5e] via-brand-deep to-brand",
  },
  {
    id: "manufacturing",
    gradient: "from-[#16376f] via-[#2c4c96] to-[#93ace8]",
  },
];
