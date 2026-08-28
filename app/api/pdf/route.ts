export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { writeFile, unlink, readFile } from "fs/promises";
import path from "path";
import os from "os";

/**
 * POST /api/pdf
 * Body: { html: string, filename?: string }
 * Tries: python scripts/generate_pdf.py (WeasyPrint) → if unavailable, returns HTML for browser print.
 * This lets the studio export real PDFs when python+weasyprint is installed (e.g. Docker/Vercel Python function),
 * and gracefully degrades on the current Windows dev box where python stub is unavailable.
 */
export async function POST(req: NextRequest) {
  try {
    const { html, filename } = await req.json();
    if (!html || typeof html !== "string") {
      return NextResponse.json({ error: "Missing html string" }, { status: 400 });
    }
    const safeName = (filename || `jordan-peters-bundle-${Date.now()}.pdf`).replace(/[^a-zA-Z0-9._-]/g, "_");

    // Try WeasyPrint via python
    const tmpHtml = path.join(os.tmpdir(), `jp-html-${Date.now()}.html`);
    const tmpPdf = path.join(os.tmpdir(), `jp-pdf-${Date.now()}.pdf`);
    await writeFile(tmpHtml, html, "utf-8");

    const candidates = ["python", "python3", "py"];
    let pdfBuffer: Buffer | null = null;
    let lastErr = "";

    for (const bin of candidates) {
      try {
        pdfBuffer = await tryWeasyPrint(bin, tmpHtml, tmpPdf);
        if (pdfBuffer) break;
      } catch (e: any) {
        lastErr = String(e?.message || e);
      }
    }

    await unlink(tmpHtml).catch(() => {});
    if (pdfBuffer) {
      await unlink(tmpPdf).catch(() => {});
      return new NextResponse(pdfBuffer as any, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${safeName}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    // Fallback: return HTML + instructions for browser print (always works)
    return NextResponse.json({
      fallback: true,
      reason: lastErr.includes("not found") || lastErr.includes("No such file") ? "weasyprint/python not available on this host" : lastErr || "weasyprint unavailable",
      html,
      hint: "Install python + pip install weasyprint, or deploy scripts/generate_pdf.py as a Python function. Current response is HTML for window.print().",
    });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

function tryWeasyPrint(bin: string, htmlPath: string, pdfPath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const script = path.join(process.cwd(), "scripts", "generate_pdf.py");
    const child = spawn(bin, [script, htmlPath, pdfPath], { timeout: 15000 });
    let stderr = "";
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", (e) => reject(e));
    child.on("close", async (code) => {
      if (code === 0) {
        try {
          const buf = await readFile(pdfPath);
          resolve(buf);
        } catch (e) {
          reject(e);
        }
      } else {
        reject(new Error(stderr || `weasyprint exit ${code}`));
      }
    });
  });
}

export async function GET() {
  return NextResponse.json({
    ready: true,
    engine: "weasyprint via scripts/generate_pdf.py (python) with HTML fallback",
    usage: "POST { html, filename } → application/pdf or { fallback: true, html }",
    install: "pip install -r scripts/requirements.txt",
    test: "python scripts/generate_pdf.py --help",
  });
}
