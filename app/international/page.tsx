import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import {
  Globe,
  DollarSign,
  CreditCard,
  ShieldCheck,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Handshake,
  Plane,
  Landmark,
} from "lucide-react";
import { SITE_CONFIG } from "@/data/portfolioData";

export const metadata = {
  title: "International Clients",
  description:
    "Jordan Peters Coder Freelancing builds custom web apps and dashboards for international clients worldwide. USD/EUR/GBP quotes, PayPal, Wise & Direct EFT payments, GDPR-aligned Data Processing Agreements, and the same 48-hour staging demo guarantee.",
};

export default function InternationalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* HERO */}
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-300 dark:border-blue-800">
              <Globe className="w-3.5 h-3.5" />
              Worldwide Remote — EU, UK, US, Canada, Australia & Beyond
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-[1.1]">
              Your Custom App. Built in South Africa.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600">
                Delivered Anywhere.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              I build custom dashboards, web apps, and MVPs for businesses worldwide — AI-orchestrated
              with a human quality gate, and with the same risk-reversal as my South African clients: a{" "}
              <strong className="text-slate-900 dark:text-white font-semibold">
                live staging demo in 48 hours
              </strong>{" "}
              you test before paying the balance. You own 100% of the code, in any currency, with
              international-friendly contracts.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a
                href={SITE_CONFIG.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Chat on WhatsApp
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(
                  "Project Inquiry (International)"
                )}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <Mail className="w-4 h-4" />
                Email: {SITE_CONFIG.email}
              </a>
            </div>
          </div>

          {/* TRUST STRIP */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: DollarSign, label: "USD / EUR / GBP Quotes" },
              { icon: CreditCard, label: "PayPal, Wise, Direct EFT" },
              { icon: ShieldCheck, label: "GDPR-Aligned DPA Signed" },
              { icon: Clock, label: "48-Hour Staging Demo" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 text-center space-y-2"
              >
                <item.icon className="w-5 h-5 mx-auto text-blue-500 dark:text-blue-400" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{item.label}</p>
              </div>
            ))}
          </div>

          {/* CURRENCY & PAYMENTS */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                International Pricing & Payments
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Quotes are issued in your currency. No hidden fees, no forex surprises — the price
                you approve is the price you pay.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white">Quote in Your Currency</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{SITE_CONFIG.currencies.join(" • ")}</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />Fixed-scope quotes, valid 14 days</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />Same transparent deposit & balance split</li>
                </ul>
              </div>
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-lg space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white">Pay the Way You Prefer</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {SITE_CONFIG.internationalPaymentMethods.map((m) => (
                    <li key={m} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />{m}</li>
                  ))}
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />Secure invoicing with full receipt trail</li>
                </ul>
              </div>
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white">US Clients: W-8BEN Ready</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />W-8BEN provided to certify foreign (non-US) status for US clients</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />Invoices structured as independent contractor services</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />No US permanent establishment claimed</li>
                </ul>
              </div>
            </div>
          </section>

          {/* LEGAL / DPA */}
          <section className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                International Data Protection
              </div>
              <h2 className="text-3xl font-extrabold text-white">
                GDPR & POPIA — Aligned, and Signed in Writing
              </h2>
              <p className="text-slate-300 max-w-3xl leading-relaxed">
                When you engage me, <strong className="text-white">you are the data controller</strong> of
                your customers&apos; data and I am your <strong className="text-white">processor</strong>. For EU/UK
                clients I sign a GDPR Article 28 Data Processing Agreement, so your procurement and
                legal teams get the paperwork they need without friction.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <strong className="text-blue-300 block">Article 28 DPA</strong>
                <p className="text-slate-300">Signed on request — covers instructions, confidentiality, security, subprocessors, breach notification, and your data subjects&apos; rights.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <strong className="text-blue-300 block">7-Day Erasure Commitment</strong>
                <p className="text-slate-300">Your confidential data is permanently destroyed within 7 calendar days of handover, with a written destruction certificate on request.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <strong className="text-blue-300 block">No AI Training on Your Data</strong>
                <p className="text-slate-300">Your business data is never used to train models or shared beyond the delivery pipeline.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <strong className="text-blue-300 block">Subprocessor Transparency</strong>
                <p className="text-slate-300">Hosting, AI APIs, and payment providers are disclosed in the DPA so nothing surprises your legal team.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/dpa"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-all"
              >
                <FileText className="w-4 h-4" />
                View DPA Template
              </Link>
              <Link
                href="/popia"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-600 transition-all"
              >
                View POPIA Policy
              </Link>
            </div>
          </section>

          {/* TIME ZONES & COMMUNICATION */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Time Zones Are Not a Problem
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                I work a remote-friendly cadence that overlaps with EU, UK, and North American
                business hours.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-center">
              {[
                { icon: Clock, title: "EU / UK Overlap", desc: "SAST (UTC+2) overlaps the full European working day — same-day replies are normal." },
                { icon: Globe, title: "US / Canada Overlap", desc: "Early-morning calls sync with Eastern US hours; async updates keep momentum." },
                { icon: Handshake, title: "Async-First Communication", desc: "Loom walkthroughs, staging links, and clear written updates so nothing depends on a single call." },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-lg space-y-3">
                  <item.icon className="w-7 h-7 mx-auto text-orange-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-2 border-orange-500/30 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                The Same Proven 48-Hour Process
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                No matter where you are, the risk is on me until you&apos;re happy.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              {[
                { step: "01", title: "Message & Quote", desc: "WhatsApp or email your scope. You get a fixed quote in your currency within hours." },
                { step: "02", title: "Deposit & 48-Hour Demo", desc: "Pay a transparent deposit. Your build is AI-orchestrated and human-reviewed at every step, and a live staging demo arrives within 48 hours — you click through it before paying the balance." },
                { step: "03", title: "Approve & Own", desc: "Approve the demo, pay the balance, receive 100% of the source code. Your confidential data is erased within 7 days." },
              ].map((item) => (
                <div key={item.step} className="p-5 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-black text-orange-500">{item.step}</span>
                  <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                Request Your International Quote
                <ArrowRight className="w-4 h-4" />
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
