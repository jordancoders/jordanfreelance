"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { ShieldCheck, Printer, CreditCard, ArrowLeft, Lock } from "lucide-react";
import { SITE_CONFIG } from "@/data/portfolioData";
import Logo from "@/components/Logo";

export default function InvoiceTemplatePage() {
  const [clientName, setClientName] = useState("Sample Client — e.g. Your Company Name");
  const [projectTitle, setProjectTitle] = useState("Custom Dispatch & Fleet Tracking Dashboard (6 Pages)");
  const [quoteTotal, setQuoteTotal] = useState(8500);

  const depositPercent = 50;
  const depositAmount = (quoteTotal * depositPercent) / 100;
  const balanceAmount = quoteTotal - depositAmount;

  const invoiceNo = "INV-20260808-042";
  const invoiceDate = "08 August 2026";
  const dueDate = "22 August 2026";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors print:bg-white print:text-slate-900">
      <Header />

      <main className="flex-1 py-12 sm:py-16 print:py-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 print:max-w-none print:px-0 print:space-y-0">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-orange-500 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <button
              id="print-invoice-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs shadow hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Export Invoice PDF
            </button>
          </div>

          {/* Interactive Calculator Box */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md space-y-4 print:hidden">
            <span className="text-xs font-bold uppercase text-orange-500">Sample Invoice Customizer</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Client Name:</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Project Scope:</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Total Quote Amount (ZAR):</label>
                <input
                  type="number"
                  value={quoteTotal}
                  onChange={(e) => setQuoteTotal(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>
          </div>

          {/* OFFICIAL INVOICE DISPLAY */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white text-slate-900 border border-slate-300 shadow-2xl space-y-8 print:p-0 print:border-none print:shadow-none print-exact">
            
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-300 pb-6">
              <div>
                <Logo
                  variant="full"
                  iconSize={48}
                  text={SITE_CONFIG.tradingName}
                  subtext={`by ${SITE_CONFIG.developerName}`}
                />
                <div className="text-xs text-slate-500 space-y-0.5 mt-2 font-mono">
                  <div>Email: {SITE_CONFIG.email}</div>
                  <div>WhatsApp: {SITE_CONFIG.whatsappFormatted}</div>
                  <div>PayPal: <a href={SITE_CONFIG.paypalMeUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">{SITE_CONFIG.paypalMeUrl}</a></div>
                  <div>Location: South Africa</div>
                </div>
              </div>

              <div className="text-right space-y-1 font-mono text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block font-sans">
                  INVOICE / QUOTE
                </span>
                <div className="font-bold text-slate-900 text-sm">Invoice #: {invoiceNo}</div>
                <div>Issue Date: {invoiceDate}</div>
                <div>Due Date: {dueDate}</div>
              </div>
            </div>

            {/* Billed To */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
              <span className="text-slate-500 uppercase font-bold text-xs block mb-1">BILLED TO:</span>
              <strong className="text-slate-900 text-base block">{clientName}</strong>
              <div className="text-slate-600">Project Reference: {projectTitle}</div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-900 font-bold">
                    <th className="p-3">Item Description</th>
                    <th className="p-3 text-center">Deliverable</th>
                    <th className="p-3 text-right">Amount (ZAR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr>
                    <td className="p-3">
                      <strong className="block text-slate-900">{projectTitle}</strong>
                      <span className="text-xs text-slate-500">
                        Custom full-stack web application development (AI-orchestrated with a human quality gate), responsive styling, API integrations & POPIA compliance layer.
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono">48-Hour Staging Demo</td>
                    <td className="p-3 text-right font-bold">R {quoteTotal.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total & Split Breakdown */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-4 border-t border-slate-300 break-inside-avoid">
              <div className="space-y-1 text-xs text-slate-600 max-w-md">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  No-Gamble Guarantee Included:
                </div>
                <div>
                  If the 48-hour staging demo link is not delivered on time, 100% of the deposit + 100% of unused API credits will be refunded immediately.
                </div>
              </div>

              <div className="w-full sm:w-64 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>R {quoteTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-orange-600 border-t border-slate-200 pt-1">
                  <span>Kick-off Deposit ({depositPercent}%):</span>
                  <span>R {depositAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Final Balance ({100 - depositPercent}%):</span>
                  <span>R {balanceAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 text-base border-t-2 border-slate-900 pt-1">
                  <span>Due Now:</span>
                  <span>R {depositAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4 text-xs break-inside-avoid">
              <h3 className="font-bold text-sm text-orange-400 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Options
              </h3>
              <p className="text-[11px] text-slate-400">Payable via PayPal or Direct EFT (Bank Transfer).</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
                  <strong className="text-white block font-bold text-xs">Option 1: PayPal</strong>
                  <div><a href={SITE_CONFIG.paypalMeUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline text-xs font-mono">{SITE_CONFIG.paypalMeUrl}</a></div>
                  <div className="text-slate-400 text-[11px]">Instant, secure transfer</div>
                </div>

                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
                  <strong className="text-white block font-bold text-xs">Option 2: Direct EFT (Bank Transfer)</strong>
                  <div>Send proof of payment via WhatsApp: <strong className="text-emerald-400 font-mono">{SITE_CONFIG.whatsappFormatted}</strong></div>
                  <div className="text-slate-400 text-[11px]">Bank details provided upon quote confirmation</div>
                </div>
              </div>
            </div>

            {/* LEGAL TERMS CLAUSE ON INVOICE */}
            <div className="p-6 rounded-2xl bg-slate-100 border border-slate-300 space-y-2 text-xs text-slate-800 leading-relaxed break-inside-avoid">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide border-b border-slate-300 pb-1 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-orange-600" />
                LEGAL TERMS & CONDITIONS OF PAYMENT
              </h4>
              <p>
                <strong>&ldquo;PAY &amp; AGREE&rdquo;:</strong> Payment of the deposit invoice constitutes full legal acceptance of our Terms of Service, Privacy Policy, POPIA Compliance Policy, and the No-Gamble Guarantee (see the Guarantee &amp; Refund Policy for full terms).
              </p>
              <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-slate-700">
                <li>Source code will be released only upon receipt of final payment balance.</li>
                <li>Staging environments contain minified/obfuscated code to protect intellectual property.</li>
                <li>All confidential Client datasets will be permanently destroyed within 7 calendar days of handover — a voluntary commitment that exceeds the statutory duty under Section 14 of POPIA.</li>
              </ul>
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
