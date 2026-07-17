import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? siteConfig.name;
  const subtitle = searchParams.get("subtitle") ?? siteConfig.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0a0a0f",
          backgroundImage:
            "radial-gradient(circle at 12% 10%, rgba(139,92,246,0.35), transparent 45%), radial-gradient(circle at 88% 88%, rgba(139,92,246,0.22), transparent 50%)",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#a78bfa",
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          ~/portfolio
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 24 ? 60 : 76,
            fontWeight: 600,
            color: "#f7f7fa",
            lineHeight: 1.1,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#a1a1ad",
            marginTop: 28,
            maxWidth: 820,
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
