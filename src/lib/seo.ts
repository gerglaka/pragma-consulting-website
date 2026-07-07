import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { type AppPathname, type Locale, routing } from "@/i18n/routing";

// Domain-agnostic: set NEXT_PUBLIC_SITE_URL in production (e.g. on Vercel).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3199";

const OG_LOCALES: Record<Locale, string> = {
  hu: "hu_HU",
  sk: "sk_SK",
  en: "en_US",
};

export function absoluteUrl(locale: Locale, href: AppPathname): string {
  return `${SITE_URL}${getPathname({ locale, href })}`;
}

export function languageAlternates(
  href: AppPathname,
): Record<string, string> {
  return {
    ...Object.fromEntries(
      routing.locales.map((l) => [l, absoluteUrl(l, href)]),
    ),
    "x-default": absoluteUrl(routing.defaultLocale, href),
  };
}

export function buildPageMetadata({
  locale,
  href,
  title,
  description,
}: {
  locale: Locale;
  href: AppPathname;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(locale, href),
      languages: languageAlternates(href),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(locale, href),
      siteName: "Pragma",
      locale: OG_LOCALES[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
