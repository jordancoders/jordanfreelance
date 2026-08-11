import { NextResponse } from "next/server";
import { destroyClientSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await destroyClientSession();
  return NextResponse.json({ ok: true });
}
