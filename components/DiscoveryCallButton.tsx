import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/data/portfolioData";

export default function DiscoveryCallButton() {
  return (
    <a
      id="book-discovery-call-trigger"
      href={SITE_CONFIG.whatsappLink + "?text=Hi%20Jordan%2C%20I%27d%20like%20to%20book%20a%2015-minute%20discovery%20call."}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-sm transition-all border border-slate-300 dark:border-slate-700 shadow-sm"
    >
      <MessageCircle className="w-4 h-4 text-green-500" />
      Book 15-Min Discovery Call
    </a>
  );
}
