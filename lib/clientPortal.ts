/**
 * Client Portal — utility functions.
 *
 * Pure helpers for client portal accounts. All data persistence is handled
 * via MongoDB (see lib/db.ts). These functions perform no I/O.
 */

import type {
  ClientPortalAccount,
  InvoiceLike,
  ProgressUpdate,
  ActivityEntry,
} from "./types";

export type { InvoiceLike, ClientPortalAccount, ProgressUpdate, PaymentRecord, SharedAsset } from "./types";

/** localStorage key — kept for backward compatibility with old invite cards. */
export const CLIENT_SESSION_KEY = "jordanpeters_client_session";

/** Versioned prefix so pasted cards can be auto-detected. */
export const CARD_PREFIX = "JPCARD1:";

/** Standard milestone plan every new portal starts with (admin can edit freely). */
export const DEFAULT_MILESTONES: { label: string; status: ProgressUpdate["status"]; note?: string }[] = [
  { label: "Scope locked & quote confirmed", status: "completed", note: "Requirements captured and agreed." },
  { label: "Kick-off deposit received", status: "in-progress" },
  { label: "Design & architecture", status: "queued" },
  { label: "48-hour staging demo delivered", status: "queued" },
  { label: "Revisions & final approval", status: "queued" },
  { label: "Production handover & source code", status: "queued" },
  { label: "7-day data erasure confirmation", status: "queued" },
];

const slugPart = (name: string) =>
  (name || "client").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 8) || "client";

/** Deterministic-ish, human-friendly unique username: first name + 3 digits. */
export function generateUsername(name: string): string {
  const base = slugPart(name.split(/\s+/)[0]);
  return `${base}${Math.floor(100 + Math.random() * 900)}`;
}

/** Readable random password (10 chars, no ambiguous characters). */
export function generatePassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  const cryptoObj = typeof crypto !== "undefined" ? crypto : undefined;
  if (cryptoObj?.getRandomValues) {
    const vals = new Uint32Array(10);
    cryptoObj.getRandomValues(vals);
    for (const v of vals) out += chars[v % chars.length];
  } else {
    for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

/** Fills every new field with safe defaults so old cards / backups never crash. */
export function normalizeClientAccount(acc: ClientPortalAccount): ClientPortalAccount {
  return {
    ...acc,
    progress: Array.isArray(acc.progress) ? acc.progress : [],
    payments: Array.isArray(acc.payments) ? acc.payments : [],
    messages: Array.isArray(acc.messages) ? acc.messages : [],
    assets: Array.isArray(acc.assets) ? acc.assets : [],
    activity: Array.isArray(acc.activity) ? acc.activity : [],
  };
}

/** Overall completion: admin-set % wins; otherwise derived from milestones. */
export function computePercentComplete(acc: ClientPortalAccount): number {
  if (typeof acc.percentComplete === "number" && acc.percentComplete >= 0 && acc.percentComplete <= 100) {
    return Math.round(acc.percentComplete);
  }
  const progress = acc.progress || [];
  const total = progress.length;
  if (!total) return 0;
  return Math.round((progress.filter((p) => p.status === "completed").length / total) * 100);
}

/** Sum of every recorded payment for a project. */
export function totalPaymentsReceived(acc: ClientPortalAccount): number {
  return (acc.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
}

/** Prepend an activity entry to a client's audit trail (immutable helper). */
export function appendActivity(
  acc: ClientPortalAccount,
  actor: ActivityEntry["actor"],
  action: string,
  detail?: string
): ClientPortalAccount {
  const entry: ActivityEntry = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    actor,
    action,
    detail,
    ts: new Date().toISOString(),
  };
  return { ...acc, activity: [entry, ...(acc.activity || [])].slice(0, 250) };
}

/** Captures the relevant invoice/quote fields into a portable snapshot. */
export function buildDocumentSnapshot(inv: InvoiceLike | undefined | null): ClientPortalAccount["document"] {
  if (!inv) return undefined;
  const currency = inv.currency === "USD" ? "USD" : "ZAR";
  const subtotal = (inv.items || []).reduce((sum, it) => sum + (it.quantity || 0) * (it.rate || 0), 0);
  const depositPercent = inv.depositPercent ?? 50;
  const depositAmount = Math.round(subtotal * (depositPercent / 100));
  return {
    documentType: inv.documentType === "Quote" ? "Quote" : "Invoice",
    invoiceNumber: inv.invoiceNumber || "INV-PENDING",
    projectTitle: inv.items?.[0]?.description || "Custom Web App",
    clientName: inv.clientName || "Client",
    clientCompany: inv.clientCompany || "",
    currency,
    issueDate: inv.issueDate || "",
    dueDate: inv.dueDate || "",
    status: inv.status || "Draft",
    items: (inv.items || []).map((it) => ({
      description: it.description || "",
      quantity: it.quantity || 0,
      rate: it.rate || 0,
    })),
    subtotal,
    depositPercent,
    depositAmount,
    depositPaid: inv.depositPaid || 0,
    balance: Math.max(0, subtotal - depositAmount),
    notes: inv.notes || "",
  };
}

// ─── Invite card (the shareable payload) ─────────────────────────────────────

function toBase64Url(str: string): string {
  const b64 = typeof Buffer !== "undefined"
    ? Buffer.from(str).toString("base64")
    : btoa(str);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): string {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  return typeof Buffer !== "undefined"
    ? Buffer.from(padded, "base64").toString()
    : atob(padded);
}

/** Encodes an account into a compact, copy-paste invite card. */
export function buildInviteCard(account: ClientPortalAccount): string {
  return `${CARD_PREFIX}${toBase64Url(JSON.stringify({ v: 1, account }))}`;
}

/** Parses pasted text back into an account. Accepts card format or raw JSON. */
export function parseInviteCard(text: string): ClientPortalAccount | null {
  const trimmed = (text || "").trim();
  if (!trimmed) return null;
  try {
    let parsed: { v?: number; account?: ClientPortalAccount };
    if (trimmed.startsWith(CARD_PREFIX)) {
      parsed = JSON.parse(fromBase64Url(trimmed.slice(CARD_PREFIX.length).trim()));
    } else {
      parsed = JSON.parse(trimmed);
    }
    const account = parsed?.account ?? (parsed as unknown as ClientPortalAccount);
    if (!account || typeof account !== "object" || !account.username || !account.password) return null;
    return normalizeClientAccount(account);
  } catch {
    return null;
  }
}
