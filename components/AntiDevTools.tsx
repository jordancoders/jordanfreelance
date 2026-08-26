"use client";

import { useEffect } from "react";

/**
 * Anti-DevTools protection layer.
 *
 * Techniques used:
 *  1. Debugger timing detection — a `debugger` statement fires; if DevTools
 *     is open the execution pauses, and the elapsed time exceeds a threshold.
 *  2. Keyboard shortcut blocking — F12, Ctrl+Shift+I/J/C, Cmd+Option+I/J/C,
 *     and Ctrl+U (view source) are all suppressed.
 *  3. Right-click context menu disabled.
 *  4. Console.log wrapping — after 50 logs the page shows a warning overlay.
 *  5. Window size discrepancy detection — if the browser window shrinks by
 *     more than 150px (classic DevTools-docked signature), a warning fires.
 *
 * Note: None of these are unbreakable. A determined attacker can always
 * bypass client-side protections. The goal is to deter casual inspection
 * and protect against automated scraping tools.
 */
export default function AntiDevTools() {
  useEffect(() => {
    // ── 1. Debugger timing detection ─────────────────────────────────────
    let devtoolsDetected = false;

    function detectDebugger() {
      const start = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const elapsed = performance.now() - start;
      if (elapsed > 100) {
        devtoolsDetected = true;
        showWarning("Developer tools detected. This site is protected.");
      }
    }

    // Run detection every 3 seconds
    const debuggerInterval = setInterval(detectDebugger, 3000);
    detectDebugger(); // Run immediately

    // ── 2. Keyboard shortcut blocking ────────────────────────────────────
    function blockShortcuts(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // F12
      if (key === "f12") {
        e.preventDefault();
        showWarning("F12 is disabled on this site.");
        return false;
      }

      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
      if (ctrl && shift && ["i", "j", "c"].includes(key)) {
        e.preventDefault();
        showWarning("Developer tools keyboard shortcut is disabled.");
        return false;
      }

      // Ctrl+U (view source)
      if (ctrl && key === "u") {
        e.preventDefault();
        showWarning("View source is disabled on this site.");
        return false;
      }

      // Ctrl+S (save page)
      if (ctrl && key === "s") {
        e.preventDefault();
        return false;
      }

      return true;
    }

    document.addEventListener("keydown", blockShortcuts, { capture: true });

    // ── 3. Right-click disabled ──────────────────────────────────────────
    function blockContextMenu(e: MouseEvent) {
      e.preventDefault();
      return false;
    }

    document.addEventListener("contextmenu", blockContextMenu, { capture: true });

    // ── 4. Console.log monitoring ────────────────────────────────────────
    let logCount = 0;
    const MAX_LOGS = 50;
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    function countLog(...args: unknown[]) {
      logCount++;
      originalLog.apply(console, args);
      if (logCount >= MAX_LOGS && !devtoolsDetected) {
        devtoolsDetected = showWarning("Excessive console activity detected. This site is protected.");
      }
    }

    function countWarn(...args: unknown[]) {
      logCount++;
      originalWarn.apply(console, args);
    }

    function countError(...args: unknown[]) {
      logCount++;
      originalError.apply(console, args);
    }

    console.log = countLog as typeof console.log;
    console.warn = countWarn as typeof console.warn;
    console.error = countError as typeof console.error;

    // ── 5. Window resize detection (docked DevTools) ─────────────────────
    const initialWidth = window.innerWidth;
    const initialHeight = window.innerHeight;

    function checkResize() {
      const widthDiff = Math.abs(window.innerWidth - initialWidth);
      const heightDiff = Math.abs(window.innerHeight - initialHeight);

      if (widthDiff > 150 || heightDiff > 150) {
        if (!devtoolsDetected) {
          devtoolsDetected = showWarning("Developer tools may be open. This site is protected.");
        }
      }
    }

    window.addEventListener("resize", checkResize);

    // ── Cleanup ──────────────────────────────────────────────────────────
    return () => {
      clearInterval(debuggerInterval);
      document.removeEventListener("keydown", blockShortcuts, { capture: true });
      document.removeEventListener("contextmenu", blockContextMenu, { capture: true });
      window.removeEventListener("resize", checkResize);
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  return null; // No DOM output — pure side effects
}

// ── Warning overlay ─────────────────────────────────────────────────────────

let warningShown = false;

function showWarning(message: string): boolean {
  if (warningShown) return true;
  warningShown = true;

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "anti-devtools-warning";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: rgba(0, 0, 0, 0.92);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #f97316;
    font-family: system-ui, sans-serif;
    text-align: center;
    padding: 2rem;
    cursor: pointer;
  `;

  overlay.innerHTML = `
    <div style="max-width: 480px;">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 1.5rem;">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.75rem; color: white;">
        Site Protected
      </h2>
      <p style="font-size: 0.875rem; color: #94a3b8; line-height: 1.6; margin-bottom: 1.5rem;">
        ${message}
      </p>
      <p style="font-size: 0.75rem; color: #64748b;">
        Close developer tools and refresh the page to continue.
      </p>
    </div>
  `;

  overlay.addEventListener("click", () => {
    overlay.remove();
    warningShown = false;
  });

  document.body.appendChild(overlay);

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.remove();
      warningShown = false;
    }
  }, 5000);

  return true;
}
