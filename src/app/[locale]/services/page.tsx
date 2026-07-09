import type { Metadata } from "next";
import {
  BarChart3Icon,
  CheckIcon,
  DatabaseIcon,
  GlobeIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesPage" });
  return buildPageMetadata({
    locale: locale as Locale,
    href: "/services",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

const ITEMS = ["item1", "item2", "item3", "item4"] as const;

export default function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("servicesPage");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: t("metaTitle"),
          description: t("metaDescription"),
          url: absoluteUrl(locale as Locale, "/services"),
          inLanguage: locale,
        }}
      />
      <div className="animate-fade-up">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          {t("intro")}
        </p>
      </div>

      <div className="mt-14 space-y-6">
        {/* Websites */}
        <Reveal>
        <section
          aria-labelledby="svc-websites"
          className="spotlight rounded-2xl border border-border/70 bg-card p-6 sm:p-10"
        >
          <GlobeIcon aria-hidden="true" className="size-8 text-primary" />
          <h2
            id="svc-websites"
            className="mt-4 font-display text-2xl font-bold sm:text-3xl"
          >
            {t("websites.title")}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {t("websites.description")}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckIcon
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-primary"
                />
                <span>{t(`websites.${item}`)}</span>
              </li>
            ))}
          </ul>
        </section>
        </Reveal>

        {/* Custom systems */}
        <Reveal>
        <section
          aria-labelledby="svc-systems"
          className="spotlight rounded-2xl border border-border/70 bg-card p-6 sm:p-10"
        >
          <DatabaseIcon aria-hidden="true" className="size-8 text-primary" />
          <h2
            id="svc-systems"
            className="mt-4 font-display text-2xl font-bold sm:text-3xl"
          >
            {t("systems.title")}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {t("systems.description")}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckIcon
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-primary"
                />
                <span>{t(`systems.${item}`)}</span>
              </li>
            ))}
          </ul>
        </section>
        </Reveal>

        {/* Process improvement — Pillar B, confident */}
        <Reveal>
        <section
          aria-labelledby="svc-process"
          className="spotlight rounded-2xl bg-brand-deep p-6 text-white [--spot-color:rgba(255,255,255,0.09)] sm:p-10"
        >
          <BarChart3Icon aria-hidden="true" className="size-8 text-gold" />
          <p className="mt-4 text-sm font-medium text-gold">
            {t("process.badge")}
          </p>
          <h2
            id="svc-process"
            className="mt-1 font-display text-2xl font-bold sm:text-3xl"
          >
            {t("process.title")}
          </h2>
          <p className="mt-3 max-w-2xl text-white/80">
            {t("process.description")}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckIcon
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-gold"
                />
                <span>{t(`process.${item}`)}</span>
              </li>
            ))}
          </ul>
        </section>
        </Reveal>
      </div>

      {/* Pricing CTA — no prices in v1 */}
      <Reveal>
      <section
        aria-labelledby="svc-pricing"
        className="mt-14 rounded-2xl border border-border/70 bg-muted/40 p-6 text-center sm:p-10"
      >
        <h2 id="svc-pricing" className="font-display text-2xl font-bold">
          {t("pricing.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          {t("pricing.description")}
        </p>
        <Button
          className="btn-shimmer mt-6 h-11 px-6 text-base"
          render={<Link href="/contact" />}
        >
          {t("pricing.button")}
        </Button>
      </section>
      </Reveal>
    </div>
  );
}
