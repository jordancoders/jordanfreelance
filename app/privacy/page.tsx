import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { SITE_CONFIG } from "@/data/portfolioData";

export const metadata = {
  title: "Privacy Policy (POPIA-Aligned)",
  description: "Official POPIA Privacy Policy for Jordan Peters Coder Freelancing. Information collection, usage, 7-day data erasure policy, and POPIA data subject rights.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-orange-500 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
            
            <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                <ShieldCheck className="w-4 h-4" />
                POPIA Compliant Legal Document
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Last Updated: 08 August 2026 • Entity: Jordan Peters Coder Freelancing
              </p>
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
              
              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. INTRODUCTION</h2>
                <p>
                  This Privacy Policy explains how Jordan Peters Coder Freelancing (&ldquo;Developer&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses, stores, and protects personal information in compliance with the Protection of Personal Information Act 4 of 2013 (POPIA) of South Africa.
                </p>
                <p>
                  The Developer provides services to Clients in South Africa and internationally. For Clients located in the European Union or the United Kingdom, the Developer&apos;s handling of personal information is additionally aligned with the EU General Data Protection Regulation (GDPR) and UK GDPR, and a Data Processing Agreement (DPA) under Article 28 is signed as part of the engagement (see <Link href="/dpa" className="text-orange-500 underline">DPA template</Link>).
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. INFORMATION WE COLLECT</h2>
                <p>We may collect the following personal information necessary for project delivery:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Client name, company name, email address, phone number</li>
                  <li>Payment information (processed via PayPal or EFT – we do not store raw card details)</li>
                  <li>Project-related communications and feedback</li>
                  <li>Technical information required for project delivery (API keys, access credentials, staging inputs)</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. HOW WE USE YOUR INFORMATION</h2>
                <p>We use your personal information strictly for:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Communicating about project deliverables and staging demos</li>
                  <li>Processing payments and invoicing</li>
                  <li>Delivering custom software and providing technical support</li>
                  <li>Invoicing and legal record-keeping</li>
                  <li>Complying with South African legal obligations</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. LAWFUL BASIS FOR PROCESSING</h2>
                <p>We process personal information based on:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Consent:</strong> Provided by you when engaging our software development services.</li>
                  <li><strong>Contractual necessity:</strong> To fulfill our obligations under project agreements and proposals.</li>
                  <li><strong>Legal obligation:</strong> Where required by South African law (e.g. SARS tax record compliance).</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. INFORMATION SHARING</h2>
                <p>We do not sell or rent your personal information. We may share information strictly with:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>PayPal (for secure payment processing)</li>
                  <li>Cloud API and hosting infrastructure providers strictly for project delivery requirements</li>
                  <li>Legal authorities if required by South African law or court order</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. DATA SECURITY</h2>
                <p>
                  We implement reasonable technical and organizational measures to protect your personal information, including encryption in transit (TLS 1.3), data-at-rest protection via hosting-provider infrastructure, strict access controls, and protected staging environments.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2">
                <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  7. DATA RETENTION & 7-DAY AUTOMATIC ERASURE
                </h2>
                <p className="text-slate-800 dark:text-emerald-100 font-medium">
                  7.1 We retain personal information only for as long as necessary to fulfill the project scope or as required by SARS tax law.
                </p>
                <p className="text-slate-800 dark:text-emerald-100 font-medium">
                  7.2 Project-related communications and tax invoices are retained for legal record-keeping.
                </p>
                <p className="text-slate-900 dark:text-white font-bold underline">
                  7.3 All Client-provided confidential data (real emails, client directories, names, numbers, physical addresses, and staging databases) will be permanently and irreversibly deleted from our active systems within 7 calendar days of final payment and source code handover. POPIA itself (Section 14) requires records to be destroyed or de-identified once the purpose for which they were collected has been served; this 7-day erasure is a voluntary commitment that is stricter than the statutory minimum.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">8. DATA SUBJECT RIGHTS</h2>
                <p>Under POPIA, you have the right to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Access your personal information held by us</li>
                  <li>Request correction of inaccurate or incomplete information</li>
                  <li>Request deletion or shredding of your confidential data</li>
                  <li>Object to processing on reasonable grounds</li>
                  <li>Withdraw consent at any time in writing</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">9. INFORMATION OFFICER</h2>
                <p>
                  The Developer&apos;s Information Officer can be contacted at: <br />
                  <strong>Email:</strong> <a href={`mailto:${SITE_CONFIG.email}`} className="text-orange-500 underline">{SITE_CONFIG.email}</a> <br />
                  <strong>WhatsApp:</strong> {SITE_CONFIG.whatsappFormatted}
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">10. CROSS-BORDER DATA TRANSFERS</h2>
                <p>
                  Your information may be transferred to AI API service providers located outside South Africa (e.g., API providers in the US/EU). Section 72 of POPIA permits a transfer outside the Republic where the recipient is subject to a law, binding corporate rules, or a binding agreement that provides substantially similar protection, or where the data subject consents. The Developer relies on those lawful grounds and conducts transfers with appropriate encryption and contractual safeguards in place.
                </p>
                <p>
                  Where the Developer processes personal information of data subjects in the EU/UK (for example, end-user data within a Client&apos;s application, or the Client&apos;s own business information), transfers outside the EEA/UK are made subject to appropriate safeguards as required by GDPR Article 44&ndash;49, including standard contractual clauses relied upon by the Developer&apos;s hosting and AI subprocessors. The Client&apos;s role as Data Controller and the Developer&apos;s role as Data Processor, including erasure obligations, is documented in the signed <Link href="/dpa" className="text-orange-500 underline">Data Processing Agreement</Link>.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">11. COOKIES AND TRACKING</h2>
                <p>
                  This policy applies to development services provided. Any custom website or web application built for the Client will require its own cookie consent mechanism — this is the Client&apos;s responsibility to implement post-handover.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">12. UPDATES TO THIS POLICY</h2>
                <p>
                  We may update this Privacy Policy from time to time. Material changes will be communicated directly to active clients.
                </p>
              </section>

            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center text-xs text-slate-500 gap-4">
              <span>Jordan Peters Coder Freelancing</span>
              <Link href="/popia" className="text-orange-500 hover:underline font-bold">
                View Full POPIA Compliance Policy →
              </Link>
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
