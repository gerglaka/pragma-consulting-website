import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["hu", "sk", "en"],
  defaultLocale: "hu",
  pathnames: {
    "/": "/",
    "/services": {
      hu: "/szolgaltatasok",
      sk: "/sluzby",
      en: "/services",
    },
    "/references": {
      hu: "/referenciak",
      sk: "/referencie",
      en: "/references",
    },
    "/about": {
      hu: "/rolunk",
      sk: "/o-nas",
      en: "/about",
    },
    "/contact": {
      hu: "/kapcsolat",
      sk: "/kontakt",
      en: "/contact",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
