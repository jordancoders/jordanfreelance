import { ImageResponse } from "next/og";

export const alt = "Jordan Peters Coder Freelancing - AI-Orchestrated Custom Web Apps & Dashboards for SA SMEs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A1628 0%, #0D1A2D 55%, #070D17 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "14px",
              background: "#f97316",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
              fontWeight: 900,
              color: "#ffffff",
            }}
          >
            JP
          </div>
          <div style={{ display: "flex", fontSize: "26px", fontWeight: 700, color: "#fb923c" }}>
            JORDAN PETERS
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: "62px",
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: "920px",
          }}
        >
          <span>Custom Web Apps & Dashboards</span>
          <span>for South African SMEs</span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "40px",
            fontSize: "26px",
            fontWeight: 600,
            color: "#cbd5e1",
          }}
        >
          <span style={{ display: "flex", color: "#34d399" }}>Live Demo in 48 Hours</span>
          <span style={{ display: "flex", color: "#34d399" }}>You Own 100% of the Code</span>
          <span style={{ display: "flex", color: "#34d399" }}>POPIA-Aligned</span>
        </div>
      </div>
    ),
    size
  );
}
