import Link from "next/link";
import { CheckCircle2, Layers, Code, Zap, Wrench, Database } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SERVICES_DATA, Service, SITE_CONFIG } from "@/data/portfolioData";

export const metadata = {
  title: "Services & Custom Development Quotes",
  description: "Custom web apps, full dashboards, startup MVPs, maintenance retainers, and POPIA data migration for South African SMEs. Get a fast custom quote.",
};

export default function ServicesPage() {
  const whatsIncluded = [
    "48-Hour Staging Demo",
    "AI-Orchestrated Builds — Human Quality Gate",
    "POPIA Compliance",
    "7-Day Data Erasure",
    "Data Destruction Certificate (on request)",
    "1 Free Deployment Assist Session",
    "Full Source Code Ownership",
    "14-Day Bug Fix Warranty",
    "Flexible Payment Terms (Agreed Per Quote)",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-[#070D17] dark:via-[#0A1628] dark:to-[#070D17] border-b border-slate-200 dark:border-slate-800 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-800">
              <Layers className="w-4 h-4" />
              Tailored Quote-Based Development
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Services & Custom Quote
            </h1>

            <p className="text-xl sm:text-3xl text-orange-600 dark:text-orange-400 font-bold max-w-3xl mx-auto leading-relaxed">
              Every project is AI-orchestrated with a human quality gate, and ships with a working staging demo in 48 hours, full source code on approval, and POPIA-aligned data handling.
            </p>

            <div className="pt-2 flex justify-center">
              <Link
                id="services-hero-cta"
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all"
              >
                Request a Custom Quote →
              </Link>
            </div>

          </div>
        </section>

        {/* SERVICES CARDS GRID */}
        <section className="py-20 bg-white dark:bg-[#080F1D] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
                Core Offerings
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Choose Your Solution Scope
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Pricing is quote-based with zero hidden markups.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SERVICES_DATA.map((service: Service, idx) => (
                <div
                  key={service.id}
                  className="rounded-2xl p-8 bg-slate-50 dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-orange-500/50 transition-all flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-orange-500 text-white font-bold">
                        {idx === 0 && <Layers className="w-6 h-6" />}
                        {idx === 1 && <Code className="w-6 h-6" />}
                        {idx === 2 && <Zap className="w-6 h-6" />}
                        {idx === 3 && <Wrench className="w-6 h-6" />}
                        {idx === 4 && <Database className="w-6 h-6" />}
                      </div>
                      <span className="text-xs font-bold bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
                        {service.priceTag}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {service.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                        What&apos;s Included:
                      </span>
                      <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                        {service.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      Recommended: {service.recommendedFor}
                    </p>

                    <Link
                      id={`service-quote-btn-${service.id}`}
                      href={`/contact?service=${service.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow transition-all"
                    >
                      Request a Quote →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* WHAT'S INCLUDED IN EVERY PROJECT */}
        <section className="py-16 bg-slate-100 dark:bg-[#070D17] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                What&apos;s Included In Every Single Project
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                No add-on charges or surprises. Standard Jordan Peters Coder Freelancing guarantees.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {whatsIncluded.map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 flex items-start gap-3 shadow-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item}</span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* PRICING NOTE */}
        <section className="py-16 bg-white dark:bg-[#080F1D] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6 shadow-2xl">
              
              <div className="inline-block px-3.5 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
                Transparent Pricing Philosophy
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white">
                &ldquo;Production-Ready Software Built for Your SME&rdquo;
              </h3>

              <p className="text-slate-300 text-base leading-relaxed">
                You get production-ready software: AI-orchestrated with a human quality gate, delivered as a working staging demo you can click through in 48 hours, test before paying the balance, and full source code handed over on approval. Tell me about your project and I’ll send a transparent custom quote.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  id="pricing-note-quote-btn"
                  href="/contact"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md text-center"
                >
                  Request a Quote →
                </Link>
                <a
                  id="pricing-note-whatsapp-btn"
                  href={SITE_CONFIG.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm text-center"
                >
                  WhatsApp Jordan ({SITE_CONFIG.whatsappNumber})
                </a>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
