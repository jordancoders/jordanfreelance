#!/usr/bin/env python3
"""
WeasyPrint HTML → PDF for Jordan Peters bundle.

Usage:
  python scripts/generate_pdf.py input.html output.pdf
  cat input.html | python scripts/generate_pdf.py - output.pdf
  python scripts/generate_pdf.py --json payload.json output.pdf

Requires: pip install weasyprint
On Vercel: deploy as Python serverless function or run in Docker.
On this Windows dev box Python is not installed — the Next.js API route
/app/api/pdf falls back to Node HTML response when python is unavailable.
"""
import sys, json, pathlib

def main():
    try:
        from weasyprint import HTML
    except ImportError:
        sys.stderr.write("weasyprint not installed. Run: pip install weasyprint\n")
        sys.exit(2)

    if len(sys.argv) < 3:
        sys.stderr.write("Usage: generate_pdf.py <input.html|-> <output.pdf> [--json payload.json]\n")
        sys.exit(1)

    inp = sys.argv[1]
    out = sys.argv[2]

    if inp == "-":
        html_str = sys.stdin.read()
    elif inp.endswith(".json"):
        # payload.json → render minimal HTML then PDF (for API use)
        data = json.loads(pathlib.Path(inp).read_text(encoding="utf-8"))
        html_str = render_from_payload(data)
    else:
        html_str = pathlib.Path(inp).read_text(encoding="utf-8")

    HTML(string=html_str, base_url=".").write_pdf(out)
    print(f"PDF written to {out}", file=sys.stderr)

def render_from_payload(data: dict) -> str:
    # Minimal fallback template — real bundle is rendered in Next.js,
    # this is for headless API calls.
    title = data.get("title", "Jordan Peters — Document Bundle")
    body = data.get("html", "<p>No content</p>")
    return f"""<!doctype html>
<html><head><meta charset="utf-8">
<style>@page{{size:A4;margin:18mm}} body{{font-family:Inter,sans-serif;font-size:11pt;color:#0f172a}} h1{{font-size:18pt}} table{{width:100%;border-collapse:collapse}} th,td{{border:1px solid #cbd5e1;padding:6px}}</style>
<title>{title}</title></head><body><h1>{title}</h1>{body}</body></html>"""

if __name__ == "__main__":
    main()
