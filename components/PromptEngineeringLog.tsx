"use client";

import { useState } from "react";
import { Brain, ChevronDown, ChevronUp, Bug, MessageSquareQuote, Wrench } from "lucide-react";

const LOG_ROWS = [
  {
    hallucination: "AI used a deprecated sorting method that broke the bookings list order.",
    prompt: "“That method is deprecated in this stack version. Use the current sort API and add error handling.”",
    fix: "Clean, working sort function — no deprecated calls, no silent failures."
  },
  {
    hallucination: "AI suggested adding a chat feature nobody asked for.",
    prompt: "“Strictly follow the scope doc — no chat feature. Remove it entirely.”",
    fix: "Scope preserved. No bloat, no off-spec code."
  },
  {
    hallucination: "AI surfaced demo records that looked like real client passport data.",
    prompt: "“Mask all staging data — use clearly fake records only. No real-looking personal info in the demo.”",
    fix: "POPIA-safe staging demo — no personal data ever exposed."
  }
];

export default function PromptEngineeringLog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
      {/* Toggle Header */}
      <button
        id="prompt-log-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-slate-800/60 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span className="block font-bold text-white text-base sm:text-lg">
              🧠 How I kept the AI on track for this build
            </span>
            <span className="block text-xs text-slate-400 mt-0.5">
              The prompt engineering log — real corrections from the sample build, human-reviewed at every step
            </span>
          </div>
        </div>
        <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expandable Table */}
      {isOpen && (
        <div className="border-t border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[680px]">
              <thead>
                <tr className="bg-slate-800/60 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3.5 font-bold">
                    <span className="inline-flex items-center gap-1.5">
                      <Bug className="w-3.5 h-3.5 text-red-400" />
                      AI&apos;s First Attempt (The Hallucination)
                    </span>
                  </th>
                  <th className="px-6 py-3.5 font-bold">
                    <span className="inline-flex items-center gap-1.5">
                      <MessageSquareQuote className="w-3.5 h-3.5 text-orange-400" />
                      My Correction Prompt
                    </span>
                  </th>
                  <th className="px-6 py-3.5 font-bold">
                    <span className="inline-flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                      Final Fix
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {LOG_ROWS.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-slate-800/80 align-top bg-slate-900/40 hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-300 leading-relaxed">
                      {row.hallucination}
                    </td>
                    <td className="px-6 py-4">
                      <code className="block text-xs text-orange-300 bg-orange-950/40 border border-orange-800/60 rounded-lg px-3 py-2.5 leading-relaxed font-mono">
                        {row.prompt}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-emerald-300 leading-relaxed">
                      ✓ {row.fix}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-slate-800/40 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200">This is the human quality gate in action.</strong>{" "}
            Every AI-generated change passes through my review before it reaches your staging link —
            for scope, security, and correctness. What you see here is exactly the process your build goes through.
          </div>
        </div>
      )}
    </div>
  );
}
