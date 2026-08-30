"use client";

import type { Invoice, InvoiceDeclaration } from "@/lib/types";
import { SITE_CONFIG } from "@/data/portfolioData";

/** Common props passed to all PDF components */
const commonProps = {
  developerName: SITE_CONFIG.developerName,
  tradingName: SITE_CONFIG.tradingName,
  email: SITE_CONFIG.email,
  whatsappFormatted: SITE_CONFIG.whatsappFormatted,
  location: SITE_CONFIG.location,
  siteUrl: SITE_CONFIG.siteUrl,
  paypalMeUrl: SITE_CONFIG.paypalMeUrl,
};

/**
 * Generate and download an invoice PDF.
 */
export async function downloadInvoicePDF(invoice: Invoice, filename?: string) {
  const { pdf } = await import("@react-pdf/renderer");
  const { default: InvoicePDF } = await import("@/components/pdf/InvoicePDF");
  const blob = await pdf(<InvoicePDF invoice={invoice} {...commonProps} />).toBlob();
  triggerDownload(blob, filename || `${invoice.invoiceNumber}.pdf`);
}

/**
 * Generate and download a declaration PDF.
 */
export async function downloadDeclarationPDF(
  invoice: Invoice,
  declaration: InvoiceDeclaration,
  filename?: string,
) {
  const { pdf } = await import("@react-pdf/renderer");
  const { default: DeclarationPDF } = await import("@/components/pdf/DeclarationPDF");
  const blob = await pdf(
    <DeclarationPDF invoice={invoice} declaration={declaration} {...commonProps} />,
  ).toBlob();
  triggerDownload(blob, filename || `${invoice.invoiceNumber}-declaration.pdf`);
}

/**
 * Generate and download a cover letter PDF.
 */
export async function downloadCoverLetterPDF(invoice: Invoice, filename?: string) {
  const { pdf } = await import("@react-pdf/renderer");
  const { default: CoverLetterPDF } = await import("@/components/pdf/CoverLetterPDF");
  const blob = await pdf(<CoverLetterPDF invoice={invoice} {...commonProps} />).toBlob();
  triggerDownload(blob, filename || `${invoice.invoiceNumber}-cover-letter.pdf`);
}

/** Trigger browser download from a Blob */
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
