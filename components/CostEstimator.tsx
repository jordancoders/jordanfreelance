"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export default function CostEstimator() {
  const [pages, setPages] = useState(8);
  const [integrations, setIntegrations] = useState(2);
  const [complexity, setComplexity] = useState<1|2|3>(2);
  const [rush, setRush] = useState(false);

  const estimate = useMemo(() => {
    const base = 9500;
    const pageCost = pages * 850;
    const integCost = integrations * 1800;
    const mult = complexity === 1 ? 1 : complexity === 2 ? 1.35 : 1.75;
    const subtotal = Math.round((base + pageCost + integCost) * mult);
    const rushFee = rush ? Math.round(subtotal * 0.12) : 0;
    const total = subtotal + rushFee;
    const deposit = Math.round(total * 0.5);
    return { subtotal, rushFee, total, deposit, balance: total - deposit };
  }, [pages, integrations, complexity, rush]);

  const fmt = (n: number) => `R ${n.toLocaleString()}`;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      <div className="px-6 sm:px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-[11px] font-bold tracking-wider uppercase border border-orange-200 dark:border-orange-800"><Calculator className="w-3.5 h-3.5" /> Public Cost Estimator</div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Estimate your build — instant, transparent</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Play with scope. Final quote is human-reviewed within 2 hours — this is your starting point, not a checkout.</p>
        </div>
        <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-orange-500 text-white items-center justify-center shrink-0"><Sparkles className="w-6 h-6" /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        <div className="lg:col-span-3 p-6 sm:p-8 space-y-6">
          <div>
            <label className="text-xs font-bold tracking-wider uppercase text-slate-500">Pages / views — {pages}</label>
            <input type="range" min={3} max={20} value={pages} onChange={e=>setPages(Number(e.target.value))} className="w-full accent-orange-500 mt-2" />
            <div className="flex justify-between text-[11px] font-mono text-slate-400"><span>3</span><span>20</span></div>
          </div>
          <div>
            <label className="text-xs font-bold tracking-wider uppercase text-slate-500">Integrations (PayPal, Maps, etc.) — {integrations}</label>
            <input type="range" min={0} max={6} value={integrations} onChange={e=>setIntegrations(Number(e.target.value))} className="w-full accent-orange-500 mt-2" />
            <div className="flex justify-between text-[11px] font-mono text-slate-400"><span>0</span><span>6</span></div>
          </div>
          <div>
            <label className="text-xs font-bold tracking-wider uppercase text-slate-500">Complexity</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {([1,2,3] as const).map(v => (
                <button key={v} onClick={()=>setComplexity(v)} className={`px-3 py-2.5 rounded-xl border text-xs font-bold ${complexity===v ? "bg-orange-500 text-white border-orange-500" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-300"}`}>
                  {v===1?"Simple":v===2?"Standard":"Complex"}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
            <input type="checkbox" checked={rush} onChange={e=>setRush(e.target.checked)} className="accent-orange-500 w-4 h-4" />
            48-hour rush (guaranteed staging) +12%
          </label>
        </div>

        <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900/60 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
          <div className="rounded-2xl bg-slate-900 text-white p-5 space-y-3">
            <div className="text-[11px] font-bold tracking-widest uppercase text-orange-400">Your Estimate</div>
            <div className="text-3xl font-black tracking-tight">{fmt(estimate.total)}</div>
            <div className="text-xs text-slate-400">ex VAT • 50% kick-off deposit {fmt(estimate.deposit)} • balance {fmt(estimate.balance)} on approval</div>
            {estimate.rushFee>0 && <div className="text-[11px] font-mono text-amber-300">Rush staging guarantee: +{fmt(estimate.rushFee)}</div>}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
              <div className="rounded-xl bg-white/10 border border-white/15 p-3"><div className="text-slate-400">Pages</div><div className="font-bold text-white">{pages}</div></div>
              <div className="rounded-xl bg-white/10 border border-white/15 p-3"><div className="text-slate-400">Integrations</div><div className="font-bold text-white">{integrations}</div></div>
            </div>
          </div>
          <Link href={`/contact?est=${estimate.total}&pages=${pages}&integ=${integrations}`} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow">
            Get Exact Quote in 2 Hours <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="https://wa.me/27848600638" target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center">Or WhatsApp the Estimate</a>
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> POPIA-safe • No checkout — you approve the working demo first.</p>
        </div>
      </div>
    </div>
  );
}
