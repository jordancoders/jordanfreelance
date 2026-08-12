import { NextRequest, NextResponse } from "next/server";
import { getClientSessionUsername } from "@/lib/auth";
import { getClientByUsername, updateClient, getInvoice, updateInvoice } from "@/lib/db";
import { buildDocumentSnapshot } from "@/lib/clientPortal";
import { notifyDeclarationSigned, notifyClientReply } from "@/lib/notifyAdmin";
import { isSameOrigin } from "@/lib/csrf";
import type { ClientPortalAccount } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
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

  // Only allow the client to update specific fields
  const allowedPatch: Partial<ClientPortalAccount> = {};
  if (body.declaration) {
    // The signature is always stamped as captured by the client (never trust
    // the client body for the actor), then pushed onto the linked invoice so
    // the admin dashboard and PDF bundle see it immediately — no card round-trip.
    const declaration = {
      ...body.declaration,
      signedBy: "client" as const,
      signedAt: body.declaration.signedAt || new Date().toISOString(),
    };
    allowedPatch.declaration = declaration;
    if (account.invoiceId) {
      const invoice = await getInvoice(account.invoiceId);
      if (invoice) {
        const status = invoice.status === "Sent" ? "Accepted" : invoice.status;
        await updateInvoice(account.invoiceId, { declaration, status });
        // Reflect the new status on the client's own snapshot right away
        // (signing the declaration IS accepting the quote).
        allowedPatch.document = buildDocumentSnapshot({ ...invoice, declaration, status });
      }
    }
    void notifyDeclarationSigned({
      clientName: account.clientName || username,
      projectTitle: account.document?.projectTitle || "your project",
      invoiceNumber: account.document?.invoiceNumber || "—",
    });
  }
  if (Array.isArray(body.messages)) {
    allowedPatch.messages = body.messages;
    const last = body.messages[body.messages.length - 1];
    if (last?.from === "client") {
      const snippet = typeof last.text === "string" ? last.text.slice(0, 140) : "";
      void notifyClientReply({ clientName: account.clientName || username, snippet });
    }
  }
  if (Array.isArray(body.activity)) allowedPatch.activity = body.activity;

  if (!account.id) {
    return NextResponse.json({ error: "invalid-account" }, { status: 500 });
  }
  const updated = await updateClient(account.id, allowedPatch);
  if (!updated) {
    return NextResponse.json({ error: "update-failed" }, { status: 500 });
  }
  const { password: _password, ...safeAccount } = updated;
  return NextResponse.json({ account: safeAccount });
}
