import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio & Case Studies",
  description:
    "Browse custom web apps, dashboards, and MVPs built by Jordan Peters Coder Freelancing — Next.js 15 builds with 48-hour staging demos, full source-code ownership, and POPIA-aligned handling.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
