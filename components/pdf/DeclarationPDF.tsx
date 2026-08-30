import React from "react";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { pdfStyles, fmtDate } from "./styles";
import type { Invoice, InvoiceDeclaration } from "@/lib/types";

interface DeclarationPDFProps {
  invoice: Invoice;
  declaration: InvoiceDeclaration;
  developerName: string;
  tradingName: string;
  email: string;
  location: string;
  siteUrl: string;
}

export default function DeclarationPDF({
  invoice,
  declaration,
  developerName,
  tradingName,
  email,
  location,
  siteUrl,
}: DeclarationPDFProps) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* ── HEADER ── */}
        <View style={pdfStyles.header}>
          <View style={pdfStyles.headerLeft}>
            <Text style={pdfStyles.brandName}>{tradingName}</Text>
            <Text style={pdfStyles.brandSubtext}>by {developerName}</Text>
            <Text style={pdfStyles.headerInfo}>
              {email} • {location}{"\n"}
              {siteUrl}
            </Text>
          </View>
          <View style={pdfStyles.headerRight}>
            <View style={{ backgroundColor: "#dcfce7", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 }}>
              <Text style={{ fontSize: 7, fontWeight: "bold", color: "#166534", textTransform: "uppercase" }}>
                Official Record
              </Text>
            </View>
            <Text style={[pdfStyles.headerInfo, { textAlign: "right" }]}>
              Generated {fmtDate(new Date().toISOString())}{"\n"}
              Ref: {invoice.invoiceNumber}
            </Text>
          </View>
        </View>

        {/* ── TITLE ── */}
        <Text style={pdfStyles.declarationTitle}>Declaration of Agreement &amp; Consent</Text>
        <Text style={pdfStyles.declarationSubtitle}>
          {invoice.documentType} {invoice.invoiceNumber} • {invoice.clientName}
        </Text>

        {/* ── DECLARED BY ── */}
        <View style={pdfStyles.clientBox}>
          <Text style={pdfStyles.clientBoxLabel}>Declared By</Text>
          <Text style={pdfStyles.clientBoxName}>{declaration.signerName || invoice.clientName}</Text>
          <Text style={pdfStyles.clientBoxDetail}>
            {invoice.clientCompany || ""} {invoice.clientEmail ? `• ${invoice.clientEmail}` : ""}
          </Text>
          <Text style={pdfStyles.clientBoxDetail}>
            Signed: {fmtDate(declaration.signedAt)} • Captured by: {declaration.signedBy || "admin"}
          </Text>
        </View>

        {/* ── CLAUSES ── */}
        <View style={pdfStyles.mt16}>
          <Text style={pdfStyles.declarationClause}>
            I, the undersigned, hereby acknowledge and agree to the terms set out in {invoice.documentType} {invoice.invoiceNumber} issued by {developerName} ({tradingName}).
          </Text>

          <Text style={pdfStyles.declarationClause}>
            I confirm that I have reviewed the scope of work, deliverables, timeline, and payment terms outlined in the document. I understand that the deposit of {(invoice.depositPercent ?? 50)}% is required before work commences, and the balance is due upon final approval and source-code handover.
          </Text>

          <Text style={pdfStyles.declarationClause}>
            I further acknowledge that confidential data provided for this project will be processed strictly in line with the Protection of Personal Information Act (Act 4 of 2013), and that all confidential client data will be permanently destroyed within 7 calendar days of handover — a voluntary commitment that exceeds the statutory duty under Section 14 of POPIA. A Data Destruction Certificate is available on written request.
          </Text>

          <Text style={pdfStyles.declarationClause}>
            I understand that any dispute arising from this engagement shall be governed by the laws of the Republic of South Africa and subject to the jurisdiction of the courts of South Africa.
          </Text>
        </View>

        {/* ── SIGNATURE ── */}
        <View style={pdfStyles.mt16}>
          <Text style={pdfStyles.sectionTitle}>Signature</Text>

          {declaration.signatureDataUrl && declaration.signatureDataUrl.startsWith("data:image/") ? (
            <View style={{ marginTop: 10 }}>
              <Image
                src={declaration.signatureDataUrl}
                style={{ width: 180, height: 60, objectFit: "contain" }}
              />
            </View>
          ) : declaration.signatureDataUrl && /^https?:\/\//.test(declaration.signatureDataUrl) ? (
            <View style={{ marginTop: 10 }}>
              <Image src={declaration.signatureDataUrl} style={{ width: 180, height: 60, objectFit: "contain" }} />
            </View>
          ) : (
            <View style={pdfStyles.signatureLine}>
              <Text style={pdfStyles.signatureLabel}>Signature of authorised representative</Text>
            </View>
          )}

          <View style={{ flexDirection: "row", gap: 40, marginTop: 20 }}>
            <View style={{ flex: 1 }}>
              <View style={pdfStyles.signatureLine}>
                <Text style={pdfStyles.signatureLabel}>Date</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={pdfStyles.signatureLine}>
                <Text style={pdfStyles.signatureLabel}>Witness (optional)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── FOOTER ── */}
        <View style={pdfStyles.footer}>
          <Text style={pdfStyles.footerText}>
            {tradingName} • {location} • {siteUrl}{"\n"}
            This declaration constitutes a legally binding agreement under South African law.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
