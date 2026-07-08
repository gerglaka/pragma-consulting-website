import type { Metadata } from "next";
import {
  AwardIcon,
  BadgeEuroIcon,
  LanguagesIcon,
  UserRoundIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { use } from "react";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { team } from "@/content/team";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return buildPageMetadata({
    locale: locale as Locale,
    href: "/about",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
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
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: t("metaTitle"),
          description: t("metaDescription"),
          url: absoluteUrl(locale as Locale, "/about"),
          inLanguage: locale,
        }}
      />
      <div className="animate-fade-up">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
      </div>

      <div className="animate-fade-up mt-8 max-w-2xl space-y-5 text-lg leading-relaxed [animation-delay:120ms]">
        <p className="font-display text-xl font-semibold text-primary">
          {t("p1")}
        </p>
        <p>{t("p2")}</p>
        <p>{t("p3")}</p>
        <p>{t("p4")}</p>
      </div>

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

      {/* Team */}
      <section aria-labelledby="about-team" className="mt-14">
        <Reveal>
          <h2
            id="about-team"
            className="font-display text-3xl font-bold tracking-tight"
          >
            {t("team.title")}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {t("team.intro")}
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.08}>
              <article className="h-full overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-md motion-safe:hover:-translate-y-1">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={t(`team.${member.id}.name`)}
                    width={800}
                    height={1000}
                    className="aspect-4/5 w-full object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex aspect-4/5 w-full items-center justify-center bg-muted"
                  >
                    <UserRoundIcon className="size-16 text-muted-foreground/50" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold">
                    {t(`team.${member.id}.name`)}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t(`team.${member.id}.role`)}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

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
