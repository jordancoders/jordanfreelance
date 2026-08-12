"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Printer, ShieldCheck, ArrowLeft, Loader } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
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
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 print:text-black">
      <Header />

      {/* Toolbar — hidden when printing */}
      <div className="print:hidden bg-slate-900 text-white py-4">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/client/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      <main className="flex-1 py-10 print:py-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 print:max-w-none print:px-0">
          {/* The printable document */}
          <div className="bg-white dark:bg-white dark:text-slate-900 text-slate-900 shadow-2xl border border-slate-300 print:border-none print:shadow-none">
            {/* Page 1 — signed declaration */}
            <div className="p-8 sm:p-12 print:p-8">
              <div className="flex items-center gap-2 text-emerald-700 mb-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Signed Declaration</span>
              </div>
              <h1 className="text-2xl font-black mb-1">Declaration of Agreement &amp; Consent</h1>
              <p className="text-xs text-slate-500 mb-6">
                {SITE_CONFIG.tradingName} by {SITE_CONFIG.developerName} — {SITE_CONFIG.brandLine}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 uppercase font-bold block mb-0.5">Client</span>
                  <strong>{account.clientName}</strong>
                  {account.clientCompany && <div className="text-slate-600">{account.clientCompany}</div>}
                </div>
                <div className="text-right">
                  <span className="text-slate-500 uppercase font-bold block mb-0.5">Document</span>
                  <strong>{doc ? `${doc.documentType} ${doc.invoiceNumber}` : "—"}</strong>
                  <div className="text-slate-600">{doc?.projectTitle || "Custom Web App"}</div>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-800 mb-6">
                I, <strong className="border-b-2 border-slate-700 px-1">{decl?.signerName || "_______________________________"}</strong>,
                being the authorised representative of{" "}
                <strong className="border-b-2 border-slate-700 px-1">{account.clientCompany || account.clientName}</strong>,
                hereby declare that the information provided in the accompanying document(s) is true and correct, and that I
                have read, understood, and agree to be bound by the {SITE_CONFIG.brandLine}{" "}
                <a href={`${SITE_CONFIG.siteUrl}/terms`} className="underline">Terms of Service</a>,{" "}
                <a href={`${SITE_CONFIG.siteUrl}/privacy`} className="underline">Privacy Policy</a>,{" "}
                <a href={`${SITE_CONFIG.siteUrl}/popia`} className="underline">POPIA Compliance Policy</a>, the{" "}
                <a href={`${SITE_CONFIG.siteUrl}/guarantee`} className="underline">No-Gamble Guarantee</a>{" "}
                and — where applicable — the{" "}
                <a href={`${SITE_CONFIG.siteUrl}/dpa`} className="underline">Data Processing Agreement</a>.
              </p>
              <p className="text-sm leading-relaxed text-slate-800 mb-8">
                I further acknowledge that confidential data provided for this project will be processed in line with POPIA
                (Act 4 of 2013), and that all confidential client data will be permanently destroyed within 7 calendar days
                of handover — a voluntary commitment that exceeds the statutory duty under Section 14 of POPIA.
              </p>

              {/* Document breakdown */}
              {doc && (
                <div className="mb-8">
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
                      {(doc.items || []).map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-3 font-semibold">{it.description}</td>
                          <td className="p-3 text-center">{it.quantity}</td>
                          <td className="p-3 text-right">{symbol} {it.rate.toLocaleString()}</td>
                          <td className="p-3 text-right font-bold">{symbol} {(it.quantity * it.rate).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 ml-auto w-full sm:w-72 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Total</span>
                      <span>{symbol} {doc.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-700">
                      <span>Kick-off deposit ({doc.depositPercent}%)</span>
                      <span>{symbol} {doc.depositAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-black border-t border-slate-200 pt-1">
                      <span>Final balance ({100 - doc.depositPercent}%)</span>
                      <span>{symbol} {doc.balance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-1">
                      <span>Status</span>
                      <strong>{doc.status}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-10">
                <div>
                  {decl?.signatureDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={decl.signatureDataUrl} alt="Signature" className="h-24 w-auto object-contain border-b-2 border-slate-700" />
                  ) : (
                    <div className="h-24 border-b-2 border-slate-700" />
                  )}
                  <p className="text-[11px] text-slate-500 mt-1">Signature</p>
                </div>
                <div>
                  <div className="h-24 border-b-2 border-slate-700" />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Date: {signedDate || new Date().toLocaleDateString("en-ZA", { day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div>
                  <div className="h-24 border-b-2 border-slate-700" />
                  <p className="text-[11px] text-slate-500 mt-1">Witness (optional)</p>
                </div>
              </div>

              <p className="mt-10 text-[10px] text-slate-400 border-t border-slate-200 pt-3">
                Generated from your private portal ({SITE_CONFIG.siteUrl}/client) — your signed declaration is shared
                instantly with your developer and kept in your project records. Build progress: {pct}%.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
