import { NextResponse } from "next/server";
import { getClientSessionUsername } from "@/lib/auth";
import { getClientByUsername } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const username = await getClientSessionUsername();
  if (!username) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const account = await getClientByUsername(username);
  if (!account) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }
  const { password: _password, ...safeAccount } = account;
  return NextResponse.json({ account: safeAccount });
}
