"use client";
import { useState } from "react";
import { Clock, Sparkles, ArrowRight } from "lucide-react";

export default function BeforeAfterSlider() {
  const [pos, setPos] = useState(54);
  return (
    <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1A2D] shadow-xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-500"><Sparkles className="w-4 h-4 text-orange-500" /> Code → Demo Timelapse</div>
        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">48h staging → slide to compare</span>
      </div>
      <div className="relative h-[320px] sm:h-[380px] select-none overflow-hidden bg-slate-100 dark:bg-slate-900">
        {/* BEFORE */}
        <div className="absolute inset-0 p-6 flex flex-col justify-center bg-slate-50 dark:bg-[#070D17]">
          <div className="max-w-md space-y-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-500 bg-white dark:bg-slate-800 border px-2.5 py-1 rounded-full"><Clock className="w-3 h-3" /> Before — WhatsApp + Sheets</span>
            <div className="space-y-2 text-sm">
              <div className="h-8 rounded-lg bg-white border border-slate-200 flex items-center px-3 text-slate-400 font-mono text-xs">Re: booking 12 Dec? — unread (3)</div>
              <div className="h-24 rounded-xl bg-white border border-slate-200 p-3 space-y-2"><div className="h-3 bg-slate-100 rounded w-3/4" /><div className="h-3 bg-slate-100 rounded w-1/2" /><div className="grid grid-cols-4 gap-2 pt-2"><div className="h-6 bg-red-50 border border-red-200 rounded" /><div className="h-6 bg-amber-50 border border-amber-200 rounded" /><div className="h-6 bg-slate-100 rounded" /><div className="h-6 bg-slate-100 rounded" /></div></div>
              <div className="text-xs text-slate-400">Double bookings • Lost deposits • No audit trail</div>
            </div>
          </div>
        </div>
        {/* AFTER - clipped */}
        <div className="absolute inset-0 p-6 bg-gradient-to-br from-slate-900 via-[#0A1628] to-slate-900 text-white flex flex-col justify-center overflow-hidden border-l border-white/10" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <div className="max-w-md space-y-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-emerald-300 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full">After — Live Dashboard • 48h</span>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-white/10 backdrop-blur border border-white/15 p-3"><div className="text-[10px] text-slate-300">Revenue</div><div className="text-lg font-black text-emerald-400">R 248k</div></div>
              <div className="rounded-xl bg-white/10 backdrop-blur border border-white/15 p-3"><div className="text-[10px] text-slate-300">Bookings</div><div className="text-lg font-black">94</div></div>
              <div className="rounded-xl bg-white/10 backdrop-blur border border-white/15 p-3"><div className="text-[10px] text-slate-300">Vault</div><div className="text-lg font-black text-emerald-400">POPIA ✓</div></div>
            </div>
            <div className="rounded-xl bg-white text-slate-900 p-3 text-xs space-y-2"><div className="flex justify-between font-bold"><span>TRM-8840</span><span className="text-emerald-600">Ready for Guide</span></div><div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full w-[84%] bg-orange-500" /></div></div>
          </div>
        </div>
        {/* handle */}
        <div className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_4px_rgba(249,115,22,0.3)]" style={{ left: `${pos}%` }} />
        <div className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-orange-500 shadow-xl flex items-center justify-center cursor-ew-resize" style={{ left: `calc(${pos}% - 20px)` }}>
          <ArrowRight className="w-4 h-4 text-orange-500" />
        </div>
        <input type="range" min={5} max={95} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" aria-label="Before after slider" />
      </div>
      <div className="px-6 py-3 text-[11px] text-slate-500 flex flex-wrap justify-between gap-2 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <span>Drag the handle → this is the 48-hour transformation.</span><span className="font-mono text-orange-600 dark:text-orange-400">{pos}% after</span>
      </div>
    </div>
  );
}
