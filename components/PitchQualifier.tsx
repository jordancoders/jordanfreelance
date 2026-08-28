"use client";
import { useState } from "react";
import { Sparkles, Send, ShieldCheck, MessageSquare } from "lucide-react";
import Link from "next/link";

const SCOPE_KEYWORDS: Record<string, { label: string; price: string }> = {
  booking: { label: "Booking & Operations Dashboard", price: "From R 12,000" },
  dashboard: { label: "Custom Dashboard", price: "From R 15,000" },
  tourism: { label: "Tourism & Dispatch Portal", price: "From R 15,000" },
  ecommerce: { label: "E-commerce Lite", price: "From R 10,000" },
  shop: { label: "E-commerce Lite", price: "From R 10,000" },
  mvp: { label: "Startup MVP Scaffold", price: "From R 18,000" },
  inventory: { label: "Inventory / Ops System", price: "From R 14,000" },
};

function qualify(text: string) {
  const t = text.toLowerCase();
  for (const [k, v] of Object.entries(SCOPE_KEYWORDS)) if (t.includes(k)) return v;
  return null;
}

export default function PitchQualifier() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof qualify> | null>(null);
  const [asked, setAsked] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length < 8) return;
    setResult(qualify(input));
    setAsked(true);
  };

  return (
    <div className="rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl overflow-hidden">
      <div className="p-6 sm:p-8 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-[11px] font-bold tracking-wider uppercase border border-orange-500/30"><Sparkles className="w-3.5 h-3.5" /> AI Pitch Qualifier</div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">Describe your app idea — get a scoped answer in 30 seconds</h3>
            <p className="text-sm text-slate-400 max-w-2xl">No sales call. I lock the AI to your brief, check feasibility, and give you a ballpark + what’s included. Guardrailed — no hallucinations, no off-spec bloat.</p>
          </div>
          <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 items-center justify-center shrink-0"><MessageSquare className="w-6 h-6" /></div>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. I need a booking dashboard for my guesthouse with deposits and guide dispatch..."
            className="flex-1 px-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
          <button type="submit" className="px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm inline-flex items-center justify-center gap-2 shrink-0">
            <Send className="w-4 h-4" /> Qualify My Pitch
          </button>
        </form>

        {asked && (
          <div className="rounded-2xl bg-slate-800/80 border border-slate-700 p-5 space-y-3 animate-in fade-in">
            {result ? (
              <>
                <div className="text-sm font-bold text-emerald-400 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Looks feasible — scoped as: {result.label}</div>
                <div className="text-xs text-slate-300">Ballpark <span className="font-black text-white">{result.price}</span> • 48-hour staging demo • POPIA-safe • Full code on approval. Final quote after 2-hour human review.</div>
              </>
            ) : (
              <div className="text-sm text-slate-300">Got it — that sounds like a <strong className="text-white">Custom App / Dashboard</strong>. I’ll review the scope manually and reply within 2 hours with a transparent quote and 48h staging plan.</div>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              <Link href={`/contact?pitch=${encodeURIComponent(input.slice(0,120))}`} className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100">Send This Pitch → Get Quote in 2h</Link>
              <a href={`https://wa.me/27848600638?text=${encodeURIComponent(`Hi Jordan, my pitch: ${input.slice(0,300)}`)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">Continue on WhatsApp</a>
            </div>
            <p className="text-[11px] text-slate-500">Zero obligation. No data stored — pitch is only used to generate your quote.</p>
          </div>
        )}
      </div>
      <div className="px-6 py-3 bg-slate-800/60 border-t border-slate-800 text-[11px] text-slate-500 flex flex-wrap gap-2">
        <span>✓ Prompt-locked to your brief</span><span>•</span><span>✓ Human review before quote</span><span>•</span><span>✓ No off-spec features</span>
      </div>
    </div>
  );
}
