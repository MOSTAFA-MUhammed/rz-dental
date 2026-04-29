"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

type ModalProps = {
  eyebrow?: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export function Modal({
  children,
  eyebrow = "Details",
  isOpen,
  onClose,
  title,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-10 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="glass-panel max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/40 p-6 shadow-[0_35px_120px_rgba(15,23,42,0.35)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9a7438]">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-950"
            aria-label="Close modal"
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
