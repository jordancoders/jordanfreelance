import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sample Invoice & Legal Package",
  description:
    "A sample invoice and quotation package from Jordan Peters Coder Freelancing — no-tax pricing, per-quote deposit splits, 48-hour staging guarantee, and PayPal/EFT payment options.",
};

export default function InvoiceTemplateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
