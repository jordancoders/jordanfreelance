"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Invoice, InvoiceDeclaration } from "@/lib/types";
import { SITE_CONFIG } from "@/data/portfolioData";

/** Format currency */
function fmtCur(amount: number, currency: "ZAR" | "USD" = "ZAR"): string {
  return `${currency === "ZAR" ? "R" : "$"} ${amount.toLocaleString("en-ZA")}`;
}

/** Format date nicely */
function fmtDate(d: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-ZA", { day: "2-digit", month: "long", year: "numeric" });
}

/** Calculate totals */
function calcTotals(inv: Invoice) {
  const subtotal = (inv.items || []).reduce((s, i) => s + (i.quantity || 0) * (i.rate || 0), 0);
  const deposit = Math.round(subtotal * ((inv.depositPercent ?? 50) / 100));
  const balance = Math.max(0, subtotal - deposit);
  return { subtotal, deposit, balance, total: subtotal };
}

/** Sanitize invoice data for safe PDF generation */
function sanitize(inv: Invoice): Invoice {
  return {
    ...inv,
    items: inv.items?.length ? inv.items : [{ id: "1", description: "Custom Work", quantity: 1, rate: 0 }],
    clientName: inv.clientName?.trim() || "Client",
    invoiceNumber: inv.invoiceNumber?.trim() || `DOC-${Date.now()}`,
    currency: (inv.currency === "USD" ? "USD" : "ZAR") as Invoice["currency"],
    issueDate: inv.issueDate || new Date().toISOString().slice(0, 10),
    dueDate: inv.dueDate || new Date().toISOString().slice(0, 10),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// INVOICE PDF
// ═══════════════════════════════════════════════════════════════════════════════

export function downloadInvoicePDF(inv: Invoice, filename?: string) {
  const invoice = sanitize(inv);
  const { subtotal, deposit, balance, total } = calcTotals(invoice);
  const cur = invoice.currency || "ZAR";
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // ── Header ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(SITE_CONFIG.tradingName, 14, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`by ${SITE_CONFIG.developerName}`, 14, 23);
  doc.text(SITE_CONFIG.email, 14, 28);
  doc.text(`WhatsApp: ${SITE_CONFIG.whatsappFormatted} • ${SITE_CONFIG.location}`, 14, 32);
  doc.text(`Web: ${SITE_CONFIG.siteUrl}`, 14, 36);

  // Right side header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(SITE_CONFIG.developerName, 196, 18, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date: ${fmtDate(invoice.issueDate)}`, 196, 23, { align: "right" });
  doc.text(`Ref: ${invoice.invoiceNumber}`, 196, 28, { align: "right" });

  // Divider
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(14, 40, 196, 40);

  // ── Document type + status ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  const title = invoice.documentType === "Quote" ? `Quotation ${invoice.invoiceNumber}` : `Invoice ${invoice.invoiceNumber}`;
  doc.text(title, 14, 50);

  // Status badge
  doc.setFontSize(7);
  doc.setFillColor(invoice.status === "Paid" ? 220 : 254, invoice.status === "Paid" ? 252 : 243, invoice.status === "Paid" ? 231 : 196);
  doc.roundedRect(170, 44, 26, 6, 1, 1, "F");
  doc.setTextColor(invoice.status === "Paid" ? 22 : 146, invoice.status === "Paid" ? 101 : 64, invoice.status === "Paid" ? 52 : 14);
  doc.text(invoice.status.toUpperCase(), 183, 48.5, { align: "center" });

  // ── Client info ──
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 56, 182, 22, 1, 1, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 56, 182, 22, 1, 1, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text("BILL TO", 18, 61);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(invoice.clientName, 18, 67);
  if (invoice.clientCompany) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(invoice.clientCompany, 18, 72);
  }
  if (invoice.clientEmail || invoice.clientPhone) {
    doc.setFontSize(7);
    const contact = [invoice.clientEmail, invoice.clientPhone].filter(Boolean).join(" • ");
    doc.text(contact, 18, 76);
  }

  // ── Items table ──
  let startY = 85;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("ITEMS", 14, startY);
  startY += 4;

  const tableData = (invoice.items || []).map((item) => [
    item.description,
    String(item.quantity),
    fmtCur(item.rate, cur),
    fmtCur((item.quantity || 0) * (item.rate || 0), cur),
  ]);

  autoTable(doc, {
    startY,
    head: [["Description", "Qty", "Rate", "Amount"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], fontStyle: "bold", fontSize: 7, textColor: 255 },
    styles: { fontSize: 8, cellPadding: 3, textColor: [51, 65, 85] },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 35, halign: "right" },
      3: { cellWidth: 35, halign: "right", fontStyle: "bold" },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  // ── Totals ──
  const finalY = (doc as any).lastAutoTable?.finalY || startY + 20;
  const totalsX = 130;
  const valsX = 185;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Subtotal", totalsX, finalY + 10);
  doc.setTextColor(15, 23, 42);
  doc.text(fmtCur(subtotal, cur), valsX, finalY + 10, { align: "right" });

  doc.setTextColor(100, 116, 139);
  doc.text(`Deposit (${invoice.depositPercent ?? 50}%)`, totalsX, finalY + 16);
  doc.setTextColor(15, 23, 42);
  doc.text(fmtCur(deposit, cur), valsX, finalY + 16, { align: "right" });

  doc.setTextColor(100, 116, 139);
  doc.text("Balance on completion", totalsX, finalY + 22);
  doc.setTextColor(15, 23, 42);
  doc.text(fmtCur(balance, cur), valsX, finalY + 22, { align: "right" });

  // Bold total line
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.3);
  doc.line(totalsX, finalY + 25, valsX, finalY + 25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TOTAL", totalsX, finalY + 31);
  doc.text(fmtCur(total, cur), valsX, finalY + 31, { align: "right" });

  // ── Payment details ──
  const payY = finalY + 38;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, payY, 182, 18, 1, 1, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(22, 101, 52);
  doc.text("PAYMENT OPTIONS", 18, payY + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(`PayPal: ${SITE_CONFIG.paypalMeUrl}`, 18, payY + 10);
  doc.text(`Direct EFT — bank details available on request.`, 18, payY + 14);
  doc.text(`Payment due by: ${fmtDate(invoice.dueDate)}`, 18, payY + 18);

  // ── Quote proposal fields ──
  let proposalY = payY + 26;
  if (invoice.documentType === "Quote" && invoice.proposalSummary) {
    proposalY = addProposalSection(doc, "Project Understanding", invoice.proposalSummary, proposalY);
  }
  if (invoice.documentType === "Quote" && invoice.proposalSolution) {
    proposalY = addProposalSection(doc, "Proposed Solution", invoice.proposalSolution, proposalY);
  }
  if (invoice.documentType === "Quote" && invoice.proposalDeliverables?.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("DELIVERABLES", 14, proposalY);
    proposalY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    invoice.proposalDeliverables.forEach((d) => {
      if (proposalY > 270) { doc.addPage(); proposalY = 20; }
      doc.text(`• ${d}`, 18, proposalY);
      proposalY += 5;
    });
    proposalY += 3;
  }
  if (invoice.documentType === "Quote" && invoice.proposalTimeline) {
    proposalY = addProposalSection(doc, "Timeline", invoice.proposalTimeline, proposalY);
  }
  if (invoice.documentType === "Quote" && invoice.proposalGuarantee) {
    proposalY = addProposalSection(doc, "Guarantee", invoice.proposalGuarantee, proposalY);
  }
  if (invoice.documentType === "Quote" && invoice.proposalNextSteps) {
    proposalY = addProposalSection(doc, "Next Steps", invoice.proposalNextSteps, proposalY);
  }

  // ── Notes ──
  if (invoice.notes) {
    if (proposalY > 250) { doc.addPage(); proposalY = 20; }
    doc.setFillColor(255, 247, 237);
    doc.setDrawColor(254, 215, 170);
    doc.setLineWidth(0.3);
    doc.line(14, proposalY, 14, proposalY + 10);
    doc.roundedRect(15, proposalY - 3, 180, 10, 1, 1, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(154, 52, 18);
    doc.text(invoice.notes, 19, proposalY + 3);
    proposalY += 14;
  }

  // ── Footer ──
  const pageH = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(14, pageH - 16, 196, pageH - 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text(`${SITE_CONFIG.tradingName} • ${SITE_CONFIG.location} • ${SITE_CONFIG.siteUrl}`, 105, pageH - 10, { align: "center" });
  doc.text("This document was generated electronically and is valid without signature unless otherwise stated.", 105, pageH - 6, { align: "center" });

  doc.save(filename || `${invoice.invoiceNumber}.pdf`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// DECLARATION PDF
// ═══════════════════════════════════════════════════════════════════════════════

export function downloadDeclarationPDF(inv: Invoice, declaration: InvoiceDeclaration, filename?: string) {
  const invoice = sanitize(inv);
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(SITE_CONFIG.tradingName, 14, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`${SITE_CONFIG.email} • ${SITE_CONFIG.location}`, 14, 23);
  doc.text(SITE_CONFIG.siteUrl, 14, 28);

  // Official badge
  doc.setFillColor(220, 252, 231);
  doc.roundedRect(160, 12, 36, 5, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(22, 101, 52);
  doc.text("OFFICIAL RECORD", 178, 15.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated ${fmtDate(new Date().toISOString())}`, 196, 23, { align: "right" });
  doc.text(`Ref: ${invoice.invoiceNumber}`, 196, 28, { align: "right" });

  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(14, 32, 196, 32);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("Declaration of Agreement & Consent", 105, 42, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`${invoice.documentType} ${invoice.invoiceNumber} • ${invoice.clientName}`, 105, 48, { align: "center" });

  // Declared by
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 54, 182, 18, 1, 1, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.text("DECLARED BY", 18, 59);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(declaration.signerName || invoice.clientName, 18, 65);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`Signed: ${fmtDate(declaration.signedAt)} • Captured by: ${declaration.signedBy || "admin"}`, 18, 70);

  // Clauses
  const clauses = [
    `I, the undersigned, hereby acknowledge and agree to the terms set out in ${invoice.documentType} ${invoice.invoiceNumber} issued by ${SITE_CONFIG.developerName} (${SITE_CONFIG.tradingName}).`,
    `I confirm that I have reviewed the scope of work, deliverables, timeline, and payment terms outlined in the document. I understand that the deposit of ${invoice.depositPercent ?? 50}% is required before work commences, and the balance is due upon final approval and source-code handover.`,
    `I further acknowledge that confidential data provided for this project will be processed strictly in line with the Protection of Personal Information Act (Act 4 of 2013), and that all confidential client data will be permanently destroyed within 7 calendar days of handover — a voluntary commitment that exceeds the statutory duty under Section 14 of POPIA. A Data Destruction Certificate is available on written request.`,
    `I understand that any dispute arising from this engagement shall be governed by the laws of the Republic of South Africa and subject to the jurisdiction of the courts of South Africa.`,
  ];

  let y = 82;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  clauses.forEach((c) => {
    const lines = doc.splitTextToSize(c, 175);
    lines.forEach((line: string) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(line, 14, y);
      y += 4;
    });
    y += 3;
  });

  // Signature section
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("SIGNATURE", 14, y);
  y += 8;

  // Signature image
  if (declaration.signatureDataUrl && declaration.signatureDataUrl.startsWith("data:image/")) {
    try {
      doc.addImage(declaration.signatureDataUrl, "PNG", 14, y, 60, 20);
      y += 24;
    } catch {
      doc.line(14, y + 15, 80, y + 15);
      y += 20;
    }
  } else {
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.2);
    doc.line(14, y + 15, 80, y + 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text("Signature of authorised representative", 14, y + 19);
    y += 24;
  }

  // Date + witness lines
  doc.line(14, y + 5, 80, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("Date", 14, y + 9);

  doc.line(110, y + 5, 176, y + 5);
  doc.text("Witness (optional)", 110, y + 9);

  // Footer
  const pageH = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(14, pageH - 16, 196, pageH - 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text(`${SITE_CONFIG.tradingName} • ${SITE_CONFIG.location} • ${SITE_CONFIG.siteUrl}`, 105, pageH - 10, { align: "center" });
  doc.text("This declaration constitutes a legally binding agreement under South African law.", 105, pageH - 6, { align: "center" });

  doc.save(filename || `${invoice.invoiceNumber}-declaration.pdf`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// COVER LETTER PDF
// ═══════════════════════════════════════════════════════════════════════════════

export function downloadCoverLetterPDF(inv: Invoice, filename?: string) {
  const invoice = sanitize(inv);
  const { total, deposit, balance } = calcTotals(invoice);
  const cur = invoice.currency || "ZAR";
  const firstName = invoice.clientName.split(" ")[0] || invoice.clientName;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(SITE_CONFIG.tradingName, 14, 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(SITE_CONFIG.email, 14, 23);
  doc.text(`WhatsApp: ${SITE_CONFIG.whatsappFormatted} • ${SITE_CONFIG.location}`, 14, 28);
  doc.text(`Web: ${SITE_CONFIG.siteUrl}`, 14, 32);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(SITE_CONFIG.developerName, 196, 18, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date: ${fmtDate(new Date().toISOString())}`, 196, 23, { align: "right" });
  doc.text(`Ref: ${invoice.invoiceNumber}`, 196, 28, { align: "right" });

  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(14, 36, 196, 36);

  // To
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 42, 182, 18, 1, 1, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text("TO", 18, 47);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(invoice.clientName, 18, 53);
  if (invoice.clientCompany) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(invoice.clientCompany, 18, 57);
  }

  // Body
  let y = 70;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Dear ${firstName},`, 14, y);
  y += 8;

  doc.setTextColor(51, 65, 85);
  const para1 = `Thank you for considering ${SITE_CONFIG.tradingName} for your project. Please find your ${invoice.documentType === "Quote" ? "proposal / quotation" : "invoice"} ${invoice.invoiceNumber} attached${invoice.documentType === "Quote" ? " — prepared as a detailed proposal so you can evaluate exactly what is included" : ""}.`;
  const lines1 = doc.splitTextToSize(para1, 175);
  lines1.forEach((line: string) => { doc.text(line, 14, y); y += 5; });
  y += 3;

  // Financial summary
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y - 3, 182, 22, 1, 1, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("FINANCIAL SUMMARY", 18, y + 2);
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`Total value: ${fmtCur(total, cur)}`, 18, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Kick-off deposit (${invoice.depositPercent ?? 50}%): ${fmtCur(deposit, cur)}`, 18, y + 13);
  doc.text(`Balance on completion: ${fmtCur(balance, cur)}`, 18, y + 17);
  y += 24;

  // Payment terms
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const terms = invoice.documentType === "Quote"
    ? "This proposal includes a 48-hour staging demo — you will receive a live, clickable link to test the build before any further commitment. If the demo is not delivered within 48 hours of deposit confirmation, you receive a 100% refund of the deposit plus unused API credits."
    : "Payment is due by the date shown on the invoice. The deposit secures your 48-hour staging window; the balance is due on final approval and source-code handover.";
  const termsLines = doc.splitTextToSize(terms, 175);
  termsLines.forEach((line: string) => { doc.text(line, 14, y); y += 5; });
  y += 3;

  if (invoice.documentType === "Quote" && invoice.proposalNextSteps) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Next steps: ", 14, y);
    const nsWidth = doc.getTextWidth("Next steps: ");
    doc.setFont("helvetica", "normal");
    const nsLines = doc.splitTextToSize(invoice.proposalNextSteps, 175 - nsWidth);
    doc.text(nsLines[0], 14 + nsWidth, y);
    y += 5;
  }

  // Sign off
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text("Kind regards,", 14, y);
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(SITE_CONFIG.developerName, 14, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(SITE_CONFIG.tradingName, 14, y);
  y += 5;
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`${SITE_CONFIG.email} • WhatsApp: ${SITE_CONFIG.whatsappFormatted}`, 14, y);

  // Footer
  const pageH = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(14, pageH - 16, 196, pageH - 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text(`${SITE_CONFIG.tradingName} • ${SITE_CONFIG.location} • ${SITE_CONFIG.siteUrl}`, 105, pageH - 10, { align: "center" });
  doc.text("This document was generated electronically and is valid without signature unless otherwise stated.", 105, pageH - 6, { align: "center" });

  doc.save(filename || `${invoice.invoiceNumber}-cover-letter.pdf`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function addProposalSection(doc: jsPDF, title: string, content: string, y: number): number {
  if (y > 250) { doc.addPage(); y = 20; }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(title.toUpperCase(), 14, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const lines = doc.splitTextToSize(content, 175);
  lines.forEach((line: string) => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.text(line, 14, y);
    y += 4;
  });
  return y + 4;
}
