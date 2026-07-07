import type { Metadata } from "next";
import { AwardIcon, BadgeEuroIcon, LanguagesIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

const FACTS = [
  { key: "languages", Icon: LanguagesIcon },
  { key: "pricing", Icon: BadgeEuroIcon },
  { key: "credential", Icon: AwardIcon },
] as const;

export default function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("aboutPage");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
      </Reveal>

      <Reveal className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed">
        <p className="font-display text-xl font-semibold text-primary">
          {t("p1")}
        </p>
        <p>{t("p2")}</p>
        <p>{t("p3")}</p>
        <p>{t("p4")}</p>
      </Reveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {FACTS.map(({ key, Icon }, i) => (
          <Reveal key={key} delay={i * 0.08}>
            <div className="h-full rounded-2xl border border-border/70 bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-md motion-safe:hover:-translate-y-1">
              <Icon aria-hidden="true" className="size-7 text-primary" />
              <h2 className="mt-3 font-display text-xl font-semibold">
                {t(`facts.${key}.title`)}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t(`facts.${key}.description`)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
      <section
        aria-labelledby="about-cta"
        className="mt-14 rounded-2xl border border-border/70 bg-muted/40 p-6 text-center sm:p-10"
      >
        <h2 id="about-cta" className="font-display text-2xl font-bold">
          {t("cta.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          {t("cta.description")}
        </p>
        <Button
          className="mt-6 h-11 px-6 text-base"
          render={<Link href="/contact" />}
        >
          {t("cta.button")}
        </Button>
      </section>
      </Reveal>
    </div>
  );
}
