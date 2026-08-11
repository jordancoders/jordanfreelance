import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Custom Quote",
  description:
    "Request a transparent custom quote from Jordan Peters Coder Freelancing. Get a working 48-hour staging demo before you pay the balance — custom web apps and dashboards for South African SMEs.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
