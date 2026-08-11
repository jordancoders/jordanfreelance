import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/data/portfolioData";

export const metadata = {
  title: "POPIA Compliance Policy",
  description: "POPIA Compliance Policy outlining how Jordan Peters Coder Freelancing adheres to all 8 Conditions for Lawful Processing under South Africa's POPIA Act 4 of 2013.",
};

export default function PopiaPage() {
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
                South African Statutory Compliance
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                POPIA Compliance Policy
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Last Updated: 08 August 2026 • Entity: Jordan Peters Coder Freelancing
              </p>
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
              
              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. INTRODUCTION</h2>
                <p>
                  This POPIA Compliance Policy outlines how Jordan Peters Coder Freelancing (&ldquo;Developer&rdquo;) ensures full compliance with the Protection of Personal Information Act 4 of 2013 (POPIA) in the provision of custom software development services to South African SMEs and international clients. For clients located in the EU/UK, the Developer additionally aligns its processing with the GDPR/UK GDPR through a signed Data Processing Agreement (see the <Link href="/dpa" className="text-orange-500 underline">DPA template</Link>), while POPIA remains the Developer&apos;s primary statutory framework.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. DESIGNATED INFORMATION OFFICER</h2>
                <p>
                  As required by Section 55(1) of POPIA, the Developer — a South African sole proprietor — is a &ldquo;responsible party&rdquo; and has designated an Information Officer. For a sole proprietor the head of the private body (the owner) is the Information Officer by default, unless a deputy is designated in terms of Section 55(2). The Information Officer oversees POPIA compliance and data subject requests. <br />
                  <strong>Contact Email:</strong> <a href={`mailto:${SITE_CONFIG.email}`} className="text-orange-500 underline">{SITE_CONFIG.email}</a>
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3">
                <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  3. THE 8 POPIA CONDITIONS FOR LAWFUL PROCESSING
                </h2>
                <p className="text-xs text-slate-300">The Developer adheres strictly to all 8 POPIA statutory conditions:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200 pt-2">
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <strong className="text-orange-400 block">3.1 Accountability:</strong> Information Officer oversees all development compliance.
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <strong className="text-orange-400 block">3.2 Processing Limitation:</strong> Minimal, lawful, transparent data handling.
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <strong className="text-orange-400 block">3.3 Purpose Specification:</strong> Clear, legitimate project goals communicated upfront.
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <strong className="text-orange-400 block">3.4 Further Processing:</strong> Data never reused for incompatible purposes.
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <strong className="text-orange-400 block">3.5 Information Quality:</strong> Accuracy and completeness maintained.
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <strong className="text-orange-400 block">3.6 Openness:</strong> Notification of processing activities.
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <strong className="text-orange-400 block">3.7 Security Safeguards:</strong> Encryption in transit (TLS 1.3), with data-at-rest protection via hosting-provider infrastructure and strict access controls.
                  </div>
                  <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                    <strong className="text-orange-400 block">3.8 Data Subject Rights:</strong> Complete access, deletion, and porting rights.
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. CONSENT</h2>
                <p>4.1 By engaging the Developer&apos;s services, the Client provides explicit consent for the processing of personal information necessary for project delivery.</p>
                <p>4.2 Consent is specific, voluntary, and informed.</p>
                <p>4.3 The Client may withdraw consent at any time by written notice, subject to contractual obligations.</p>
                <p>4.4 Consent is not bundled – each processing purpose is addressed separately.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. DATA SUBJECT RIGHTS IMPLEMENTATION</h2>
                <p>5.1 Access Requests: Data subjects may request access to their personal information. Section 26 of POPIA requires a response within a reasonable time; the Developer&apos;s response standard is 30 days, consistent with the access-to-records timeframes in Section 25 of PAIA.</p>
                <p>5.2 Correction Requests: Inaccurate data will be corrected immediately.</p>
                <p>5.3 Deletion Requests: Data will be deleted and an audit log maintained.</p>
                <p>5.4 Portability Requests: Data will be provided in a machine-readable format.</p>
                <p>5.5 Objection: Direct marketing will cease upon objection.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">6. SECURITY MEASURES</h2>
                <p>The Developer implements the following technical and organizational security measures:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Encryption in transit (TLS 1.3); data at rest protected by hosting-provider infrastructure encryption and strict access controls</li>
                  <li>Least privilege access controls & obfuscated staging builds</li>
                  <li>Data Minimization: Only minimum required data collected</li>
                  <li><strong>Scheduled Erasure:</strong> All Client confidential data deleted within 7 days of project completion — a voluntary commitment that exceeds the statutory duty in Section 14 of POPIA to destroy or delete records once the purpose has been served</li>
                  <li>Incident response protocol</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">7. BREACH NOTIFICATION</h2>
                <p>In the event of a security compromise or breach of personal information, Section 22 of POPIA requires the responsible party to notify the Information Regulator and the affected data subject &ldquo;as soon as reasonably possible&rdquo; after becoming aware of the breach:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The Information Regulator (Regulator) will be notified as soon as reasonably possible after the breach is detected</li>
                  <li>Affected data subjects will also be notified, unless the Regulator directs otherwise or the breach cannot be linked to identifiable data subjects</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">8. OPERATORS (SUBCONTRACTORS)</h2>
                <p>The Developer engages third-party infrastructure services (payment processors, hosting providers, and cloud APIs) strictly for project delivery. All operators are contractually bound to comply with POPIA via their own Data Processing Agreements.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">9. PAIA MANUAL</h2>
                <p>The Developer maintains a PAIA Manual as required by Section 51 of the Promotion of Access to Information Act.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">10. INFORMATION OFFICER & REGISTRATION WITH THE INFORMATION REGULATOR</h2>
                <p>
                  10.1 In terms of Section 55 of POPIA, the head of the Developer&apos;s private body acts as the Information Officer — for a sole proprietor, the owner is the Information Officer by default, unless a deputy is designated under Section 55(2). The Information Officer oversees POPIA compliance and handles data-subject requests.
                </p>
                <p>
                  10.2 Regulation 3 of the POPIA Regulations (2018) requires the Information Officer of a private body to be registered with the Information Regulator through its online registration portal. The Developer is currently completing this registration and will maintain it for the duration of its processing activities. Registration status, and proof of registration once complete, will be made available to Clients upon request.
                </p>
                <p>
                  10.3 Section 57 of POPIA requires prior authorisation from the Regulator only for specific higher-risk processing (for example, certain special personal information and credit information); the Developer will obtain such authorisation if and when a project falls within those categories.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">11. DIRECT MARKETING</h2>
                <p>Direct marketing only occurs where explicit, recorded consent has been obtained.</p>
              </section>

              <section className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">12. POLICY REVIEW</h2>
                <p>This POPIA Compliance Policy is reviewed annually and updated as necessary to reflect changes in South African legislation or business practices.</p>
              </section>

            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center text-xs text-slate-500 gap-4">
              <span>Jordan Peters Coder Freelancing</span>
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
