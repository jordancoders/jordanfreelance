"use client";

import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { pdfStyles, fmtCurrency, fmtDate, calcSubtotal, calcDeposit, calcBalance } from "./styles";
import type { Invoice } from "@/lib/types";

interface CoverLetterPDFProps {
  invoice: Invoice;
  developerName: string;
  tradingName: string;
  email: string;
  whatsappFormatted: string;
  location: string;
  siteUrl: string;
}

export default function CoverLetterPDF({
  invoice,
  developerName,
  tradingName,
  email,
  whatsappFormatted,
  location,
  siteUrl,
}: CoverLetterPDFProps) {
  const subtotal = calcSubtotal(invoice.items || []);
  const total = subtotal;
  const deposit = calcDeposit(total, invoice.depositPercent ?? 50);
  const balance = calcBalance(total, deposit);
  const cur = invoice.currency || "ZAR";
  const firstName = invoice.clientName.split(" ")[0] || invoice.clientName;

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
              Date: {fmtDate(new Date().toISOString())}{"\n"}
              Ref: {invoice.invoiceNumber}
            </Text>
          </View>
        </View>

        {/* ── TO ── */}
        <View style={pdfStyles.clientBox}>
          <Text style={pdfStyles.clientBoxLabel}>To</Text>
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

        {/* ── BODY ── */}
        <View style={pdfStyles.mt16}>
          <Text style={pdfStyles.coverLetterGreeting}>Dear {firstName},</Text>

          <Text style={pdfStyles.coverLetterBody}>
            Thank you for considering {tradingName} for your project. Please find your{" "}
            {invoice.documentType === "Quote" ? "proposal / quotation" : "invoice"} {invoice.invoiceNumber} attached
            {invoice.documentType === "Quote" ? " — prepared as a detailed proposal so you can evaluate exactly what is included" : ""}.
          </Text>

          {invoice.documentType === "Quote" && invoice.proposalSummary && (
            <View style={pdfStyles.infoBadge}>
              <Text style={pdfStyles.infoBadgeText}>
                <Text style={{ fontWeight: "bold" }}>Project understanding: </Text>
                {invoice.proposalSummary}
              </Text>
            </View>
          )}

          {/* ── FINANCIAL SUMMARY ── */}
          <View style={[pdfStyles.clientBox, { backgroundColor: "#f8fafc" }]}>
            <Text style={pdfStyles.clientBoxLabel}>Financial Summary</Text>
            <Text style={pdfStyles.bodyTextBold}>
              Total value: {fmtCurrency(total, cur)}
            </Text>
            <Text style={pdfStyles.bodyText}>
              Kick-off deposit ({invoice.depositPercent ?? 50}%): {fmtCurrency(deposit, cur)}
            </Text>
            <Text style={pdfStyles.bodyText}>
              Balance on completion: {fmtCurrency(balance, cur)}
            </Text>
          </View>

          <Text style={pdfStyles.coverLetterBody}>
            {invoice.documentType === "Quote"
              ? "This proposal includes a 48-hour staging demo — you will receive a live, clickable link to test the build before any further commitment. If the demo is not delivered within 48 hours of deposit confirmation, you receive a 100% refund of the deposit plus unused API credits (see Guarantee policy for qualifying criteria)."
              : "Payment is due by the date shown on the invoice. The deposit secures your 48-hour staging window; the balance is due on final approval and source-code handover."}
          </Text>

          {invoice.documentType === "Quote" && invoice.proposalNextSteps && (
            <Text style={pdfStyles.coverLetterBody}>
              <Text style={{ fontWeight: "bold" }}>Next steps: </Text>
              {invoice.proposalNextSteps}
            </Text>
          )}

          {/* ── SIGN OFF ── */}
          <View style={pdfStyles.coverLetterSignoff}>
            <Text style={pdfStyles.bodyText}>Kind regards,</Text>
            <Text style={pdfStyles.bodyTextBold}>{developerName}</Text>
            <Text style={pdfStyles.bodyText}>{tradingName}</Text>
            <Text style={[pdfStyles.bodyText, { color: "#64748b", fontSize: 9 }]}>
              {email} • WhatsApp: {whatsappFormatted}
            </Text>
          </View>
        </View>

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
