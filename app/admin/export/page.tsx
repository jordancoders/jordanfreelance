"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Printer, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import SignaturePad from "@/components/SignaturePad";
import { SITE_CONFIG } from "@/data/portfolioData";
import { getInvoice } from "@/lib/db";
import type { Invoice } from "@/lib/types";

function ExportContent() {
  const searchParams = useSearchParams();
  const docParam = searchParams?.get("doc") || "";

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [signature, setSignature] = useState("");
  const [signerName, setSignerName] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docParam) { setLoading(false); return; }
    setLoading(true);
    getInvoice(docParam)
      .then((inv) => {
        if (inv) {
          setInvoice(inv);
          setSignature(inv.declaration?.signatureDataUrl || "");
          setSignerName(inv.declaration?.signerName || "");
          setAcknowledged(inv.declaration?.acknowledged || false);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [docParam]);

  const persistDeclaration = async (sig: string, name: string, ack: boolean) => {
    if (!invoice) return;
    try {
      const { updateInvoice } = await import("@/app/actions/invoices");
      await updateInvoice(invoice.id, {
        declaration: { signatureDataUrl: sig, signerName: name, acknowledged: ack, signedAt: new Date().toISOString() },
      });
    } catch {
      // Ignore — the bundle still prints fine.
    }
  };

  const symbol = invoice?.currency === "USD" ? "$" : "R";
  const subtotal = invoice
    ? invoice.items.reduce((sum, it) => sum + it.quantity * it.rate, 0)
    : 0;
  const depositPct = invoice?.depositPercent ?? 50;
  const deposit = (subtotal * depositPct) / 100;
  const balance = subtotal - deposit;

  const today = new Date().toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 print:bg-white text-slate-900 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading document…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white text-slate-900">
      {/* Toolbar — hidden when printing */}
      <div className="print:hidden bg-slate-900 text-white py-4">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Link>
            <span className="text-sm font-black">{SITE_CONFIG.brandLine}</span>
          </div>
          <div className="flex items-center gap-3">
            {!invoice && (
              <span className="text-xs text-amber-400 font-semibold">
                No document selected — showing the legal bundle only.
              </span>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              Export Full PDF Bundle
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 print:py-0 print:px-0">
        {/* Signature & declaration panel */}
        <div className="print:hidden p-6 rounded-3xl bg-white border-2 border-dashed border-slate-300 shadow-xl space-y-4 mb-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-extrabold">Signed Declaration — required before issuing</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Capture the Client&apos;s signature and name below. The signed declaration is printed on the first
            page of the bundle, and the document(s) that follow are the official contract records. For EU/UK
            clients, the Data Processing Agreement is included automatically.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SignaturePad
              value={signature}
              onChange={(dataUrl) => {
                setSignature(dataUrl);
                void persistDeclaration(dataUrl, signerName, acknowledged);
              }}
              label="Client signature"
            />
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Signer Full Name
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => {
                    setSignerName(e.target.value);
                    void persistDeclaration(signature, e.target.value, acknowledged);
                  }}
                  placeholder="e.g. Thabo Nkosi"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Date Signed
                </label>
                <div className="p-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50">{today}</div>
              </div>
              <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => {
                    setAcknowledged(e.target.checked);
                    void persistDeclaration(signature, signerName, e.target.checked);
                  }}
                  className="mt-0.5 w-4 h-4 accent-orange-500"
                />
                <span>
                  I have read and accept the Terms of Service, Privacy Policy, POPIA Compliance Policy,
                  the No-Gamble Guarantee, and (where applicable) the Data Processing Agreement.
                </span>
              </label>
            </div>
          </div>
          {(!acknowledged || !signature) && (
            <p className="text-[11px] text-amber-600 font-semibold">
              Complete the acknowledgement and signature before exporting — the PDF records them on the declaration.
            </p>
          )}
        </div>

        {/* ==== THE PRINTABLE DOCUMENT ==== */}
        <div className="bg-white shadow-2xl border border-slate-300 print:border-none print:shadow-none">
          {/* Page 1 — Signed declaration */}
          <div className="p-10 print:p-8 border-b border-slate-300">
            <div className="flex items-center gap-2 text-emerald-700 mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Signed Declaration</span>
            </div>
            <h1 className="text-2xl font-black mb-4">Declaration of Agreement &amp; Consent</h1>
            <p className="text-sm leading-relaxed text-slate-800 mb-6">
              I, <strong className="border-b-2 border-slate-700 px-1">{signerName || "_______________________________"}</strong>,
              being the authorised representative of{" "}
              <strong className="border-b-2 border-slate-700 px-1">
                {invoice?.clientCompany || invoice?.clientName || "_______________________________"}
              </strong>
              , hereby declare that the information provided in the accompanying document(s) is true and correct, and that I
              have read, understood, and agree to be bound by the {SITE_CONFIG.brandLine} Terms of Service, Privacy Policy,
              POPIA Compliance Policy, the No-Gamble Guarantee, and — where applicable — the Data Processing Agreement.
            </p>
            <p className="text-sm leading-relaxed text-slate-800 mb-8">
              I further acknowledge that confidential data provided for this project will be processed in line with POPIA
              (Act 4 of 2013), and that all confidential client data will be permanently destroyed within 7 calendar days of
              handover — a voluntary commitment that exceeds the statutory duty under Section 14 of POPIA.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-10">
              <div>
                {signature ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={signature} alt="Signature" className="h-24 w-auto object-contain border-b-2 border-slate-700" />
                ) : (
                  <div className="h-24 border-b-2 border-slate-700" />
                )}
                <p className="text-[11px] text-slate-500 mt-1">Signature</p>
              </div>
              <div>
                <div className="h-24 border-b-2 border-slate-700"></div>
                <p className="text-[11px] text-slate-500 mt-1">Date: {today}</p>
              </div>
              <div>
                <div className="h-24 border-b-2 border-slate-700"></div>
                <p className="text-[11px] text-slate-500 mt-1">Witness (optional)</p>
              </div>
            </div>
            <p className="mt-10 text-[10px] text-slate-400 border-t border-slate-200 pt-3">
              Generated from {SITE_CONFIG.siteUrl} on {today}. This declaration forms part of the contract record.
            </p>
          </div>

          {/* Page 2+ — Invoice / Quote (if selected) */}
          {invoice ? (
            <div className="p-10 print:p-8 border-b border-slate-300">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-900 pb-6">
                <div>
                  <div className="text-2xl font-black">
                    {SITE_CONFIG.tradingName} <span className="text-orange-600 font-normal">by {SITE_CONFIG.developerName}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 font-mono">
                    Email: {SITE_CONFIG.email} • WhatsApp: {SITE_CONFIG.whatsappFormatted} • Location: South Africa
                  </div>
                </div>
                <div className="text-right font-mono text-xs bg-slate-50 border border-slate-300 p-4 rounded-xl">
                  <div className="text-sm font-bold text-orange-600 uppercase tracking-widest font-sans">{invoice.documentType}</div>
                  <div className="font-bold text-slate-900 text-sm mt-1"># {invoice.invoiceNumber}</div>
                  <div>Issue: {invoice.issueDate}</div>
                  <div>Due: {invoice.dueDate}</div>
                  <div className="mt-1">Status: <strong>{invoice.status}</strong></div>
                </div>
              </div>

              <div className="py-6">
                <span className="text-slate-500 uppercase font-bold text-xs block mb-1">Billed To:</span>
                <strong className="text-slate-900 text-base block">{invoice.clientName}</strong>
                {invoice.clientCompany && <div className="text-sm text-slate-600">{invoice.clientCompany}</div>}
                {invoice.clientEmail && <div className="text-sm text-slate-600">{invoice.clientEmail}</div>}
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 bg-slate-100 font-bold">
                    <th className="p-3">Deliverable</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Rate</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoice.items.map((it) => (
                    <tr key={it.id}>
                      <td className="p-3 font-semibold">{it.description}</td>
                      <td className="p-3 text-center">{it.quantity}</td>
                      <td className="p-3 text-right">{symbol} {it.rate.toLocaleString()}</td>
                      <td className="p-3 text-right font-bold">{symbol} {(it.quantity * it.rate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 ml-auto w-full sm:w-72 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal (Total):</span>
                  <span>{symbol} {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-orange-600 border-t border-slate-200 pt-1">
                  <span>Kick-off Deposit ({depositPct}%):</span>
                  <span>{symbol} {deposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Final Balance ({100 - depositPct}%):</span>
                  <span>{symbol} {balance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 text-base border-t-2 border-slate-900 pt-1">
                  <span>Due Now:</span>
                  <span>{symbol} {deposit.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 text-xs text-slate-600 border-t border-slate-300 pt-3">
                <strong className="text-slate-900 block mb-1">Payment:</strong>
                Payable via PayPal ({SITE_CONFIG.paypalEmail}) or Direct EFT (bank transfer) — details provided on confirmation.
                {invoice.notes && (
                  <>
                    <strong className="text-slate-900 block mt-3 mb-1">Notes:</strong>
                    {invoice.notes}
                  </>
                )}
              </div>
            </div>
          ) : null}

          {/* Legal summaries — pages after the invoice */}
          <div className="p-10 print:p-8 border-b border-slate-300">
            <h2 className="text-xl font-black mb-4">Terms of Service — Key Points</h2>
            <ul className="text-xs text-slate-700 space-y-2 leading-relaxed list-disc pl-5">
              <li>Kick-off deposit agreed per project and stated in the quote; the balance is due on final approval and source-code handover.</li>
              <li>No-Gamble Guarantee: if the 48-hour staging demo is not delivered, 100% of the deposit + 100% of unused API credits are refunded.</li>
              <li>Full source code ownership transfers to the Client upon final payment.</li>
              <li>14-day critical bug-fix warranty from final delivery.</li>
              <li>Quotes are valid for 14 days from issue date.</li>
            </ul>
            <p className="text-[10px] text-slate-400 mt-3">Full terms: {SITE_CONFIG.siteUrl}/terms</p>
          </div>

          <div className="p-10 print:p-8 border-b border-slate-300">
            <h2 className="text-xl font-black mb-4">Privacy Policy — Key Points</h2>
            <ul className="text-xs text-slate-700 space-y-2 leading-relaxed list-disc pl-5">
              <li>Only the minimum personal information required for project delivery is collected and processed.</li>
              <li>Information is used strictly for communication, delivery, payments, and legal record-keeping — never sold.</li>
              <li>Reasonable security measures are applied (encryption at rest and in transit, least-privilege access).</li>
              <li>Data subjects may request access, correction, deletion, or object to processing at any time.</li>
              <li>Cross-border transfers follow the lawful grounds in Section 72 of POPIA and, for EU/UK data, GDPR Articles 44–49.</li>
            </ul>
            <p className="text-[10px] text-slate-400 mt-3">Full policy: {SITE_CONFIG.siteUrl}/privacy</p>
          </div>

          <div className="p-10 print:p-8 border-b border-slate-300">
            <h2 className="text-xl font-black mb-4">POPIA Compliance — Key Points</h2>
            <ul className="text-xs text-slate-700 space-y-2 leading-relaxed list-disc pl-5">
              <li>The Developer is a responsible party under POPIA (Act 4 of 2013) and adheres to all 8 Conditions for Lawful Processing.</li>
              <li>A designated Information Officer handles data-subject requests (Section 55).</li>
              <li>Security compromises are reported to the Information Regulator and affected data subjects as soon as reasonably possible (Section 22).</li>
              <li>Confidential client data is destroyed within 7 calendar days of handover — a voluntary commitment exceeding the Section 14 statutory duty.</li>
              <li>A signed Data Destruction Certificate is available on written request.</li>
            </ul>
            <p className="text-[10px] text-slate-400 mt-3">Full policy: {SITE_CONFIG.siteUrl}/popia</p>
          </div>

          <div className="p-10 print:p-8 border-b border-slate-300">
            <h2 className="text-xl font-black mb-4">Data Processing Agreement — Key Points (EU/UK clients)</h2>
            <ul className="text-xs text-slate-700 space-y-2 leading-relaxed list-disc pl-5">
              <li>The Client acts as Data Controller and the Developer acts as Data Processor under GDPR Article 28 / UK GDPR.</li>
              <li>Personal data is processed only on documented instructions; no use for AI training, profiling, or sale.</li>
              <li>Subprocessors (hosting, AI APIs, payments) are bound by equivalent data-protection obligations.</li>
              <li>Transfers outside the EEA/UK rely on appropriate safeguards (e.g., standard contractual clauses).</li>
              <li>On completion, all personal data is deleted or returned at the Client&apos;s choice; copies are removed.</li>
            </ul>
            <p className="text-[10px] text-slate-400 mt-3">Full DPA template: {SITE_CONFIG.siteUrl}/dpa</p>
          </div>

          <div className="p-6 bg-slate-900 text-white text-[10px] flex flex-wrap items-center justify-between gap-3">
            <span>{SITE_CONFIG.brandLine} — Official Document Bundle</span>
            <span>Generated {today} • {SITE_CONFIG.siteUrl}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExportPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Preparing bundle…</div>}>
      <ExportContent />
    </Suspense>
  );
}
