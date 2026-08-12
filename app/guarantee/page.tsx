import Link from "next/link";
import {
  ShieldCheck,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  Scale,
  MessageSquareWarning,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE_CONFIG } from "@/data/portfolioData";

export const metadata = {
  title: "Refund & Guarantee Policy",
  description: "Our guarantees, refund terms, and what you can expect. No fine print, no surprises.",
};

// Bullet with an icon chip and a wrapping text block — the text lives in its
// own flex child so inline <strong> tags never overflow on small screens.
function Li({ icon, text, tone = "emerald" }: { icon: React.ReactNode; text: React.ReactNode; tone?: "emerald" | "amber" | "red" }) {
  const tones = {
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400 border-amber-200 dark:border-amber-900",
    red: "bg-red-100 text-red-600 dark:bg-red-950/70 dark:text-red-400 border-red-200 dark:border-red-900",
  };
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-0.5 shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center ${tones[tone]}`}>
        {icon}
      </span>
      <span className="flex-1 min-w-0 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{text}</span>
    </li>
  );
}

function SectionHeading({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
      <span className="w-10 h-10 shrink-0 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md">
        {icon}
      </span>
      {children}
    </h2>
  );
}

const quickFacts = [
  { icon: <Clock className="w-5 h-5" />, title: "48-Hour Staging", desc: "Full deposit refund if the demo isn't delivered on time (qualifying projects)" },
  { icon: <WrenchIcon />, title: "14-Day Bug-Fix", desc: "Critical bugs fixed at no charge after final delivery" },
  { icon: <TrashIcon />, title: "7-Day Data Erasure", desc: "Confidential data destroyed after handover — written confirmation" },
];

function WrenchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}

export default function GuaranteePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden py-16 sm:py-20 bg-slate-900 text-white border-b border-slate-800">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/40">
              <ShieldCheck className="w-4 h-4" />
              No Fine Print — No Surprises
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Refund &amp; Guarantee Policy
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              I stand behind my work — but I don&apos;t overpromise. Here is exactly what is guaranteed,
              when a refund applies, and the rights the law gives you anyway.
            </p>
            <p className="text-xs text-slate-400">Last Updated: 12 August 2026</p>

            {/* Quick facts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 max-w-3xl mx-auto">
              {quickFacts.map((f) => (
                <div key={f.title} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-1.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    {f.icon}
                  </div>
                  <p className="text-sm font-extrabold text-white">{f.title}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-14">
          {/* Section 1: Our Guarantees */}
          <section className="space-y-8">
            <SectionHeading icon={<ShieldCheck className="w-5 h-5" />}>
              1. Our Guarantees (What I Actually Promise)
            </SectionHeading>

            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-black">1.1</span>
                  Quality of Service Guarantee
                </h3>
                <ul className="space-y-3">
                  <Li icon={<CheckCircle2 className="w-3.5 h-3.5" />} text="The delivered work will substantially conform to the written specifications agreed in our Statement of Work." />
                  <Li icon={<CheckCircle2 className="w-3.5 h-3.5" />} text={<>If the delivered work has material defects or does not function as specified, I will <strong className="text-slate-900 dark:text-white font-semibold">fix it at no additional cost</strong> provided you report the issue within <strong className="text-slate-900 dark:text-white font-semibold">14 days</strong> of delivery.</>} />
                  <Li icon={<CheckCircle2 className="w-3.5 h-3.5" />} text="If I cannot fix the issue within a reasonable timeframe (generally 10 business days), you may request a partial or full refund for that deliverable." />
                </ul>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-black">1.2</span>
                  No-Lock-In Guarantee
                </h3>
                <ul className="space-y-3">
                  <Li icon={<CheckCircle2 className="w-3.5 h-3.5" />} text={<>You are not tied into any long-term contracts. You can pause or cancel your project at any time by giving <strong className="text-slate-900 dark:text-white font-semibold">7 days&apos; written notice</strong>.</>} />
                  <Li icon={<CheckCircle2 className="w-3.5 h-3.5" />} text="Upon cancellation, you will only be billed for work already completed up to that point (calculated on a time-and-materials basis)." />
                </ul>
              </div>

              <div id="48-hour-staging-guarantee" className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1A2D] border-2 border-emerald-500/50 shadow-lg space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                    <Clock className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">1.3 48-Hour Staging Refund Guarantee</h3>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Qualifying Projects Only</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <Li icon={<CheckCircle2 className="w-3.5 h-3.5" />} text={<>For projects explicitly marked as qualifying for this guarantee in the Statement of Work, I will deliver a <strong className="text-slate-900 dark:text-white font-semibold">staging/demo link within 48 hours</strong> of deposit confirmation and receipt of all required materials (credentials, designs, data, etc.) from you.</>} />
                  <Li icon={<CheckCircle2 className="w-3.5 h-3.5" />} text={<>If the deadline is missed, you choose either: <strong className="text-slate-900 dark:text-white font-semibold">(a)</strong> a <strong className="text-slate-900 dark:text-white font-semibold">full refund of your deposit plus 100% of unused API credits</strong>, or <strong className="text-slate-900 dark:text-white font-semibold">(b)</strong> continue with the project and receive <strong className="text-slate-900 dark:text-white font-semibold">one free hour of additional development</strong> (valued at R 750) at no cost. This backs the &ldquo;48-Hour Staging Refund Guarantee&rdquo; shown across this site.</>} />
                  <Li icon={<AlertCircle className="w-3.5 h-3.5" />} tone="amber" text={<><strong className="text-slate-900 dark:text-white font-semibold">Exclusions:</strong> This guarantee does not apply to projects that require complex third-party integrations, AI/ML models, or where the delay is caused by waiting on your feedback, credentials, or assets.</>} />
                  <Li icon={<CheckCircle2 className="w-3.5 h-3.5" />} text={<>This guarantee is binding and forms part of the contract between us. It does not limit any rights you have under the Consumer Protection Act 68 of 2008.</>} />
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Refund Policy */}
          <section className="space-y-8">
            <SectionHeading icon={<RefreshCw className="w-5 h-5" />}>
              2. Refund Policy — When and How
            </SectionHeading>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-black">2.1</span>
                When You Can Claim a Refund
              </h3>
              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full min-w-[560px] text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200 dark:border-slate-700">
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
                      <td className="p-3">Repair, re-performance, or refund (at our discretion)</td>
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

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center text-xs font-black">2.2</span>
                What Is NOT Refundable
              </h3>
              <ul className="space-y-3">
                <Li icon={<AlertCircle className="w-3.5 h-3.5" />} tone="red" text="Work already delivered and accepted by you (either in writing or by using the software in production)" />
                <Li icon={<AlertCircle className="w-3.5 h-3.5" />} tone="red" text="Third-party costs we incurred on your behalf (domains, hosting, software licenses, APIs) — these are passed through at cost" />
                <Li icon={<AlertCircle className="w-3.5 h-3.5" />} tone="red" text="Change requests or scope creep that were not in the original agreement" />
                <Li icon={<AlertCircle className="w-3.5 h-3.5" />} tone="red" text={<>Refund requests made more than <strong className="text-slate-900 dark:text-white font-semibold">30 days</strong> after final delivery</>} />
                <Li icon={<AlertCircle className="w-3.5 h-3.5" />} tone="red" text="Projects where you failed to provide timely feedback or required information, causing delays" />
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-black">2.3</span>
                How to Request a Refund
              </h3>
              <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300 list-decimal pl-5 leading-relaxed">
                <li>Email <strong className="text-slate-900 dark:text-white font-semibold">{SITE_CONFIG.email}</strong> with subject: <strong className="text-slate-900 dark:text-white font-semibold">&quot;Refund Request — [Invoice/Project Name]&quot;</strong></li>
                <li>Include: Your name, project details, invoice number, amount paid, and a clear explanation of the issue</li>
                <li>We will acknowledge within <strong className="text-slate-900 dark:text-white font-semibold">1 business day</strong></li>
                <li>We will investigate and respond with a decision within <strong className="text-slate-900 dark:text-white font-semibold">5 business days</strong></li>
                <li>If approved, we will refund via the original payment method within <strong className="text-slate-900 dark:text-white font-semibold">10 business days</strong></li>
              </ol>
            </div>
          </section>

          {/* Section 3: CPA Rights */}
          <section className="space-y-6">
            <SectionHeading icon={<Scale className="w-5 h-5" />}>
              3. CPA Rights — What the Law Actually Says
            </SectionHeading>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-sm">
              <p className="text-slate-600 dark:text-slate-300">The Consumer Protection Act 68 of 2008 gives you specific rights. Here is how I apply them:</p>
              <ul className="space-y-4">
                <Li icon={<CheckCircle2 className="w-3.5 h-3.5" />} text={<><strong className="text-slate-900 dark:text-white font-semibold">Section 54 (Quality of Services):</strong> I must perform my services with reasonable skill and care. If I don&apos;t, you can demand that I remedy the defect or refund you. I take this seriously — if you believe my work falls below standard, contact me immediately.</>} />
                <Li icon={<CheckCircle2 className="w-3.5 h-3.5" />} text={<><strong className="text-slate-900 dark:text-white font-semibold">Section 56 (Implied Warranty of Quality):</strong> This applies primarily to goods (e.g., if I supply a physical product). For digital deliverables, I warrant that the code I provide will function as specified. If it doesn&apos;t, I will fix or refund.</>} />
                <Li icon={<CheckCircle2 className="w-3.5 h-3.5" />} text={<><strong className="text-slate-900 dark:text-white font-semibold">Section 16 (Cooling-Off):</strong> Only applies if I approached you first (direct marketing). If that&apos;s you, you have <strong className="text-slate-900 dark:text-white font-semibold">5 business days</strong> to cancel without penalty from the date you accepted my offer.</>} />
              </ul>
            </div>
          </section>

          {/* Section 4: Dispute Resolution */}
          <section className="space-y-6">
            <SectionHeading icon={<MessageSquareWarning className="w-5 h-5" />}>
              4. Dispute Resolution
            </SectionHeading>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>If we cannot agree on a refund or remedy:</p>
              <ol className="space-y-2.5 list-decimal pl-5 leading-relaxed">
                <li>We will first attempt mediation — we will bring in a mutually agreed third party (e.g., a fellow developer or industry body) to assess the work.</li>
                <li>If mediation fails, either party may refer the matter to the <strong className="text-slate-900 dark:text-white font-semibold">National Consumer Tribunal</strong> or the courts of South Africa, as per the CPA.</li>
                <li>I will not take legal action against you for disputed amounts without first giving you 14 days&apos; written notice and an opportunity to settle.</li>
              </ol>
            </div>
          </section>

          {/* Section 5: Cooling-Off */}
          <section className="space-y-6">
            <SectionHeading icon={<Clock className="w-5 h-5" />}>
              5. Cooling-Off Period (Direct Marketing Only)
            </SectionHeading>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>If you engaged me after an unsolicited approach (phone call, email, or visit), you have <strong className="text-slate-900 dark:text-white font-semibold">5 business days</strong> from the date you accepted the quote to cancel the agreement in writing. I will refund any deposit paid, provided no work has commenced. If work has already started, you will be billed on a pro-rata basis for work done.</p>
            </div>
          </section>

          {/* Contact */}
          <section className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-5 shadow-xl border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              Need Help?
            </div>
            <h2 className="text-2xl font-extrabold">Contact Me About a Refund or Guarantee Claim</h2>
            <p className="text-slate-300 text-sm max-w-lg">
              For refund requests, guarantee claims, or any questions — reply directly and I&apos;ll get back to you within one business day.
            </p>
            <div className="space-y-2 text-sm">
              <p><strong className="text-white">Jordan Peters {SITE_CONFIG.tradingName}</strong></p>
              <p>Email: <a href={`mailto:${SITE_CONFIG.email}`} className="text-orange-400 hover:underline font-semibold">{SITE_CONFIG.email}</a></p>
              <p>Phone / WhatsApp: <a href={`tel:${SITE_CONFIG.phoneE164}`} className="text-orange-400 hover:underline font-semibold">{SITE_CONFIG.whatsappFormatted}</a></p>
            </div>
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <Link
                id="guarantee-contact-cta"
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg transition-all"
              >
                Request a Custom Quote
              </Link>
              <Link href="/" className="text-slate-300 hover:text-white text-sm font-bold transition-colors">
                ← Back to Home
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
