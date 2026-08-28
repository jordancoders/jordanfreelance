"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Printer, ShieldCheck, ArrowLeft, FileText, Lock, Globe, Database, Scale, Download } from "lucide-react";
import Link from "next/link";
import SignaturePad from "@/components/SignaturePad";
import { SITE_CONFIG } from "@/data/portfolioData";
import Logo from "@/components/Logo";
import { fetchInvoice } from "@/app/actions/invoices";
import { downloadElementAsPdf } from "@/lib/pdfDownload";
import type { Invoice } from "@/lib/types";

function ExportContent() {
  const searchParams = useSearchParams();
  const docParam = searchParams?.get("doc") || "";

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [signature, setSignature] = useState("");
  const [signerName, setSignerName] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!docParam) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchInvoice(docParam)
      .then((inv) => {
        if (cancelled) return;
        if (inv) {
          setInvoice(inv);
          setSignature(inv.declaration?.signatureDataUrl || "");
          setSignerName(inv.declaration?.signerName || "");
          setAcknowledged(inv.declaration?.acknowledged || false);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [docParam]);

  const persistDeclaration = async (sig: string, name: string, ack: boolean) => {
    if (!invoice) return;
    const declaration = {
      signatureDataUrl: sig,
      signerName: name,
      acknowledged: ack,
      signedAt: new Date().toISOString(),
      signedBy: "admin" as const,
    };
    try {
      const { editInvoice } = await import("@/app/actions/invoices");
      await editInvoice(invoice.id, { declaration });
      const { updateLinkedClientDeclaration } = await import("@/app/actions/clients");
      await updateLinkedClientDeclaration(invoice.id, declaration);
    } catch {
      // Ignore — the bundle still prints fine.
    }
  };

  const symbol = invoice?.currency === "USD" ? "$" : "R";
  const subtotal = invoice
    ? (invoice.items || []).reduce((sum, it) => sum + (it.quantity || 0) * (it.rate || 0), 0)
    : 0;
  const depositPct = invoice?.depositPercent ?? 50;
  const deposit = Math.round((subtotal * depositPct) / 100);
  const balance = Math.max(0, subtotal - deposit);
  const signedAt = invoice?.declaration?.signedAt || null;

  const today = new Date().toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const todayISO = new Date().toLocaleDateString("en-ZA");

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 print:bg-white text-slate-900 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading document…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 print:bg-white text-slate-900">
      {/* Toolbar — hidden when printing */}
      <div className="print:hidden bg-slate-900 text-white py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Link>
            <span className="text-sm font-black hidden sm:inline">{SITE_CONFIG.brandLine}</span>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">• Official Bundle</span>
          </div>
          <div className="flex items-center gap-3">
            {!invoice && (
              <span className="text-xs text-amber-400 font-semibold hidden sm:inline">
                No document — showing the legal bundle only.
              </span>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print PDF
            </button>
            <button
              onClick={async () => {
                if (!contentRef.current || downloading) return;
                setDownloading(true);
                try {
                  await downloadElementAsPdf(contentRef.current, `bundle-${invoice?.invoiceNumber || "legal"}.pdf`);
                } finally {
                  setDownloading(false);
                }
              }}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloading ? "Generating…" : "Download PDF"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 print:py-0 print:px-0">
        {/* Signature & declaration panel — screen only */}
        <div className="print:hidden p-6 rounded-3xl bg-white border-2 border-dashed border-slate-300 shadow-xl space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold">Signed Declaration — capture before exporting</h2>
          </div>
          {invoice?.declaration?.signedBy === "client" ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Signed by the client via their portal</strong> on{" "}
                {signedAt ? new Date(signedAt).toLocaleDateString("en-ZA", { day: "2-digit", month: "long", year: "numeric" }) : "—"}
                . This is the client&apos;s own signature — the bundle is ready to export. Editing here will overwrite it.
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed">
              Capture the client&apos;s signature and name below — or ask them to sign in their own portal (it lands here automatically).
              The signed declaration prints as <strong>page 1</strong> of the bundle; the {invoice ? `${invoice.documentType.toLowerCase()} and` : ""} legal summaries follow.
              For EU/UK clients the Data Processing Agreement is included automatically.
            </p>
          )}
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
                <div className="p-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50 font-mono">{today}</div>
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
              Complete the acknowledgement and signature before exporting — the PDF records them on page 1. The bundle is still printable without a signature (shows unsigned placeholders).
            </p>
          )}
        </div>

        {/* ==== THE PRINTABLE DOCUMENT — A4 paper ==== */}
        <div ref={contentRef} className="bg-white shadow-2xl border border-slate-300 print:border-none print:shadow-none print-exact text-slate-900 overflow-hidden">
          {/* ── Page 1 — Signed declaration — always first page ── */}
          <div className="p-8 sm:p-10 print:p-8">
            {/* Official letterhead bar */}
            <div className="flex justify-between items-start gap-4 border-b-2 border-slate-900 pb-5 mb-6">
              <div>
                <Logo variant="full" iconSize={40} text={SITE_CONFIG.tradingName} subtext={`by ${SITE_CONFIG.developerName}`} />
                <div className="text-xs text-slate-500 font-mono mt-1 space-y-0.5">
                  <div>{SITE_CONFIG.email} • {SITE_CONFIG.whatsappFormatted}</div>
                  <div>{SITE_CONFIG.location} • {SITE_CONFIG.siteUrl}</div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> Official Record
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  Generated {today} • Ref: {invoice ? invoice.invoiceNumber : "GENERAL"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-emerald-700 mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Signed Declaration</span>
              {invoice && <span className="text-[11px] font-mono text-slate-400 ml-1">• {invoice.documentType} {invoice.invoiceNumber} • {invoice.status}</span>}
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Declaration of Agreement &amp; Consent</h1>
            <p className="text-[11px] text-slate-500 font-mono mb-5">Forming part of the contract record for {invoice ? `${invoice.documentType} ${invoice.invoiceNumber}` : "general engagement"} — {SITE_CONFIG.brandLine}</p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Declared By</span>
                <strong className="text-slate-900">{signerName?.trim() || "_______________________________"}</strong>
                <div className="text-slate-600">{invoice?.clientCompany || invoice?.clientName || "Client Company / Individual"}</div>
                {invoice?.clientEmail && <div className="text-slate-500 font-mono text-xs">{invoice.clientEmail}</div>}
              </div>
              <div className="text-right sm:text-left lg:text-right">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Engagement</span>
                <strong className="text-slate-900">{invoice ? `${invoice.documentType} ${invoice.invoiceNumber}` : "General Terms Acceptance"}</strong>
                {invoice && <div className="text-slate-600">{invoice.items[0]?.description || "Custom Web App"}</div>}
                <div className="text-slate-500 font-mono text-xs mt-1">Issue {invoice?.issueDate || today} • Due {invoice?.dueDate || "—"}</div>
              </div>
            </div>

            <div className="space-y-3 text-sm leading-relaxed text-slate-800">
              <p>
                I, <strong className="text-slate-900 border-b border-slate-900 px-1">{signerName?.trim() || "_______________________________"}</strong>,
                {" "}being the duly authorised representative of{" "}
                <strong className="text-slate-900 border-b border-slate-900 px-1">
                  {invoice?.clientCompany || invoice?.clientName || "_______________________________"}
                </strong>
                , hereby declare that the information provided in the accompanying document(s) is true and correct, and that I
                have read, understood, and agree to be bound by the {SITE_CONFIG.brandLine} <strong>Terms of Service</strong>, <strong>Privacy Policy</strong>,
                <strong> POPIA Compliance Policy</strong>, the <strong>No-Gamble Guarantee</strong> (48-hour staging refund, 14-day bug-fix warranty, 7-day data erasure), and — where applicable — the <strong>Data Processing Agreement</strong>.
              </p>
              <p>
                I further acknowledge that confidential data provided for this project will be processed strictly in line with the Protection of Personal Information Act (Act 4 of 2013), and that all confidential client data will be <strong>permanently destroyed within 7 calendar days of handover</strong> — a voluntary commitment that exceeds the statutory duty under Section 14 of POPIA. A Data Destruction Certificate is available on written request.
              </p>
              <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <strong>Effect of signing:</strong> Signing this declaration (electronically or by hand) constitutes formal <em>acceptance</em> of the {invoice ? invoice.documentType.toLowerCase() : "document"}. Where a client signs via their portal, the status moves to <strong>Accepted</strong> and the signature is mirrored to the studio record server-side (never trust the browser payload). For the full legal text, see the summaries that follow and the online policies at {SITE_CONFIG.siteUrl}/terms, /privacy, /popia, /dpa and /guarantee.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              <div>
                <div className="h-24 border border-slate-300 bg-white flex items-center justify-center overflow-hidden">
                  {signature ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={signature} alt="Signature" className="h-20 w-auto object-contain" />
                  ) : (
                    <span className="text-[11px] text-slate-400 italic px-2 text-center">No signature — sign above or on the line below</span>
                  )}
                </div>
                <div className="h-5 border-b-2 border-slate-900 mt-1" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Signature of authorised representative</p>
                {signerName && <p className="text-xs text-slate-700 font-mono">{signerName}</p>}
              </div>
              <div className="flex flex-col justify-end">
                <div className="h-24 flex items-end justify-center">
                  <div className="w-full border-b-2 border-slate-900 h-6 flex items-end text-xs font-mono text-slate-700 pb-1">
                    {signedAt ? new Date(signedAt).toLocaleDateString("en-ZA", { day: "2-digit", month: "long", year: "numeric" }) : today}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Date</p>
                <p className="text-[10px] text-slate-400">Server time on signing: {signedAt ? new Date(signedAt).toLocaleString("en-ZA") : todayISO}</p>
              </div>
              <div className="flex flex-col justify-end">
                <div className="h-24 flex items-end justify-center">
                  <div className="w-full border-b-2 border-slate-400 h-6" />
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Witness (optional)</p>
                <p className="text-[10px] text-slate-400">Full name + signature</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-between gap-2 text-[10px] text-slate-400 font-mono border-t border-slate-200 pt-3">
              <span>Generated from {SITE_CONFIG.siteUrl} • {today} • Page 1 of Bundle</span>
              <span>{invoice?.declaration?.signedBy === "client" ? "Signed by client via portal" : invoice?.declaration?.signedBy === "admin" ? "Signed in studio (admin)" : signature ? "Signature on file" : "Awaiting signature — unsigned copy"}</span>
            </div>
            {!signature && (
              <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-lg print:hidden">
                This copy is unsigned. Complete the signature above and re-export to generate a signed contract record.
              </p>
            )}
          </div>

          {/* Page 2+ — Invoice / Quote (if selected) */}
          {invoice ? (
            <div className="p-8 sm:p-10 print:p-8 border-t-2 border-slate-900 break-before avoid-break">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-900 pb-6 mb-6">
                <div>
                  <Logo
                    variant="full"
                    iconSize={44}
                    text={SITE_CONFIG.tradingName}
                    subtext={`by ${SITE_CONFIG.developerName}`}
                  />
                  <div className="text-xs text-slate-500 mt-2 font-mono space-y-0.5">
                    <div>Email: {SITE_CONFIG.email} • WhatsApp: {SITE_CONFIG.whatsappFormatted}</div>
                    <div>Web: {SITE_CONFIG.siteUrl} • Location: South Africa (Remote)</div>
                    <div>PayPal: {SITE_CONFIG.paypalMeUrl}</div>
                  </div>
                </div>
                <div className="text-right font-mono text-xs bg-slate-50 border border-slate-300 p-4 min-w-[190px]">
                  <div className="text-sm font-bold text-orange-600 uppercase tracking-widest font-sans">{invoice.documentType}</div>
                  <div className="font-bold text-slate-900 text-sm mt-1 font-mono"># {invoice.invoiceNumber}</div>
                  <div className="mt-1">Issue: {invoice.issueDate}</div>
                  <div>Due: {invoice.dueDate}</div>
                  <div className="mt-2 inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-white border border-slate-300 text-slate-700">Status: {invoice.status}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{invoice.currency} • {invoice.depositPercent ?? 50}% deposit</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-[11px] uppercase font-bold text-slate-500 tracking-wider mb-1">Billed To</div>
                  <strong className="text-slate-900 text-sm block">{invoice.clientName}</strong>
                  {invoice.clientCompany && <div className="text-xs text-slate-700">{invoice.clientCompany}</div>}
                  {invoice.clientEmail && <div className="text-xs text-slate-600 font-mono">{invoice.clientEmail}</div>}
                  {invoice.clientPhone && <div className="text-xs text-slate-600 font-mono">{invoice.clientPhone}</div>}
                </div>
                <div className="text-right sm:text-left lg:text-right">
                  <div className="text-[11px] uppercase font-bold text-slate-500 tracking-wider mb-1">Issued By</div>
                  <div className="text-sm font-bold text-slate-900">{SITE_CONFIG.tradingName}</div>
                  <div className="text-xs text-slate-600">Attn: {SITE_CONFIG.developerName}</div>
                  <div className="text-xs text-slate-500 font-mono">{SITE_CONFIG.siteUrl}</div>
                </div>
              </div>

              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="border-b-2 border-slate-900 bg-slate-100 font-bold text-slate-900">
                    <th className="p-3 border-r border-slate-300">Deliverable / Description</th>
                    <th className="p-3 text-center border-r border-slate-300 w-16">Qty</th>
                    <th className="p-3 text-right border-r border-slate-300 w-28">Rate</th>
                    <th className="p-3 text-right w-28">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoice.items.map((it) => (
                    <tr key={it.id} className="even:bg-slate-50/60">
                      <td className="p-3 font-medium text-slate-900 border-r border-slate-200">{it.description}</td>
                      <td className="p-3 text-center font-mono text-slate-700 border-r border-slate-200">{it.quantity}</td>
                      <td className="p-3 text-right font-mono text-slate-700 border-r border-slate-200">{symbol} {it.rate.toLocaleString()}</td>
                      <td className="p-3 text-right font-bold font-mono text-slate-900">{symbol} {(it.quantity * it.rate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 ml-auto w-full sm:w-80 border border-slate-300 text-xs">
                <div className="flex justify-between px-3 py-2 bg-slate-50 border-b border-slate-200 text-slate-600">
                  <span>Subtotal (Total ex VAT):</span>
                  <span className="font-mono font-semibold">{symbol} {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between px-3 py-2 border-b border-slate-200 font-bold text-emerald-700 bg-white">
                  <span>Kick-off Deposit ({depositPct}%):</span>
                  <span className="font-mono">{symbol} {deposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between px-3 py-2 text-slate-600 bg-slate-50 border-b border-slate-200">
                  <span>Balance on completion ({100 - depositPct}%):</span>
                  <span className="font-mono">{symbol} {balance.toLocaleString()}</span>
                </div>
                {invoice.depositPaid > 0 && (
                  <div className="flex justify-between px-3 py-1.5 text-[11px] text-slate-500 border-b border-slate-200">
                    <span>Already paid:</span>
                    <span className="font-mono">{symbol} {invoice.depositPaid.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between px-3 py-2 font-black text-slate-900 text-sm border-t-2 border-slate-900 bg-white">
                  <span>Due Now:</span>
                  <span className="font-mono text-orange-600">{symbol} {deposit.toLocaleString()}</span>
                </div>
              </div>

              {/* Proposal sections for quotes — print as tinted cards */}
              {invoice.documentType === "Quote" && (
                <div className="mt-6 space-y-3">
                  {invoice.proposalSummary && (
                    <div className="p-3 bg-orange-50 border-l-4 border-orange-500 break-inside-avoid">
                      <h4 className="font-black text-orange-700 text-xs uppercase tracking-wider mb-1">🎯 Your Project</h4>
                      <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">{invoice.proposalSummary}</p>
                    </div>
                  )}
                  {invoice.proposalSolution && (
                    <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 break-inside-avoid">
                      <h4 className="font-black text-emerald-700 text-xs uppercase tracking-wider mb-1">💡 Proposed Solution</h4>
                      <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">{invoice.proposalSolution}</p>
                    </div>
                  )}
                  {invoice.proposalDeliverables && invoice.proposalDeliverables.length > 0 && (
                    <div className="p-3 bg-slate-50 border border-slate-200 break-inside-avoid">
                      <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider mb-1">📦 What You Get</h4>
                      <ul className="space-y-1">
                        {invoice.proposalDeliverables.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-800">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {invoice.proposalTimeline && (
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-500 break-inside-avoid">
                      <h4 className="font-black text-blue-700 text-xs uppercase tracking-wider mb-1">⏱️ Timeline</h4>
                      <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">{invoice.proposalTimeline}</p>
                    </div>
                  )}
                  {(invoice.proposalGuarantee || invoice.proposalSocialProof || invoice.proposalNextSteps) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {invoice.proposalGuarantee && (
                        <div className="p-3 border-2 border-slate-900 bg-white break-inside-avoid">
                          <h4 className="font-black text-xs text-slate-900 uppercase mb-1">🛡️ Guarantee</h4>
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{invoice.proposalGuarantee}</p>
                        </div>
                      )}
                      {invoice.proposalSocialProof && (
                        <div className="p-3 border border-slate-200 bg-slate-50 break-inside-avoid">
                          <h4 className="font-black text-xs text-slate-900 uppercase mb-1">⭐ Trust Signals</h4>
                          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{invoice.proposalSocialProof}</p>
                        </div>
                      )}
                      {invoice.proposalNextSteps && (
                        <div className="p-3 border-2 border-orange-500 bg-orange-50 break-inside-avoid">
                          <h4 className="font-black text-xs text-orange-700 uppercase mb-1">🚀 Next Steps</h4>
                          <p className="text-xs text-orange-900 font-semibold leading-relaxed whitespace-pre-wrap">{invoice.proposalNextSteps}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 p-3 border border-slate-300 bg-white text-xs break-inside-avoid">
                <strong className="text-slate-900 block mb-1 uppercase text-[11px] tracking-wider">Payment</strong>
                <span className="text-slate-700">Payable via PayPal.me or Direct EFT (bank transfer) — details provided on confirmation.</span>
                <span className="block mt-1 font-mono text-xs">PayPal.me: {SITE_CONFIG.paypalMeUrl} • WhatsApp proof: {SITE_CONFIG.whatsappFormatted}</span>
                {invoice.notes && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <strong className="text-slate-900">Notes:</strong> <span className="whitespace-pre-wrap">{invoice.notes}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 text-[10px] text-slate-500 border-t border-slate-300 pt-2 leading-relaxed">
                Quote valid 30 days • 14-day acceptance window • Full IP transfer on final payment • Consumer Protection Act 68 of 2008 rights are never limited. See {SITE_CONFIG.siteUrl}/terms
              </div>
            </div>
          ) : (
            <div className="p-8 border-t border-slate-200 text-center text-sm text-slate-500 break-before">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700">No invoice/quote linked</p>
              <p className="text-xs">This bundle contains only the signed declaration and legal summaries. Link a document via <span className="font-mono">/admin/export?doc=INV-…</span> to include it.</p>
            </div>
          )}

          {/* Legal summaries — each as a bordered section, page-break friendly */}
          <div className="p-8 sm:p-10 print:p-8 border-t-2 border-slate-900 break-before">
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-5 h-5 text-slate-700" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Legal Appendix — Summary Extracts</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-6">Summaries below are extracts for inclusion in the contract record. The full policies at the URLs govern in case of any discrepancy.</p>

            <div className="space-y-6">
              <section className="border border-slate-300 p-4 break-inside-avoid">
                <h2 className="text-sm font-black flex items-center gap-2 mb-2"><FileText className="w-4 h-4 text-orange-600" /> Terms of Service — Key Points</h2>
                <ul className="text-xs text-slate-700 space-y-1.5 leading-relaxed list-disc pl-5">
                  <li>Kick-off deposit per project as stated in the quote; balance due on final approval and source-code handover.</li>
                  <li><strong>No-Gamble Guarantee:</strong> if the 48-hour staging demo is not delivered, 100% of the deposit + 100% of unused API credits are refunded (qualifying projects — see Guarantee & Refund Policy for exclusions).</li>
                  <li>Full source code ownership transfers to the client upon final payment; staging environments may contain minified code.</li>
                  <li>14-day critical bug-fix warranty from final delivery; ongoing support by arrangement.</li>
                  <li>Quotes valid 30 days; 14-day acceptance window once issued.</li>
                  <li>Consumer Protection Act 68 of 2008 rights apply and are never limited — including the 5-business-day cooling-off right where the developer approached the client first (Section 16).</li>
                </ul>
                <p className="text-[10px] text-slate-400 mt-2 font-mono">Full terms: {SITE_CONFIG.siteUrl}/terms • {SITE_CONFIG.siteUrl}/guarantee</p>
              </section>

              <section className="border border-slate-300 p-4 break-inside-avoid">
                <h2 className="text-sm font-black flex items-center gap-2 mb-2"><Lock className="w-4 h-4 text-slate-600" /> Privacy Policy — Key Points</h2>
                <ul className="text-xs text-slate-700 space-y-1.5 leading-relaxed list-disc pl-5">
                  <li>Only the minimum personal information required for delivery is collected and processed.</li>
                  <li>Used strictly for communication, delivery, payments, and legal record-keeping — never sold or used for AI training.</li>
                  <li>Reasonable security (encryption at rest and in transit, least-privilege access, access logging).</li>
                  <li>Data subjects may request access, correction, deletion, or object to processing at any time (POPIA Section 24).</li>
                  <li>Cross-border transfers follow POPIA Section 72 and, for EU/UK data, GDPR Articles 44–49.</li>
                  <li>Cookies are essential-only (no tracking/ads/analytics) — see Cookie Policy section.</li>
                </ul>
                <p className="text-[10px] text-slate-400 mt-2 font-mono">Full policy: {SITE_CONFIG.siteUrl}/privacy</p>
              </section>

              <section className="border border-slate-300 p-4 break-inside-avoid">
                <h2 className="text-sm font-black flex items-center gap-2 mb-2"><Database className="w-4 h-4 text-emerald-600" /> POPIA Compliance — Key Points</h2>
                <ul className="text-xs text-slate-700 space-y-1.5 leading-relaxed list-disc pl-5">
                  <li>Responsible party under POPIA (Act 4 of 2013) — adheres to all 8 Conditions for Lawful Processing.</li>
                  <li>Designated Information Officer handles data-subject requests (Section 55) via {SITE_CONFIG.email}.</li>
                  <li>Security compromises reported to the Information Regulator and affected data subjects as soon as reasonably possible (Section 22).</li>
                  <li><strong>Confidential client data destroyed within 7 calendar days of handover</strong> — exceeds Section 14 statutory duty; Data Destruction Certificate available on request.</li>
                  <li>7-day data-erasure commitment documented in the declaration above.</li>
                </ul>
                <p className="text-[10px] text-slate-400 mt-2 font-mono">Full policy: {SITE_CONFIG.siteUrl}/popia</p>
              </section>

              <section className="border border-slate-300 p-4 break-inside-avoid">
                <h2 className="text-sm font-black flex items-center gap-2 mb-2"><Globe className="w-4 h-4 text-blue-600" /> Data Processing Agreement — Key Points (EU/UK)</h2>
                <ul className="text-xs text-slate-700 space-y-1.5 leading-relaxed list-disc pl-5">
                  <li>Client as <strong>Data Controller</strong>, developer as <strong>Data Processor</strong> under GDPR Article 28 / UK GDPR.</li>
                  <li>Processing only on documented instructions; no use for AI training, profiling, or sale.</li>
                  <li>Subprocessors (hosting, AI APIs, payments) bound by equivalent data-protection obligations — listed in the full DPA.</li>
                  <li>Transfers outside EEA/UK rely on appropriate safeguards (e.g., Standard Contractual Clauses).</li>
                  <li>On completion, personal data is deleted or returned at the client&apos;s choice; copies are removed within the 7-day window.</li>
                </ul>
                <p className="text-[10px] text-slate-400 mt-2 font-mono">Full DPA template: {SITE_CONFIG.siteUrl}/dpa • EU representative available on request</p>
              </section>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t-2 border-slate-900 text-[10px] flex flex-wrap items-center justify-between gap-3 font-mono print:bg-white">
            <span className="font-bold text-slate-700">{SITE_CONFIG.brandLine} — Official Document Bundle</span>
            <span className="text-slate-500">Generated {today} • {SITE_CONFIG.siteUrl} • {invoice ? `${invoice.documentType} ${invoice.invoiceNumber}` : "Legal bundle"} • Page bundle</span>
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
