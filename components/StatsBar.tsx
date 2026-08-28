"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const dur = 1100;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{v}{suffix}</>;
}

export default function StatsBar() {
  const stats = [
    { to: 48, suffix: " Hours", label: "Live Staging SLA", subtext: "Working staging link delivered in <48h", icon: CheckCircle2, color: "text-orange-500", valueStr: "48 Hours" },
    { to: 100, suffix: "%", label: "Source Code Ownership", subtext: "Full source handed over on final payment", icon: Sparkles, color: "text-emerald-500", valueStr: "100%" },
    { to: 7, suffix: " Days", label: "Data Erasure Promise", subtext: "Written confirmation after project handover", icon: ShieldAlert, color: "text-blue-500", valueStr: "7 Days" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="w-full bg-slate-900 dark:bg-[#0D1A2D] text-white py-6 sm:py-10 px-4 sm:px-6 rounded-2xl shadow-xl border border-slate-800 my-6 sm:my-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/[0.06] via-transparent to-emerald-500/[0.06] pointer-events-none" />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800 relative">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.12 }} className={`flex items-center gap-4 sm:gap-5 ${idx !== 0 ? 'pt-6 md:pt-0 md:pl-8' : ''}`}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">
                  <CountUp to={stat.to} suffix={stat.suffix} />
                </div>
                <div className="font-semibold text-slate-200 text-sm sm:text-base truncate">{stat.label}</div>
                <div className="text-[11px] sm:text-xs text-slate-400 leading-snug">{stat.subtext}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
