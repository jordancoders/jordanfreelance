"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Invoice, InvoiceDeclaration, ExpenseEntry } from "@/lib/types";
import { SITE_CONFIG } from "@/data/portfolioData";

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM — Professional invoice styling
// ═══════════════════════════════════════════════════════════════════════════════

const C: Record<string, [number, number, number]> = {
  navy: [15, 23, 42],
  orange: [249, 115, 22],
  white: [255, 255, 255],
  lightGray: [248, 250, 252],
  midGray: [226, 232, 240],
  darkText: [30, 41, 59],
  bodyText: [71, 85, 105],
  muted: [148, 163, 184],
  green: [22, 101, 52],
  red: [220, 38, 38],
  greenBg: [240, 253, 244],
  greenBorder: [187, 247, 208],
};

function fmtCur(n: number, cur: "ZAR" | "USD" = "ZAR") {
  return `${cur === "ZAR" ? "R" : "$"} ${n.toLocaleString("en-ZA")}`;
}

function fmtDate(d: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-ZA", { day: "2-digit", month: "long", year: "numeric" });
}

function calcTotals(inv: Invoice) {
  const subtotal = (inv.items || []).reduce((s, i) => s + (i.quantity || 0) * (i.rate || 0), 0);
  const deposit = Math.round(subtotal * ((inv.depositPercent ?? 50) / 100));
  return { subtotal, deposit, balance: Math.max(0, subtotal - deposit), total: subtotal };
}

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

// ── Shared layout helpers ─────────────────────────────────────────────────────

function drawHeader(doc: jsPDF, leftLines: string[], rightLines: string[]) {
  // Dark navy header bar
  doc.setFillColor(...C.navy);
  doc.rect(0, 0, 210, 38, "F");

  // Orange accent line
  doc.setFillColor(...C.orange);
  doc.rect(0, 38, 210, 2, "F");

  // Left text (brand)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...C.white);
  doc.text(leftLines[0], 16, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  leftLines.slice(1).forEach((line, i) => {
    doc.text(line, 16, 23 + i * 5);
  });

  // Right text (document info)
  rightLines.forEach((line, i) => {
    doc.setFont(i === 0 ? "helvetica" : "helvetica", i === 0 ? "bold" : "normal");
    doc.setFontSize(i === 0 ? 12 : 8);
    doc.setTextColor(...C.white);
    doc.text(line, 194, 16 + i * 6, { align: "right" });
  });
}

function drawFooter(doc: jsPDF) {
  const pH = doc.internal.pageSize.getHeight();
  doc.setFillColor(...C.navy);
  doc.rect(0, pH - 14, 210, 14, "F");
  doc.setFillColor(...C.orange);
  doc.rect(0, pH - 14, 210, 1, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(203, 213, 225);
  doc.text(`${SITE_CONFIG.brandLine}  •  ${SITE_CONFIG.location}  •  ${SITE_CONFIG.siteUrl}`, 105, pH - 8, { align: "center" });
  doc.text("Generated electronically — valid without signature unless otherwise stated.", 105, pH - 4, { align: "center" });
}

function sectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...C.orange);
  doc.text(title.toUpperCase(), 16, y);
  doc.setDrawColor(...C.orange);
  doc.setLineWidth(0.3);
  doc.line(16, y + 2, 194, y + 2);
  return y + 8;
}

function drawInfoBox(doc: jsPDF, x: number, y: number, w: number, h: number, label: string, lines: string[]) {
  doc.setFillColor(...C.lightGray);
  doc.setDrawColor(...C.midGray);
  doc.roundedRect(x, y, w, h, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(...C.muted);
  doc.text(label, x + 6, y + 6);
  let ly = y + 12;
  lines.forEach((line) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...C.darkText);
    doc.text(line, x + 6, ly);
    ly += 5;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// INVOICE / QUOTATION PDF
// ═══════════════════════════════════════════════════════════════════════════════

export function downloadInvoicePDF(inv: Invoice, filename?: string) {
  const invoice = sanitize(inv);
  const { subtotal, deposit, balance, total } = calcTotals(invoice);
  const cur = invoice.currency || "ZAR";
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const isQuote = invoice.documentType === "Quote";

  // ═══════════════════════════════════════════════════════════════════════════
  // HEADER — matches invoice-template page layout
  // ═══════════════════════════════════════════════════════════════════════════
  let y = 16;

  // Brand (left)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...C.darkText);
  doc.text(SITE_CONFIG.tradingName, 16, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.muted);
  doc.text(`by ${SITE_CONFIG.developerName}`, 16, y);
  y += 10;
  doc.setFontSize(7);
  doc.text(SITE_CONFIG.email, 16, y);
  y += 4;
  doc.text(`WhatsApp: ${SITE_CONFIG.whatsappFormatted}`, 16, y);
  y += 4;
  doc.text(`PayPal: ${SITE_CONFIG.paypalMeUrl.replace("https://www.paypal.com/paypalme/", "paypal.me/")}`, 16, y);
  y += 4;
  doc.text(`Location: ${SITE_CONFIG.location}`, 16, y);

  // Invoice info box (right) — bordered box like the template
  doc.setFillColor(...C.lightGray);
  doc.setDrawColor(...C.midGray);
  doc.roundedRect(130, 14, 64, 32, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...C.orange);
  doc.text(isQuote ? "QUOTATION" : "INVOICE", 162, 22, { align: "center" });
  doc.setFontSize(8);
  doc.setTextColor(...C.darkText);
  doc.text(`Ref: ${invoice.invoiceNumber}`, 162, 29, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.bodyText);
  doc.text(`Issue: ${fmtDate(invoice.issueDate)}`, 162, 35, { align: "center" });
  doc.text(`Due: ${fmtDate(invoice.dueDate)}`, 162, 39, { align: "center" });

  // Status badge
  const statusColor: [number, number, number] = invoice.status === "Paid" ? C.green : C.orange;
  const statusBg: [number, number, number] = invoice.status === "Paid" ? C.greenBg : [255, 247, 237];
  doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
  doc.roundedRect(144, 41, 36, 5, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(...statusColor);
  doc.text(invoice.status.toUpperCase(), 162, 44.5, { align: "center" });

  // Divider line
  y = 52;
  doc.setDrawColor(...C.midGray);
  doc.setLineWidth(0.3);
  doc.line(16, y, 194, y);
  y += 8;

  // ═══════════════════════════════════════════════════════════════════════════
  // BILLED TO — full width box like the template
  // ═══════════════════════════════════════════════════════════════════════════
  doc.setFillColor(...C.lightGray);
  doc.setDrawColor(...C.midGray);
  doc.roundedRect(16, y, 178, 22, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  doc.text("BILLED TO", 22, y + 6);
  doc.setFontSize(11);
  doc.setTextColor(...C.darkText);
  doc.text(invoice.clientName, 22, y + 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.bodyText);
  const billedLines = [invoice.clientCompany, [invoice.clientEmail, invoice.clientPhone].filter(Boolean).join("  •  ")].filter(Boolean);
  if (billedLines.length) doc.text(billedLines.join("  •  "), 22, y + 19);
  y += 30;

  // ═══════════════════════════════════════════════════════════════════════════
  // ITEMS TABLE — matches template: light gray header with bold border
  // ═══════════════════════════════════════════════════════════════════════════
  const tableData = (invoice.items || []).map((item) => [
    item.description,
    String(item.quantity),
    fmtCur(item.rate, cur),
    fmtCur((item.quantity || 0) * (item.rate || 0), cur),
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Item Description", "Qty", "Rate", "Amount (" + cur + ")"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [241, 245, 249], fontStyle: "bold", fontSize: 7, textColor: C.darkText, cellPadding: 4, lineColor: C.darkText, lineWidth: 0.4 },
    styles: { fontSize: 8, cellPadding: 3.5, textColor: C.darkText, lineColor: C.midGray, lineWidth: 0.15 },
    columnStyles: {
      0: { cellWidth: 86 },
      1: { cellWidth: 18, halign: "center" },
      2: { cellWidth: 36, halign: "right" },
      3: { cellWidth: 36, halign: "right", fontStyle: "bold" },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TOTALS + GUARANTEE — split layout like the template
  // ═══════════════════════════════════════════════════════════════════════════
  const finalY = (doc as any).lastAutoTable?.finalY || y + 20;

  // Left: Guarantee text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...C.green);
  doc.text("No-Gamble Guarantee Included:", 16, finalY + 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.bodyText);
  const guaranteeText = "If the 48-hour staging demo link is not delivered on time, 100% of the deposit + 100% of unused API credits will be refunded immediately.";
  const gLines = doc.splitTextToSize(guaranteeText, 80);
  gLines.forEach((line: string, i: number) => {
    doc.text(line, 16, finalY + 16 + i * 4);
  });

  // Right: Totals box — matches template exactly
  const totBoxX = 114;
  const totBoxY = finalY + 4;
  doc.setFillColor(...C.lightGray);
  doc.setDrawColor(...C.midGray);
  doc.roundedRect(totBoxX, totBoxY, 80, 38, 2, 2, "FD");

  let ty = totBoxY + 8;
  const addTotRow = (label: string, value: string, opts?: { bold?: boolean; orange?: boolean; divider?: boolean; big?: boolean }) => {
    if (opts?.divider) {
      doc.setDrawColor(...C.midGray);
      doc.setLineWidth(0.2);
      doc.line(totBoxX + 4, ty - 2, totBoxX + 76, ty - 2);
    }
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    doc.setFontSize(opts?.big ? 10 : 8);
    doc.setTextColor(...(opts?.orange ? C.orange : opts?.bold ? C.darkText : C.bodyText));
    doc.text(label, totBoxX + 6, ty);
    doc.text(value, totBoxX + 74, ty, { align: "right" });
    ty += opts?.big ? 8 : 6;
  };

  addTotRow("Subtotal:", fmtCur(subtotal, cur));
  addTotRow(`Kick-off Deposit (${invoice.depositPercent ?? 50}%):`, fmtCur(deposit, cur), { bold: true, orange: true, divider: true });
  addTotRow(`Final Balance (${100 - (invoice.depositPercent ?? 50)}%):`, fmtCur(balance, cur));
  addTotRow("Due Now:", fmtCur(deposit, cur), { bold: true, big: true, divider: true });

  y = finalY + 50;

  // ═══════════════════════════════════════════════════════════════════════════
  // PAYMENT OPTIONS — dark navy card like the template
  // ═══════════════════════════════════════════════════════════════════════════
  if (y > 220) { doc.addPage(); y = 20; }
  doc.setFillColor(...C.navy);
  doc.roundedRect(16, y, 178, 32, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...C.orange);
  doc.text("PAYMENT OPTIONS", 22, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(203, 213, 225);
  doc.text("Payable via PayPal or Direct EFT (Bank Transfer).", 22, y + 14);

  // PayPal box
  doc.setFillColor(30, 41, 59);
  doc.setDrawColor(51, 65, 85);
  doc.roundedRect(22, y + 18, 80, 12, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...C.white);
  doc.text("PayPal", 26, y + 24);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(52, 211, 153);
  doc.text(SITE_CONFIG.paypalMeUrl.replace("https://www.paypal.com/paypalme/", "paypal.me/"), 26, y + 28);

  // EFT box
  doc.setFillColor(30, 41, 59);
  doc.setDrawColor(51, 65, 85);
  doc.roundedRect(108, y + 18, 80, 12, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...C.white);
  doc.text("Direct EFT (Bank Transfer)", 112, y + 24);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(203, 213, 225);
  doc.text(`WhatsApp: ${SITE_CONFIG.whatsappFormatted}`, 112, y + 28);

  y += 40;

  // ═══════════════════════════════════════════════════════════════════════════
  // NOTES (if any)
  // ═══════════════════════════════════════════════════════════════════════════
  if (invoice.notes) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFillColor(...C.orange);
    doc.rect(16, y - 1, 2, 10, "F");
    doc.setFillColor(255, 247, 237);
    doc.rect(18, y - 1, 176, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...C.orange);
    doc.text("NOTE", 22, y + 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.bodyText);
    doc.text(invoice.notes, 22, y + 7);
    y += 16;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LEGAL TERMS — matches template
  // ═══════════════════════════════════════════════════════════════════════════
  if (y > 230) { doc.addPage(); y = 20; }
  doc.setFillColor(...C.lightGray);
  doc.setDrawColor(...C.midGray);
  doc.roundedRect(16, y, 178, 30, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...C.darkText);
  doc.text("LEGAL TERMS & CONDITIONS OF PAYMENT", 22, y + 6);
  doc.setDrawColor(...C.midGray);
  doc.setLineWidth(0.2);
  doc.line(22, y + 8, 188, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(...C.bodyText);
  doc.text('"PAY & AGREE": Payment of the deposit invoice constitutes full legal acceptance of our Terms of Service, Privacy Policy, POPIA Compliance Policy, and the No-Gamble Guarantee.', 22, y + 13);
  doc.text("• Source code released only upon receipt of final payment balance.", 22, y + 18);
  doc.text("• Staging environments contain minified code to protect intellectual property.", 22, y + 22);
  doc.text("• All confidential Client datasets permanently destroyed within 7 calendar days of handover (exceeds POPIA Section 14).", 22, y + 26);

  // ═══════════════════════════════════════════════════════════════════════════
  // PROPOSAL FIELDS (quotes only)
  // ═══════════════════════════════════════════════════════════════════════════
  if (isQuote) {
    y += 38;
    const proposalFields = [
      invoice.proposalSummary && { title: "Project Understanding", text: invoice.proposalSummary },
      invoice.proposalSolution && { title: "Proposed Solution", text: invoice.proposalSolution },
      invoice.proposalTimeline && { title: "Timeline", text: invoice.proposalTimeline },
      invoice.proposalGuarantee && { title: "Guarantee", text: invoice.proposalGuarantee },
      invoice.proposalNextSteps && { title: "Next Steps", text: invoice.proposalNextSteps },
    ].filter(Boolean) as { title: string; text: string }[];

    proposalFields.forEach(({ title, text }) => {
      if (y > 250) { doc.addPage(); y = 20; }
      y = sectionTitle(doc, title, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...C.bodyText);
      const lines = doc.splitTextToSize(text, 174);
      lines.forEach((line: string) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(line, 16, y);
        y += 4;
      });
      y += 4;
    });

    if (invoice.proposalDeliverables?.length) {
      if (y > 250) { doc.addPage(); y = 20; }
      y = sectionTitle(doc, "Deliverables", y);
      invoice.proposalDeliverables.forEach((d) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...C.darkText);
        doc.text(`✓  ${d}`, 20, y);
        y += 5;
      });
    }
  }

  drawFooter(doc);
  doc.save(filename || `${invoice.invoiceNumber}.pdf`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// DECLARATION PDF
// ═══════════════════════════════════════════════════════════════════════════════

export function downloadDeclarationPDF(inv: Invoice, declaration: InvoiceDeclaration, filename?: string) {
  const invoice = sanitize(inv);
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // ── Header ──
  drawHeader(doc,
    [SITE_CONFIG.tradingName, `by ${SITE_CONFIG.developerName}`, SITE_CONFIG.email],
    ["DECLARATION", invoice.invoiceNumber, fmtDate(new Date().toISOString())],
  );

  // ── Title ──
  let y = 52;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...C.darkText);
  doc.text("Declaration of Agreement & Consent", 105, y, { align: "center" });
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.muted);
  doc.text(`${invoice.documentType} ${invoice.invoiceNumber}  •  ${invoice.clientName}`, 105, y, { align: "center" });
  y += 12;

  // ── Declared by ──
  drawInfoBox(doc, 16, y, 178, 24, "DECLARED BY", [
    declaration.signerName || invoice.clientName,
    invoice.clientCompany || "",
    `Signed: ${fmtDate(declaration.signedAt)}  •  Captured by: ${declaration.signedBy || "admin"}`,
  ]);
  y += 32;

  // ── Clauses ──
  y = sectionTitle(doc, "Terms & Acknowledgement", y);

  const clauses = [
    `I, the undersigned, hereby acknowledge and agree to the terms set out in ${invoice.documentType} ${invoice.invoiceNumber} issued by ${SITE_CONFIG.developerName} (${SITE_CONFIG.tradingName}).`,
    `I confirm that I have reviewed the scope of work, deliverables, timeline, and payment terms outlined in the document. I understand that the deposit of ${invoice.depositPercent ?? 50}% is required before work commences, and the balance is due upon final approval and source-code handover.`,
    `I further acknowledge that confidential data provided for this project will be processed strictly in line with the Protection of Personal Information Act (Act 4 of 2013), and that all confidential client data will be permanently destroyed within 7 calendar days of handover — a voluntary commitment that exceeds the statutory duty under Section 14 of POPIA. A Data Destruction Certificate is available on written request.`,
    `I understand that any dispute arising from this engagement shall be governed by the laws of the Republic of South Africa and subject to the jurisdiction of the courts of South Africa.`,
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.bodyText);
  clauses.forEach((c) => {
    const lines = doc.splitTextToSize(c, 174);
    lines.forEach((line: string) => {
      if (y > 255) { doc.addPage(); y = 20; }
      doc.text(line, 16, y);
      y += 4;
    });
    y += 4;
  });

  // ── Signature ──
  y += 6;
  y = sectionTitle(doc, "Signature", y);

  if (declaration.signatureDataUrl && declaration.signatureDataUrl.startsWith("data:image/")) {
    try {
      doc.addImage(declaration.signatureDataUrl, "PNG", 16, y, 60, 20);
      y += 26;
    } catch {
      y += 20;
    }
  } else {
    doc.setDrawColor(...C.darkText);
    doc.setLineWidth(0.3);
    doc.line(16, y + 16, 90, y + 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.muted);
    doc.text("Signature of authorised representative", 16, y + 20);
    y += 26;
  }

  // Date + witness
  doc.setDrawColor(...C.darkText);
  doc.setLineWidth(0.3);
  doc.line(16, y + 4, 90, y + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  doc.text("Date", 16, y + 8);

  doc.line(110, y + 4, 184, y + 4);
  doc.text("Witness (optional)", 110, y + 8);

  drawFooter(doc);
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
  const isQuote = invoice.documentType === "Quote";
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // ── Header ──
  drawHeader(doc,
    [SITE_CONFIG.tradingName, `by ${SITE_CONFIG.developerName}`, SITE_CONFIG.email, `WhatsApp: ${SITE_CONFIG.whatsappFormatted}`],
    ["COVER LETTER", invoice.invoiceNumber, fmtDate(new Date().toISOString())],
  );

  let y = 52;

  // ── To box ──
  drawInfoBox(doc, 16, y, 90, 24, "TO", [
    invoice.clientName,
    invoice.clientCompany || "",
    [invoice.clientEmail, invoice.clientPhone].filter(Boolean).join("  •  "),
  ].filter(Boolean));

  // ── Financial summary box ──
  drawInfoBox(doc, 112, y, 82, 24, "FINANCIAL SUMMARY", [
    `Total: ${fmtCur(total, cur)}`,
    `Deposit (${invoice.depositPercent ?? 50}%): ${fmtCur(deposit, cur)}`,
    `Balance: ${fmtCur(balance, cur)}`,
  ]);
  y += 32;

  // ── Body ──
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...C.darkText);
  doc.text(`Dear ${firstName},`, 16, y);
  y += 8;

  doc.setTextColor(...C.bodyText);
  const greeting = `Thank you for considering ${SITE_CONFIG.tradingName} for your project. Please find your ${isQuote ? "proposal / quotation" : "invoice"} ${invoice.invoiceNumber} attached${isQuote ? " — prepared as a detailed proposal so you can evaluate exactly what is included" : ""}.`;
  const gLines = doc.splitTextToSize(greeting, 174);
  gLines.forEach((line: string) => { doc.text(line, 16, y); y += 5; });
  y += 3;

  if (isQuote && invoice.proposalSummary) {
    doc.setFillColor(...C.orange);
    doc.rect(16, y - 1, 2, 12, "F");
    doc.setFillColor(255, 247, 237);
    doc.rect(18, y - 1, 176, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...C.orange);
    doc.text("PROJECT UNDERSTANDING", 22, y + 3);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...C.bodyText);
    doc.text(invoice.proposalSummary, 22, y + 8);
    y += 16;
  }

  // Terms
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.bodyText);
  const terms = isQuote
    ? "This proposal includes a 48-hour staging demo — you will receive a live, clickable link to test the build before any further commitment. If the demo is not delivered within 48 hours of deposit confirmation, you receive a 100% refund of the deposit plus unused API credits."
    : "Payment is due by the date shown on the invoice. The deposit secures your 48-hour staging window; the balance is due on final approval and source-code handover.";
  const tLines = doc.splitTextToSize(terms, 174);
  tLines.forEach((line: string) => { doc.text(line, 16, y); y += 5; });
  y += 3;

  if (isQuote && invoice.proposalNextSteps) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...C.darkText);
    doc.text("Next steps: ", 16, y);
    const nsW = doc.getTextWidth("Next steps: ");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.bodyText);
    doc.text(invoice.proposalNextSteps, 16 + nsW, y);
    y += 10;
  }

  // ── Sign off ──
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.bodyText);
  doc.text("Kind regards,", 16, y);
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.darkText);
  doc.text(SITE_CONFIG.developerName, 16, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.orange);
  doc.text(SITE_CONFIG.tradingName, 16, y);
  y += 5;
  doc.setFontSize(7);
  doc.setTextColor(...C.muted);
  doc.text(`${SITE_CONFIG.email}  •  WhatsApp: ${SITE_CONFIG.whatsappFormatted}`, 16, y);

  drawFooter(doc);
  doc.save(filename || `${invoice.invoiceNumber}-cover-letter.pdf`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MONTHLY STATEMENT PDF
// ═══════════════════════════════════════════════════════════════════════════════

export interface StatementData {
  monthLabel: string;
  incomeZAR: number;
  incomeUSD: number;
  expensesZAR: number;
  expensesUSD: number;
  profitZAR: number;
  profitUSD: number;
  monthInvoices: { invoiceNumber: string; amount: number; currency: "ZAR" | "USD" }[];
  monthExpenses: { description: string; category: string; amount: number; currency: "ZAR" | "USD" }[];
}

export function downloadMonthlyStatementPDF(data: StatementData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  drawHeader(doc,
    [SITE_CONFIG.tradingName, `by ${SITE_CONFIG.developerName}`, SITE_CONFIG.email],
    ["MONTHLY STATEMENT", data.monthLabel, fmtDate(new Date().toISOString())],
  );

  // ── Summary cards ──
  let y = 50;
  const cards = [
    { label: "Income (ZAR)", value: `R ${data.incomeZAR.toLocaleString()}`, bg: C.greenBg, fg: C.green },
    { label: "Expenses (ZAR)", value: `R ${data.expensesZAR.toLocaleString()}`, bg: [254, 242, 242], fg: C.red },
    { label: "Profit (ZAR)", value: `R ${data.profitZAR.toLocaleString()}`, bg: data.profitZAR >= 0 ? C.greenBg : [254, 242, 242], fg: data.profitZAR >= 0 ? C.green : C.red },
    { label: "Profit (USD)", value: `$ ${data.profitUSD.toLocaleString()}`, bg: data.profitUSD >= 0 ? C.greenBg : [254, 242, 242], fg: data.profitUSD >= 0 ? C.green : C.red },
  ];

  cards.forEach((c, i) => {
    const cx = i % 2 === 0 ? 16 : 112;
    const cy = y + Math.floor(i / 2) * 22;
    doc.setFillColor(c.bg[0], c.bg[1], c.bg[2]);
    doc.setDrawColor(c.fg[0], c.fg[1], c.fg[2]);
    doc.roundedRect(cx, cy, 82, 18, 2, 2, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.muted);
    doc.text(c.label, cx + 6, cy + 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(c.fg[0], c.fg[1], c.fg[2]);
    doc.text(c.value, cx + 6, cy + 14);
  });
  y += 52;

  // ── Invoice table ──
  if (data.monthInvoices.length > 0) {
    y = sectionTitle(doc, "Invoices", y);
    autoTable(doc, {
      startY: y,
      head: [["Invoice #", "Amount"]],
      body: data.monthInvoices.map((inv) => [
        inv.invoiceNumber,
        `${inv.currency === "USD" ? "$" : "R"} ${inv.amount.toLocaleString()}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: C.navy, fontStyle: "bold", fontSize: 7, textColor: C.white, cellPadding: 4 },
      styles: { fontSize: 8, cellPadding: 3, textColor: C.darkText },
      columnStyles: { 1: { halign: "right", fontStyle: "bold" } },
      alternateRowStyles: { fillColor: C.lightGray },
    });
    y = (doc as any).lastAutoTable?.finalY + 8;
  }

  // ── Expense table ──
  if (data.monthExpenses.length > 0) {
    y = sectionTitle(doc, "Expenses", y);
    autoTable(doc, {
      startY: y,
      head: [["Description", "Category", "Amount"]],
      body: data.monthExpenses.map((e) => [
        e.description,
        e.category,
        `${e.currency === "USD" ? "$" : "R"} ${e.amount.toLocaleString()}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: C.navy, fontStyle: "bold", fontSize: 7, textColor: C.white, cellPadding: 4 },
      styles: { fontSize: 8, cellPadding: 3, textColor: C.darkText },
      columnStyles: { 2: { halign: "right", fontStyle: "bold" } },
      alternateRowStyles: { fillColor: C.lightGray },
    });
  }

  drawFooter(doc);
  doc.save(`statement-${data.monthLabel.replace(/\s+/g, "-").toLowerCase()}.pdf`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// YEAR-TO-DATE SUMMARY PDF
// ═══════════════════════════════════════════════════════════════════════════════

export interface YTDData {
  year: string;
  ytdIncomeZAR: number;
  ytdIncomeUSD: number;
  ytdExpensesZAR: number;
  ytdExpensesUSD: number;
  ytdProfitZAR: number;
  ytdProfitUSD: number;
  allInvoices: { invoiceNumber: string; amount: number; currency: "ZAR" | "USD"; date: string }[];
  allExpenses: { description: string; category: string; amount: number; currency: "ZAR" | "USD"; date: string }[];
}

export function downloadYTDSummaryPDF(data: YTDData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  drawHeader(doc,
    [SITE_CONFIG.tradingName, `by ${SITE_CONFIG.developerName}`, SITE_CONFIG.email],
    ["YEAR-TO-DATE SUMMARY", data.year, fmtDate(new Date().toISOString())],
  );

  let y = 50;
  const cards = [
    { label: "YTD Income (ZAR)", value: `R ${data.ytdIncomeZAR.toLocaleString()}`, fg: C.green },
    { label: "YTD Expenses (ZAR)", value: `R ${data.ytdExpensesZAR.toLocaleString()}`, fg: C.red },
    { label: "YTD Profit (ZAR)", value: `R ${data.ytdProfitZAR.toLocaleString()}`, fg: data.ytdProfitZAR >= 0 ? C.green : C.red },
    { label: "YTD Profit (USD)", value: `$ ${data.ytdProfitUSD.toLocaleString()}`, fg: data.ytdProfitUSD >= 0 ? C.green : C.red },
  ];

  cards.forEach((c, i) => {
    const cx = i % 2 === 0 ? 16 : 112;
    const cy = y + Math.floor(i / 2) * 22;
    doc.setFillColor(...C.lightGray);
    doc.setDrawColor(c.fg[0], c.fg[1], c.fg[2]);
    doc.roundedRect(cx, cy, 82, 18, 2, 2, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.muted);
    doc.text(c.label, cx + 6, cy + 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(c.fg[0], c.fg[1], c.fg[2]);
    doc.text(c.value, cx + 6, cy + 14);
  });
  y += 52;

  if (data.allInvoices.length > 0) {
    y = sectionTitle(doc, "All Invoices", y);
    autoTable(doc, {
      startY: y,
      head: [["Date", "Invoice #", "Amount"]],
      body: data.allInvoices.map((inv) => [
        fmtDate(inv.date),
        inv.invoiceNumber,
        `${inv.currency === "USD" ? "$" : "R"} ${inv.amount.toLocaleString()}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: C.navy, fontStyle: "bold", fontSize: 7, textColor: C.white, cellPadding: 4 },
      styles: { fontSize: 8, cellPadding: 3, textColor: C.darkText },
      columnStyles: { 2: { halign: "right", fontStyle: "bold" } },
      alternateRowStyles: { fillColor: C.lightGray },
    });
    y = (doc as any).lastAutoTable?.finalY + 8;
  }

  if (data.allExpenses.length > 0) {
    y = sectionTitle(doc, "All Expenses", y);
    autoTable(doc, {
      startY: y,
      head: [["Date", "Description", "Category", "Amount"]],
      body: data.allExpenses.map((e) => [
        fmtDate(e.date),
        e.description,
        e.category,
        `${e.currency === "USD" ? "$" : "R"} ${e.amount.toLocaleString()}`,
      ]),
      theme: "striped",
      headStyles: { fillColor: C.navy, fontStyle: "bold", fontSize: 7, textColor: C.white, cellPadding: 4 },
      styles: { fontSize: 7, cellPadding: 2.5, textColor: C.darkText },
      columnStyles: { 3: { halign: "right", fontStyle: "bold" } },
      alternateRowStyles: { fillColor: C.lightGray },
    });
  }

  drawFooter(doc);
  doc.save(`ytd-summary-${data.year}.pdf`);
}
