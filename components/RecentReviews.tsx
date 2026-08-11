"use client";

import { Star, CheckCircle2 } from "lucide-react";
import type { ClientReview } from "@/lib/types";

interface RecentReviewsProps {
  reviews: ClientReview[];
}

export default function RecentReviews({ reviews }: RecentReviewsProps) {
  const topThree = [...reviews]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  if (topThree.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Recent Verified Client Reviews
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Added directly by clients after project sign-off — never fabricated
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {topThree.map((r) => (
          <div
            key={r.id}
            className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-orange-500/40 transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < r.rating ? "fill-amber-400" : "text-slate-300 dark:text-slate-600"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                &ldquo;{r.content}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
              {r.avatar ? (
                <img src={r.avatar} alt={r.clientName} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-xs font-black">
                  {r.clientName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <strong className="block text-xs text-slate-900 dark:text-white">{r.clientName}</strong>
                <span className="block text-[10px] text-slate-500">
                  {r.companyTitle || "Verified Client"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
