import { NextRequest, NextResponse } from "next/server";
import { destroyClientSession } from "@/lib/auth";
import { isSameOrigin } from "@/lib/csrf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  await destroyClientSession();
  return NextResponse.json({ ok: true });
}
