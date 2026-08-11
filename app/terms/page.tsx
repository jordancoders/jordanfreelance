import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { ShieldCheck, FileText, ArrowLeft } from "lucide-react";
import { SITE_CONFIG } from "@/data/portfolioData";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service and legal agreements for Jordan Peters Coder Freelancing. Includes quality assurances, deposit terms, IP protection, and source code handover rules.",
};

export default function TermsPage() {
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-800">
                <FileText className="w-4 h-4" />
                Standard Master Services Agreement
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Terms of Service
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Last Updated: 08 August 2026 • Entity: Jordan Peters Coder Freelancing
              </p>
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
              
              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. SCOPE OF SERVICES</h2>
                <p>
                  The Developer agrees to build software solutions as described in the project scope provided by the Client. Specific deliverables, timelines, and payment terms are outlined in each project proposal/invoice.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. PAYMENT TERMS</h2>
                <p>2.1 A kick-off deposit is required to commence work. The exact percentage is agreed per project and stated in the quote. This covers labor kick-off and upfront API token costs.</p>
                <p>2.2 The remaining balance is due upon delivery of the complete source code. Source code will only be released after final payment is received.</p>
                <p>2.3 Quotes are valid for 14 days from the date of the invoice.</p>
              </section>

              <section id="no-gamble" className="p-6 rounded-2xl bg-slate-900 text-white border-2 border-emerald-500/60 space-y-2 shadow-lg">
                <h2 className="text-xl font-extrabold text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  3. THE &ldquo;NO-GAMBLE&rdquo; GUARANTEE
                </h2>
                <p className="text-slate-200 font-medium">
                  3.1 A live staging demo will be delivered within 48 hours of deposit confirmation.
                </p>
                <p className="text-emerald-300 font-bold">
                  3.2 If the staging demo is not delivered within 48 hours, the Client receives 100% of the deposit refunded + 100% of unused API credits.
                </p>
                <p className="text-slate-300 text-xs">
                  3.3 Once the staging link has been delivered, the deposit becomes non-refundable as the majority of API tokens and labor have been consumed. The 100% refund in clause 3.2 applies exclusively to non-delivery of the staging link within 48 hours.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. INTELLECTUAL PROPERTY & SOURCE CODE PROTECTION</h2>
                <p>4.1 Full ownership of the custom source code developed specifically for this project transfers to the Client upon final payment.</p>
                <p>4.2 Until final payment is received, all source code remains the exclusive property of the Developer.</p>
                <p>4.3 The staging demo deployed for Client review will contain minified, obfuscated, and production-built code. Source maps will be disabled. This is standard industry practice to protect intellectual property during development and review.</p>
                <p>4.4 Third-party tools, libraries, and APIs remain subject to their original licenses.</p>
                <p>4.5 The Developer retains the right to use general knowledge, skills, and reusable code components (not specific to the Client&apos;s proprietary business logic) for future work.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. CLIENT RESPONSIBILITIES</h2>
                <p>5.1 Provide timely access to required accounts, API keys, and inputs.</p>
                <p>5.2 Review deliverables via staging link and provide feedback within reasonable timelines.</p>
                <p>5.3 Use delivered systems lawfully and in compliance with all applicable laws.</p>
                <p><strong>5.4 HOSTING & DOMAIN:</strong> The Client is solely responsible for procuring hosting and domain registration. The Developer will provide ONE (1) complimentary deployment assistance session to help get the app live on Vercel/Netlify/AWS or similar platforms.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. API TOKEN USAGE</h2>
                <p>6.1 API costs are pass-through costs estimated per project.</p>
                <p>6.2 A live usage log will be provided upon request.</p>
                <p>6.3 Any unused credits will be refunded; any overages will be invoiced separately at cost (with prior written approval).</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">7. DATA POPULATION (Placeholder Policy)</h2>
                <p>7.1 The Developer provides the software framework, database schema, user interfaces, and business logic.</p>
                <p>7.2 The Client is solely responsible for populating the dashboard with their actual production data after handover.</p>
                <p>7.3 The Developer will seed the system with demo/dummy data strictly for testing and demonstration purposes.</p>
                <p>7.4 The Developer is not liable for inaccuracies, completeness, or legal compliance of the Client&apos;s uploaded content.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">8. DATA ERASURE (Confidential Info Deletion)</h2>
                <p>8.1 Within 7 calendar days of final payment, the Developer permanently deletes all Client-provided confidential information from local development environments, test databases, and temporary storage.</p>
                <p>8.2 Confidential information includes, but is not limited to: real client names, email addresses, phone numbers, physical addresses, ID numbers, financial information, API keys, and proprietary business data.</p>
                <p>8.3 The Developer retains only the sanitized source code (with no Client-specific production datasets).</p>
                <p>8.4 Upon written request, the Developer will provide a signed &ldquo;Data Destruction Certificate&rdquo; confirming secure erasure.</p>
                <p>8.5 During active development, dummy/placeholder data is used wherever possible to minimize exposure of sensitive Client information.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">9. LIMITATION OF LIABILITY</h2>
                <p>9.1 To the maximum extent permitted by law, the Developer is not liable for indirect, incidental, or consequential damages.</p>
                <p>9.2 The Developer&apos;s total liability for any claim arising from services rendered shall not exceed the total amount paid by the Client for the specific service giving rise to the claim.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">10. WARRANTY & SUPPORT</h2>
                <p>10.1 The Developer warrants that the delivered code will substantially conform to the agreed project scope.</p>
                <p>10.2 The Developer will provide reasonable support to fix any critical bugs discovered within 14 days of final delivery, provided the Client has not materially modified the code.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">11. TERMINATION</h2>
                <p>Either party may terminate the engagement in writing with reasonable notice. Outstanding invoices for completed work remain payable upon termination. Work in progress may be delivered in its current state or billed proportionally.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">12. CONFIDENTIALITY</h2>
                <p>All information shared during the course of the project is treated as confidential. The Developer does not disclose Client data, trade secrets, or proprietary systems to third parties without written consent.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">13. FORCE MAJEURE</h2>
                <p>The Developer is not liable for failure or delay in performance due to causes beyond reasonable control, including but not limited to acts of God, internet outages, API provider failures, or government restrictions.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">14. GOVERNING LAW</h2>
                <p>These terms are governed by the laws of the Republic of South Africa. Any dispute arising from these terms or the project will be resolved in the courts of South Africa.</p>
              </section>

              <section className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">15. SOURCE CODE HANDOVER</h2>
                <p>15.1 Upon full payment of the final balance, the Developer will transfer the complete, unminified source code to the Client.</p>
                <p>15.2 Transfer will occur via one of the following methods, at the Client&apos;s discretion:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Transfer of the private GitHub repository to the Client&apos;s account</li>
                  <li>Delivery of a ZIP file containing the complete source code</li>
                  <li>Push to a private repository designated by the Client</li>
                </ul>
                <p>15.3 Upon successful transfer, the Developer&apos;s access to the repository will be revoked.</p>
                <p>15.4 The Developer will provide written confirmation of handover and, upon request, a signed Data Destruction Certificate.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">16. PORTFOLIO SHOWCASE & PRIVACY</h2>
                <p>16.1 The Developer may request to showcase screenshots, live preview links, or descriptions of the completed project in their portfolio, website, or marketing materials.</p>
                <p>16.2 <strong>Opt-Out Guarantee:</strong> The Client has the absolute right to opt-out of this showcase during the project scoping phase or by written request at any time. If opted-out, the project will remain 100% private and will not be displayed anywhere on Jordan Peters Coder Freelancing&apos;s public sites.</p>
              </section>

              <section className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
                <h2 className="text-xl font-bold text-blue-900 dark:text-blue-300">17. INTERNATIONAL CLIENTS & DATA PROCESSING AGREEMENT</h2>
                <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                  17.1 <strong>Worldwide Service:</strong> The Developer provides services to Clients worldwide on a remote basis. Quotes may be issued in ZAR, USD, EUR, or GBP, and payments may be accepted via PayPal, Wise, or direct EFT (bank transfer), as agreed per project.
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                  17.2 <strong>Data Processing Agreement:</strong> For Clients subject to the EU GDPR or UK GDPR, a Data Processing Agreement (DPA) in accordance with Article 28 forms part of this Agreement and will be signed before processing commences. A copy of the DPA template is available at <Link href="/dpa" className="underline font-bold">/dpa</Link>. In this relationship, the Client acts as Data Controller and the Developer acts as Data Processor.
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                  17.3 <strong>US Clients:</strong> Upon request, the Developer will provide a completed W-8BEN form. Services are provided as independent contractor services with no US permanent establishment.
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">
                  17.4 <strong>Governing Law:</strong> These Terms remain governed by the laws of the Republic of South Africa as set out in clause 14, regardless of the Client&apos;s country of residence, and no clause in this Agreement is intended to waive any mandatory rights of data subjects under the GDPR/UK GDPR.
                </p>
              </section>

            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center text-xs text-slate-500 gap-4">
              <span>Jordan Peters Coder Freelancing</span>
              <Link href="/invoice-template" className="text-orange-500 hover:underline font-bold">
                View Sample Invoice & Legal Package →
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
