import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { ShieldCheck, FileText, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/data/portfolioData";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Jordan Peters Coder Freelancing. Clear terms on pricing, delivery, IP, and liability.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Hero */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Terms of Service
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Clear, fair terms. No hidden clauses.
            </p>
            <p className="text-xs text-slate-400">Last Updated: 11 August 2026</p>
          </div>

          {/* Section 1: Agreement */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-orange-500" />
              1. Agreement & Acceptance
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              By engaging Jordan Peters {SITE_CONFIG.tradingName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) to provide services, you (&quot;Client&quot;) accept these Terms of Service. They apply alongside any specific Statement of Work (SOW) signed by both parties. If there is a conflict, the SOW prevails.
            </p>
          </section>

          {/* Section 2: Services */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-orange-500" />
              2. Our Services
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              We provide custom software development, web application development, dashboard creation, and related consulting services. The exact scope, deliverables, timeline, and pricing for each project will be set out in a written SOW, which becomes binding once signed by both parties or confirmed via email by you.
            </p>
          </section>

          {/* Section 3: Quotes & Payment */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-500" />
              3. Quotes, Pricing & Payment
            </h2>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">3.1 Quotes</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Quotes are estimates based on information you provide. They are valid for <strong className="text-slate-900 dark:text-white">30 days</strong> from the date of issue.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  If your requirements change after the quote is issued, we will provide a revised quote.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <strong className="text-slate-900 dark:text-white">Price anchor:</strong> Most dashboard projects start from <strong className="text-slate-900 dark:text-white">R 15,000</strong> (excluding VAT if applicable). This is a guide, not a fixed price for all projects.
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">3.2 Payment Terms</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <strong className="text-slate-900 dark:text-white">Deposit:</strong> 50% of the total estimated project cost is due before work commences.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <strong className="text-slate-900 dark:text-white">Final Payment:</strong> The remaining 50% is due upon delivery of the final product, unless milestone payments are agreed in the SOW.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <strong className="text-slate-900 dark:text-white">Invoicing:</strong> Invoices are sent via email. Payment is due within <strong className="text-slate-900 dark:text-white">15 business days</strong> of the invoice date.
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Late Payment:</strong> If payment is not received within 15 business days, we reserve the right to suspend all work, charge interest at the prescribed rate under the National Credit Act (currently 11.75% per annum), and withhold delivery of source code or access to staging/production environments until the account is settled.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Scope */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-orange-500" />
              4. Scope & Change Management
            </h2>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  The SOW defines the initial scope. Any additional features, design changes, or functionality requested after the SOW is signed constitute a <strong className="text-slate-900 dark:text-white">change request</strong>.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  Change requests will be quoted separately and will adjust the timeline and total cost.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  We will not commence work on changes until you approve the revised quote in writing (email is sufficient).
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Scope creep:</strong> If you request work outside the SOW without a formal change request, we reserve the right to pause the project and issue a change quote before continuing.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Delivery */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-500" />
              5. Delivery & Acceptance
            </h2>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <strong className="text-slate-900 dark:text-white">Delivery:</strong> We deliver the final product via a staging link, code repository handover, or production deployment as agreed in the SOW.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <strong className="text-slate-900 dark:text-white">Acceptance Testing:</strong> You have <strong className="text-slate-900 dark:text-white">14 calendar days</strong> from delivery to test the product and report any bugs or defects that materially deviate from the SOW.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <strong className="text-slate-900 dark:text-white">Deemed Acceptance:</strong> If you do not report any issues within 14 days, the product is deemed accepted. If you start using the product in production (live environment), it is deemed accepted immediately.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <strong className="text-slate-900 dark:text-white">Post-Acceptance:</strong> After acceptance, bug fixes are charged at our standard hourly rate (currently <strong className="text-slate-900 dark:text-white">R 750/hour</strong>), unless they are severe defects that existed at the time of delivery and were not reasonably discoverable during testing.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: IP */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-orange-500" />
              6. Intellectual Property
            </h2>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <strong className="text-slate-900 dark:text-white">Ownership Transfer:</strong> Upon <strong className="text-slate-900 dark:text-white">full and final payment</strong> of all amounts owed, we transfer all intellectual property rights in the custom-developed code and deliverables to you.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <strong className="text-slate-900 dark:text-white">Pre-Existing IP:</strong> We retain ownership of any code libraries, frameworks, templates, or tools we used that were developed by us prior to this project. We grant you a perpetual, royalty-free, worldwide license to use these pre-existing components as part of the delivered product.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <strong className="text-slate-900 dark:text-white">Third-Party IP:</strong> Any open-source libraries, frameworks, or third-party software used remain the property of their respective owners and are governed by their own licenses.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <strong className="text-slate-900 dark:text-white">Portfolio Rights:</strong> We reserve the right to include screenshots and descriptions of the project in our portfolio, case studies, and social media, unless you explicitly request otherwise in writing.
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Source Code Escrow:</strong> If you have not paid in full, we are not obligated to release source code, and we retain full ownership until the account is settled.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Sections 7-17 summarized */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              7-17. Additional Terms
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Client Obligations</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Provide timely feedback and required information. 14-day response window or project may be placed on hold.</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Warranty</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">30-day warranty on delivered work. We fix material bugs at no cost during this period.</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Limitation of Liability</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Capped to the total amount paid for the project. No liability for indirect or consequential damages.</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Confidentiality</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Both parties keep non-public information confidential. Survives termination.</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Termination</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">7 days&apos; written notice by either party. You pay for work completed. We retain ownership of unpaid code.</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Data Protection</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">We comply with POPIA. You warrant that any data you provide has necessary consents.</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Subcontractors</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">We may engage subcontractors and remain responsible for their work.</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Governing Law</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">South African law. Disputes first go to informal negotiation, then to the National Consumer Tribunal or courts.</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="p-8 rounded-3xl bg-slate-900 text-white space-y-4">
            <h2 className="text-xl font-bold">Contact</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Jordan Peters {SITE_CONFIG.tradingName}</strong></p>
              <p>Email: <a href={`mailto:${SITE_CONFIG.email}`} className="text-orange-400 hover:underline">{SITE_CONFIG.email}</a></p>
              <p>Phone: <a href={`tel:${SITE_CONFIG.whatsappNumber}`} className="text-orange-400 hover:underline">{SITE_CONFIG.whatsappFormatted}</a></p>
            </div>
          </section>

          {/* Back link */}
          <div className="text-center">
            <Link href="/" className="text-orange-500 hover:underline text-sm font-bold">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
