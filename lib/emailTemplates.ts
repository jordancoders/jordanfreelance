/**
 * Polished, conversion-friendly email templates for the studio.
 *
 * Copy tone: personal, confident, outcome-first ("I've put together your
 * Quotation…", "I can start Monday and have a live staging demo for you to
 * click by Wednesday") — never apologetic about the AI workflow, never
 * robotic. All templates are plain-text so they paste cleanly into Gmail,
 * WhatsApp, or any client.
 */

import { SITE_CONFIG } from "@/data/portfolioData";
import type { ClientPortalAccount, InvoiceLike } from "./clientPortal";


// ─── Date helpers ────────────────────────────────────────────────────────────

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function prettyDate(d: Date): string {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** The next Monday strictly after today (kick-off day). */
export function nextMonday(): Date {
  const d = new Date();
  const day = d.getDay(); // 0 Sun … 6 Sat
  const add = day === 1 ? 7 : (8 - day) % 7 || 7;
  const monday = new Date(d);
  monday.setDate(d.getDate() + add);
  return monday;
}

/** The 48-hour staging demo date (kick-off + 2 days → typically Wednesday). */
export function stagingDate(start: Date = nextMonday()): Date {
  const s = new Date(start);
  s.setDate(s.getDate() + 2);
  return s;
}

// ─── Money helpers ───────────────────────────────────────────────────────────

const symbolFor = (inv: { currency?: string }) => (inv.currency === "USD" ? "$" : "R");
const money = (inv: { currency?: string }, n: number) => `${symbolFor(inv)} ${n.toLocaleString()}`;

// ─── Document calculations (mirrors the admin's no-tax invoice logic) ────────

const subtotalOf = (inv: InvoiceLike) =>
  (inv.items || []).reduce((sum, it) => sum + (it.quantity || 0) * (it.rate || 0), 0);
const depositOf = (inv: InvoiceLike) => {
  const pct = inv.depositPercent ?? 50;
  return Math.round(subtotalOf(inv) * (pct / 100));
};
const balanceOf = (inv: InvoiceLike) => Math.max(0, subtotalOf(inv) - depositOf(inv));
const projectTitleOf = (inv: InvoiceLike) =>
  inv.items?.[0]?.description || "custom web app";

const signatureBlock = () =>
  [
    `Kind regards,`,
    `${SITE_CONFIG.developerName}`,
    `${SITE_CONFIG.brandLine}`,
    `WhatsApp: ${SITE_CONFIG.whatsappFormatted}`,
    `Email: ${SITE_CONFIG.email}`,
  ].join("\n");

// ─── 1. Quote / Invoice delivery email ───────────────────────────────────────

export function buildQuoteEmailDraft(inv: InvoiceLike): string {
  const docTitle = inv.documentType === "Quote" ? "Quotation" : "Invoice";
  const total = subtotalOf(inv);
  const deposit = depositOf(inv);
  const balance = balanceOf(inv);
  const pct = inv.depositPercent ?? 50;
  const notes = (inv.notes || "").trim();
  const start = nextMonday();
  const staging = stagingDate(start);

  return [
    `Hi ${inv.clientName},`,
    ``,
    `I've put together your ${docTitle} ${inv.invoiceNumber} for the ${projectTitleOf(inv)}.`,
    ``,
    `Here's the breakdown:`,
    `• Total: ${money(inv, total)}`,
    `• Kick-off deposit (${pct}%): ${money(inv, deposit)}`,
    `• Final balance (${100 - pct}%): ${money(inv, balance)}`,
    ``,
    `How this works:`,
    `1. You approve the ${docTitle.toLowerCase()} and the ${pct}% kick-off deposit covers the API tokens and kick-off labour.`,
    `2. I start ${prettyDate(start)} and you get a live staging link to click through by ${prettyDate(staging)} — before you pay the balance.`,
    `3. You test it, we do any agreed revisions, and the full source code becomes yours on final payment.`,
    ``,
    `Payment is via PayPal (${SITE_CONFIG.paypalEmail}) or Direct EFT (bank transfer) — proof of payment via WhatsApp ${SITE_CONFIG.whatsappFormatted}.`,
    ...(notes ? [``, `Note: ${notes}`, ``] : [``]),
    `Reply to this email or WhatsApp me to approve, and I'll get your slot booked for ${prettyDate(start)}.`,
    ``,
    signatureBlock(),
  ].join("\n");
}

// ─── 2. Kick-off / "recipe" email (the plan) ─────────────────────────────────

export function buildKickoffEmailDraft(inv: InvoiceLike): string {
  const start = nextMonday();
  const staging = stagingDate(start);
  const itemLines = (inv.items || []).map(
    (it, i) => `  ${i + 1}. ${it.description} (${it.quantity} × ${money(inv, it.rate || 0)})`
  );

  return [
    `Hi ${inv.clientName},`,
    ``,
    `Confirmed — we're live on ${projectTitleOf(inv)}. 🚀`,
    ``,
    `Here's the recipe for your build:`,
    ...itemLines,
    ``,
    `Timeline:`,
    `• Kick-off: ${prettyDate(start)}`,
    `• Live staging demo link for you to click: ${prettyDate(staging)} (48-hour guarantee)`,
    ``,
    `Deposit received/confirmed: ${money(inv, depositOf(inv))} — this covers the API tokens and kick-off labour for your project.`,
    ``,
    `What I need from you before kick-off:`,
    `• Any login details, sample data, or branding assets for the staging build`,
    `• Confirm the primary WhatsApp number for status updates`,
    ``,
    `You'll get the staging link the moment it's ready — test everything on it, then we handle the balance after your approval.`,
    ``,
    signatureBlock(),
  ].join("\n");
}

// ─── 3. Final handover email (export bundle, source, erasure) ────────────────

export function buildHandoverEmailDraft(inv: InvoiceLike): string {
  return [
    `Hi ${inv.clientName},`,
    ``,
    `Your ${projectTitleOf(inv)} is complete and live. 🎉`,
    ``,
    `Handover checklist:`,
    `1. Staging approved — final version deployed.`,
    `2. Full source code transferred to you (ownership is 100% yours on final payment).`,
    `3. Export bundle: your signed declaration plus the legal package (terms, privacy, POPIA, DPA) is exported from the studio as a PDF bundle — keep it with your records.`,
    `4. 7-day data erasure: any confidential staging data and credentials are permanently destroyed within 7 calendar days of this handover, and you'll receive written confirmation.`,
    ``,
    `Final balance due: ${money(inv, balanceOf(inv))} — payable via PayPal (${SITE_CONFIG.paypalEmail}) or Direct EFT.`,
    ``,
    `Every project includes a 14-day bug-fix warranty: critical bugs found after handover are fixed at no charge (documented in the Refund & Guarantee Policy). Optional care plans are available if you'd like ongoing maintenance.`,
    ``,
    `Thank you for trusting me with this build — it's been a pleasure.`,
    ``,
    signatureBlock(),
  ].join("\n");
}

// ─── 3b. Sign-request email (send the PDF for signature) ─────────────────────

export function buildSignRequestEmailDraft(inv: InvoiceLike): string {
  const docTitle = inv.documentType === "Quote" ? "Quotation" : "Invoice";
  return [
    `Hi ${inv.clientName},`,
    ``,
    `Your ${docTitle} ${inv.invoiceNumber} is ready to sign (a copy is attached as a PDF for your records).`,
    ``,
    `To sign it (easiest — no printing):`,
    `1. Open your private portal: ${SITE_CONFIG.siteUrl}/client`,
    `2. Log in with the username & password from your portal invite, then sign the declaration right there.`,
    `3. I see your signature instantly — no need to send anything back.`,
    ``,
    `Prefer the attached PDF? Sign the declaration on the first page and return it by replying to this email or WhatsApp ${SITE_CONFIG.whatsappFormatted}.`,
    ``,
    `Once I receive your signed copy, I'll archive it with your project records (total: ${money(inv, subtotalOf(inv))}).`,
    ``,
    `If anything in the ${docTitle.toLowerCase()} doesn't look right, just reply and I'll adjust it — no questions asked.`,
    ``,
    signatureBlock(),
  ].join("\n");
}

// ─── 4. Client Portal (CP) invite message — carries the access card ──────────

const portalUrl = () => `${SITE_CONFIG.siteUrl}/client`;

/** The invite text. `channel` tweaks formatting for WhatsApp vs email. */
export function buildCPInviteMessage(
  account: ClientPortalAccount,
  channel: "email" | "whatsapp" = "email"
): string {
  const name = account.clientName || account.username;
  const project = account.document?.projectTitle || "your project";
  const divider = channel === "whatsapp" ? "──────────────" : "━━━━━━━━━━━━━━━━━━━━";

  const body = [
    `Hi ${name},`,
    ``,
    channel === "whatsapp" ? `Your private portal for ${project} is ready 🎉` : `Your private portal for ${project} is ready.`,
    ``,
    `Track your build live with % progress, view your quote, check payments, read my updates and reply, open your staging links, and sign your declaration — all in one place, no admin dashboard needed. When you sign the declaration, I see it instantly — no need to send anything back.`,
    ``,
    `${divider}`,
    `🔗 PORTAL: ${portalUrl()}`,
    `👤 USERNAME: ${account.username}`,
    `🔑 PASSWORD: ${account.password}`,
    `${divider}`,
    ``,
    `How to log in:`,
    `1. Open the portal link above.`,
    `2. Enter your username and password.`,
    `3. You're in — your dashboard is live.`,
    ``,
    `If you have any questions, WhatsApp me on ${SITE_CONFIG.whatsappFormatted}.`,
    ``,
    signatureBlock(),
  ];

  return body.join("\n");
}

/** The wa.me target for a client: their phone, falling back to the studio number. */
function whatsAppTarget(account: ClientPortalAccount): string {
  const digits = (account.phone || "").replace(/[^0-9]/g, "");
  const normalized = digits.replace(/^27/, "").replace(/^0/, "");
  return normalized ? `27${normalized}` : "27848600638";
}

/** Pre-filled WhatsApp share link for an arbitrary update text. */
export function buildWhatsAppShareUrl(account: ClientPortalAccount, text: string): string {
  return `https://wa.me/${whatsAppTarget(account)}?text=${encodeURIComponent(text)}`;
}

/** WhatsApp draft for an admin update / announcement composed in the studio. */
export function buildWhatsAppMessageShare(account: ClientPortalAccount, text: string): string {
  const project = account.document?.projectTitle || "your project";
  const body = [
    `Hi ${account.clientName || account.username},`,
    ``,
    `Quick update on ${project}:`,
    text,
    ``,
    `Your private portal: ${portalUrl()}`,
  ].join("\n");
  return buildWhatsAppShareUrl(account, body);
}

/** WhatsApp draft for sharing a link / deliverable with the client. */
export function buildWhatsAppAssetShare(account: ClientPortalAccount, label: string, url: string): string {
  const project = account.document?.projectTitle || "your project";
  const body = [
    `Hi ${account.clientName || account.username},`,
    ``,
    `Here's your ${label} for ${project}:`,
    url,
  ].join("\n");
  return buildWhatsAppShareUrl(account, body);
}

/** Pre-filled WhatsApp share link for the CP invite. */
export function buildCPWhatsAppUrl(account: ClientPortalAccount): string {
  return buildWhatsAppShareUrl(account, buildCPInviteMessage(account, "whatsapp"));
}
