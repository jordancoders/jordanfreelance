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

  // ── Header ──
  drawHeader(doc,
    [SITE_CONFIG.tradingName, `by ${SITE_CONFIG.developerName}`, SITE_CONFIG.email, `WhatsApp: ${SITE_CONFIG.whatsappFormatted}`],
    [isQuote ? "QUOTATION" : "INVOICE", invoice.invoiceNumber, fmtDate(invoice.issueDate)],
  );

  // ── Status badge ──
  const statusY = 46;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  if (invoice.status === "Paid") {
    doc.setFillColor(...C.greenBg);
    doc.setDrawColor(...C.greenBorder);
  } else {
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(253, 224, 71);
  }
  doc.roundedRect(16, statusY - 4, 24, 6, 1, 1, "FD");
  doc.setTextColor(...(invoice.status === "Paid" ? C.green : C.orange));
  doc.text(invoice.status.toUpperCase(), 28, statusY, { align: "center" });

  // ── Client & Payment info boxes ──
  const boxY = 56;
  drawInfoBox(doc, 16, boxY, 90, 30, "BILL TO", [
    invoice.clientName,
    invoice.clientCompany || "",
    [invoice.clientEmail, invoice.clientPhone].filter(Boolean).join("  •  "),
  ].filter(Boolean));

  drawInfoBox(doc, 112, boxY, 82, 30, "PAYMENT DETAILS", [
    `PayPal: ${SITE_CONFIG.paypalMeUrl.replace("https://www.paypal.com/paypalme/", "paypal.me/")}`,
    `Due by: ${fmtDate(invoice.dueDate)}`,
    `Deposit: ${invoice.depositPercent ?? 50}% upfront`,
  ]);

  // ── Items table ──
  let startY = 94;
  startY = sectionTitle(doc, "Items", startY);

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
    theme: "striped",
    headStyles: { fillColor: C.navy, fontStyle: "bold", fontSize: 7, textColor: C.white, cellPadding: 4 },
    styles: { fontSize: 8, cellPadding: 3.5, textColor: C.darkText, lineColor: C.midGray, lineWidth: 0.1 },
    columnStyles: {
      0: { cellWidth: 88 },
      1: { cellWidth: 18, halign: "center" },
      2: { cellWidth: 36, halign: "right" },
      3: { cellWidth: 36, halign: "right", fontStyle: "bold" },
    },
    alternateRowStyles: { fillColor: C.lightGray },
  });

  // ── Totals ──
  const finalY = (doc as any).lastAutoTable?.finalY || startY + 20;
  const txR = 194;

  // Totals box
  doc.setFillColor(...C.lightGray);
  doc.setDrawColor(...C.midGray);
  doc.roundedRect(120, finalY + 4, 74, 36, 2, 2, "FD");

  let ty = finalY + 12;
  const addRow = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 9 : 8);
    doc.setTextColor(...(bold ? C.darkText : C.bodyText));
    doc.text(label, 126, ty);
    doc.text(value, txR - 4, ty, { align: "right" });
    ty += bold ? 8 : 6;
  };

  addRow("Subtotal", fmtCur(subtotal, cur));
  addRow(`Deposit (${invoice.depositPercent ?? 50}%)`, fmtCur(deposit, cur));
  addRow("Balance due", fmtCur(balance, cur));

  // Divider
  doc.setDrawColor(...C.navy);
  doc.setLineWidth(0.4);
  doc.line(126, ty - 1, txR - 4, ty - 1);
  ty += 2;

  addRow("TOTAL", fmtCur(total, cur), true);

  // Orange total highlight
  doc.setFillColor(...C.orange);
  doc.roundedRect(124, ty - 5, 66, 10, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...C.white);
  doc.text(`TOTAL  ${fmtCur(total, cur)}`, 157, ty + 1, { align: "center" });

  // ── Notes ──
  let noteY = finalY + 48;
  if (invoice.notes) {
    if (noteY > 250) { doc.addPage(); noteY = 20; }
    doc.setFillColor(...C.orange);
    doc.rect(16, noteY - 1, 2, 10, "F");
    doc.setFillColor(255, 247, 237);
    doc.rect(18, noteY - 1, 176, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...C.orange);
    doc.text("NOTE", 22, noteY + 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...C.bodyText);
    doc.text(invoice.notes, 22, noteY + 7);
    noteY += 16;
  }

  // ── Proposal fields (quotes only) ──
  if (isQuote) {
    const proposalFields = [
      invoice.proposalSummary && { title: "Project Understanding", text: invoice.proposalSummary },
      invoice.proposalSolution && { title: "Proposed Solution", text: invoice.proposalSolution },
      invoice.proposalTimeline && { title: "Timeline", text: invoice.proposalTimeline },
      invoice.proposalGuarantee && { title: "Guarantee", text: invoice.proposalGuarantee },
      invoice.proposalNextSteps && { title: "Next Steps", text: invoice.proposalNextSteps },
    ].filter(Boolean) as { title: string; text: string }[];

    proposalFields.forEach(({ title, text }) => {
      if (noteY > 250) { doc.addPage(); noteY = 20; }
      noteY = sectionTitle(doc, title, noteY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...C.bodyText);
      const lines = doc.splitTextToSize(text, 174);
      lines.forEach((line: string) => {
        if (noteY > 270) { doc.addPage(); noteY = 20; }
        doc.text(line, 16, noteY);
        noteY += 4;
      });
      noteY += 4;
    });

    // Deliverables
    if (invoice.proposalDeliverables?.length) {
      if (noteY > 250) { doc.addPage(); noteY = 20; }
      noteY = sectionTitle(doc, "Deliverables", noteY);
      invoice.proposalDeliverables.forEach((d) => {
        if (noteY > 270) { doc.addPage(); noteY = 20; }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...C.darkText);
        doc.text(`✓  ${d}`, 20, noteY);
        noteY += 5;
      });
      noteY += 4;
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
