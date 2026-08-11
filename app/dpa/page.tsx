"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { ShieldCheck, Printer, ArrowLeft, FileText, Lock, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/data/portfolioData";

export default function DpaPage() {
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
              href="/international"
              className="inline-flex items-center gap-2 text-xs font-bold text-orange-500 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to International Clients
            </Link>

            <button
              id="print-dpa-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs shadow hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Export DPA PDF
            </button>
          </div>

          {/* DPA DOCUMENT */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white text-slate-900 border border-slate-300 shadow-2xl space-y-8 print:p-0 print:border-none print:shadow-none print-exact">
            
            {/* Document Header */}
            <div className="border-b border-slate-300 pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="text-2xl font-black text-slate-900">
                    {SITE_CONFIG.tradingName} <span className="text-orange-600 font-normal">by {SITE_CONFIG.developerName}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 font-mono">
                    Email: {SITE_CONFIG.email} • WhatsApp: {SITE_CONFIG.whatsappFormatted} • Location: South Africa
                  </div>
                </div>
                <div className="text-right space-y-1 font-mono text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block font-sans">
                    DATA PROCESSING AGREEMENT
                  </span>
                  <div className="font-bold text-slate-900 text-sm">GDPR Article 28 • UK GDPR Art 28</div>
                  <div>Template Version: 1.0 • August 2026</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-4 border border-slate-200 bg-slate-50 p-3 rounded-lg">
                <strong className="text-slate-500">How to use:</strong> complete the blank fields below (parties,
                processing details, retention) and sign. This template aligns with the EU General Data Protection
                Regulation (Article 28) and UK GDPR for Clients located in the EU/UK, and serves as a processing
                contract for Clients in other jurisdictions.
              </p>
            </div>

            {/* Section 1 - Parties */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">1. PARTIES</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Data Controller (&ldquo;Client&rdquo;):</strong> _____________________________________ (name),
                registered at _____________________________________ (address), email: _____________________________________.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong>Data Processor (&ldquo;Developer&rdquo;):</strong> Jordan Peters Coder Freelancing, a South
                African sole proprietor, contactable at {SITE_CONFIG.email} / {SITE_CONFIG.whatsappFormatted}.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                This Agreement forms part of, and is incorporated into, the Master Services Agreement / proposal
                governing the development project between the Parties.
              </p>
            </section>

            {/* Section 2 - Roles */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">2. ROLES & PURPOSE</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                2.1 The Client is the Data Controller in respect of Personal Data processed under this Agreement.
                The Developer is a Data Processor acting on the documented instructions of the Client.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                2.2 The subject matter, duration, nature, and purpose of the processing is: the design, development,
                staging, and delivery of the Client&apos;s custom software application (web app / dashboard / MVP) as
                described in the project proposal, including any associated hosting, API integration, testing, and
                support.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                2.3 Categories of data subjects: the Client&apos;s customers, employees, and end-users whose data appears
                in the application. Categories of Personal Data: names, contact details, business information,
                bookings/transactions, and any data submitted through the application by end-users.
              </p>
            </section>

            {/* Section 3 - Instructions */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">3. INSTRUCTIONS & COMPLIANCE</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                3.1 The Developer shall process Personal Data only on documented instructions from the Client unless
                required to do so by applicable law (in which case the Developer shall inform the Client of that legal
                requirement before processing, unless that law prohibits such information on important public-interest
                grounds).
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                3.2 The Developer shall take reasonable steps to ensure personnel with access to Personal Data are
                subject to confidentiality obligations and process the data only on instructions.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                3.3 The Developer shall not use Client data for AI model training, profiling, or any purpose other than
                delivering the project, and shall not &ldquo;sell&rdquo; or &ldquo;share&rdquo; Personal Data as those terms are defined
                in the CCPA/CPRA.
              </p>
            </section>

            {/* Section 4 - Security */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">4. SECURITY OF PROCESSING</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                Taking into account the state of the art, costs of implementation, and the nature, scope, context, and
                purposes of processing, the Developer shall implement appropriate technical and organisational measures,
                including:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
                <li>Encryption of data in transit (TLS 1.3); data at rest protected by hosting-provider infrastructure encryption and strict access controls.</li>
                <li>Least-privilege access controls; staging environments built in protected production mode with source maps disabled.</li>
                <li>Data minimisation — dummy/placeholder data used during development wherever possible.</li>
                <li>Prompt security incident response and remediation.</li>
              </ul>
            </section>

            {/* Section 5 - Subprocessors */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">5. SUBPROCESSORS</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                5.1 The Developer may engage the following categories of subprocessors to deliver the project: cloud
                hosting providers, AI API providers, and payment processors. A current list is provided to the Client
                on request.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                5.2 Where subprocessors are engaged, the Developer shall impose data-protection obligations on them
                equivalent to those in this Agreement, and shall remain fully liable to the Client for their acts and
                omissions.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                5.3 The Developer shall inform the Client of any intended changes concerning the addition or replacement
                of subprocessors, giving the Client the opportunity to object.
              </p>
            </section>

            {/* Section 6 - Cross-border */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">6. INTERNATIONAL DATA TRANSFERS</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                Where Personal Data is transferred outside the EEA/UK (including to South Africa for development, or to
                hosting/AI providers in the US or EU), such transfers shall be made subject to appropriate safeguards
                as required by GDPR Article 44-49, including standard contractual clauses relied upon by the relevant
                subprocessors, and the Developer shall cooperate with the Client to ensure transfer compliance.
              </p>
            </section>

            {/* Section 7 - Rights */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">7. DATA SUBJECT RIGHTS & ASSISTANCE</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                7.1 Taking into account the nature of the processing, the Developer shall assist the Client by
                appropriate technical and organisational measures, insofar as possible, to fulfil the Client&apos;s
                obligation to respond to requests for the exercise of data subjects&apos; rights (access, rectification,
                erasure, restriction, portability, and objection).
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                7.2 The Developer shall assist the Client with its obligations regarding security, breach notification,
                and data protection impact assessments, taking into account the information available to the Developer.
              </p>
            </section>

            {/* Section 8 - Breach */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">8. PERSONAL DATA BREACH NOTIFICATION</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                The Developer shall notify the Client without undue delay after becoming aware of a personal data
                breach affecting Client data, and shall provide reasonable information to enable the Client to meet its
                notification obligations (including to supervisory authorities within 72 hours where required). The
                Developer shall take steps to mitigate and remediate the breach.
              </p>
            </section>

            {/* Section 9 - Erasure */}
            <section className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
              <h2 className="text-lg font-black text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                9. RETURN & DELETION OF DATA
              </h2>
              <p className="text-sm text-emerald-900 font-medium">
                9.1 At the end of the project (final payment and source code handover), the Developer shall, at the
                choice of the Client, delete or return all Personal Data processed under this Agreement, and delete
                existing copies.
              </p>
              <p className="text-sm text-emerald-900 font-medium">
                9.2 The Developer&apos;s commitment: all Client-provided confidential data (real emails, client
                directories, names, numbers, addresses, and staging databases) is permanently and irreversibly deleted
                from active systems within 7 calendar days of handover. A signed Data Destruction Certificate is
                provided upon written request.
              </p>
            </section>

            {/* Section 10 - Audit */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">10. AUDIT & RECORDS</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                The Developer shall make available to the Client all information necessary to demonstrate compliance
                with this Agreement, and allow for and contribute to audits, inspections, or assessments conducted by
                the Client or the Client&apos;s authorised auditor.
              </p>
            </section>

            {/* Section 11 - Liability */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">11. LIABILITY & INDEMNITY</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                11.1 The Developer shall be liable to the Client only for damage caused by processing that infringes the
                GDPR/UK GDPR or this Agreement, where the Developer has not complied with obligations specifically
                addressed to processors, or has acted outside or contrary to lawful instructions of the Client.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                11.2 The Developer&apos;s total liability under this Agreement is limited to the amounts paid by the Client
                for the specific development project, in line with the Master Services Agreement.
              </p>
            </section>

            {/* Section 12 - Term */}
            <section className="space-y-3">
              <h2 className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">12. TERM & GOVERNING LAW</h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                12.1 This Agreement takes effect on project commencement and continues until the end of processing
                (data erasure under clause 9), whichever is later.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                12.2 This Agreement is governed by the laws of the Republic of South Africa, and the Parties submit to
                the jurisdiction of the South African courts, without prejudice to the Client&apos;s rights as a data
                subject under the GDPR/UK GDPR.
              </p>
            </section>

            {/* Signature Block */}
            <section className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-600" />
                SIGNATURES
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-700">
                <div className="space-y-6">
                  <p>Signed for and on behalf of the <strong>Data Controller (Client)</strong>:</p>
                  <div className="space-y-1">
                    <div className="border-b border-slate-400 h-8"></div>
                    <p className="text-xs text-slate-500">Name & Signature • Date</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <p>Signed for and on behalf of the <strong>Data Processor (Developer)</strong>:</p>
                  <div className="space-y-1">
                    <div className="border-b border-slate-400 h-8"></div>
                    <p className="text-xs text-slate-500">
                      Jordan Peters Coder Freelancing • Date — sent as a signed PDF copy
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer note */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Article 28 GDPR • UK GDPR • POPIA-aligned handling
              </span>
              <span>{SITE_CONFIG.brandLine} — International Client Documentation</span>
            </div>

          </div>

          {/* Context footer card */}
          <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2 print:hidden">
            <h3 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Why this matters
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              EU/UK clients&apos; procurement teams legally require a signed Article 28 DPA before work starts. This
              template turns your existing 7-day erasure and security commitments into a document their legal team
              accepts. For US/Canada/Australia clients, it also serves as the processing contract their vendors expect.
            </p>
          </div>

        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
