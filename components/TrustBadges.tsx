import { ShieldCheck, Clock, CreditCard, Lock, CheckCircle } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    { label: "POPIA-Aligned", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800" },
    { label: "48-Hour Demo", icon: Clock, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800" },
    { label: "Flexible Payment", icon: CreditCard, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800" },
    { label: "Secure by Design", icon: Lock, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800" },
    { label: "Tested Before You Pay", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-4">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div
            key={index}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold transition-transform hover:scale-105 ${badge.color}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{badge.label}</span>
          </div>
        );
      })}
    </div>
  );
}
