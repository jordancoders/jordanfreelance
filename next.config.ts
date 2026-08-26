import type { NextConfig } from "next";

// Next.js dev mode uses webpack HMR which evaluates modules with eval — that
// needs 'unsafe-eval'. Production builds never eval, so the header stays strict
// in prod while the local dev server keeps hot reload working.
const isDev = process.env.NODE_ENV !== "production";

const securityHeaders = [
  // Browser XSS / injection hardening
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Disable device/API permissions the site never uses
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), autoplay=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // JSON-LD scripts in <head> + Next runtime need inline scripts;
      // dev additionally needs 'unsafe-eval' for webpack hot reload
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      // Inline styles are used throughout (React style props, signature pad)
      // fonts.googleapis.com for Lexend (accessibility dyslexia font)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Project demo images come from picsum/unsplash; signatures are data: URIs
      "img-src 'self' data: blob: https:",
      // fonts.gstatic.com for Lexend font files
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self'",
      "media-src 'self'",
      // Project embeds (staging demos, Google Form on /contact) are https iframes
      "frame-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
