import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portal",
  description:
    "Private client portal — track your build live, review your quote, and sign your declaration. Access is by invitation only.",
  robots: { index: false, follow: false },
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
