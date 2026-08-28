"use client";
import { useEffect, useState } from "react";
import { Clock, Hammer, Globe, Zap } from "lucide-react";

const BUILDS = [
  { tag: "Booking Dashboard", client: "Cape Town SME • anonymized", left: "22h 14m to staging", stage: "Build in progress" },
  { tag: "Tourism Dispatch Portal", client: "Garden Route operator", left: "Live — revisions phase", stage: "Staging demo live" },
  { tag: "E-commerce Lite", client: "Durban retailer", left: "6h 42m to staging", stage: "In progress" },
];

export default function LiveBuildTicker() {
  const [i, setI] = useState(0);
  const [secs, setSecs] = useState(81400);
  useEffect(() => {
    const a = setInterval(() => setI((v) => (v + 1) % BUILDS.length), 4200);
    const b = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 172800)), 1000);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);
  const b = BUILDS[i];
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;

  return (
    <div className="w-full rounded-2xl bg-slate-900 dark:bg-[#0D1A2D] border border-slate-800 shadow-xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">Live Build Ticker</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="text-xs font-mono text-slate-400 truncate">{b.tag} — {b.client}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 shrink-0">
          <Clock className="w-3.5 h-3.5 text-orange-400" />
          <span className="font-bold text-white tabular-nums">{String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}</span>
          <span className="text-slate-500">to staging SLA</span>
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-slate-800 border-t border-slate-800 text-center">
        <div className="py-3 px-2"><div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase flex items-center justify-center gap-1"><Hammer className="w-3 h-3" /> Stage</div><div className="text-xs font-bold text-orange-400 mt-1">{b.stage}</div></div>
        <div className="py-3 px-2"><div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase flex items-center justify-center gap-1"><Globe className="w-3 h-3" /> Region</div><div className="text-xs font-bold text-white mt-1">SA + Worldwide</div></div>
        <div className="py-3 px-2"><div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase flex items-center justify-center gap-1"><Zap className="w-3 h-3" /> Demo</div><div className="text-xs font-bold text-emerald-400 mt-1">48h guarantee</div></div>
      </div>
      <div className="h-1 bg-slate-800"><div className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all" style={{ width: `${42 + i*17}%` }} /></div>
    </div>
  );
}
