import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#0f172a",
    lineHeight: 1.5,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: "#0f172a",
    paddingBottom: 12,
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
    flexShrink: 1,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  brandSubtext: {
    fontSize: 8,
    color: "#64748b",
    fontFamily: "Helvetica",
  },
  headerInfo: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 4,
    lineHeight: 1.4,
  },

  // Client info box
  clientBox: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  clientBoxLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  clientBoxName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
  },
  clientBoxDetail: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 1,
  },

  // Section titles
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },

  // Table
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableRowAlt: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  tableCell: {
    fontSize: 9,
    color: "#334155",
  },
  tableCellBold: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0f172a",
  },

  // Totals
  totalsBox: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginBottom: 4,
  },
  totalsLabel: {
    fontSize: 9,
    color: "#64748b",
    width: 100,
    textAlign: "right",
  },
  totalsValue: {
    fontSize: 9,
    color: "#0f172a",
    width: 80,
    textAlign: "right",
  },
  totalsRowBold: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 2,
    borderTopColor: "#0f172a",
  },
  totalsLabelBold: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    width: 100,
    textAlign: "right",
  },
  totalsValueBold: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    width: 80,
    textAlign: "right",
  },

  // Body text
  bodyText: {
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.6,
    marginBottom: 8,
  },
  bodyTextBold: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
    lineHeight: 1.6,
    marginBottom: 8,
  },

  // Payment section
  paymentBox: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 6,
  },
  paymentDetail: {
    fontSize: 9,
    color: "#166534",
    lineHeight: 1.6,
  },

  // Footer
  footer: {
    marginTop: "auto",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 1.4,
  },

  // Declaration specific
  declarationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
    textAlign: "center",
  },
  declarationSubtitle: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 20,
  },
  declarationClause: {
    fontSize: 9,
    color: "#334155",
    lineHeight: 1.7,
    marginBottom: 12,
  },
  signatureLine: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#0f172a",
    paddingTop: 6,
    width: 200,
  },
  signatureLabel: {
    fontSize: 8,
    color: "#64748b",
  },

  // Cover letter specific
  coverLetterDate: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 12,
  },
  coverLetterGreeting: {
    fontSize: 11,
    color: "#0f172a",
    marginBottom: 12,
  },
  coverLetterBody: {
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.7,
    marginBottom: 8,
  },
  coverLetterSignoff: {
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.7,
    marginTop: 16,
  },

  // Info badges
  infoBadge: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderLeftWidth: 3,
    borderLeftColor: "#f97316",
    padding: 8,
    marginBottom: 12,
  },
  infoBadgeText: {
    fontSize: 9,
    color: "#9a3412",
    lineHeight: 1.5,
  },

  // Utility
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
  textRight: { textAlign: "right" },
  textCenter: { textAlign: "center" },
  fontMono: { fontFamily: "Courier" },
});

/** Format currency based on invoice currency */
export function fmtCurrency(amount: number, currency: "ZAR" | "USD" = "ZAR"): string {
  const symbol = currency === "ZAR" ? "R" : "$";
  return `${symbol} ${amount.toLocaleString("en-ZA")}`;
}

/** Format a date string nicely */
export function fmtDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Calculate invoice subtotal from items */
export function calcSubtotal(items: { quantity: number; rate: number }[]): number {
  return items.reduce((sum, item) => sum + (item.quantity || 0) * (item.rate || 0), 0);
}

/** Calculate deposit amount */
export function calcDeposit(total: number, percent: number): number {
  return Math.round(total * (percent / 100));
}

/** Calculate balance after deposit */
export function calcBalance(total: number, deposit: number): number {
  return Math.max(0, total - deposit);
}
