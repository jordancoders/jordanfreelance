import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Guarantee Policy",
  description: "Our guarantees, refund terms, and what you can expect. No fine print, no surprises.",
  robots: { index: true, follow: true },
};

export default function GuaranteeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
