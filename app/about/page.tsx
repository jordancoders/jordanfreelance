import Link from "next/link";
import { ShieldCheck, Zap, Lock, Award, CheckCircle2, Code, Layers, Sparkles, SearchCheck, MonitorPlay } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import StatsBar from "@/components/StatsBar";
import SocialLinks from "@/components/SocialLinks";
import RepoLink from "@/components/RepoLink";
import { SITE_CONFIG } from "@/data/portfolioData";

export const metadata = {
  title: "About — Freelance Full-Stack Developer",
  description: "Learn about Jordan Peters Coder Freelancing: who you're hiring, how the 48-hour staging guarantee works, and POPIA-aligned data handling for South African SMEs.",
};

export default function AboutPage() {
  const values = [
    {
      title: "Transparency",
      desc: "You see every token I use, every line of code, every step of the process. No hidden fees or surprise invoices.",
      icon: ShieldCheck,
      badge: "0% API Mark-up"
    },
    {
      title: "Speed",
      desc: "48-hour staging demo link delivered directly to your browser. No 2-week waiting games or vague email updates.",
      icon: Zap,
      badge: "48h Staging Guarantee"
    },
    {
      title: "Trust",
      desc: "POPIA-aligned data handling. Confidential data destroyed within 7 days. Full source code transferred to you on final payment.",
      icon: Lock,
      badge: "7-Day Data Erasure"
    }
  ];

  const techBadges = [
    "Next.js 15", "React 19", "Tailwind CSS v4", "TypeScript",
    "Firebase", "Node.js", "Python", "Supabase", "PayPal API", "Resend API"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-[#070D17] dark:via-[#0A1628] dark:to-[#070D17] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            <div className="space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-800">
                <Award className="w-4 h-4" />
                Independent Freelance Software Developer • {SITE_CONFIG.brandLine}
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Hi, I&apos;m Jordan Peters.
              </h1>

              <div className="space-y-4 text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                <p>
                  I&apos;m an independent software developer delivering modern web applications, dashboards, and MVPs for South African SMEs.
                </p>
                <p className="p-5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500 text-slate-800 dark:text-slate-200 text-base leading-relaxed shadow-sm">
                  I&apos;m Jordan. I don&apos;t memorize syntax — I master requirements. My job is to be the <strong>Product Manager, QA Tester, and Security Guard</strong> between the AI and your final product. The AI generates code at 10x speed; I make sure it&apos;s the right code, scoped to your budget, and secure for your users. That&apos;s how I deliver a working staging link in 48 hours — not weeks.
                </p>
                <p>
                  This modern approach allows me to deliver agency-grade web applications with a working <strong>48-hour live staging demo</strong> — without weeks of delay or hidden fees.
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  I show you a working app in 48 hours. I protect your business data under POPIA law with 7-day data erasure policy. I hand over 100% of the source code when you&apos;re satisfied.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  id="about-contact-btn"
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all"
                >
                  Contact Me →
                </Link>
                <a
                  id="about-whatsapp-btn"
                  href={SITE_CONFIG.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors"
                >
                  WhatsApp ({SITE_CONFIG.whatsappNumber})
                </a>
              </div>

            </div>

          </div>
        </section>

        {/* HUMAN SECTION — who you're hiring; shows initials avatar until a photo is added */}
        <section className="py-12 bg-white dark:bg-[#080F1D] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-6">
              {SITE_CONFIG.photoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={SITE_CONFIG.photoUrl}
                  alt={`${SITE_CONFIG.developerName}, freelance software developer`}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-orange-500/40 shadow-lg shrink-0"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-4xl font-black border-4 border-orange-400/40 shadow-lg shrink-0">
                  JP
                </div>
              )}
              <div className="text-center sm:text-left space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Meet {SITE_CONFIG.developerName.split(" ")[0]} — {SITE_CONFIG.tradingName}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  I&apos;m Jordan, an independent software developer in South Africa, building web apps and dashboards for local SMEs. You work directly with me — no account managers, no hand-offs. I ship fast with AI tooling, but review every line before you see it.
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                  <SocialLinks />
                  <RepoLink />
                </div>
              </div>
            </div>
            </div>
          </section>

        {/* STATS BAR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <StatsBar />
        </section>

        {/* VALUES SECTION */}
        <section className="py-16 bg-white dark:bg-[#080F1D] border-t border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
                Guiding Principles
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Core Business Values
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div
                    key={i}
                    className="p-8 rounded-2xl bg-slate-50 dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-orange-500/50 transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-orange-500 text-white font-bold">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                        {v.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {v.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* TECH STACK BADGES */}
        <section className="py-16 bg-slate-100 dark:bg-[#070D17] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <Code className="w-5 h-5 text-orange-500" />
              Technologies & Infrastructure
            </h3>

            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {techBadges.map((badge) => (
                <span
                  key={badge}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#0D1A2D] text-slate-800 dark:text-slate-200 text-sm font-semibold border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* HOW I BUILD & REVIEW — HONEST PROCESS TRANSPARENCY */}
        <section className="py-16 bg-white dark:bg-[#080F1D] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-950/60 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
                How I Actually Build
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                How I Build & Review Your Project
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
                Straight answer: I orchestrate AI at 10x speed on proven, modern foundations — and every part of your project passes through my quality gate (a human) before you ever see it. Here is the exact process:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Layers,
                  step: "01",
                  title: "Proven Foundations",
                  desc: "Like every serious developer, I start from established, battle-tested stacks (Next.js 15, Tailwind, TypeScript) instead of blank pages — then engineer the parts specific to your business.",
                  tag: "Industry-standard stacks"
                },
                {
                  icon: Sparkles,
                  step: "02",
                  title: "AI Prompt-Locked & Scoped",
                  desc: "Before a single line is written, the AI is “locked” to your exact requirements with constraint prompts — no extra features, no off-spec code. It drafts at speed; I rewrite and harden.",
                  tag: "Speed without shortcuts"
                },
                {
                  icon: SearchCheck,
                  step: "03",
                  title: "Security & Hallucination Audit",
                  desc: "I manually audit every AI-generated change for hardcoded secrets, SQL injection risks, deprecated functions, and scope drift — plus POPIA obligations for your client data. Anything that doesn't hold up gets fixed before it reaches you.",
                  tag: "Human Quality Gate"
                },
                {
                  icon: MonitorPlay,
                  step: "04",
                  title: "You Test It Live",
                  desc: "Within 48 hours you click through the real working app on a staging link. You approve it before paying the balance — the demo is the proof, not a promise.",
                  tag: "48h staging demo"
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-orange-500/50 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-orange-500 text-white">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black text-slate-300 dark:text-slate-700 font-mono">{item.step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                    <span className="inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {item.tag}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-slate-100 dark:bg-[#0A1628] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                <strong className="text-slate-900 dark:text-white">What this means for you:</strong>{" "}
                you get the speed of modern AI-assisted development with the accountability of a human engineer who works directly with you — no account managers, no hand-offs, and you approve the working product before paying the balance.
              </p>
            </div>

          </div>
        </section>

        {/* HOW THIS SITE WAS BUILT — DOGFOODING + TRANSPARENCY */}
        <section className="py-16 bg-white dark:bg-[#080F1D] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Full Transparency: This Website Was Built With AI
                </h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                This very portfolio was generated with <strong className="text-slate-900 dark:text-white">DeepSeek V4 Flash</strong> inside <strong className="text-slate-900 dark:text-white">Freebuff</strong>, with human code review on every change. After each build, I re-read the site and the code multiple times using <strong className="text-slate-900 dark:text-white">DeepSeek Chat</strong> and <strong className="text-slate-900 dark:text-white">Qwen Studio</strong> to catch errors I or the AI agent might have missed — the same multi-pass review your project gets before it reaches you.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["DeepSeek V4 Flash", "Freebuff", "DeepSeek Chat", "Qwen Studio", "Human Code Review"].map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-[11px] font-bold border border-orange-200 dark:border-orange-800"
                  >
                    {tool}
                  </span>
                ))}
              </div>
              <div className="pt-1">
                <RepoLink />
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 bg-[#0A1628] text-white text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
              <ShieldCheck className="w-4 h-4" />
              100% Engineering Commitment
            </div>
            
            <h2 className="text-3xl font-extrabold text-white">
              Ready to test my 48-Hour Live Staging Guarantee?
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Experience modern AI-driven software development with a working staging demo before final payment, reviewed code, and POPIA-aligned data handling.
            </p>

            <div className="pt-2">
              <Link
                id="about-final-cta-btn"
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg hover:scale-105 transition-all"
              >
                Request a Custom Quote →
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
