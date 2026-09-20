"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SECTION_IDS, whatsappUrl } from "@/lib/config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";
import { Logo } from "./Logo";

export function Header() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>(SECTION_IDS.home);

  const links = [
    { id: SECTION_IDS.home, label: t.nav.home },
    { id: SECTION_IDS.why, label: t.nav.why },
    { id: SECTION_IDS.cities, label: t.nav.cities },
    { id: SECTION_IDS.invest, label: t.nav.invest },
    { id: SECTION_IDS.expansion, label: t.nav.expansion },
    { id: SECTION_IDS.contact, label: t.nav.contact },
  ];

  // Solid glass bar after the first scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the link of the section currently in view.
  useEffect(() => {
    const ids = Object.values(SECTION_IDS);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const waHref = whatsappUrl(t.whatsapp.message);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        scrolled || menuOpen ? "border-b border-white/10 bg-navy/85 shadow-card backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href={`#${SECTION_IDS.home}`} aria-label="Otrebol" className="shrink-0">
          <Logo tone="light" />
        </a>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  aria-current={active === l.id ? "true" : undefined}
                  className={`relative rounded-full px-4 py-2 text-[0.92rem] font-medium transition ${
                    active === l.id ? "text-gold" : "text-white/85 hover:text-white"
                  }`}
                >
                  {l.label}
                  {active === l.id && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded bg-gold"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="btn-gold !px-3.5 !py-2.5 text-sm sm:!px-5"
          >
            <MessageCircle size={18} aria-hidden="true" />
            <span className="hidden sm:inline">{t.whatsapp.button}</span>
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.a11y.closeMenu : t.a11y.openMenu}
            className="rounded-full p-2.5 text-white transition hover:bg-white/10 xl:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Principal"
            className="max-h-[calc(100svh-72px)] overflow-y-auto border-t border-white/10 bg-navy/95 backdrop-blur-xl xl:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
              {links.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-lg px-3 py-3.5 font-display text-2xl ${
                      active === l.id ? "text-gold" : "text-white"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="px-3 pb-2 pt-4">
                <LanguageSwitcher variant="inline" />
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
