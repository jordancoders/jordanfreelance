/**
 * Server-side Cloudflare Turnstile token verification.
 *
 * If TURNSTILE_SECRET_KEY is not configured (local dev), verification is
 * silently skipped so the app works without a Cloudflare account.
 */

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || "";
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileResult {
  success: boolean;
  /** Human-readable error when verification fails. */
  error?: string;
}

/**
 * Verify a Turnstile response token submitted by the client.
 * Returns `{ success: true }` when the token is valid (or Turnstile is not
 * configured), or `{ success: false, error: "..." }` on failure.
 */
export async function verifyTurnstile(
  token: string | undefined | null,
  ip?: string,
): Promise<TurnstileResult> {
  // Graceful skip when Turnstile is not configured (local dev / staging).
  if (!TURNSTILE_SECRET) {
    return { success: true };
  }

  if (!token) {
    return { success: false, error: "Captcha verification required." };
  }

  try {
    const form = new URLSearchParams();
    form.append("secret", TURNSTILE_SECRET);
    form.append("response", token);
    if (ip) form.append("remoteip", ip);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body: form,
    });

    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
      challenge_ts?: string;
      hostname?: string;
    };

    if (data.success) {
      return { success: true };
    }

    const codes = data["error-codes"]?.join(", ") || "unknown";
    console.warn(`[turnstile] Verification failed: ${codes}`);
    return {
      success: false,
      error: "Captcha verification failed. Please try again.",
    };
  } catch (err) {
    console.error("[turnstile] Verification request error:", err);
    // Fail open: if Turnstile's API is unreachable, allow the request
    // rather than blocking legitimate users.
    return { success: true };
  }
}
