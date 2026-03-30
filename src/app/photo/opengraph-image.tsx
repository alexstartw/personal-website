import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const alt = "Alex Lin Photography — Portrait & Cosplay · Taipei";
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
        background: "#080806",
        fontFamily: "Inter",
        overflow: "hidden",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Warm ambient glow center */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(200,168,130,0.10) 0%, transparent 65%)",
        }}
      />

      {/* Aperture rings */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 520,
          height: 520,
          borderRadius: "50%",
          border: "1px solid rgba(200,168,130,0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 380,
          height: 380,
          borderRadius: "50%",
          border: "1px solid rgba(200,168,130,0.12)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 240,
          height: 240,
          borderRadius: "50%",
          border: "1px solid rgba(200,168,130,0.16)",
        }}
      />

      {/* Thin horizontal line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(200,168,130,0.12) 20%, rgba(200,168,130,0.12) 80%, transparent)",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Category label */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#c8a882",
            marginBottom: 20,
          }}
        >
          Photography
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#f0ede8",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          Alex Lin
        </div>

        {/* Thin divider */}
        <div
          style={{
            width: 40,
            height: 1,
            background: "rgba(200,168,130,0.5)",
            marginBottom: 16,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: "#888",
            letterSpacing: "0.04em",
            marginBottom: 8,
          }}
        >
          Portrait &amp; Cosplay Photography
        </div>

        <div
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "#555",
            letterSpacing: "0.08em",
            marginBottom: 36,
          }}
        >
          Taipei, Taiwan
        </div>

        {/* IG handle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            border: "1px solid rgba(200,168,130,0.25)",
            borderRadius: 24,
            background: "rgba(200,168,130,0.06)",
          }}
        >
          {/* IG icon (simplified) */}
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              border: "1.5px solid #c8a882",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                border: "1.5px solid #c8a882",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 400,
              color: "#c8a882",
              letterSpacing: "0.05em",
            }}
          >
            @yu_._photographer
          </span>
        </div>
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
