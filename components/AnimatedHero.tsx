"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/data/portfolioData";
import TrustBadges from "@/components/TrustBadges";
import DiscoveryCallButton from "@/components/DiscoveryCallButton";

const ROTATING_WORDS = ["Web Apps", "Dashboards", "Booking Portals", "MVPs"];

function TypewriterWord() {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState(ROTATING_WORDS[0]);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const word = ROTATING_WORDS[index];
    if (typing) {
      if (display.length < word.length) {
        const t = setTimeout(() => setDisplay(word.slice(0, display.length + 1)), 70);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 1600);
        return () => clearTimeout(t);
      }
    } else {
      if (display.length > 0) {
        const t = setTimeout(() => setDisplay(display.slice(0, -1)), 36);
        return () => clearTimeout(t);
      } else {
        setIndex((i) => (i + 1) % ROTATING_WORDS.length);
        setTyping(true);
      }
    }
  }, [display, typing, index]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 inline-block min-w-[280px] sm:min-w-[420px] text-left">
      {display}
      <span className="inline-block w-[3px] h-[0.85em] bg-orange-500 ml-1 animate-pulse translate-y-1" />
    </span>
  );
}

export default function AnimatedHero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-300, 300], [6, -6]), { stiffness: 90, damping: 18 });
  const ry = useSpring(useTransform(mx, [-300, 300], [-8, 8]), { stiffness: 90, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - (r.left + r.width / 2));
    my.set(e.clientY - (r.top + r.height / 2));
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-[#070D17] dark:via-[#0A1628] dark:to-[#070D17]"
    >
      {/* parallax blobs */}
      <motion.div
        style={{ x: useTransform(mx, [-300, 300], [-18, 18]), y: useTransform(my, [-300, 300], [-12, 12]) }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[420px] bg-orange-500/12 dark:bg-orange-500/18 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        style={{ x: useTransform(mx, [-300, 300], [22, -22]), y: useTransform(my, [-300, 300], [16, -16]) }}
        className="absolute -top-10 -right-20 w-[520px] h-[520px] bg-blue-500/8 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-slate-900 text-white dark:bg-slate-800/90 text-[11px] sm:text-sm font-semibold border border-slate-700/80 shadow-md max-w-full">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute opacity-60" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative shrink-0" />
          <span className="whitespace-nowrap">Available for New SA SME Projects</span>
          <span className="hidden xs:inline text-slate-400">|</span>
          <Link href="/guarantee" className="text-orange-400 font-bold hover:underline whitespace-nowrap">48-Hour Staging Guarantee</Link>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-5xl mx-auto leading-[1.05]">
          Custom Booking Dashboards & <br className="hidden sm:block" />
          <TypewriterWord />
          <br />
          <span className="text-slate-900 dark:text-white">for SA SMEs</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-lg sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Stop running your business on WhatsApp and spreadsheets. <strong className="text-slate-900 dark:text-white font-semibold">I build you a clickable, working version of your app in 48 hours — you test it live before you pay the balance, and you own 100% of the code.</strong>
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium">
          I orchestrate AI to ship your custom dashboard in 48 hours — without the bloat. Every line is human-reviewed, tested, and secure. You pay for results, not months of dev time.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-full px-3.5 py-1.5 backdrop-blur">
            <Sparkles className="w-4 h-4" /> AI-Accelerated
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 rounded-full px-3.5 py-1.5 backdrop-blur">
            <ShieldCheck className="w-4 h-4" /> Human-Quality Gate
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-full px-3.5 py-1.5 backdrop-blur">
            <CheckCircle2 className="w-4 h-4" /> 100% Code Ownership
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link id="hero-primary-cta" href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all group">
            Request a Quote
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
          </Link>
          <a id="hero-email-cta" href={`mailto:${SITE_CONFIG.email}`} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-700 font-bold text-base border border-slate-300 dark:border-slate-700 shadow-sm transition-all">
            <Mail className="w-4 h-4 text-orange-500" /> Email Me
          </a>
          <DiscoveryCallButton />
        </motion.div>

        {/* Tilt preview card */}
        <motion.div style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }} className="mx-auto max-w-3xl pt-4 hidden lg:block">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/60 backdrop-blur p-3 shadow-xl">
            <div className="flex items-center gap-2 px-2 pb-2">
              <span className="w-3 h-3 rounded-full bg-red-500" /><span className="w-3 h-3 rounded-full bg-amber-500" /><span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="ml-2 text-[11px] font-mono text-slate-400">staging.jpfreelance.dpdns.org/demo — live in 48h →</span>
            </div>
            <div className="h-28 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-500 p-[1px]">
              <div className="h-full rounded-[11px] bg-white dark:bg-slate-900 grid grid-cols-4 gap-2 p-3">
                <div className="col-span-1 space-y-2"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded" /><div className="h-16 bg-orange-50 dark:bg-orange-950/40 rounded border border-orange-100 dark:border-orange-900" /></div>
                <div className="col-span-3 grid grid-cols-3 gap-2"><div className="h-full bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700" /><div className="h-full bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700" /><div className="h-full bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700" /></div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="pt-4">
          <TrustBadges />
        </div>
      </div>
    </section>
  );
}
