import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Clock, Lock, Mail, Globe } from "lucide-react";
import StatsBar from "@/components/StatsBar";
import ProcessSteps from "@/components/ProcessSteps";
import LiveSiteEmbed from "@/components/LiveSiteEmbed";
import PromptEngineeringLog from "@/components/PromptEngineeringLog";
import RecentReviews from "@/components/RecentReviews";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AnimatedHero from "@/components/AnimatedHero";
import LiveBuildTicker from "@/components/LiveBuildTicker";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import SectionReveal from "@/components/SectionReveal";
import PitchQualifier from "@/components/PitchQualifier";
import { SITE_CONFIG } from "@/data/portfolioData";
import { getPublishedReviews, getPublishedProjects } from "@/lib/db";
import type { ClientReview, Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Public pages must never 500 because of a database hiccup — if Mongo is
  // briefly unavailable, render the empty state instead (the data layer is
  // still the source of truth; it re-syncs on the next request).
  let reviews: ClientReview[] = [];
  let projects: Project[] = [];
  try {
    [reviews, projects] = await Promise.all([
      getPublishedReviews(),
      getPublishedProjects(),
    ]);
  } catch (err) {
    console.error("[home] Mongo read failed — rendering empty state:", err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 selection:bg-orange-500 selection:text-white transition-colors">
      <Header />

      <main className="flex-1">
        <AnimatedHero />

        {/* STATS BAR + LIVE TICKER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-4">
          <StatsBar />
          <LiveBuildTicker />
        </section>

        {/* CLIENT TRUST & TESTIMONIALS — bento */}
        <SectionReveal>
        <section className="py-16 bg-white dark:bg-[#080F1D] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
                Proof Over Promises
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Your Trust Signal: The 48-Hour Working Demo
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                I don't ask you to trust words — I hand you a clickable staging link within 48 hours. You test every feature yourself before paying the balance. That's the review that matters.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-8 rounded-2xl bg-slate-50 dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 text-center space-y-4 backdrop-blur shadow-sm">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  No empty stars. A working build in 48 hours.
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  I won't publish fake or placeholder reviews — ever. Verified client reviews are featured on the Testimonials page after real project sign-offs. Until then, judge me by what you can actually test: your own staging demo in 48 hours, before you pay the balance.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  {SITE_CONFIG.loomUrl && (
                    <a
                      id="reviews-loom-btn"
                      href={SITE_CONFIG.loomUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm shadow transition-all"
                    >
                      ▶ Watch the Sample Build Teardown
                    </a>
                  )}
                  <Link
                    id="reviews-cta-btn"
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow transition-all"
                  >
                    Test It Yourself — 48-Hour Staging →
                  </Link>
                  <Link
                    id="reviews-policy-link"
                    href="/testimonials"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm border border-slate-300 dark:border-slate-700 shadow transition-all"
                  >
                    Verified Reviews Policy →
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-xl">
                  <div className="text-3xl font-black">48h</div><div className="text-sm font-bold">Staging guarantee</div><div className="text-xs opacity-80 mt-1">Missed SLA = 100% deposit back + unused API credits</div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800">
                  <div className="text-lg font-black">POPIA ✓</div><div className="text-xs text-slate-400">7-day erasure • Certificate on request</div>
                  <div className="text-xs text-slate-300 mt-2">Your data never trains AI. Ever.</div>
                </div>
              </div>
            </div>

            <RecentReviews reviews={reviews} />

          </div>
        </section>
        </SectionReveal>

        {/* FEATURED PROJECT SHOWCASE */}
        <section className="py-20 bg-slate-100 dark:bg-[#070D17] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
                  Featured Case Study
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
                  See Real Code in Action
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1">
                  Explore a real, deployed build embedded live — exactly what your 48-hour staging demo will feel like.
                </p>
              </div>

              <Link
                id="view-all-projects-link"
                href="/projects"
                className="inline-flex items-center gap-2 font-bold text-orange-600 dark:text-orange-400 hover:underline text-sm group"
              >
                Explore Staging Architecture Demos →
              </Link>
            </div>

            <LiveSiteEmbed projects={projects} />
            <BeforeAfterSlider />
            <SectionReveal><PitchQualifier /></SectionReveal>
            <PromptEngineeringLog />

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                id="demo-section-whatsapp-cta"
                href={SITE_CONFIG.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg transition-all"
              >
                Chat on WhatsApp — Quote in 2 Hours
              </a>
              <Link
                id="demo-section-quote-cta"
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm border border-slate-300 dark:border-slate-700 shadow-sm transition-all"
              >
                Get a Custom Quote
              </Link>
            </div>
          </div>
        </section>

        {/* PROCESS TEASER SECTION */}
        <SectionReveal>
        <section id="process-teaser" className="py-20 bg-slate-50 dark:bg-[#070D17] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
                My AI Quality Gate Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                AI-Orchestrated. Human-Gated. Delivered in 48 Hours.
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base">
                No developer disappearing acts. No hidden fees. Every AI-generated change is reviewed for security and scope before you see a live staging demo in 48 hours.
              </p>
            </div>

            <ProcessSteps />

            <div className="pt-2 text-center">
              <a
                id="process-section-whatsapp-cta"
                href={SITE_CONFIG.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg transition-all"
              >
                Ask a Question on WhatsApp
              </a>
            </div>
          </div>
        </section>
        </SectionReveal>

        {/* INTERNATIONAL CLIENTS STRIP */}
        <section className="py-8 sm:py-12 bg-blue-50 dark:bg-[#0A1628] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left w-full lg:w-auto">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  Building Worldwide — EU, UK, US, Canada & Australia
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Quotes in USD / EUR / GBP • PayPal, Wise & card payments • GDPR-aligned DPA • Same 48-hour demo.
                </p>
              </div>
            </div>
            <Link
              id="international-strip-cta"
              href="/international"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all shrink-0"
            >
              <Globe className="w-4 h-4" />
              International Clients Page
            </Link>
          </div>
        </section>

        {/* FINAL HERO CTA */}
        <section className="py-20 bg-gradient-to-br from-[#0A1628] via-[#0D1A2D] to-[#0A1628] text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">

            <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ready to Build Your App with Zero Risk?
            </h2>

            <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Get a custom, transparent quote within 2 hours during business hours. Complete with a 48-hour staging demo and 7-day POPIA data erasure guarantee.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                id="homepage-final-quote-cta"
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-xl hover:scale-105 transition-all text-center"
              >
                Get a Custom Quote →
              </Link>
              <a
                id="homepage-final-whatsapp-cta"
                href={SITE_CONFIG.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-colors text-center"
              >
                Chat on WhatsApp ({SITE_CONFIG.whatsappFormatted})
              </a>
            </div>

            <div className="text-xs text-slate-400 pt-4 flex flex-wrap justify-center gap-4">
              <span>✓ 48-Hour Staging Guarantee</span>
              <span>•</span>
              <span>✓ 7-Day Data Erasure Promise</span>
              <span>•</span>
              <span>✓ Full Source Code Handover</span>
            </div>

          </div>
        </section>

      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
