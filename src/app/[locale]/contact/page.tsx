import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import type { Locale } from "@/i18n/routing";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return buildPageMetadata({
    locale: locale as Locale,
    href: "/contact",
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("contactPage");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: t("metaTitle"),
          description: t("metaDescription"),
          url: absoluteUrl(locale as Locale, "/contact"),
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
      <div className="animate-fade-up mt-12 max-w-xl [animation-delay:120ms]">
        <ContactForm />
      </div>
    </div>
  );
}
