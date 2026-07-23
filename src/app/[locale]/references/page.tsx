import { ArrowUpRightIcon } from "lucide-react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { DeviceFrame } from "@/components/device-frame";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { projects } from "@/content/projects";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "referencesPage" });
  return buildPageMetadata({
    locale: locale as Locale,
    href: "/references",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default function ReferencesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("referencesPage");
  const tp = useTranslations("projects");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: t("metaTitle"),
          description: t("metaDescription"),
          url: absoluteUrl(locale as Locale, "/references"),
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

      <div className="mt-14 space-y-16">
        {projects.map((project, i) => (
          <Reveal key={project.id}>
          <article
            aria-labelledby={`project-${project.id}`}
            className="grid items-center gap-8 lg:grid-cols-2"
          >
            <DeviceFrame
              gradient={project.gradient}
              image={project.image}
              className={i % 2 === 1 ? "lg:order-last" : undefined}
            />
            <div>
              <p className="text-xs font-medium tracking-wide text-primary uppercase">
                {tp(`${project.id}.tag`)} · {tp(`${project.id}.client`)}
              </p>
              <h2
                id={`project-${project.id}`}
                className="mt-2 font-display text-2xl font-bold sm:text-3xl"
              >
                {tp(`${project.id}.title`)}
              </h2>
              <dl className="mt-6 space-y-4">
                <div>
                  <dt className="text-sm font-semibold text-primary">
                    {t("problemLabel")}
                  </dt>
                  <dd className="mt-1 text-muted-foreground">
                    {tp(`${project.id}.problem`)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-primary">
                    {t("solutionLabel")}
                  </dt>
                  <dd className="mt-1 text-muted-foreground">
                    {tp(`${project.id}.solution`)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-primary">
                    {t("resultLabel")}
                  </dt>
                  <dd className="mt-1 text-muted-foreground">
                    {tp(`${project.id}.result`)}
                  </dd>
                </div>
              </dl>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw mt-6 inline-flex items-center gap-1 pb-0.5 font-medium text-primary"
                >
                  {t("visit")}
                  <ArrowUpRightIcon aria-hidden="true" className="size-4" />
                </a>
              )}
            </div>
          </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
      <section
        aria-labelledby="ref-cta"
        className="mt-20 rounded-2xl border border-border/70 bg-muted/40 p-6 text-center sm:p-10"
      >
        <h2 id="ref-cta" className="font-display text-2xl font-bold">
          {t("cta.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          {t("cta.description")}
        </p>
        <Button
          className="btn-shimmer mt-6 h-11 px-6 text-base"
          render={<Link href="/contact" />}
        >
          {t("cta.button")}
        </Button>
      </section>
      </Reveal>
    </div>
  );
}
