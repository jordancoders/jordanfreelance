import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Processing Agreement (GDPR Article 28)",
  description:
    "Data Processing Agreement template for international clients of Jordan Peters Coder Freelancing — GDPR Article 28 & UK GDPR aligned, with POPIA-aligned 7-day data erasure commitments.",
};

export default function DpaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
