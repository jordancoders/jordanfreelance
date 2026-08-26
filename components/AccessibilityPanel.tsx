"use client";

import { useEffect, useState, useCallback } from "react";
import { Accessibility, X, Plus, Minus, RotateCcw } from "lucide-react";

type Settings = {
  fontSize: number;       // 100 = default, step 10
  highContrast: boolean;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
};

const DEFAULTS: Settings = {
  fontSize: 100,
  highContrast: false,
  dyslexiaFont: false,
  reducedMotion: false,
};

const STORAGE_KEY = "a11y-settings";

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveSettings(s: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* private mode */
  }
}

/** Apply settings to the document. */
function applySettings(s: Settings) {
  const root = document.documentElement;
  // Font size: scale via CSS variable on <html>
  root.style.setProperty("--a11y-font-scale", `${s.fontSize / 100}`);
  root.classList.toggle("a11y-high-contrast", s.highContrast);
  root.classList.toggle("a11y-dyslexia-font", s.dyslexiaFont);
  root.classList.toggle("a11y-reduced-motion", s.reducedMotion);
}

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [mounted, setMounted] = useState(false);

  // Load + apply on mount
  useEffect(() => {
    const s = loadSettings();
    setSettings(s);
    applySettings(s);
    setMounted(true);
  }, []);

  const update = useCallback(
    (patch: Partial<Settings>) => {
      const next = { ...settings, ...patch };
      setSettings(next);
      saveSettings(next);
      applySettings(next);
    },
    [settings]
  );

  const resetAll = useCallback(() => {
    setSettings({ ...DEFAULTS });
    saveSettings({ ...DEFAULTS });
    applySettings({ ...DEFAULTS });
  }, []);

  if (!mounted) return null;

  const fontSizeLabel =
    settings.fontSize === 100 ? "Default" : `${settings.fontSize}%`;

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-6 z-[90] p-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-xl transition-all hover:scale-110"
        aria-label="Open accessibility settings"
        aria-expanded={open}
        aria-controls="a11y-panel"
      >
        <Accessibility className="w-5 h-5" />
      </button>

      {/* Panel */}
      {open && (
        <div
          id="a11y-panel"
          role="dialog"
          aria-label="Accessibility settings"
          className="fixed bottom-34 right-6 z-[90] w-72 bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Accessibility className="w-4 h-4 text-orange-500" />
              Accessibility
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
              aria-label="Close accessibility settings"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-5">
            {/* ── Font Size ── */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Text Size
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    update({ fontSize: Math.max(80, settings.fontSize - 10) })
                  }
                  disabled={settings.fontSize <= 80}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-300 transition-colors"
                  aria-label="Decrease text size"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center text-xs font-mono font-bold text-slate-900 dark:text-white">
                  {fontSizeLabel}
                </div>
                <button
                  onClick={() =>
                    update({ fontSize: Math.min(150, settings.fontSize + 10) })
                  }
                  disabled={settings.fontSize >= 150}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-700 dark:text-slate-300 transition-colors"
                  aria-label="Increase text size"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── High Contrast ── */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  High Contrast
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Boosts text contrast for low vision
                </p>
              </div>
              <button
                role="switch"
                aria-checked={settings.highContrast}
                onClick={() => update({ highContrast: !settings.highContrast })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.highContrast
                    ? "bg-orange-500"
                    : "bg-slate-300 dark:bg-slate-600"
                }`}
                aria-label="Toggle high contrast"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.highContrast ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            {/* ── Dyslexia-Friendly Font ── */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Dyslexia Font
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  OpenDyslexic for easier reading
                </p>
              </div>
              <button
                role="switch"
                aria-checked={settings.dyslexiaFont}
                onClick={() => update({ dyslexiaFont: !settings.dyslexiaFont })}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.dyslexiaFont
                    ? "bg-orange-500"
                    : "bg-slate-300 dark:bg-slate-600"
                }`}
                aria-label="Toggle dyslexia-friendly font"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.dyslexiaFont ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            {/* ── Reduced Motion ── */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Reduced Motion
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Disables animations & transitions
                </p>
              </div>
              <button
                role="switch"
                aria-checked={settings.reducedMotion}
                onClick={() =>
                  update({ reducedMotion: !settings.reducedMotion })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.reducedMotion
                    ? "bg-orange-500"
                    : "bg-slate-300 dark:bg-slate-600"
                }`}
                aria-label="Toggle reduced motion"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    settings.reducedMotion ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            {/* ── Reset ── */}
            <button
              onClick={resetAll}
              className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to Defaults
            </button>
          </div>
        </div>
      )}
    </>
  );
}
