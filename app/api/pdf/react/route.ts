import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { SITE_CONFIG } from "@/data/portfolioData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanit(obj: any) {
  return {
    ...obj,
    items: Array.isArray(obj.items) && obj.items.length ? obj.items : [{ id: "1", description: "Custom Work", quantity: 1, rate: 0 }],
    clientName: obj.clientName?.trim() || "Client",
    invoiceNumber: obj.invoiceNumber?.trim() || `DOC-${Date.now()}`,
    currency: obj.currency === "USD" ? "USD" : "ZAR",
    issueDate: obj.issueDate || new Date().toISOString().slice(0, 10),
    dueDate: obj.dueDate || new Date().toISOString().slice(0, 10),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoice: rawInv, declaration: rawDecl, type = "invoice", filename } = body || {};
    if (!rawInv) return NextResponse.json({ error: "Missing invoice" }, { status: 400 });

    const invoice = sanit(rawInv);
    const declaration = rawDecl
      ? {
          ...rawDecl,
          signatureDataUrl: typeof rawDecl.signatureDataUrl === "string" ? rawDecl.signatureDataUrl.slice(0, 2_000_000) : "",
        }
      : undefined;

    // Guard declaration data URL
    if (declaration?.signatureDataUrl && !declaration.signatureDataUrl.startsWith("data:image/") && !/^https?:\/\//.test(declaration.signatureDataUrl)) {
      declaration.signatureDataUrl = "";
    }

    const common = {
      developerName: SITE_CONFIG.developerName,
      tradingName: SITE_CONFIG.tradingName,
      email: SITE_CONFIG.email,
      whatsappFormatted: SITE_CONFIG.whatsappFormatted,
      location: SITE_CONFIG.location,
      siteUrl: SITE_CONFIG.siteUrl,
      paypalMeUrl: SITE_CONFIG.paypalMeUrl,
    };

    let el: React.ReactElement | null = null;
    if (type === "invoice") {
      const { default: InvoicePDF } = await import("@/components/pdf/InvoicePDF");
      el = React.createElement(InvoicePDF, { invoice, ...common });
    } else if (type === "declaration") {
      if (!declaration) return NextResponse.json({ error: "Missing declaration" }, { status: 400 });
      const { default: DeclarationPDF } = await import("@/components/pdf/DeclarationPDF");
      el = React.createElement(DeclarationPDF as any, { invoice, declaration, ...common });
    } else if (type === "cover-letter") {
      const { default: CoverLetterPDF } = await import("@/components/pdf/CoverLetterPDF");
      el = React.createElement(CoverLetterPDF, { invoice, ...common });
    } else {
      return NextResponse.json({ error: `Unknown type ${type}` }, { status: 400 });
    }

    if (!el) return NextResponse.json({ error: "Failed to build PDF element" }, { status: 500 });

    const buf = await renderToBuffer(el as any);
    if (!buf || buf.length < 500) {
      console.error("[pdf/react] buffer too small", buf?.length);
      return NextResponse.json({ error: `Generated too small (${buf?.length})` }, { status: 500 });
    }

    const name = (filename || `${invoice.invoiceNumber}-${type}.pdf`).replace(/[^a-zA-Z0-9._-]/g, "_");
    return new NextResponse(buf as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${name}"`,
        "Cache-Control": "no-store",
        "Content-Length": String(buf.length),
      },
    });
  } catch (err: any) {
    console.error("[pdf/react] exception", err?.stack || err);
    return NextResponse.json({ error: String(err?.message || err), stack: String(err?.stack || "").slice(0, 2000) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: "POST { invoice, declaration?, type:'invoice'|'declaration'|'cover-letter', filename? } → application/pdf" });
}
