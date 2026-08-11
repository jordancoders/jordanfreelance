import { Calendar } from "lucide-react";
import Link from "next/link";

export default function DiscoveryCallButton() {
  return (
    <Link
      id="book-discovery-call-trigger"
      href="/contact"
      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-sm transition-all border border-slate-300 dark:border-slate-700 shadow-sm"
    >
      <Calendar className="w-4 h-4 text-orange-500" />
      Book 15-Min Discovery Call
    </Link>
  );
}
