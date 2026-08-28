"use client";
import { useEffect, useState } from "react";
import { MessageSquareQuote, Wallet, Lock, SearchCheck, Monitor, CheckSquare, Key, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProcessStepsProps {
  compact?: boolean;
}

export default function ProcessSteps({ compact = false }: ProcessStepsProps) {
  const steps = [
    {
      num: "01",
      title: "Request a Quote",
      icon: MessageSquareQuote,
      desc: "Tell me about your project needs. I assess the scope and send a transparent custom quote. No obligation, no pressure.",
      badge: "Fast 2h Response"
    },
    {
      num: "02",
      title: "Flexible Deposit",
      icon: Wallet,
      desc: "We agree on a kick-off deposit for your specific project (covers API tokens & kick-off labor), with the balance due on final approval.",
      badge: "Agreed Per Quote"
    },
    {
      num: "03",
      title: "AI Prompt-Locked & Scoped",
      icon: Lock,
      desc: "Before I write a single line, I “lock” the AI with your exact requirements — no extra features, no off-spec code. Constraint prompts keep the AI on your brief, not its own imagination.",
      badge: "On-Brief Guarantee"
    },
    {
      num: "04",
      title: "Security & Hallucination Audit",
      icon: SearchCheck,
      desc: "I manually review every AI-generated change for hardcoded secrets, SQL injection risks, and deprecated functions. You get a human-quality check on AI-speed output.",
      badge: "Human-Quality Gate"
    },
    {
      num: "05",
      title: "48-Hour Staging Demo",
      icon: Monitor,
      desc: "Within 48 hours, you receive a live URL link to test and click through your working app. No technical install required.",
      badge: "No-Gamble Guarantee"
    },
    {
      num: "06",
      title: "Review & Approve",
      icon: CheckSquare,
      desc: "You test all features. We agree on revision rounds upfront so there are zero surprises or unexpected fees.",
      badge: "Zero Surprises"
    },
    {
      num: "07",
      title: "Final Payment",
      icon: Key,
      desc: "You test and approve the application on staging. Once satisfied, you release the final balance payment.",
      badge: "Protected Staging Preview"
    },
    {
      num: "08",
      title: "Handover & Data Erasure",
      icon: Trash2,
      desc: "Full source code ownership transfers to you. All confidential test data is permanently deleted within 7 days, with written confirmation provided.",
      badge: "7-Day Data Erasure"
    }
  ];

  const displayedSteps = compact ? steps.slice(0, 3) : steps;

  // stepper progress — show active step
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    if (compact) return;
    const id = setInterval(() => setActiveIdx((v) => (v + 1) % steps.length), 2200);
    return () => clearInterval(id);
  }, [compact, steps.length]);

  return (
    <div className="space-y-8">
      {/* horizontal stepper (desktop) */}
      {!compact && (
        <div className="hidden lg:block">
          <div className="relative flex items-center justify-between gap-2 px-2">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 rounded-full -translate-y-1/2" />
            <motion.div className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full -translate-y-1/2" initial={{ width: "0%" }} animate={{ width: `${((activeIdx + 1) / steps.length) * 100}%` }} transition={{ duration: 0.6 }} />
            {steps.map((s, idx) => (
              <div key={s.num} className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${idx <= activeIdx ? "bg-orange-500 text-white border-orange-500 shadow" : "bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"}`}>{s.num}</div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2 px-1"><span>Quote</span><span>Demo</span><span>Handover</span></div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedSteps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = idx === activeIdx;
          return (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className={`relative group p-6 rounded-2xl bg-white dark:bg-[#0D1A2D] border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${isActive ? "border-orange-400/60 shadow-orange-500/10" : "border-slate-200 dark:border-slate-800 hover:border-orange-500/50"}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-3xl font-black font-mono ${isActive ? "text-orange-500" : "text-orange-500/80"}`}>
                    {s.num}
                  </span>
                  <div className={`p-3 rounded-xl transition-colors ${isActive ? "bg-orange-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:bg-orange-500 group-hover:text-white"}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <span className="inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 mb-2">
                  {s.badge}
                </span>

                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {s.title}
                </h4>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {!compact && (
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-400 font-medium">
                  {s.num === "03" && "Constraint-Prompted Builds"}
                  {s.num === "04" && "Human Quality Gate on Every Change"}
                  {s.num === "05" && "Protected by 48h Refund Guarantee"}
                  {s.num === "08" && "Written POPIA Confirmation"}
                  {s.num !== "03" && s.num !== "04" && s.num !== "05" && s.num !== "08" && "Quality Standard"}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {compact && (
        <div className="text-center pt-2">
          <Link
            id="process-teaser-full-link"
            href="/process"
            className="inline-flex items-center gap-2 font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-base group"
          >
            See Full 8-Step Process & Legal Rules
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
