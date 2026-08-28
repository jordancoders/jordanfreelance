"use client";

/**
 * Generate and download a PDF from a DOM element.
 * Uses html2pdf.js (html2canvas + jsPDF) with production-quality settings.
 * Dynamic import avoids SSR issues (html2pdf.js references `self`).
 *
 * Strategy: Clone the element, inject a <style> tag that overrides CSS hiding,
 * preserve all original layout. If a specific mode is passed, only that
 * data-print-mode section is shown (not all of them).
 */

export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string,
  /** Which print-mode sections to show in the PDF. "all" shows everything. */
  showMode?: string,
) {
  const { default: html2pdf } = await import("html2pdf.js");

  // Deep clone — preserves all layout, fonts, colours, borders exactly
  const clone = element.cloneNode(true) as HTMLElement;

  // Make the clone visible off-screen for html2canvas to capture
  Object.assign(clone.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: "210mm",
    maxHeight: "none",
    overflow: "visible",
    visibility: "visible",
    opacity: "1",
    zIndex: "-9999",
    background: "#ffffff",
    color: "#0f172a",
  });

  // Remove the inline display:none that the React state toggle sets
  clone.style.removeProperty("display");
  clone.style.display = "block";

  // Remove any Tailwind "hidden" class
  clone.classList.remove("hidden");

  // Build override rules — inject a <style> tag into the clone.
  // This overrides the CSS that hides print sections, without touching
  // any child element's inline styles (preserving layout).
  let overrideCSS = `
    .hidden, .print\:hidden { display: block !important; }
    .shadow-2xl, .shadow-xl, .shadow-lg { box-shadow: none !important; }
  `;

  if (showMode) {
    // Show ONLY the matching sections (e.g. "invoice" → show [data-print-mode="invoice"])
    // Hide everything else, then selectively show matching ones
    overrideCSS += `
      [data-print-mode] { display: none !important; }
    `;
    // Map mode to the data-print-mode attributes that should be visible
    const modeMap: Record<string, string[]> = {
      "invoice": ["invoice"],
      "declaration": ["declaration"],
      "cover-letter": ["cover-letter"],
      "invoice-declaration": ["invoice", "declaration"],
      "full-package": ["cover-letter", "invoice", "declaration"],
      "monthly-statement": ["monthly-statement"],
      "ytd-summary": ["ytd-summary"],
    };
    const visible = modeMap[showMode] || [showMode];
    for (const m of visible) {
      overrideCSS += `[data-print-mode="${m}"] { display: block !important; }\n`;
    }
  } else {
    // No mode filter — show everything (used by export bundle page)
    overrideCSS += `
      [data-print-mode] { display: block !important; }
    `;
  }

  const styleTag = document.createElement("style");
  styleTag.textContent = overrideCSS;
  clone.prepend(styleTag);

  document.body.appendChild(clone);

  try {
    await html2pdf()
      .set({
        margin: [14, 16, 14, 16] as [number, number, number, number],
        filename,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          allowTaint: false,
          backgroundColor: "#ffffff",
          windowWidth: 794,
          width: 794,
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait" as const,
        },
      })
      .from(clone)
      .save();
  } finally {
    document.body.removeChild(clone);
  }
}
