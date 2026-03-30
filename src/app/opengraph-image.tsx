import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const alt = "Li-Yu Alex Lin — Senior Data Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function loadFont(name: string) {
  return readFileSync(join(process.cwd(), "public/fonts", name));
}

export default function OGImage() {
  const regular = loadFont("Inter-Regular.ttf");
  const bold = loadFont("Inter-Bold.ttf");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#0b0c10",
        fontFamily: "Inter",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Accent glow top-left */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: -80,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Right side decorative dots */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          opacity: 0.3,
        }}
      >
        {[...Array(5)].map((_, row) => (
          <div key={row} style={{ display: "flex", gap: 16 }}>
            {[...Array(5)].map((_, col) => (
              <div
                key={col}
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#6366f1",
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 0,
          bottom: 0,
          width: 720,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#6366f1",
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#6366f1",
            }}
          >
            Senior Data Engineer
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: "#f1f5f9",
            lineHeight: 1.1,
            marginBottom: 20,
          }}
        >
          Li-Yu Alex Lin
        </div>

        {/* Divider */}
        <div
          style={{
            width: 48,
            height: 2,
            background: "linear-gradient(90deg, #6366f1, transparent)",
            marginBottom: 24,
          }}
        />

        {/* Description */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: "#94a3b8",
            lineHeight: 1.6,
            marginBottom: 40,
            maxWidth: 560,
          }}
        >
          Cloud-native data platforms · GenAI & RAG applications · Event-driven
          architectures · Taipei, Taiwan
        </div>

        {/* Tech tags */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Python", "dbt", "Apache Airflow", "Microsoft Fabric", "LLM"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  padding: "6px 14px",
                  border: "1px solid rgba(99,102,241,0.35)",
                  borderRadius: 6,
                  fontSize: 13,
                  color: "#818cf8",
                  background: "rgba(99,102,241,0.08)",
                }}
              >
                {tag}
              </div>
            ),
          )}
        </div>
      </div>

      {/* Bottom URL */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          right: 80,
          fontSize: 13,
          color: "#334155",
          letterSpacing: "0.05em",
        }}
      >
        alexstartw.github.io/personal-website
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
