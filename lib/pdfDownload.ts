"use client";

import html2pdf from "html2pdf.js";

/**
 * Generate and download a PDF from a DOM element.
 * Used for invoice/declaration/statement exports.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string,
) {
  // Clone the element so we can modify styles without affecting the page
  const clone = element.cloneNode(true) as HTMLElement;

  // Make it visible for html2pdf capture (it works offscreen but explicit is better)
  clone.style.position = "fixed";
  clone.style.left = "0";
  clone.style.top = "0";
  clone.style.width = "210mm"; // A4 width
  clone.style.zIndex = "-9999";
  clone.style.background = "#ffffff";
  document.body.appendChild(clone);

  const opt = {
    margin: [14, 16, 14, 16] as [number, number, number, number],
    filename,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
  };

  try {
    await html2pdf().set(opt).from(clone).save();
  } finally {
    document.body.removeChild(clone);
  }
}
