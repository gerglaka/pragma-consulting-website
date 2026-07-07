import {
  AppWindowIcon,
  ArrowRightIcon,
  BarChart3Icon,
  DatabaseIcon,
  GlobeIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { DeviceFrame } from "@/components/device-frame";
import { Button } from "@/components/ui/button";
import { projects } from "@/content/projects";
import { Link } from "@/i18n/navigation";

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
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <h1 className="max-w-4xl font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
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
      </section>

      {/* Services bento */}
      <section
        aria-labelledby="home-services"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
      >
        <h2
          id="home-services"
          className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {t("services.title")}
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PILLAR_A.map(({ key, Icon }) => (
            <article
              key={key}
              className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-6 sm:p-8"
            >
              <Icon aria-hidden="true" className="size-8 text-primary" />
              <h3 className="font-display text-xl font-semibold">
                {t(`services.${key}.title`)}
              </h3>
              <p className="text-muted-foreground">
                {t(`services.${key}.description`)}
              </p>
            </article>
          ))}
          {/* Pillar B — one confident card */}
          <article className="flex flex-col gap-3 rounded-2xl bg-brand-deep p-6 text-white sm:p-8 md:col-span-3 md:flex-row md:items-center md:gap-8">
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
        </div>
      </section>

      {/* References strip */}
      <section
        aria-labelledby="home-references"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
      >
        <h2
          id="home-references"
          className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {t("references.title")}
        </h2>
        <p className="mt-3 text-muted-foreground">{t("references.subtitle")}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href="/references"
              className="group rounded-2xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/40"
            >
              <DeviceFrame gradient={project.gradient} compact />
              <p className="mt-4 text-xs font-medium tracking-wide text-primary uppercase">
                {tp(`${project.id}.tag`)}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold group-hover:text-primary">
                {tp(`${project.id}.title`)}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {tp(`${project.id}.oneliner`)}
              </p>
            </Link>
          ))}
        </div>
        <Button
          variant="outline"
          className="mt-8"
          render={<Link href="/references" />}
        >
          {t("references.cta")}
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      </section>

      {/* How we work */}
      <section
        aria-labelledby="home-how"
        className="border-y border-border/60 bg-muted/40"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2
            id="home-how"
            className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {t("how.title")}
          </h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {(["step1", "step2", "step3", "step4"] as const).map((step, i) => (
              <li key={step} className="flex flex-col gap-2">
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
              </li>
            ))}
          </ol>
          <p className="mt-10 font-display text-lg font-semibold text-primary">
            {t("how.highlight")}
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section aria-labelledby="home-cta">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
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
        </div>
      </section>
    </>
  );
}
