import { CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";

export default function StatsBar() {
  const stats = [
    {
      value: "48 Hours",
      label: "Live Staging SLA",
      subtext: "Working staging link delivered in <48h",
      icon: CheckCircle2,
      color: "text-orange-500",
    },
    {
      value: "100%",
      label: "Source Code Ownership",
      subtext: "Full source handed over on final payment",
      icon: Sparkles,
      color: "text-emerald-500",
    },
    {
      value: "7 Days",
      label: "Data Erasure Promise",
      subtext: "Written confirmation after project handover",
      icon: ShieldAlert,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="w-full bg-slate-900 dark:bg-[#0D1A2D] text-white py-6 sm:py-10 px-4 sm:px-6 rounded-2xl shadow-xl border border-slate-800 my-6 sm:my-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`flex items-center gap-4 sm:gap-5 ${idx !== 0 ? 'pt-6 md:pt-0 md:pl-8' : ''}`}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-1">
                  {stat.value}
                </div>
                <div className="font-semibold text-slate-200 text-sm sm:text-base truncate">
                  {stat.label}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 font-normal leading-snug">
                  {stat.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
