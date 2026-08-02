import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Zamin Gullari — доставка цветов в Ташкенте";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public/logo-flower.png"),
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(145deg, #1a1216 0%, #2b1a22 45%, #3d2430 100%)",
          color: "#fffaf8",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <img
            src={logoSrc}
            width={96}
            height={96}
            alt=""
            style={{ borderRadius: 28 }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            <span>Zamin</span>
            <span style={{ color: "#ed749d" }}>Gullari</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              maxWidth: 920,
            }}
          >
            Цветы и букеты с доставкой в Ташкенте
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,250,248,0.78)",
              maxWidth: 860,
              lineHeight: 1.35,
            }}
          >
            Свежие букеты и VIP-композиции. Поддержка 24/7.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
