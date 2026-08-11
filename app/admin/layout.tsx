import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Studio Admin",
  description: "Private admin studio for Jordan Peters Coder Freelancing. Access by passcode only.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
