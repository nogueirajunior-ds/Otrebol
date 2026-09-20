"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ContactForm } from "./ContactForm";
import { useLanguage } from "./LanguageProvider";

interface ModalContextValue {
  openPriorityForm: () => void;
}
const ModalContext = createContext<ModalContextValue | null>(null);

export function usePriorityModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("usePriorityModal must be used inside <PriorityModalProvider>");
  return ctx;
}

/** Accessible dialog: Esc to close, focus trap, focus restore, scroll lock. */
export function PriorityModalProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const openPriorityForm = useCallback(() => {
    lastFocused.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lastFocused.current?.focus?.();
    };
  }, [open, close]);

  const value = useMemo(() => ({ openPriorityForm }), [openPriorityForm]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center overflow-y-auto bg-ink/70 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && close()}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="priority-title"
              className="relative my-8 w-full max-w-lg rounded-3xl border border-gold/50 bg-white p-6 shadow-lift sm:p-8"
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label={t.a11y.closeDialog}
                className="absolute right-4 top-4 rounded-full p-2 text-muted transition hover:bg-slate-100 hover:text-ink"
              >
                <X size={20} />
              </button>
              <h2 id="priority-title" className="pr-10 text-3xl font-normal leading-tight text-navy">
                {t.expansion.modalTitle}
              </h2>
              <p className="mb-6 mt-2 text-[0.95rem] text-muted">{t.expansion.modalSub}</p>
              <ContactForm
                variant="modal"
                source="priority-expansion"
                defaultLocation="tampa-bay"
                defaultGoal="investment"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}
