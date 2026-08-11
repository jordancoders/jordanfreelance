import Link from "next/link";
import { ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";

export default function NoGambleGuarantee() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white p-8 sm:p-10 border-2 border-emerald-500/40 shadow-2xl">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/40">
            <ShieldCheck className="w-4 h-4" />
            Zero-Risk SME Assurance
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            The No-Gamble Guarantee
          </h3>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            If I don’t deliver a working staging link within <span className="text-white font-bold underline decoration-emerald-400 underline-offset-4">48 hours</span> of deposit confirmation, you get <span className="text-emerald-400 font-bold">100% of your deposit refunded</span> immediately, plus <span className="text-emerald-400 font-bold">100% of unused API credits</span>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-lg border border-slate-700/60">
              <RefreshCw className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full API token transparency & log access</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-lg border border-slate-700/60">
              <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
              <span>No hidden fees or surprise invoices</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3">
          <Link
            id="no-gamble-cta-quote"
            href="/contact"
            className="w-full lg:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-lg transition-all group text-center"
          >
            Start Your Risk-Free App →
          </Link>
          <Link
            id="no-gamble-cta-terms"
            href="/terms#no-gamble"
            className="w-full lg:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs text-center border border-slate-700"
          >
            Read Clause 3 in Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
