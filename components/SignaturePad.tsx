"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Eraser, PenLine } from "lucide-react";

interface SignaturePadProps {
  value: string; // data URL ('' = empty)
  onChange: (dataUrl: string) => void;
  height?: number;
  label?: string;
}

/**
 * Lightweight canvas signature pad (mouse + touch). Emits a PNG data URL.
 * Used for the signed declaration on invoices and the legal PDF bundle.
 */
export default function SignaturePad({
  value,
  onChange,
  height = 140,
  label = "Sign here",
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const getPoint = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Keep a persistent drawing surface even when React re-renders.
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
  }, []);

  const start = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const p = getPoint(e);
      if (!p) return;
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      drawingRef.current = true;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      setHasDrawn(true);
    },
    [getPoint]
  );

  const move = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!drawingRef.current) return;
      const p = getPoint(e);
      if (!p) return;
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    },
    [getPoint]
  );

  const end = useCallback(() => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL("image/png"));
  }, [onChange]);

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onChange("");
  }, [onChange]);

  return (
    <div className="space-y-1.5">
      <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        <PenLine className="w-3.5 h-3.5" />
        {label}
      </span>
      <div className="relative rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-100 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={height * 2}
          style={{ width: "100%", height, touchAction: "none" }}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
          className="cursor-crosshair"
          aria-label="Signature pad — draw your signature"
        />
        {!hasDrawn && !value && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
            {label} with mouse or finger
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={clear}
        className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-red-500 transition-colors"
      >
        <Eraser className="w-3.5 h-3.5" />
        Clear signature
      </button>
    </div>
  );
}
