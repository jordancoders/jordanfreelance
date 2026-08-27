"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Cloudflare Turnstile widget wrapper.
 *
 * Renders the invisible/challenge captcha and calls `onSuccess(token)` when
 * the user passes. The parent should include the token in form submissions.
 *
 * If NEXT_PUBLIC_TURNSTILE_SITEKEY is not set the component renders nothing
 * (graceful degradation for local dev).
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: Record<string, unknown>,
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileSuccess?: (token: string) => void;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

interface TurnstileProps {
  /** Called with the token when verification succeeds. */
  onSuccess: (token: string) => void;
  /** Called when the widget expires or errors. */
  onExpire?: () => void;
  /** Optional light/dark theme. Defaults to "auto". */
  theme?: "light" | "dark" | "auto";
  /** Optional size. Defaults to "normal". */
  size?: "normal" | "compact";
  /** Extra class on the wrapper div. */
  className?: string;
}

export default function Turnstile({
  onSuccess,
  onExpire,
  theme = "auto",
  size = "normal",
  className = "",
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>("");

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY || "";

  // Expose the callback globally so Turnstile can call it.
  useEffect(() => {
    window.onTurnstileSuccess = (token: string) => {
      onSuccess(token);
    };
    return () => {
      delete window.onTurnstileSuccess;
    };
  }, [onSuccess]);

  const loadScript = useCallback(() => {
    if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    loadScript();

    // Wait for the turnstile global to become available, then render.
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.turnstile && containerRef.current) {
        clearInterval(interval);
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: "onTurnstileSuccess",
          theme,
          size,
          "error-callback": () => onExpire?.(),
          "expired-callback": () => onExpire?.(),
        });
      }
      if (attempts > 50) clearInterval(interval); // safety: ~5s
    }, 100);

    return () => {
      clearInterval(interval);
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
      }
    };
  }, [siteKey, loadScript, theme, size, onExpire]);

  // If no site key, render nothing (dev mode).
  if (!siteKey) return null;

  return (
    <div className={className}>
      <div ref={containerRef} />
    </div>
  );
}
