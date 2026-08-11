import Link from "next/link";
import { ShieldCheck, RefreshCw, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE_CONFIG } from "@/data/portfolioData";

export const metadata = {
  title: "Refund & Guarantee Policy",
  description: "Our guarantees, refund terms, and what you can expect. No fine print, no surprises.",
};

export default function GuaranteePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-800">
              <ShieldCheck className="w-4 h-4" />
              No Fine Print
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Refund & Guarantee Policy
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              We stand behind our work, but we are careful not to overpromise. Here is exactly what we guarantee — and what we don&apos;t.
            </p>
            <p className="text-xs text-slate-400">Last Updated: 11 August 2026</p>
          </div>

          {/* Section 1: Our Guarantees */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-orange-500" />
              1. Our Guarantees (What We Actually Promise)
            </h2>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">1.1 Quality of Service Guarantee</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    The delivered work will substantially conform to the written specifications agreed in our Statement of Work.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    If the delivered work has material defects or does not function as specified, we will <strong className="text-slate-900 dark:text-white">fix it at no additional cost</strong> provided you report the issue within <strong className="text-slate-900 dark:text-white">14 days</strong> of delivery.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    If we cannot fix the issue within a reasonable timeframe (generally 10 business days), you may request a partial or full refund for that deliverable.
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">1.2 No-Lock-In Guarantee</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    You are not tied into any long-term contracts. You can pause or cancel your project at any time by giving <strong className="text-slate-900 dark:text-white">7 days&apos; written notice</strong>.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    Upon cancellation, you will only be billed for work already completed up to that point (calculated on a time-and-materials basis).
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">1.3 48-Hour Staging Guarantee (Qualifying Projects Only)</h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    For projects explicitly marked as qualifying for this guarantee in the Statement of Work, we will deliver a <strong className="text-slate-900 dark:text-white">staging/demo link within 48 hours</strong> of receiving all required materials (credentials, designs, data, etc.) from you.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <strong className="text-slate-900 dark:text-white">What happens if we miss it?</strong> You get <strong className="text-slate-900 dark:text-white">one free hour of additional development</strong> (valued at R 750) added to your project at no cost. This is a goodwill gesture, not a cash refund trigger, because the work is still in progress — you don&apos;t lose any value.
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <strong className="text-slate-900 dark:text-white">Exclusions:</strong> This guarantee does not apply to projects that require complex third-party integrations, AI/ML models, or where we are waiting on your feedback or assets.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Refund Policy */}
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="w-6 h-6 text-orange-500" />
              2. Refund Policy — When and How
            </h2>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">2.1 When You Can Claim a Refund</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left p-3 font-bold text-slate-900 dark:text-white">Scenario</th>
                      <th className="text-left p-3 font-bold text-slate-900 dark:text-white">Refund Entitlement</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-600 dark:text-slate-300">
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-medium">Non-delivery: We fail to deliver the final product within the agreed timeframe</td>
                      <td className="p-3">Full refund of all payments made for that deliverable</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-medium">Material non-compliance: The final product does not match the agreed specifications and we cannot fix it</td>
                      <td className="p-3">Pro-rata refund for the non-compliant portion</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-medium">Defective services: The service falls below the standard of quality reasonably expected (CPA Section 54)</td>
                      <td className="p-3"> Repair, re-performance, or refund (at our discretion)</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-medium">Cooling-off (direct marketing only): You signed up after an unsolicited approach</td>
                      <td className="p-3">Full cancellation with no penalty within 5 business days of acceptance (CPA Section 16)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Mutual agreement: We both agree the project should be ended</td>
                      <td className="p-3">Refund of unearned deposits, less costs already incurred</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">2.2 What Is NOT Refundable</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  Work already delivered and accepted by you (either in writing or by using the software in production)
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  Third-party costs we incurred on your behalf (domains, hosting, software licenses, APIs) — these are passed through at cost
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  Change requests or scope creep that were not in the original agreement
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  Refund requests made more than <strong className="text-slate-900 dark:text-white">30 days</strong> after final delivery
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  Projects where you failed to provide timely feedback or required information, causing delays
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">2.3 How to Request a Refund</h3>
              <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-decimal pl-5">
                <li>Email <strong className="text-slate-900 dark:text-white">{SITE_CONFIG.email}</strong> with subject: <strong className="text-slate-900 dark:text-white">&quot;Refund Request — [Invoice/Project Name]&quot;</strong></li>
                <li>Include: Your name, project details, invoice number, amount paid, and a clear explanation of the issue</li>
                <li>We will acknowledge within <strong className="text-slate-900 dark:text-white">1 business day</strong></li>
                <li>We will investigate and respond with a decision within <strong className="text-slate-900 dark:text-white">5 business days</strong></li>
                <li>If approved, we will refund via the original payment method within <strong className="text-slate-900 dark:text-white">10 business days</strong></li>
              </ol>
            </div>
          </section>

          {/* Section 3: CPA Rights */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-orange-500" />
              3. CPA Rights — What the Law Actually Says
            </h2>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <p>The Consumer Protection Act 68 of 2008 gives you specific rights. Here is how we apply them:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Section 54 (Quality of Services):</strong> We must perform our services with reasonable skill and care. If we don&apos;t, you can demand that we remedy the defect or refund you. We take this seriously — if you believe our work falls below standard, contact us immediately.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Section 56 (Implied Warranty of Quality):</strong> This applies primarily to goods (e.g., if we supply a physical product). For digital deliverables, we warrant that the code we provide will function as specified. If it doesn&apos;t, we will fix or refund.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Section 16 (Cooling-Off):</strong> Only applies if we approached you first (direct marketing). If that&apos;s you, you have <strong className="text-slate-900 dark:text-white">5 business days</strong> to cancel without penalty from the date you accepted our offer.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Dispute Resolution */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              4. Dispute Resolution
            </h2>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>If we cannot agree on a refund or remedy:</p>
              <ol className="space-y-2 list-decimal pl-5">
                <li>We will first attempt mediation — we will bring in a mutually agreed third party (e.g., a fellow developer or industry body) to assess the work.</li>
                <li>If mediation fails, either party may refer the matter to the <strong className="text-slate-900 dark:text-white">National Consumer Tribunal</strong> or the courts of South Africa, as per the CPA.</li>
                <li>We will not take legal action against you for disputed amounts without first giving you 14 days&apos; written notice and an opportunity to settle.</li>
              </ol>
            </div>
          </section>

          {/* Section 5: Cooling-Off */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-500" />
              5. Cooling-Off Period (Direct Marketing Only)
            </h2>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>If you engaged us after an unsolicited approach (phone call, email, or visit), you have <strong className="text-slate-900 dark:text-white">5 business days</strong> from the date you accepted our quote to cancel the agreement in writing. We will refund any deposit paid, provided no work has commenced. If work has already started, you will be billed on a pro-rata basis for work done.</p>
            </div>
          </section>

          {/* Contact */}
          <section className="p-8 rounded-3xl bg-slate-900 text-white space-y-4">
            <h2 className="text-xl font-bold">Contact Us</h2>
            <p className="text-slate-300 text-sm">
              For refund requests, guarantee claims, or any questions:
            </p>
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
