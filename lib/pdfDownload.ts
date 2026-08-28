"use client";

/**
 * Generate and download a PDF from a DOM element.
 * Uses html2pdf.js (html2canvas + jsPDF) with production-quality settings.
 * Dynamic import avoids SSR issues (html2pdf.js references `self`).
 */

export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string,
) {
  // Dynamic import — html2pdf.js uses `self` which doesn't exist during SSR
  const { default: html2pdf } = await import("html2pdf.js");

  // Clone the element so we don't modify the live DOM
  const clone = element.cloneNode(true) as HTMLElement;

  // Force the clone to be fully visible — strip ALL inline display:none,
  // override CSS hiding rules, and make every child visible.
  clone.style.cssText =
    "display:block!important;position:fixed;left:0;top:0;width:210mm;" +
    "z-index:-9999;background:#fff;color:#0f172a;visibility:visible!important;" +
    "opacity:1!important;overflow:visible!important;height:auto!important;";

  // Recursively force every child visible (kills display:none, visibility:hidden, etc.)
  clone.querySelectorAll<HTMLElement>("*").forEach((el) => {
    el.style.cssText += ";display:block!important;visibility:visible!important;opacity:1!important;";
    // Also remove any max-height or overflow that could clip content
    el.style.maxHeight = "none!important";
    el.style.overflow = "visible!important";
  });

  // Specifically ensure data-print-mode sections are visible
  clone.querySelectorAll<HTMLElement>("[data-print-mode]").forEach((el) => {
    el.style.cssText += ";display:block!important;";
  });

  document.body.appendChild(clone);

  try {
    await html2pdf()
      .set({
        margin: [14, 16, 14, 16],
        filename,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          letterRendering: true,
          logging: false,
          allowTaint: false,
          backgroundColor: "#ffffff",
          windowWidth: 794, // A4 at 96 DPI
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },

      })
      .from(clone)
      .save();
  } finally {
    document.body.removeChild(clone);
  }
}
