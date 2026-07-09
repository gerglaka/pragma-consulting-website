import type { Metadata } from "next";
import {
  type AbstractIntlMessages,
  hasLocale,
  NextIntlClientProvider,
} from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Inter, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SpotlightEffect } from "@/components/spotlight-effect";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import "../globals.css";

// Body font is not preloaded on purpose: the LCP hero text uses Space
// Grotesk, so that file must win the early-bandwidth race. Inter swaps in
// a moment later (font-display: swap shows fallback text immediately).
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

// display: "optional" — the preloaded file almost always arrives within the
// short block window (no font flash at all); on very slow first visits the
// metric-adjusted fallback stays instead of swapping mid-view. This also
// stops the LCP hero headline from being re-timed to the font swap.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-space-grotesk",
  display: "optional",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  // Ship only the namespaces client components actually use (header, nav,
  // theme toggle, contact form) — embedding the full catalog in every HTML
  // response measurably delays LCP on slow connections.
  const messages = await getMessages({ locale });
  const clientMessages: AbstractIntlMessages = {
    header: messages.header,
    nav: messages.nav,
    theme: messages.theme,
    contactPage: {
      form: (messages.contactPage as AbstractIntlMessages).form,
    },
  };

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={clientMessages}>
            <a
              href="#content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
            >
              {t("a11y.skipToContent")}
            </a>
            <Header />
            <main id="content" className="flex-1">
              {children}
            </main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
        <SpotlightEffect />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Pragma",
            slogan: t("home.hero.eyebrow"),
            description: t("meta.description"),
            url: absoluteUrl(locale, "/"),
            areaServed: [
              { "@type": "Country", name: "Hungary" },
              { "@type": "Country", name: "Slovakia" },
            ],
            knowsLanguage: ["hu", "sk", "en"],
          }}
        />
      </body>
    </html>
  );
}
