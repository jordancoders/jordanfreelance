"use client";

import React from "react";
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

function sanitizeInvoice(inv: Invoice): Invoice {
  return {
    ...inv,
    items: Array.isArray(inv.items) && inv.items.length ? inv.items : [{ id: "1", description: "Custom Work", quantity: 1, rate: 0 }],
    clientName: inv.clientName?.trim() || "Client",
    invoiceNumber: inv.invoiceNumber?.trim() || `DOC-${Date.now()}`,
    currency: (inv.currency === "USD" ? "USD" : "ZAR") as Invoice["currency"],
    issueDate: inv.issueDate || new Date().toISOString().slice(0, 10),
    dueDate: inv.dueDate || new Date().toISOString().slice(0, 10),
  };
}

function sanitizeDeclaration(d: InvoiceDeclaration): InvoiceDeclaration {
  let url = (d.signatureDataUrl || "").trim();
  // @react-pdf Image only handles data:image/* or http(s). Strip invalid junk.
  if (url && !url.startsWith("data:image/") && !/^https?:\/\//.test(url)) {
    console.warn("[pdf] stripping invalid signatureDataUrl, length", url.length);
    url = "";
  }
  // Guard absurdly large data URLs (>1.5MB) that can OOM pdfkit
  if (url.length > 2_000_000) {
    console.warn("[pdf] signature too large, dropping", url.length);
    url = "";
  }
  return { ...d, signatureDataUrl: url };
}

/**
 * Generate and download an invoice PDF.
 */
export async function downloadInvoicePDF(invoice: Invoice, filename?: string) {
  const inv = sanitizeInvoice(invoice);
  try {
    const { pdf } = await import("@react-pdf/renderer");
    const { default: InvoicePDF } = await import("@/components/pdf/InvoicePDF");
    const doc = React.createElement(InvoicePDF as any, { invoice: inv, ...commonProps } as any);
    let blob: Blob;
    try {
      blob = await (pdf as any)(doc).toBlob();
    } catch (e) {
      console.error("[pdf] pdf().toBlob failed, trying buffer fallback", e);
      // Fallback via server route
      throw e;
    }
    if (!blob || blob.size < 500) throw new Error(`Generated blob too small (${blob?.size ?? 0} bytes) — likely render failure`);
    triggerDownload(blob, filename || `${inv.invoiceNumber}.pdf`);
  } catch (err) {
    console.error("[pdf] downloadInvoicePDF failed:", err);
    // Try server-side fallback before surfacing to user
    const serverOk = await tryServerFallback(inv, filename || `${inv.invoiceNumber}.pdf`, "invoice");
    if (!serverOk) throw err;
  }
}

/**
 * Generate and download a declaration PDF.
 */
export async function downloadDeclarationPDF(
  invoice: Invoice,
  declaration: InvoiceDeclaration,
  filename?: string,
) {
  const inv = sanitizeInvoice(invoice);
  const decl = sanitizeDeclaration(declaration);
  try {
    const { pdf } = await import("@react-pdf/renderer");
    const { default: DeclarationPDF } = await import("@/components/pdf/DeclarationPDF");
    const doc = React.createElement(DeclarationPDF as any, { invoice: inv, declaration: decl, ...commonProps } as any);
    let blob: Blob;
    try {
      blob = await (pdf as any)(doc).toBlob();
    } catch (e) {
      console.error("[pdf] pdf().toBlob declaration failed", e);
      throw e;
    }
    if (!blob || blob.size < 500) throw new Error(`Declaration blob too small (${blob?.size ?? 0})`);
    triggerDownload(blob, filename || `${inv.invoiceNumber}-declaration.pdf`);
  } catch (err) {
    console.error("[pdf] downloadDeclarationPDF failed:", err);
    const serverOk = await tryServerFallback(inv, filename || `${inv.invoiceNumber}-declaration.pdf`, "declaration", decl);
    if (!serverOk) throw err;
  }
}

/**
 * Generate and download a cover letter PDF.
 */
export async function downloadCoverLetterPDF(invoice: Invoice, filename?: string) {
  const inv = sanitizeInvoice(invoice);
  try {
    const { pdf } = await import("@react-pdf/renderer");
    const { default: CoverLetterPDF } = await import("@/components/pdf/CoverLetterPDF");
    const doc = React.createElement(CoverLetterPDF as any, { invoice: inv, ...commonProps } as any);
    const blob = await (pdf as any)(doc).toBlob();
    if (!blob || blob.size < 500) throw new Error(`Cover blob too small (${blob?.size ?? 0})`);
    triggerDownload(blob, filename || `${inv.invoiceNumber}-cover-letter.pdf`);
  } catch (err) {
    console.error("[pdf] downloadCoverLetterPDF failed:", err);
    const serverOk = await tryServerFallback(inv, filename || `${inv.invoiceNumber}-cover-letter.pdf`, "cover-letter");
    if (!serverOk) throw err;
  }
}

async function tryServerFallback(invoice: Invoice, filename: string, type: string, declaration?: InvoiceDeclaration): Promise<boolean> {
  try {
    const res = await fetch("/api/pdf/react", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoice, declaration, type, filename }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      console.warn("[pdf] server fallback non-ok", res.status, txt.slice(0, 300));
      return false;
    }
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/pdf")) {
      console.warn("[pdf] server fallback returned non-pdf", ct);
      return false;
    }
    const blob = await res.blob();
    if (blob.size < 500) return false;
    triggerDownload(blob, filename);
    return true;
  } catch (e) {
    console.warn("[pdf] server fallback exception", e);
    return false;
  }
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
