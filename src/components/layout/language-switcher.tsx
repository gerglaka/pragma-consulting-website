"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, string> = {
  hu: "HU",
  sk: "SK",
  en: "EN",
};

export function LanguageSwitcher() {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("languageSwitcher")} className="flex items-center">
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="text-border select-none">
              |
            </span>
          )}
          <Link
            href={pathname}
            locale={l}
            aria-current={l === locale ? "true" : undefined}
            className={cn(
              "px-1.5 py-1 text-sm font-medium transition-colors hover:text-primary",
              l === locale
                ? "text-primary underline underline-offset-4"
                : "text-muted-foreground",
            )}
          >
            {LABELS[l]}
          </Link>
        </span>
      ))}
    </nav>
  );
}
