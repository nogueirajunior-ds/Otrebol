"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LOCALES, LOCALE_META } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

/** PT | EN | ES. Dropdown on desktop, inline segmented control inside the mobile menu. */
export function LanguageSwitcher({ variant = "dropdown" }: { variant?: "dropdown" | "inline" }) {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (variant === "inline") {
    return (
      <div role="group" aria-label={t.a11y.language} className="inline-flex rounded-full border border-white/25 p-1">
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={l === locale}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              l === locale ? "bg-gold text-ink" : "text-white/80 hover:text-white"
            }`}
          >
            {LOCALE_META[l].code}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t.a11y.language}: ${LOCALE_META[locale].name}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-2 text-sm font-semibold text-white transition hover:border-gold hover:text-gold"
      >
        <Globe size={16} aria-hidden="true" />
        {LOCALE_META[locale].code}
        <ChevronDown size={14} aria-hidden="true" className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={t.a11y.language}
          className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-white/15 bg-navy/95 py-1 shadow-lift backdrop-blur-xl"
        >
          {LOCALES.map((l) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <button
                type="button"
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-white transition hover:bg-white/10"
              >
                <span>
                  <span className="mr-2 font-semibold text-gold">{LOCALE_META[l].code}</span>
                  {LOCALE_META[l].name}
                </span>
                {l === locale && <Check size={14} className="text-gold" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
