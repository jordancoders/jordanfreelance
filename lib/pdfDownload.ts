"use client";

/**
 * Generate and download a PDF from a DOM element.
 * Uses html2pdf.js (html2canvas + jsPDF) with production-quality settings.
 * Dynamic import avoids SSR issues (html2pdf.js references `self`).
 */

interface PdfOptions {
  filename: string;
  /** A4 margins in mm [top, right, bottom, left] */
  margin?: [number, number, number, number];
  /** Override page size (default A4) */
  format?: "a4" | "letter" | "legal";
  /** Portrait or landscape */
  orientation?: "portrait" | "landscape";
}

export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string,
  opts?: Partial<PdfOptions>,
) {
  // Dynamic import — html2pdf.js uses `self` which doesn't exist during SSR
  const { default: html2pdf } = await import("html2pdf.js");

  const {
    margin = [14, 16, 14, 16],
    format = "a4",
    orientation = "portrait",
  } = opts || {};

  // Clone the element so we don't modify the live DOM
  const clone = element.cloneNode(true) as HTMLElement;

  // Reset any inline display:none from the print-mode toggle
  clone.style.display = "block";
  clone.style.position = "fixed";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.width = format === "a4" ? "210mm" : "215.9mm";
  clone.style.zIndex = "-9999";
  clone.style.background = "#ffffff";
  clone.style.color = "#0f172a";

  // Ensure all children are visible for capture
  clone.querySelectorAll<HTMLElement>("[style*='display: none'], [style*='display:none']").forEach((el) => {
    el.style.display = "block";
  });
  // Make print-mode sections visible
  clone.querySelectorAll<HTMLElement>("[data-print-mode]").forEach((el) => {
    el.style.display = "block";
  });

  document.body.appendChild(clone);

  const opt = {
    margin,
    filename,
    image: {
      type: "jpeg" as const,
      quality: 0.98,
    },
    html2canvas: {
      scale: 3,            // 3x for crisp text (216 DPI)
      useCORS: true,       // load cross-origin images
      letterRendering: true,
      logging: false,
      allowTaint: false,
      backgroundColor: "#ffffff",
      windowWidth: format === "a4" ? 794 : 816, // A4 / Letter px at 96 DPI
    },
    jsPDF: {
      unit: "mm",
      format,
      orientation: orientation as "portrait" | "landscape",
      compress: true,
    },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"] as const,
      before: ".break-before",
      avoid: [".avoid-break", "tr", "h2", "h3", "h4", "p"],
    },
  };

  try {
    await html2pdf().set(opt).from(clone).save();
  } finally {
    document.body.removeChild(clone);
  }
}
