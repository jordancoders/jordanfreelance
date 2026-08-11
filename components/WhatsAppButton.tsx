"use client";

import { Phone } from "lucide-react";
import { SITE_CONFIG } from "@/data/portfolioData";

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group">
      {/* Tooltip */}
      <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-slate-800 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap">
        Chat with Jordan on WhatsApp (0848600638)
      </div>

      {/* Floating Button */}
      <a
        id="floating-whatsapp-btn"
        href={SITE_CONFIG.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Jordan on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {/* Pulse ring effect */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30"></span>
        
        {/* WhatsApp Icon */}
        <Phone className="w-7 h-7 fill-white" />

        {/* Online Status Dot */}
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-slate-900 rounded-full"></span>
      </a>
    </div>
  );
}
