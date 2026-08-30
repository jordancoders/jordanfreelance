"use client";

import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { pdfStyles, fmtCurrency, fmtDate, calcSubtotal, calcDeposit, calcBalance } from "./styles";
import type { Invoice } from "@/lib/types";

interface InvoicePDFProps {
  invoice: Invoice;
  developerName: string;
  tradingName: string;
  email: string;
  whatsappFormatted: string;
  location: string;
  siteUrl: string;
  paypalMeUrl: string;
}

export default function InvoicePDF({
  invoice,
  developerName,
  tradingName,
  email,
  whatsappFormatted,
  location,
  siteUrl,
  paypalMeUrl,
}: InvoicePDFProps) {
  const subtotal = calcSubtotal(invoice.items || []);
  const total = subtotal;
  const deposit = calcDeposit(total, invoice.depositPercent ?? 50);
  const balance = calcBalance(total, deposit);
  const cur = invoice.currency || "ZAR";

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* ── HEADER ── */}
        <View style={pdfStyles.header}>
          <View style={pdfStyles.headerLeft}>
            <Text style={pdfStyles.brandName}>{tradingName}</Text>
            <Text style={pdfStyles.brandSubtext}>by {developerName}</Text>
            <Text style={pdfStyles.headerInfo}>
              {email}{"\n"}
              WhatsApp: {whatsappFormatted} • {location}{"\n"}
              Web: {siteUrl}
            </Text>
          </View>
          <View style={pdfStyles.headerRight}>
            <Text style={pdfStyles.brandName}>{developerName}</Text>
            <Text style={pdfStyles.brandSubtext}>{tradingName}</Text>
            <Text style={[pdfStyles.headerInfo, { marginTop: 4, textAlign: "right" }]}>
              Date: {fmtDate(invoice.issueDate)}{"\n"}
              Ref: {invoice.invoiceNumber}
            </Text>
          </View>
        </View>

        {/* ── DOCUMENT TYPE + STATUS ── */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#0f172a" }}>
            {invoice.documentType === "Quote" ? "Quotation" : "Invoice"} {invoice.invoiceNumber}
          </Text>
          <View style={{ backgroundColor: invoice.status === "Paid" ? "#dcfce7" : "#fef3c7", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 }}>
            <Text style={{ fontSize: 8, fontWeight: "bold", color: invoice.status === "Paid" ? "#166534" : "#92400e", textTransform: "uppercase" }}>
              {invoice.status}
            </Text>
          </View>
        </View>

        {/* ── CLIENT INFO ── */}
        <View style={pdfStyles.clientBox}>
          <Text style={pdfStyles.clientBoxLabel}>Bill To</Text>
          <Text style={pdfStyles.clientBoxName}>{invoice.clientName}</Text>
          {invoice.clientCompany && (
            <Text style={pdfStyles.clientBoxDetail}>{invoice.clientCompany}</Text>
          )}
          {(invoice.clientEmail || invoice.clientPhone) && (
            <Text style={pdfStyles.clientBoxDetail}>
              {[invoice.clientEmail, invoice.clientPhone].filter(Boolean).join(" • ")}
            </Text>
          )}
        </View>

        {/* ── ITEMS TABLE ── */}
        <Text style={pdfStyles.sectionTitle}>Items</Text>
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeader}>
            <Text style={[pdfStyles.tableHeaderText, { flex: 3 }]}>Description</Text>
            <Text style={[pdfStyles.tableHeaderText, { flex: 1, textAlign: "center" }]}>Qty</Text>
            <Text style={[pdfStyles.tableHeaderText, { flex: 1, textAlign: "right" }]}>Rate</Text>
            <Text style={[pdfStyles.tableHeaderText, { flex: 1, textAlign: "right" }]}>Amount</Text>
          </View>
          {(invoice.items || []).map((item, i) => {
            const amount = (item.quantity || 0) * (item.rate || 0);
            return (
              <View key={item.id || i} style={i % 2 === 0 ? pdfStyles.tableRow : pdfStyles.tableRowAlt}>
                <Text style={[pdfStyles.tableCell, { flex: 3 }]}>{item.description}</Text>
                <Text style={[pdfStyles.tableCell, { flex: 1, textAlign: "center" }]}>{item.quantity}</Text>
                <Text style={[pdfStyles.tableCell, { flex: 1, textAlign: "right" }]}>{fmtCurrency(item.rate, cur)}</Text>
                <Text style={[pdfStyles.tableCellBold, { flex: 1, textAlign: "right" }]}>{fmtCurrency(amount, cur)}</Text>
              </View>
            );
          })}
        </View>

        {/* ── TOTALS ── */}
        <View style={pdfStyles.totalsBox}>
          <View style={pdfStyles.totalsRow}>
            <Text style={pdfStyles.totalsLabel}>Subtotal</Text>
            <Text style={pdfStyles.totalsValue}>{fmtCurrency(subtotal, cur)}</Text>
          </View>
          <View style={pdfStyles.totalsRow}>
            <Text style={pdfStyles.totalsLabel}>Deposit ({invoice.depositPercent ?? 50}%)</Text>
            <Text style={pdfStyles.totalsValue}>{fmtCurrency(deposit, cur)}</Text>
          </View>
          <View style={pdfStyles.totalsRow}>
            <Text style={pdfStyles.totalsLabel}>Balance on completion</Text>
            <Text style={pdfStyles.totalsValue}>{fmtCurrency(balance, cur)}</Text>
          </View>
          <View style={pdfStyles.totalsRowBold}>
            <Text style={pdfStyles.totalsLabelBold}>Total</Text>
            <Text style={pdfStyles.totalsValueBold}>{fmtCurrency(total, cur)}</Text>
          </View>
        </View>

        {/* ── PAYMENT DETAILS ── */}
        <View style={pdfStyles.paymentBox}>
          <Text style={pdfStyles.paymentTitle}>Payment Options</Text>
          <Text style={pdfStyles.paymentDetail}>
            PayPal: {paypalMeUrl}{"\n"}
            Direct EFT — bank details available on request.{"\n"}
            Payment due by: {fmtDate(invoice.dueDate)}
          </Text>
        </View>

        {/* ── NOTES ── */}
        {invoice.notes && (
          <View style={pdfStyles.infoBadge}>
            <Text style={pdfStyles.infoBadgeText}>{invoice.notes}</Text>
          </View>
        )}

        {/* ── QUOTE PROPOSAL FIELDS ── */}
        {invoice.documentType === "Quote" && invoice.proposalSummary && (
          <View style={pdfStyles.mt16}>
            <Text style={pdfStyles.sectionTitle}>Project Understanding</Text>
            <Text style={pdfStyles.bodyText}>{invoice.proposalSummary}</Text>
          </View>
        )}

        {invoice.documentType === "Quote" && invoice.proposalSolution && (
          <View style={pdfStyles.mt8}>
            <Text style={pdfStyles.sectionTitle}>Proposed Solution</Text>
            <Text style={pdfStyles.bodyText}>{invoice.proposalSolution}</Text>
          </View>
        )}

        {invoice.documentType === "Quote" && invoice.proposalDeliverables && invoice.proposalDeliverables.length > 0 && (
          <View style={pdfStyles.mt8}>
            <Text style={pdfStyles.sectionTitle}>Deliverables</Text>
            {invoice.proposalDeliverables.map((d, i) => (
              <Text key={i} style={pdfStyles.bodyText}>• {d}</Text>
            ))}
          </View>
        )}

        {invoice.documentType === "Quote" && invoice.proposalTimeline && (
          <View style={pdfStyles.mt8}>
            <Text style={pdfStyles.sectionTitle}>Timeline</Text>
            <Text style={pdfStyles.bodyText}>{invoice.proposalTimeline}</Text>
          </View>
        )}

        {invoice.documentType === "Quote" && invoice.proposalGuarantee && (
          <View style={pdfStyles.mt8}>
            <Text style={pdfStyles.sectionTitle}>Guarantee</Text>
            <Text style={pdfStyles.bodyText}>{invoice.proposalGuarantee}</Text>
          </View>
        )}

        {invoice.documentType === "Quote" && invoice.proposalNextSteps && (
          <View style={pdfStyles.mt8}>
            <Text style={pdfStyles.sectionTitle}>Next Steps</Text>
            <Text style={pdfStyles.bodyText}>{invoice.proposalNextSteps}</Text>
          </View>
        )}

        {/* ── FOOTER ── */}
        <View style={pdfStyles.footer}>
          <Text style={pdfStyles.footerText}>
            {tradingName} • {location} • {siteUrl}{"\n"}
            This document was generated electronically and is valid without signature unless otherwise stated.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
