import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return NextResponse.json(
        { status: "error", message: "MONGODB_URI not configured" },
        { status: 503 }
      );
    }

    // Dynamic import to avoid connection at module load time
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    await client.db("jordanpeters").command({ ping: 1 });
    await client.close();

    return NextResponse.json({
      status: "ok",
      message: "MongoDB connected successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        message: err instanceof Error ? err.message : "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
