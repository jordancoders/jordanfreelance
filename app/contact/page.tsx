"use client";

import { Suspense } from "react";
import { Mail, Phone, Clock, MapPin, Send, MessageSquare, Calendar, Globe } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE_CONFIG } from "@/data/portfolioData";
import { useSiteConfig } from "@/hooks/useSiteConfig";

function ContactFormContent() {
  const { config } = useSiteConfig();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      
      {/* Google Form Container */}
      <div className="lg:col-span-7 bg-white dark:bg-[#0D1A2D] p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-800">
            <Send className="w-3.5 h-3.5" />
            Official Quote Form
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Send Me Your Pitch & Get Your Quote
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Please fill out the official <strong className="text-orange-500">Google Form</strong> below with your project pitch. I’ll review your requirements, lock the AI to your scope, and reply with feasibility and a custom quote.
          </p>
        </div>

        {/* Primary CTA Box to open Google Form */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-2 border-orange-500/40 space-y-4 text-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Ready to submit your pitch?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Send me your pitch via Google Form and I&apos;ll reply with feasibility, a custom quote, and a 48-hour staging demo.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <a
              id="open-google-form-btn"
              href={config.googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Open Google Form →
            </a>
            <a
              id="whatsapp-pitch-btn"
              href={SITE_CONFIG.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Pitch on WhatsApp
            </a>
          </div>
        </div>

        {/* Embedded Google Form container / preview iframe */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Embedded Google Form:</span>
            <a
              href={config.googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline"
            >
              Open in new tab ↗
            </a>
          </div>

          <div className="w-full h-[550px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 relative">
            <iframe
              src={config.googleFormUrl}
              className="w-full h-full border-0"
              title="Jordan Peters Project Quote Google Form"
            >
              Loading Google Form...
            </iframe>
          </div>
        </div>

        <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 pt-2">
          🔒 All project information is strictly confidential under South African POPIA privacy guidelines (and GDPR-aligned via a signed Data Processing Agreement for EU/UK clients). You always have the option to keep your final project private (opt-out of portfolio showcase).
        </p>

      </div>

      {/* Right Sidebar: Contact Info & Discovery Call */}
      <div className="lg:col-span-5 space-y-8">
        
        {/* Contact Info Cards */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
          <h3 className="text-2xl font-bold text-white border-b border-slate-800 pb-3">
            Direct Contact Information
          </h3>

          <div className="space-y-4">
            
            <a
              id="contact-sidebar-whatsapp"
              href={SITE_CONFIG.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-colors group"
            >
              <div className="p-3 rounded-xl bg-emerald-500 text-white shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold">WhatsApp Instant Chat:</span>
                <span className="text-base font-bold text-emerald-400 group-hover:underline">
                  {SITE_CONFIG.whatsappFormatted}
                </span>
                <span className="text-[11px] text-slate-400 block">Immediate response during business hours</span>
              </div>
            </a>

            <a
              id="contact-sidebar-email"
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-colors group"
            >
              <div className="p-3 rounded-xl bg-orange-500 text-white shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Direct Email:</span>
                <span className="text-base font-bold text-orange-400 group-hover:underline">
                  {SITE_CONFIG.email}
                </span>
                <span className="text-[11px] text-slate-400 block">Quotes & official correspondence</span>
              </div>
            </a>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="p-3 rounded-xl bg-blue-500 text-white shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Response Time Commitment:</span>
                <span className="text-sm font-bold text-white">Within 2 Hours (Mon – Fri)</span>
                <span className="text-[11px] text-slate-400 block">08:00 – 17:00 SAST</span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="p-3 rounded-xl bg-purple-500 text-white shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Location & Coverage:</span>
                <span className="text-sm font-bold text-white">{SITE_CONFIG.coverage}</span>
                <span className="text-[11px] text-slate-400 block">Serving Cape Town, Joburg, Durban, all SA SMEs & international clients (EU, UK, US, Canada, Australia)</span>
                <a href="/international" className="text-[11px] text-blue-400 hover:underline font-semibold inline-flex items-center gap-1 mt-1">
                  <Globe className="w-3 h-3" /> See how I work with international clients
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Discovery Call Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 text-white space-y-4 shadow-xl">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full w-fit">
            <Calendar className="w-4 h-4" />
            15-Min Discovery Call
          </div>

          <h3 className="text-2xl font-black text-white">
            Prefer a Live 1-on-1 Chat First?
          </h3>

          <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
            Schedule a 15-minute video walkthrough to discuss your project requirements, technical feasibility, and get instant pricing clarity.
          </p>

          <div className="pt-2">
            <a
              id="book-discovery-call-trigger"
              href={config.googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-sm transition-all border border-slate-300 dark:border-slate-700 shadow-sm"
            >
              <Calendar className="w-4 h-4 text-orange-500" />
              Book 15-Min Discovery Call
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
              Get Started
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Request a Custom Quote
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
              Tell me about your project, and I&apos;ll get back to you within 2 hours during business hours with a custom quote.
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-12 text-slate-400">Loading form...</div>}>
            <ContactFormContent />
          </Suspense>

        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
