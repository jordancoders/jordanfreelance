"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Printer, ShieldCheck, ArrowLeft, Loader, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Logo from "@/components/Logo";
import { SITE_CONFIG } from "@/data/portfolioData";
import type { ClientPortalAccount } from "@/lib/types";
import { computePercentComplete } from "@/lib/clientPortal";

export default function ClientDeclarationPage() {
  const router = useRouter();
  const [account, setAccount] = useState<ClientPortalAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/client/account")
      .then((res) => {
        if (res.status === 401) {
          router.replace("/client");
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (!cancelled && json?.account) setAccount(json.account);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader className="w-6 h-6 text-orange-500 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Link href="/client" className="text-sm font-bold text-orange-500 hover:underline">
            Back to login
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const doc = account.document;
  const symbol = doc?.currency === "USD" ? "$" : "R";
  const decl = account.declaration;
  const pct = computePercentComplete(account);
  const signedDate = decl?.signedAt
    ? new Date(decl.signedAt).toLocaleDateString("en-ZA", { day: "2-digit", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en-ZA", { day: "2-digit", month: "long", year: "numeric" });
  const today = new Date().toLocaleDateString("en-ZA", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 print:bg-white print:text-black">
      <Header />

      {/* Toolbar — hidden when printing */}
      <div className="print:hidden bg-slate-900 text-white py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/client/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              {doc ? `${doc.documentType} ${doc.invoiceNumber} • ${doc.status}` : ""} • {pct}% complete
            </span>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 py-8 print:py-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 print:max-w-none print:px-0">
          {/* The printable document — A4 paper */}
          <div className="bg-white dark:bg-white dark:text-slate-900 text-slate-900 shadow-2xl border border-slate-300 print:border-none print:shadow-none print-exact overflow-hidden">
            <div className="p-8 sm:p-10 print:p-8">
              {/* Letterhead bar */}
              <div className="flex justify-between items-start gap-4 border-b-2 border-slate-900 pb-5 mb-6">
                <div>
                  <Logo variant="full" iconSize={40} text={SITE_CONFIG.tradingName} subtext={`by ${SITE_CONFIG.developerName}`} />
                  <div className="text-xs text-slate-500 font-mono mt-1 space-y-0.5">
                    <div>{SITE_CONFIG.email} • {SITE_CONFIG.whatsappFormatted}</div>
                    <div>{SITE_CONFIG.siteUrl} • {SITE_CONFIG.location}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" /> Official Record
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">Client Portal • {today}</div>
                  <div className="text-[11px] text-slate-500 font-mono">Progress: {pct}%</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-emerald-700 mb-1">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Signed Declaration — your copy</span>
                {decl?.signedBy && <span className="text-[10px] font-mono text-slate-400">• signed by {decl.signedBy} • {signedDate}</span>}
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">Declaration of Agreement &amp; Consent</h1>
              <p className="text-xs text-slate-500 mb-5">
                {SITE_CONFIG.tradingName} by {SITE_CONFIG.developerName} — {SITE_CONFIG.brandLine} •{" "}
                <span className="font-mono">{SITE_CONFIG.siteUrl}</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Client</span>
                  <strong className="text-slate-900 text-sm">{account.clientName}</strong>
                  {account.clientCompany && <div className="text-slate-700">{account.clientCompany}</div>}
                  <div className="text-slate-500 font-mono text-xs mt-1">{account.email} {account.phone ? `• ${account.phone}` : ""}</div>
                </div>
                <div className="text-right sm:text-left lg:text-right">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Document</span>
                  <strong className="text-slate-900 text-sm flex items-center gap-1.5 justify-end sm:justify-start lg:justify-end">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    {doc ? `${doc.documentType} ${doc.invoiceNumber}` : "— No document linked —"}
                  </strong>
                  <div className="text-slate-600 text-xs">{doc?.projectTitle || "Custom Web App"}</div>
                  {doc && <div className="text-slate-500 font-mono text-xs mt-1">Issue {doc.issueDate} • Due {doc.dueDate} • {doc.status}</div>}
                </div>
              </div>

              <div className="space-y-3 text-sm leading-relaxed text-slate-800">
                <p>
                  I, <strong className="text-slate-900 border-b border-slate-900 px-1">{decl?.signerName?.trim() || "_______________________________"}</strong>,
                  {" "}being the duly authorised representative of{" "}
                  <strong className="text-slate-900 border-b border-slate-900 px-1">{account.clientCompany || account.clientName}</strong>,
                  {" "}hereby declare that the information provided in the accompanying document(s) is true and correct, and that I
                  have read, understood, and agree to be bound by the {SITE_CONFIG.brandLine} <strong>Terms of Service</strong>, <strong>Privacy Policy</strong>,
                  <strong> POPIA Compliance Policy</strong>, the <strong>No-Gamble Guarantee</strong> and — where applicable — the <strong>Data Processing Agreement</strong>.
                </p>
                <p>
                  I further acknowledge that confidential data provided for this project will be processed in line with POPIA
                  (Act 4 of 2013), and that all confidential client data will be permanently destroyed within 7 calendar days
                  of handover — a voluntary commitment that exceeds the statutory duty under Section 14 of POPIA.
                </p>
                <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <strong>What signing does:</strong> your signature constitutes formal acceptance of the {doc ? doc.documentType.toLowerCase() : "document"}. It is stamped
                  server-side as <span className="font-mono">signedBy: &quot;client&quot;</span>, mirrored to the studio, and moves the document to <strong>Accepted</strong>.
                  You retain a full copy in your portal; the developer retains the same record for audit.
                </p>
              </div>

              {/* Document breakdown — table + totals */}
              {doc && (
                <div className="mt-6 break-inside-avoid">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Document Breakdown — {doc.documentType} {doc.invoiceNumber}</h2>
                  <table className="w-full text-left text-xs border-collapse border border-slate-300">
                    <thead>
                      <tr className="border-b-2 border-slate-900 bg-slate-100 font-bold text-slate-900">
                        <th className="p-2.5 border-r border-slate-300">Deliverable</th>
                        <th className="p-2.5 text-center border-r border-slate-300 w-16">Qty</th>
                        <th className="p-2.5 text-right border-r border-slate-300 w-24">Rate</th>
                        <th className="p-2.5 text-right w-24">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(doc.items || []).map((it, idx) => (
                        <tr key={idx} className="even:bg-slate-50/60">
                          <td className="p-2.5 font-medium text-slate-900 border-r border-slate-200">{it.description}</td>
                          <td className="p-2.5 text-center font-mono text-slate-700 border-r border-slate-200">{it.quantity}</td>
                          <td className="p-2.5 text-right font-mono text-slate-700 border-r border-slate-200">{symbol} {it.rate.toLocaleString()}</td>
                          <td className="p-2.5 text-right font-bold font-mono text-slate-900">{symbol} {(it.quantity * it.rate).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 ml-auto w-full sm:w-72 border border-slate-300 text-xs">
                    <div className="flex justify-between px-3 py-2 bg-slate-50 border-b border-slate-200 text-slate-600">
                      <span>Subtotal</span>
                      <span className="font-mono font-semibold">{symbol} {doc.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between px-3 py-2 border-b border-slate-200 font-bold text-emerald-700">
                      <span>Kick-off deposit ({doc.depositPercent}%)</span>
                      <span className="font-mono">{symbol} {doc.depositAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between px-3 py-2 bg-slate-50 border-b border-slate-200 font-black text-slate-900">
                      <span>Balance ({100 - doc.depositPercent}%)</span>
                      <span className="font-mono">{symbol} {doc.balance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between px-3 py-1.5 text-[11px] text-slate-500">
                      <span>Status</span>
                      <strong className="text-slate-700">{doc.status}</strong>
                    </div>
                  </div>
                  {doc.notes && (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 text-xs text-slate-600">
                      <strong className="text-slate-900">Notes:</strong> <span className="whitespace-pre-wrap">{doc.notes}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-6 border-t border-slate-200">
                <div>
                  <div className="h-24 border border-slate-300 bg-white flex items-center justify-center overflow-hidden">
                    {decl?.signatureDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={decl.signatureDataUrl} alt="Client signature" className="h-20 w-auto object-contain" />
                    ) : (
                      <span className="text-[11px] text-slate-400 italic px-2 text-center">No signature yet — draw it in your dashboard then re-print</span>
                    )}
                  </div>
                  <div className="h-5 border-b-2 border-slate-900 mt-1" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Your signature</p>
                  {decl?.signerName && <p className="text-xs text-slate-700 font-mono">{decl.signerName}</p>}
                  {!decl?.signatureDataUrl && <p className="text-[11px] text-amber-600 mt-1">Unsigned — complete in dashboard.</p>}
                </div>
                <div className="flex flex-col justify-end">
                  <div className="h-24 flex items-end justify-center">
                    <div className="w-full border-b-2 border-slate-900 h-6 flex items-end pb-1 text-xs font-mono text-slate-700">
                      {signedDate}
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Date</p>
                  <p className="text-[10px] text-slate-400">{decl?.signedAt ? `Signed ${new Date(decl.signedAt).toLocaleString("en-ZA")}` : `Today: ${today}`}</p>
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
                <span>Generated from your private portal • {SITE_CONFIG.siteUrl}/client • {today}</span>
                <span>Build {pct}% • {decl ? `Signed by ${decl.signedBy || "client"}` : "Awaiting signature"} • Ref {doc?.invoiceNumber || account.username}</span>
              </div>
              <div className="mt-3 text-[11px] text-slate-500 leading-relaxed border border-slate-200 bg-slate-50 p-3 rounded-lg break-inside-avoid">
                <strong className="text-slate-700">Keep this copy.</strong> Your signed declaration is shared instantly with your developer and stored in your project records.
                For questions: {SITE_CONFIG.email} • {SITE_CONFIG.whatsappFormatted}. Full policies: {SITE_CONFIG.siteUrl}/terms, /privacy, /popia, /dpa.
                {decl?.signedBy === "client" && " — This declaration was signed by you via your portal and is already mirrored to the studio record."}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
