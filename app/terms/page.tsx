import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Scale,
  Lock,
  MessageSquareWarning,
} from "lucide-react";
import { SITE_CONFIG } from "@/data/portfolioData";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Jordan Peters Coder Freelancing. Clear terms on pricing, delivery, IP, and liability.",
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
  { icon: <Clock className="w-5 h-5" />, title: "30-Day Quotes", desc: "Quotes are valid for 30 days from the date of issue" },
  { icon: <ShieldCheck className="w-5 h-5" />, title: "50% Deposit", desc: "Due before work commences — balance on final delivery" },
  { icon: <CheckCircle2 className="w-5 h-5" />, title: "14-Day Acceptance", desc: "Full test window to report bugs after delivery" },
  { icon: <Lock className="w-5 h-5" />, title: "Full IP on Final Payment", desc: "Custom code is 100% yours once the account is settled" },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden py-16 sm:py-20 bg-slate-900 text-white border-b border-slate-800">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/15 text-orange-300 text-xs font-bold border border-orange-500/40">
              <Scale className="w-4 h-4" />
              Clear Terms — No Hidden Clauses
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Terms of Service
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Fair, plain-language terms covering quotes, payments, delivery, intellectual property,
              and liability. No hidden clauses — if a Statement of Work (SOW) is signed, it prevails.
            </p>
            <p className="text-xs text-slate-400">Last Updated: 12 August 2026</p>

            {/* Quick facts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto">
              {quickFacts.map((f) => (
                <div key={f.title} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-1.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
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
          {/* Section 1: Agreement */}
          <section className="space-y-5">
            <SectionHeading icon={<ShieldCheck className="w-5 h-5" />}>
              1. Agreement &amp; Acceptance
            </SectionHeading>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              By engaging Jordan Peters {SITE_CONFIG.tradingName} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) to provide services, you (&quot;Client&quot;)
              accept these Terms of Service. They apply alongside any specific Statement of Work (SOW) signed by both
              parties. If there is a conflict, the SOW prevails.
            </p>
          </section>

          {/* Section 2: Services */}
          <section className="space-y-5">
            <SectionHeading icon={<FileText className="w-5 h-5" />}>
              2. Our Services
            </SectionHeading>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              We provide custom software development, web application development, dashboard creation, and related
              consulting services. The exact scope, deliverables, timeline, and pricing for each project will be set out
              in a written SOW, which becomes binding once signed by both parties or confirmed via email by you.
            </p>
          </section>

          {/* Section 3: Quotes & Payment */}
          <section className="space-y-8">
            <SectionHeading icon={<Clock className="w-5 h-5" />}>
              3. Quotes, Pricing &amp; Payment
            </SectionHeading>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-black">3.1</span>
                Quotes
              </h3>
              <ul className="space-y-3">
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<>Quotes are estimates based on information you provide. They are valid for <strong className="text-slate-900 dark:text-white">30 days</strong> from the date of issue.</>}
                />
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<>If your requirements change after the quote is issued, we will provide a revised quote.</>}
                />
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<><strong className="text-slate-900 dark:text-white">Price anchor:</strong> Most dashboard projects start from <strong className="text-slate-900 dark:text-white">R 15,000</strong> (excluding VAT if applicable). This is a guide, not a fixed price for all projects.</>}
                />
              </ul>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-black">3.2</span>
                Payment Terms
              </h3>
              <ul className="space-y-3">
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<><strong className="text-slate-900 dark:text-white">Deposit:</strong> 50% of the total estimated project cost is due before work commences.</>}
                />
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<><strong className="text-slate-900 dark:text-white">Final Payment:</strong> The remaining 50% is due upon delivery of the final product, unless milestone payments are agreed in the SOW.</>}
                />
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<>Invoices are sent via email. Payment is due within <strong className="text-slate-900 dark:text-white">15 business days</strong> of the invoice date.</>}
                />
                <Li
                  icon={<AlertCircle className="w-3.5 h-3.5" />}
                  tone="amber"
                  text={<><strong className="text-slate-900 dark:text-white">Late Payment:</strong> If payment is not received within 15 business days, we reserve the right to suspend all work, charge interest at the prescribed rate under the National Credit Act (currently 11.75% per annum), and withhold delivery of source code or access to staging/production environments until the account is settled.</>}
                />
              </ul>
            </div>
          </section>

          {/* Section 4: Scope */}
          <section className="space-y-5">
            <SectionHeading icon={<FileText className="w-5 h-5" />}>
              4. Scope &amp; Change Management
            </SectionHeading>
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md">
              <ul className="space-y-3">
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<>The SOW defines the initial scope. Any additional features, design changes, or functionality requested after the SOW is signed constitute a <strong className="text-slate-900 dark:text-white">change request</strong>.</>}
                />
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<>Change requests will be quoted separately and will adjust the timeline and total cost.</>}
                />
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<>We will not commence work on changes until you approve the revised quote in writing (email is sufficient).</>}
                />
                <Li
                  icon={<AlertCircle className="w-3.5 h-3.5" />}
                  tone="amber"
                  text={<><strong className="text-slate-900 dark:text-white">Scope creep:</strong> If you request work outside the SOW without a formal change request, we reserve the right to pause the project and issue a change quote before continuing.</>}
                />
              </ul>
            </div>
          </section>

          {/* Section 5: Delivery */}
          <section className="space-y-5">
            <SectionHeading icon={<Clock className="w-5 h-5" />}>
              5. Delivery &amp; Acceptance
            </SectionHeading>
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md">
              <ul className="space-y-3">
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<><strong className="text-slate-900 dark:text-white">Delivery:</strong> We deliver the final product via a staging link, code repository handover, or production deployment as agreed in the SOW.</>}
                />
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<><strong className="text-slate-900 dark:text-white">Acceptance Testing:</strong> You have <strong className="text-slate-900 dark:text-white">14 calendar days</strong> from delivery to test the product and report any bugs or defects that materially deviate from the SOW.</>}
                />
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<><strong className="text-slate-900 dark:text-white">Deemed Acceptance:</strong> If you do not report any issues within 14 days, the product is deemed accepted. If you start using the product in production (live environment), it is deemed accepted immediately.</>}
                />
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<><strong className="text-slate-900 dark:text-white">Post-Acceptance:</strong> After acceptance, bug fixes are charged at our standard hourly rate (currently <strong className="text-slate-900 dark:text-white">R 750/hour</strong>), unless they are severe defects that existed at the time of delivery and were not reasonably discoverable during testing.</>}
                />
              </ul>
            </div>
          </section>

          {/* Section 6: IP */}
          <section className="space-y-5">
            <SectionHeading icon={<Lock className="w-5 h-5" />}>
              6. Intellectual Property
            </SectionHeading>
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md">
              <ul className="space-y-3">
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<><strong className="text-slate-900 dark:text-white">Ownership Transfer:</strong> Upon <strong className="text-slate-900 dark:text-white">full and final payment</strong> of all amounts owed, we transfer all intellectual property rights in the custom-developed code and deliverables to you.</>}
                />
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<><strong className="text-slate-900 dark:text-white">Pre-Existing IP:</strong> We retain ownership of any code libraries, frameworks, templates, or tools we used that were developed by us prior to this project. We grant you a perpetual, royalty-free, worldwide license to use these pre-existing components as part of the delivered product.</>}
                />
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<><strong className="text-slate-900 dark:text-white">Third-Party IP:</strong> Any open-source libraries, frameworks, or third-party software used remain the property of their respective owners and are governed by their own licenses.</>}
                />
                <Li
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  text={<><strong className="text-slate-900 dark:text-white">Portfolio Rights:</strong> We reserve the right to include screenshots and descriptions of the project in our portfolio, case studies, and social media, unless you explicitly request otherwise in writing.</>}
                />
                <Li
                  icon={<AlertCircle className="w-3.5 h-3.5" />}
                  tone="amber"
                  text={<><strong className="text-slate-900 dark:text-white">Source Code Escrow:</strong> If you have not paid in full, we are not obligated to release source code, and we retain full ownership until the account is settled.</>}
                />
              </ul>
            </div>
          </section>

          {/* Sections 7-17 summarized */}
          <section className="space-y-6">
            <SectionHeading icon={<MessageSquareWarning className="w-5 h-5" />}>
              7–17. Additional Terms
            </SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Client Obligations</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Provide timely feedback and required information. 14-day response window or project may be placed on hold.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Warranty</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">14-day bug fix warranty on delivered work. We fix material bugs at no cost during this period.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Limitation of Liability</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Capped to the total amount paid for the project. No liability for indirect or consequential damages.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Confidentiality</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Both parties keep non-public information confidential. Survives termination.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Termination</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">7 days&apos; written notice by either party. You pay for work completed. We retain ownership of unpaid code.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Data Protection</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">We comply with POPIA. You warrant that any data you provide has necessary consents.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Subcontractors</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">We may engage subcontractors and remain responsible for their work.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Governing Law</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">South African law. Disputes first go to informal negotiation, then to the National Consumer Tribunal or courts.</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-4 border border-slate-800">
            <h2 className="text-xl font-bold">Contact</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Jordan Peters {SITE_CONFIG.tradingName}</strong></p>
              <p>Email: <a href={`mailto:${SITE_CONFIG.email}`} className="text-orange-400 hover:underline">{SITE_CONFIG.email}</a></p>
              <p>Phone: <a href={`tel:${SITE_CONFIG.phoneE164}`} className="text-orange-400 hover:underline">{SITE_CONFIG.whatsappFormatted}</a></p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
              Nothing in these Terms limits your rights under the Consumer Protection Act 68 of 2008 — including the
              5-business-day cooling-off right where we approached you first. See the{" "}
              <Link href="/guarantee" className="text-orange-400 hover:underline font-semibold">Guarantee &amp; Refund Policy</Link>{" "}
              for the full breakdown of refunds, the 48-hour staging guarantee, and the 14-day bug-fix warranty.
            </p>
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
