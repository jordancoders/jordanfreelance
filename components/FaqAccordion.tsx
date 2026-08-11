"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQ_DATA, FaqItem } from "@/data/portfolioData";

export default function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>("faq-cost");

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {FAQ_DATA.map((item: FaqItem) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1A2D] overflow-hidden transition-all shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
          >
            <button
              id={`faq-btn-${item.id}`}
              onClick={() => toggle(item.id)}
              className="w-full text-left p-6 flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-orange-500 shrink-0" />
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-orange-500" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-6 pb-6 pt-1 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800/60 animate-in fade-in-50 duration-200">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
