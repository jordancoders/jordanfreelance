import { NextResponse } from "next/server";
import { getClientSessionUsername } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const username = await getClientSessionUsername();
  return NextResponse.json({ authenticated: Boolean(username), username });
}
