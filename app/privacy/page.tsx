import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "@/data/portfolioData";

export const metadata = {
  title: "Privacy Policy (POPIA-Aligned)",
  description: "Official POPIA Privacy Policy for Jordan Peters Coder Freelancing. Information collection, usage, data erasure policy, and your rights.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-800">
              <ShieldCheck className="w-4 h-4" />
              POPIA Compliant
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              How we collect, use, and protect your personal information under POPIA.
            </p>
            <p className="text-xs text-slate-400">Last Updated: 11 August 2026</p>
          </div>

          {/* Section 1: Responsible Party */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-orange-500" />
              1. Responsible Party
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Jordan Peters {SITE_CONFIG.tradingName} (hereinafter &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is the Responsible Party for processing your personal information as defined under the Protection of Personal Information Act, 2013 (POPIA).
            </p>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-6 h-6 text-orange-500" />
              2. Information We Collect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Identity & Contact</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Name, email, phone, company name, job title</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Enquiry Data</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Project requirements from forms, emails, calls</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Technical Data</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">IP address, browser type, referral URLs</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Usage Data</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">How you interact with our website</p>
              </div>
            </div>
          </section>

          {/* Section 3: Lawful Basis */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-6 h-6 text-orange-500" />
              3. Why We Process Your Information
            </h2>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Consent:</strong> When you tick a box or explicitly agree to receive marketing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Contractual Necessity:</strong> To prepare quotes, deliver services, and communicate about your project.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Legitimate Interest:</strong> To improve our website, prevent fraud, and maintain records — provided these don&apos;t override your rights.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: How We Collect */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-6 h-6 text-orange-500" />
              4. How We Collect Information
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Direct interactions:</strong> Filling out forms, emailing us, or calling us.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Automated technologies:</strong> Cookies and analytics tools (see Section 8).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-white">Third-party sources:</strong> Publicly available data (e.g., LinkedIn) only if you initiate contact.</span>
              </li>
            </ul>
          </section>

          {/* Section 5: Data Processors */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-6 h-6 text-orange-500" />
              5. Who We Share Your Information With
            </h2>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>We use the following third-party processors to operate our business:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Hosting & Infrastructure:</strong> Vercel (EU regions)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Email & Communication:</strong> Gmail, Resend</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Database:</strong> MongoDB Atlas</span>
                </li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400">We do not sell or rent your personal information to any third party.</p>
            </div>
          </section>

          {/* Section 6: Data Retention */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trash2 className="w-6 h-6 text-orange-500" />
              6. Data Retention & Deletion
            </h2>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>We retain your personal information only for as long as necessary to fulfil the purposes outlined in this policy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>If we have not exchanged a message or worked on a project for <strong className="text-slate-900 dark:text-white">12 consecutive months</strong>, we will securely delete all your personal information unless you have actively opted-in to marketing communications.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>You may request deletion at any time (see Section 10).</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 7: Data Breach */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              7. Data Security & Breach Notification
            </h2>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>We implement safeguards including encryption (HTTPS), access controls, and secure storage.</p>
              <p>In the event of a data breach that is likely to adversely affect your privacy:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>We will notify the <strong className="text-slate-900 dark:text-white">Information Regulator</strong> within 72 hours of becoming aware.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>We will notify you directly if the breach poses a high risk to your rights and freedoms.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 8: Cookies */}
          <section id="cookies" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-6 h-6 text-orange-500" />
              8. Cookies & Consent
            </h2>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Essential cookies:</strong> Do not require consent; they are necessary for the site to work.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Non-essential cookies:</strong> We will only drop these <em>after</em> you click &quot;Accept&quot; on our cookie banner. You can withdraw consent at any time.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 9: Direct Marketing */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              9. Direct Marketing
            </h2>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>We will only send you marketing emails if you have given us explicit, separate consent.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>You can withdraw this consent at any time by emailing <strong className="text-slate-900 dark:text-white">{SITE_CONFIG.email}</strong> with the subject &quot;Unsubscribe&quot;.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Existing clients:</strong> We may send service-related communications (project updates, invoices) without explicit consent, as this is necessary for our contractual relationship.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 10: Your Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-orange-500" />
              10. Your Rights (POPIA Sections 23 & 24)
            </h2>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>You have the right to:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Access:</strong> Request a copy of the personal information we hold about you.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Correction:</strong> Ask us to update or correct inaccurate information.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Deletion:</strong> Request that we delete your personal information.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Objection:</strong> Object to processing based on legitimate interest or direct marketing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-900 dark:text-white">Complaint:</strong> Lodge a complaint with the Information Regulator of South Africa.</span>
                </li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400">To exercise any of these rights, contact us at <strong>{SITE_CONFIG.email}</strong>. We will respond within <strong>5 business days</strong>.</p>
            </div>
          </section>

          {/* Section 11-13 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              11-13. International Transfers, Changes & Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">International Transfers</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your data may be processed outside South Africa. We ensure appropriate safeguards (e.g., Standard Contractual Clauses).</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Changes to This Policy</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">We review this policy annually. Changes effective 14 days after posting.</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Information Regulator</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Website: https://www.inforegulator.org.za</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="p-8 rounded-3xl bg-slate-900 text-white space-y-4">
            <h2 className="text-xl font-bold">Contact Us</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Jordan Peters {SITE_CONFIG.tradingName}</strong></p>
              <p>Email: <a href={`mailto:${SITE_CONFIG.email}`} className="text-orange-400 hover:underline">{SITE_CONFIG.email}</a></p>
              <p>Phone: <a href={`tel:${SITE_CONFIG.phoneE164}`} className="text-orange-400 hover:underline">{SITE_CONFIG.whatsappFormatted}</a></p>
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
