import Link from "next/link";
import { ShieldAlert, RefreshCw, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProcessSteps from "@/components/ProcessSteps";
import NoGambleGuarantee from "@/components/NoGambleGuarantee";
import FaqAccordion from "@/components/FaqAccordion";
import { SITE_CONFIG } from "@/data/portfolioData";

export const metadata = {
  title: "My AI Quality Gate Process | 48-Hour Staging Demo & POPIA",
  description: "Learn how Jordan Peters Coder Freelancing delivers agency-quality web apps with zero risk: AI-orchestrated builds with a human quality gate, 8-step workflow, 48-hour staging demo, POPIA compliance, and 7-day data erasure.",
};

export default function ProcessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-[#070D17] dark:via-[#0A1628] dark:to-[#070D17] border-b border-slate-200 dark:border-slate-800 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-800">
              <RefreshCw className="w-4 h-4" />
              Transparent Development Model
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              My AI Quality Gate Process
            </h1>

            <p className="text-lg sm:text-2xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              A development model built on trust, transparency, and speed.
            </p>

            <div className="pt-2 flex justify-center gap-4">
              <Link
                id="process-hero-quote-btn"
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all"
              >
                Request a Custom Quote →
              </Link>
            </div>

          </div>
        </section>

        {/* THE AI SOFTWARE ENGINEERING ADVANTAGE SECTION */}
        <section className="py-16 bg-white dark:bg-[#080F1D] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-xl">
              
              <div className="flex items-center gap-3 text-orange-400 font-bold text-xl">
                <ShieldAlert className="w-6 h-6 shrink-0 text-orange-500" />
                The AI Software Engineering Advantage
              </div>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Modern AI-assisted engineering means your app is built in days, not months — with every feature tested and reviewed by a human before it reaches you. You see the working demo in 48 hours, test it yourself, and approve before paying the balance.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm text-slate-300">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <strong className="text-orange-400 block mb-1">❌ Traditional Dev Agencies:</strong>
                  Large upfront deposits, multi-month waits before you see a working build, and scope creep that inflates the final invoice.
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-emerald-500/40">
                  <strong className="text-emerald-400 block mb-1">✅ Jordan Peters Coder Freelancing:</strong>
                  See a working staging demo in 48 hours, production-ready refined code, transparent pricing, and full POPIA compliance.
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 6-STEP PROCESS SECTION */}
        <section className="py-20 bg-slate-50 dark:bg-[#070D17] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
                End-to-End Workflow
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                The 8-Step Development Roadmap
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Every milestone is defined, transparent, and legally binding.
              </p>
            </div>

            <ProcessSteps compact={false} />

          </div>
        </section>

        {/* TRANSPARENT PRICING NOTE */}
        <section className="py-16 bg-white dark:bg-[#080F1D] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-xl">
              
              <div className="flex items-center gap-2 text-orange-400 font-bold text-lg">
                <FileText className="w-5 h-5" />
                Transparent Pricing & Pass-Through API Costs
              </div>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Every project is unique. I don&apos;t do one-size-fits-all pricing. I&apos;ll give you a custom quote based on your specific needs. Any third-party API integration costs (such as Google Maps or email dispatch) are direct pass-through — I don&apos;t profit from them. You receive total transparency on every line of code I write.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-emerald-400">
                <span>✓ 0% Mark-up on API usage</span>
                <span>•</span>
                <span>✓ Live token usage logs available</span>
                <span>•</span>
                <span>✓ Unused API credits refunded</span>
              </div>

            </div>
          </div>
        </section>

        {/* NO-GAMBLE GUARANTEE SECTION */}
        <section className="py-16 bg-slate-100 dark:bg-[#070D17] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <NoGambleGuarantee />
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="py-20 bg-white dark:bg-[#080F1D] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
                Frequently Asked Questions
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Everything You Need to Know
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Direct answers regarding costs, deposits, POPIA erasure, and source code ownership.
              </p>
            </div>

            <FaqAccordion />

          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 bg-[#0A1628] text-white text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to get started?</h2>
            <p className="text-slate-300 text-base">
              Tell me about your project and receive a custom quote within 2 hours during business hours.
            </p>
            <Link
              id="process-final-cta-btn"
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg hover:scale-105 transition-all"
            >
              Request a Quote →
            </Link>
          </div>
        </section>

      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
