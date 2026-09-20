"use client";

import { useLanguage } from "./LanguageProvider";

/** First tab stop: lets keyboard and screen-reader users jump past the navigation. */
export function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#conteudo"
      className="sr-only rounded-full bg-gold px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
    >
      {t.a11y.skip}
    </a>
  );
}
