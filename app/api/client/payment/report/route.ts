import { NextRequest, NextResponse } from "next/server";
import { getClientSessionUsername } from "@/lib/auth";
import { getClientByUsername, updateClient } from "@/lib/db";
import { appendActivity } from "@/lib/clientPortal";
import { notifyPaymentReported } from "@/lib/notifyAdmin";
import { isSameOrigin } from "@/lib/csrf";
import type { PaymentRecord } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Client reports a payment they made (EFT / PayPal / cash).
 *
 * The payment is recorded as "pending" on their portal account — it does NOT
 * touch the invoice until the admin confirms it in the studio. The admin gets
 * an in-app notification (activity log) plus an email when RESEND_API_KEY is set.
 */
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const username = await getClientSessionUsername();
  if (!username) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const account = await getClientByUsername(username);
  if (!account) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "invalid-amount" }, { status: 400 });
  }
  const methods = ["PayPal", "EFT", "Cash", "Other"] as const;
  const method = methods.includes(body.method) ? body.method : "Other";
  const date = typeof body.date === "string" && body.date ? body.date : new Date().toISOString().slice(0, 10);
  const note = typeof body.note === "string" ? body.note.trim() : "";
  // Proof-of-payment: accept base64 data-URL (image or PDF), max ~6 MB.
  const proofUrl = typeof body.proofUrl === "string" && body.proofUrl.startsWith("data:") && body.proofUrl.length < 6_000_000
    ? body.proofUrl
    : undefined;

  const payment: PaymentRecord = {
    id: `pay-${Date.now()}`,
    amount,
    method,
    date,
    note: note || undefined,
    status: "pending",
    reportedBy: "client",
    ...(proofUrl ? { proofUrl } : {}),
  };

  if (!account.id) {
    return NextResponse.json({ error: "invalid-account" }, { status: 500 });
  }

  const currency = account.document?.currency === "USD" ? "USD" : "ZAR";
  const symbol = currency === "USD" ? "$" : "R";
  const withPayment = appendActivity(
    {
      ...account,
      payments: [...(account.payments || []), payment],
    },
    "client",
    `Payment reported: ${symbol} ${amount.toLocaleString()} (${method})`,
    "Awaiting confirmation — the deposit & balance update once confirmed."
  );

  const updated = await updateClient(account.id, { payments: withPayment.payments, activity: withPayment.activity });
  if (!updated) {
    return NextResponse.json({ error: "update-failed" }, { status: 500 });
  }

  void notifyPaymentReported({
    clientName: account.clientName || username,
    amount,
    currency,
    method,
  });

  const { password: _password, ...safeAccount } = updated;
  return NextResponse.json({ account: safeAccount });
}
