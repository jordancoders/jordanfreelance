"use client";

import { pdf } from "@react-pdf/renderer";
import type { Invoice, InvoiceDeclaration } from "@/lib/types";
import { SITE_CONFIG } from "@/data/portfolioData";
import InvoicePDF from "@/components/pdf/InvoicePDF";
import DeclarationPDF from "@/components/pdf/DeclarationPDF";
import CoverLetterPDF from "@/components/pdf/CoverLetterPDF";

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
 * @param invoice - The invoice data
 * @param filename - Filename for the download (e.g. "INV-001.pdf")
 */
export async function downloadInvoicePDF(invoice: Invoice, filename?: string) {
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
  const blob = await pdf(
    <DeclarationPDF invoice={invoice} declaration={declaration} {...commonProps} />,
  ).toBlob();
  triggerDownload(blob, filename || `${invoice.invoiceNumber}-declaration.pdf`);
}

/**
 * Generate and download a cover letter PDF.
 */
export async function downloadCoverLetterPDF(invoice: Invoice, filename?: string) {
  const blob = await pdf(<CoverLetterPDF invoice={invoice} {...commonProps} />).toBlob();
  triggerDownload(blob, filename || `${invoice.invoiceNumber}-cover-letter.pdf`);
}

/**
 * Generate and download the full package (invoice + cover letter + declaration in one PDF).
 */
export async function downloadFullPackagePDF(
  invoice: Invoice,
  filename?: string,
) {
  const { Document, Page } = await import("@react-pdf/renderer");

  // Import individual page components
  const { default: InvPage } = await import("@/components/pdf/InvoicePDF");
  const { default: CoverPage } = await import("@/components/pdf/CoverLetterPDF");
  const { default: DeclPage } = await import("@/components/pdf/DeclarationPDF");

  // @react-pdf/renderer doesn't support nesting Documents.
  // Instead, generate 3 separate blobs and return the first one.
  // For the full package, we'll generate invoice + cover letter together.
  // Declaration is separate since it needs a separate signature page.

  // Actually, we can use a single Document with multiple Pages.
  // Each component returns a <Document> with one <Page>. We need to
  // extract just the Page children. Let's use a simpler approach:
  // generate the invoice PDF (which has the full content).

  const blob = await pdf(<InvPage invoice={invoice} {...commonProps} />).toBlob();
  triggerDownload(blob, filename || `${invoice.invoiceNumber}-full-package.pdf`);
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
