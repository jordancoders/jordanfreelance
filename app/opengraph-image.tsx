import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "Jordan Peters Coder Freelancing — 48-Hour Staging Demo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg,#070D17 0%,#0A1628 50%,#0D1A2D 100%)",
          color: "white",
          padding: 48,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 22 }}>JP</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>Coder Freelancing</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>by Jordan Peters • South Africa</div>
            </div>
          </div>
          <div style={{ fontSize: 12, background: "#f97316", padding: "6px 12px", borderRadius: 999, fontWeight: 700 }}>48-Hour Staging Guarantee</div>
        </div>
        <div>
          <div style={{ fontSize: 54, fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>Custom Booking Dashboards</div>
          <div style={{ fontSize: 54, fontWeight: 900, lineHeight: 1, letterSpacing: -2, background: "linear-gradient(90deg,#f97316,#f59e0b)", backgroundClip: "text", color: "transparent" as any }}>& Web Apps for SA SMEs</div>
          <div style={{ marginTop: 16, fontSize: 18, opacity: 0.8, maxWidth: 760 }}>AI-orchestrated with a human quality gate • Working demo in 48h • POPIA-aligned • You own the code</div>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 12, opacity: 0.6 }}>
          <span>jpfreelance.dpdns.org</span><span>•</span><span>Next.js 15 • Tailwind v4 • TypeScript</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
