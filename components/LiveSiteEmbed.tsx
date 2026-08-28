"use client";

import { useState } from "react";
import { Globe, ExternalLink, X, ArrowUpRight, Eye, Maximize2 } from "lucide-react";
import type { Project } from "@/lib/types";
import TourismDashboardPreview from "@/components/TourismDashboardPreview";

/**
 * Hardens an embed URL: only http(s) URLs are ever allowed into an iframe.
 */
function normalizeEmbedUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let value = raw.trim();
  if (!value) return null;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(value)) {
    value = `https://${value}`;
  }
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

interface LiveSiteEmbedProps {
  projects: Project[];
}

export default function LiveSiteEmbed({ projects }: LiveSiteEmbedProps) {
  const [isOpen, setIsOpen] = useState(false);

  const candidates = projects.filter(
    (p) => p.status !== "draft" && normalizeEmbedUrl(p.embedUrl) !== null
  );
  const embedProject = candidates.find((p) => p.featured) ?? candidates[0] ?? null;

  if (!embedProject || !embedProject.embedUrl) return <TourismDashboardPreview />;

  const url = normalizeEmbedUrl(embedProject.embedUrl)!;
  const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <>
      <div className="relative group overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-2xl transition-all hover:border-orange-500/60">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/40">
                Live Site Showcase
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                Published Build
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {embedProject.title}
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {embedProject.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {embedProject.tech.map((t) => (
                <span key={t} className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md text-xs font-mono border border-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3 w-full lg:w-auto">
            <button
              id="open-live-site-btn"
              onClick={() => setIsOpen(true)}
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg transition-all group/btn"
            >
              <Eye className="w-5 h-5" />
              Launch Live Site
              <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
            <a
              id="open-live-site-newtab"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Open in New Tab
            </a>
            <span className="text-[11px] sm:text-xs text-center text-slate-400 leading-snug">
              Real deployed build — this is what your 48h staging demo leads to
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl overflow-hidden border border-slate-700/80 bg-white relative">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-slate-700">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="flex-1 mx-3 px-3 py-1 rounded-md bg-slate-900 text-[11px] font-mono text-slate-300 truncate flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
              {displayUrl}
            </span>
            <button
              onClick={() => setIsOpen(true)}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Open fullscreen"
              title="Open fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          <iframe
            id="live-site-embed-frame"
            src={url}
            title={`Live preview of ${embedProject.title}`}
            className="w-full h-[360px] sm:h-[480px] lg:h-[560px] border-0 bg-white"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Interactive demo embedded from the deployed site — not a screenshot.
            </span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-orange-500 hover:underline inline-flex items-center gap-1"
            >
              Open full site <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in-50">
          <div className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-850 border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-mono text-slate-400 ml-2 truncate hidden sm:inline">
                  {displayUrl}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800 shrink-0">
                  Live Site
                </span>
              </div>
              <button
                id="close-live-site-btn"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <iframe
              src={url}
              title={`Fullscreen live preview of ${embedProject.title}`}
              className="flex-1 w-full border-0 bg-white min-h-[60vh]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
            <div className="p-4 bg-slate-850 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                This is {embedProject.title} — deployed live. The 48-hour staging guarantee means every client tests a link exactly like this before paying the balance.
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700"
                >
                  Open in New Tab
                </a>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = "/contact";
                  }}
                  className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
                >
                  Get a Custom Quote →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
