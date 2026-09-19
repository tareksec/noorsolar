import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Noor Solar Energy — Direct Importer & Wholesale Supplier in Bangladesh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "#111311",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#CEF23E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111311"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            </div>
            <span style={{ fontSize: "28px", fontWeight: "bold", letterSpacing: "1px", color: "#FFFFFF" }}>
              NOOR SOLAR ENERGY
            </span>
          </div>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              background: "#CEF23E",
              color: "#111311",
              padding: "8px 18px",
              borderRadius: "9999px",
            }}
          >
            B2B WHOLESALE DIRECT
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "980px" }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              lineHeight: 1.15,
              margin: 0,
              color: "#FFFFFF",
            }}
          >
            Commercial Solar Panels, Lithium Batteries & Inverters
          </h1>
          <p style={{ fontSize: "24px", color: "#A0A5A0", margin: 0 }}>
            Direct Importer & Container-Scale Equipment Supplier in Bangladesh
          </p>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            borderTop: "1px solid #282C28",
            paddingTop: "24px",
          }}
        >
          <span style={{ fontSize: "16px", color: "#CEF23E", fontWeight: 600 }}>
            Tier-1 Monocrystalline N-Type
          </span>
          <span style={{ color: "#5C605C" }}>•</span>
          <span style={{ fontSize: "16px", color: "#CEF23E", fontWeight: 600 }}>
            LiFePO4 Rack Storage
          </span>
          <span style={{ color: "#5C605C" }}>•</span>
          <span style={{ fontSize: "16px", color: "#CEF23E", fontWeight: 600 }}>
            Commercial Inverters
          </span>
          <span style={{ marginLeft: "auto", fontSize: "16px", color: "#A0A5A0" }}>
            noorsolaren.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
