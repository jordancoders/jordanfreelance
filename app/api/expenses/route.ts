import { NextRequest, NextResponse } from "next/server";
import { getExpenses, createExpense, updateExpense, deleteExpense } from "@/lib/db";
import { getClientSessionUsername } from "@/lib/auth";
import { isSameOrigin } from "@/lib/csrf";
import { checkRateLimit } from "@/lib/rateLimit";
import { EXPENSE_CATEGORIES } from "@/lib/types";
import type { ExpenseEntry, ExpenseCategory } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Expenses are admin-only. Any authenticated session can read/write
 * (single-admin model — no role-based access needed).
 */
async function requireAdmin() {
  const username = await getClientSessionUsername();
  if (!username) return null;
  return username;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const expenses = await getExpenses();
  return NextResponse.json({ expenses });
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "bad-request" }, { status: 400 });

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) return NextResponse.json({ error: "invalid-amount" }, { status: 400 });

  const currencies = ["ZAR", "USD"] as const;
  const currency = currencies.includes(body.currency) ? body.currency : "ZAR";

  // Rate limit: 30 writes per 15 minutes per IP.
  const rl = await checkRateLimit("expenses-write", 30);
  if (!rl.ok) return NextResponse.json({ error: "rate-limited" }, { status: 429 });

  const allowedCategories = EXPENSE_CATEGORIES.map((c) => c.value);
  const category: ExpenseCategory = allowedCategories.includes(body.category) ? body.category : "other";

  const expense: ExpenseEntry = {
    id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    description: typeof body.description === "string" ? body.description.trim() : "",
    amount,
    currency,
    category,
    date: typeof body.date === "string" ? body.date : new Date().toISOString().slice(0, 10),
    invoiceRef: typeof body.invoiceRef === "string" ? body.invoiceRef.trim() || undefined : undefined,
    vendor: typeof body.vendor === "string" ? body.vendor.trim() || undefined : undefined,
    receiptUrl: typeof body.receiptUrl === "string" && body.receiptUrl.startsWith("data:") && body.receiptUrl.length < 6_000_000 ? body.receiptUrl : undefined,
    note: typeof body.note === "string" ? body.note.trim() || undefined : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const created = await createExpense(expense);
  return NextResponse.json({ expense: created });
}

export async function PUT(req: NextRequest) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: "missing-id" }, { status: 400 });

  const { id, ...patch } = body;
  const updated = await updateExpense(id, patch);
  if (!updated) return NextResponse.json({ error: "not-found" }, { status: 404 });
  return NextResponse.json({ expense: updated });
}

export async function DELETE(req: NextRequest) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing-id" }, { status: 400 });

  const deleted = await deleteExpense(id);
  if (!deleted) return NextResponse.json({ error: "not-found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
