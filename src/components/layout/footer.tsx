import { useTranslations } from "next-intl";
import { Logo } from "@/components/layout/logo";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";

const NAV_ITEMS: { href: AppPathname; key: string }[] = [
  { href: "/services", key: "services" },
  { href: "/references", key: "references" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
];

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs space-y-3">
            <Logo />
            <p className="text-sm text-muted-foreground">
              {t("footer.description")}
            </p>
            <p className="font-display text-sm font-semibold text-primary">
              {t("footer.tagline")}
            </p>
          </div>
          <nav aria-label={t("footer.navTitle")}>
            <h2 className="mb-3 text-sm font-semibold">
              {t("footer.navTitle")}
            </h2>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-10 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          © {year} Pragma. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
