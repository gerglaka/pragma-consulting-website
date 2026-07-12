export type TeamMember = {
  /** Must match a key under `aboutPage.team` in the message files. */
  id: string;
  /** Path under /public, e.g. "/team/anna.webp" (portrait, ~4:5). */
  photo?: string;
};

// Names/roles live in messages/{hu,sk,en}.json under `aboutPage.team.<id>`.
// To add a member: add an entry here + the message keys in all three files.
// To add a photo: put the file in public/team/ and set `photo: "/team/<file>"`.
export const team: TeamMember[] = [
  { id: "gergo" },
  { id: "daniella" },
  { id: "levente" },
];
