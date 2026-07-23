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
          viewBox="1980 3370 4360 4360"
          role="img"
          aria-hidden="true"
        >
          <polygon
            points="3366.78,3693.74 2716.8,4731.92 2728.63,7215 4943.28,3693.74"
            fill="#ffffff"
          />
          <path
            d="M3948.27 3687.82l1007.08 0c492.83,199.27 840.54,682.31 840.54,1246.57 0,742.31 -601.76,1344.07 -1344.07,1344.07 -742.31,0 -1344.07,-601.76 -1344.07,-1344.07 0,-564.26 347.7,-1047.3 840.53,-1246.57z"
            fill="#ffffff"
          />
          <line
            x1="2616.88"
            y1="6048.5"
            x2="4182.68"
            y2="3531.93"
            stroke="#101f42"
            strokeWidth="242.53"
          />
          <line
            x1="2524.35"
            y1="7569.4"
            x2="5004.81"
            y2="3582.78"
            stroke="#101f42"
            strokeWidth="242.52"
          />
          <path
            fill="#101f42"
            d="M4620.15 4406.82l-578.38 928.87c103.55,111.62 251.5,181.47 415.76,181.47 313.15,0 567,-253.85 567,-567 0,-256.63 -170.48,-473.43 -404.38,-543.33z"
          />
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
