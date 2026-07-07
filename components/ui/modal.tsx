"use client";

import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Modal({ open, title, onClose, children }: { open: boolean; title?: string; onClose: () => void; children: ReactNode; }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[1.75rem] bg-surface2 p-6 shadow-soft">
        {title && <h3 className="mb-4 text-xl font-semibold text-ink">{title}</h3>}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
