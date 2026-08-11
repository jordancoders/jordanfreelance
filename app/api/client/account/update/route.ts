import { NextRequest, NextResponse } from "next/server";
import { getClientSessionUsername } from "@/lib/auth";
import { getClientByUsername, updateClient } from "@/lib/db";
import type { ClientPortalAccount } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
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
  if (body.declaration) allowedPatch.declaration = body.declaration;
  if (Array.isArray(body.messages)) allowedPatch.messages = body.messages;
  if (Array.isArray(body.activity)) allowedPatch.activity = body.activity;

  if (!account.id) {
    return NextResponse.json({ error: "invalid-account" }, { status: 500 });
  }
  const { password: _password, ...safeAccount } = await updateClient(account.id, allowedPatch);
  return NextResponse.json({ account: safeAccount });
}
