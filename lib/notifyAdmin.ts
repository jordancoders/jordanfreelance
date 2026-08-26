/**
 * Server-side admin notifications.
 *
 * When a client does something important in their portal (signs a declaration,
 * replies to a message, reports a payment), the studio owner gets an email so
 * they don't have to watch the dashboard. Sending is fire-and-forget: it uses
 * RESEND_API_KEY when configured and silently no-ops otherwise — the in-app
 * notification bell is the always-available fallback.
 */
import "server-only";

const ADMIN_EMAIL = "jordancodefreelancer@protonmail.com";
const FROM = "onboarding@resend.dev";

/** Escapes user-supplied text for safe interpolation into the HTML email body. */
function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends a notification email to the studio owner. Never throws — failures are
 * logged and swallowed so portal actions never break because of email.
 */
export async function notifyAdminEmail(opts: { subject: string; html: string }): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("[notifyAdmin] RESEND_API_KEY missing — email notification skipped (in-app bell still shows it).");
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: FROM,
        to: [ADMIN_EMAIL],
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.warn("[notifyAdmin] Resend rejected notification:", body);
    }
  } catch (err) {
    console.error("[notifyAdmin] Resend fetch error:", err);
  }
}

/** Shared chrome for notification emails. */
function wrap(title: string, bodyHtml: string): string {
  return `
    <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
      <h2 style="color: #ea580c; margin-bottom: 12px;">${esc(title)}</h2>
      ${bodyHtml}
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
      <p style="font-size: 12px; color: #64748b;">
        From your client portal — open the Studio Admin to act on it: <a href="https://jpfreelance.dpdns.org/admin">jpfreelance.dpdns.org/admin</a>
      </p>
    </div>
  `;
}

/** Client signed the declaration in their portal. */
export async function notifyDeclarationSigned(opts: { clientName: string; projectTitle: string; invoiceNumber: string }): Promise<void> {
  await notifyAdminEmail({
    subject: `✍ ${opts.clientName} signed the declaration — ${opts.invoiceNumber}`,
    html: wrap(
      `${opts.clientName} signed the declaration`,
      `
      <p><strong>Client:</strong> ${esc(opts.clientName)}</p>
      <p><strong>Project:</strong> ${esc(opts.projectTitle)}</p>
      <p><strong>Document:</strong> ${esc(opts.invoiceNumber)}</p>
      <p>The signature is already archived on the linked document — the PDF bundle is export-ready.</p>
      `
    ),
  });
}

/** Client replied inside their portal. */
export async function notifyClientReply(opts: { clientName: string; snippet: string }): Promise<void> {
  await notifyAdminEmail({
    subject: `💬 ${opts.clientName} replied in the portal`,
    html: wrap(
      `${opts.clientName} replied in the portal`,
      `<blockquote style="background:#f8fafc; padding:12px; border-left:4px solid #f97316; margin:8px 0; white-space:pre-line;">${esc(opts.snippet)}</blockquote>`
    ),
  });
}

/** Client reported a payment — needs confirmation in the studio. */
export async function notifyPaymentReported(opts: { clientName: string; amount: number; currency: string; method: string }): Promise<void> {
  await notifyAdminEmail({
    subject: `💰 ${opts.clientName} reported a payment (${opts.currency} ${opts.amount.toLocaleString()})`,
    html: wrap(
      `${opts.clientName} reported a payment`,
      `
      <p><strong>Amount:</strong> ${esc(opts.currency)} ${opts.amount.toLocaleString()}</p>
      <p><strong>Method:</strong> ${esc(opts.method)}</p>
      <p>Confirm it in the Client Portals tab to record it against their invoice.</p>
      `
    ),
  });
}
