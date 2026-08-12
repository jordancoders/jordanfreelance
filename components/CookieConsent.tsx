"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, Check } from "lucide-react";

const CONSENT_KEY = "jp_cookie_consent";

/**
 * Cookie consent banner.
 *
 * This site only uses essential cookies (admin / client-portal sessions) — no
 * tracking, advertising, or analytics cookies. The banner is honest about that
 * and records explicit consent so visitors can see the site is transparent
 * about what it stores (POPIA + GDPR-friendly).
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      // private mode — show the banner each visit
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, new Date().toISOString());
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 z-[100] max-w-2xl mx-auto p-4 rounded-2xl bg-slate-900/95 dark:bg-[#0D1A2D]/95 backdrop-blur border border-slate-700/60 shadow-2xl text-white flex flex-col sm:flex-row items-start sm:items-center gap-3"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="w-8 h-8 shrink-0 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
          <Cookie className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold">Cookies? Only the essential kind.</p>
          <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
            This site uses essential cookies solely to keep you signed in to your client portal or the studio — no
            tracking, advertising, or analytics cookies.{" "}
            <Link href="/privacy#cookies" className="text-orange-400 hover:underline font-semibold">
              Full cookie policy
            </Link>
            .
          </p>
        </div>
      </div>
      <button
        onClick={accept}
        className="shrink-0 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
      >
        <Check className="w-3.5 h-3.5" />
        Got it
      </button>
    </div>
  );
}
