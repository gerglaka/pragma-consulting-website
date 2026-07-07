import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Pragma";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });

  const [grotesk500, grotesk700] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/space-grotesk-500.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/space-grotesk-700.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundImage:
          "linear-gradient(135deg, #101f42 0%, #1a3a7a 55%, #3b5bad 100%)",
        color: "#ffffff",
        fontFamily: "Space Grotesk",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <svg
          width="84"
          height="84"
          viewBox="0 0 32 32"
          fill="none"
          role="img"
          aria-hidden="true"
        >
          <path
            d="M16 3.5 A12.5 12.5 0 1 0 28.5 16"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x="12.5" y="12.5" width="7" height="7" rx="1" fill="#e8a020" />
        </svg>
        <div style={{ fontSize: 64, fontWeight: 700 }}>Pragma</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: "#e8a020",
            letterSpacing: 2,
          }}
        >
          {t("eyebrow")}
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 980,
          }}
        >
          {t("headline")}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Space Grotesk",
          data: grotesk500,
          weight: 500,
          style: "normal",
        },
        {
          name: "Space Grotesk",
          data: grotesk700,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
