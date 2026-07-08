import {
  AppWindowIcon,
  ArrowRightIcon,
  BarChart3Icon,
  DatabaseIcon,
  GlobeIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { use } from "react";
import { DeviceFrame } from "@/components/device-frame";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { partners } from "@/content/partners";
import { projects } from "@/content/projects";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildPageMetadata({
    locale: locale as Locale,
    href: "/",
    title: t("title"),
    description: t("description"),
  });
}

const PILLAR_A = [
  { key: "websites", Icon: GlobeIcon },
  { key: "systems", Icon: DatabaseIcon },
  { key: "webapps", Icon: AppWindowIcon },
] as const;

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("home");
  const tp = useTranslations("projects");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-0 size-[36rem] rounded-full bg-primary/10 blur-3xl dark:bg-primary/15"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="animate-fade-up">
            <p className="flex items-center gap-3 text-sm font-semibold tracking-widest text-primary uppercase">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              {t("hero.eyebrow")}
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {t("hero.headline")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              {t("hero.subheadline")}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                className="h-11 px-6 text-base"
                render={<Link href="/contact" />}
              >
                {t("hero.ctaPrimary")}
              </Button>
              <Button
                variant="outline"
                className="h-11 px-6 text-base"
                render={<Link href="/references" />}
              >
                {t("hero.ctaSecondary")}
                <ArrowRightIcon aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services bento */}
      <section
        aria-labelledby="home-services"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
      >
        <Reveal>
          <h2
            id="home-services"
            className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {t("services.title")}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PILLAR_A.map(({ key, Icon }, i) => (
            <Reveal key={key} delay={i * 0.08}>
              <article className="flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-md motion-safe:hover:-translate-y-1 sm:p-8">
                <Icon aria-hidden="true" className="size-8 text-primary" />
                <h3 className="font-display text-xl font-semibold">
                  {t(`services.${key}.title`)}
                </h3>
                <p className="text-muted-foreground">
                  {t(`services.${key}.description`)}
                </p>
              </article>
            </Reveal>
          ))}
          {/* Pillar B — one confident card */}
          <Reveal className="md:col-span-3" delay={0.16}>
            <article className="flex flex-col gap-3 rounded-2xl bg-brand-deep p-6 text-white transition-all duration-200 hover:shadow-lg motion-safe:hover:-translate-y-1 sm:p-8 md:flex-row md:items-center md:gap-8">
              <BarChart3Icon
                aria-hidden="true"
                className="size-8 shrink-0 text-gold"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gold">
                  {t("services.process.badge")}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold">
                  {t("services.process.title")}
                </h3>
                <p className="mt-2 text-white/80">
                  {t("services.process.description")}
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-2 w-fit border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white md:mt-0 dark:border-white/30 dark:bg-transparent dark:hover:bg-white/10"
                render={<Link href="/services" />}
              >
                {t("services.more")}
                <ArrowRightIcon aria-hidden="true" />
              </Button>
            </article>
          </Reveal>
        </div>
      </section>

      {/* References strip */}
      <section
        aria-labelledby="home-references"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
      >
        <Reveal>
          <h2
            id="home-references"
            className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {t("references.title")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t("references.subtitle")}
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.08}>
              <Link
                href="/references"
                className="group block h-full rounded-2xl border border-border/70 bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md motion-safe:hover:-translate-y-1"
              >
                <DeviceFrame gradient={project.gradient} compact />
                <p className="mt-4 text-xs font-medium tracking-wide text-primary uppercase">
                  {tp(`${project.id}.tag`)}
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold transition-colors group-hover:text-primary">
                  {tp(`${project.id}.title`)}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tp(`${project.id}.oneliner`)}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <Button
            variant="outline"
            className="mt-8"
            render={<Link href="/references" />}
          >
            {t("references.cta")}
            <ArrowRightIcon aria-hidden="true" />
          </Button>
        </Reveal>
      </section>

      {/* How we work */}
      <section
        aria-labelledby="home-how"
        className="border-y border-border/60 bg-muted/40"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Reveal>
            <h2
              id="home-how"
              className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
            >
              {t("how.title")}
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {(["step1", "step2", "step3", "step4"] as const).map((step, i) => (
              <li key={step}>
                <Reveal delay={i * 0.08} className="flex h-full flex-col gap-2">
                  <span
                    aria-hidden="true"
                    className="flex size-10 items-center justify-center rounded-full bg-primary font-display font-bold text-primary-foreground"
                  >
                    {i + 1}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold">
                    {t(`how.${step}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(`how.${step}.description`)}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal delay={0.1}>
            <p className="mt-10 font-display text-lg font-semibold text-primary">
              {t("how.highlight")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Partners */}
      <section
        aria-labelledby="home-partners"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
      >
        <Reveal>
          <h2
            id="home-partners"
            className="text-center text-sm font-semibold tracking-widest text-muted-foreground uppercase"
          >
            {t("partners.title")}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {partners.map((partner) => {
              const mark = partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={160}
                  height={64}
                  className="h-12 w-auto opacity-80 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0 sm:h-14"
                />
              ) : (
                <span className="flex h-14 min-w-36 items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 font-display text-lg font-semibold text-muted-foreground/70">
                  {partner.name}
                </span>
              );
              return (
                <li key={partner.id}>
                  {partner.url ? (
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {mark}
                    </a>
                  ) : (
                    mark
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </section>

      {/* Final CTA */}
      <section aria-labelledby="home-cta">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <Reveal>
            <h2
              id="home-cta"
              className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl"
            >
              {t("finalCta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {t("finalCta.description")}
            </p>
            <Button
              className="mt-8 h-11 bg-gold px-6 text-base text-gold-foreground hover:bg-gold/85"
              render={<Link href="/contact" />}
            >
              {t("finalCta.button")}
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
