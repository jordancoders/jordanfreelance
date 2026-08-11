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
    <div className="w-full bg-slate-900 dark:bg-[#0D1A2D] text-white py-10 px-4 sm:px-6 rounded-2xl shadow-xl border border-slate-800 my-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`flex items-center gap-5 ${idx !== 0 ? 'pt-6 md:pt-0 md:pl-8' : ''}`}>
              <div className="w-14 h-14 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                <Icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-1">
                  {stat.value}
                </div>
                <div className="font-semibold text-slate-200 text-sm sm:text-base">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-400 font-normal">
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
