"use client";

import { Facebook, Instagram, Linkedin } from "lucide-react";
import { SECTION_IDS, SOCIAL_LINKS } from "@/lib/config";
import { useLanguage } from "./LanguageProvider";
import { Logo } from "./Logo";

export function Footer() {
  const { t } = useLanguage();
  const links = [
    { id: SECTION_IDS.home, label: t.nav.home },
    { id: SECTION_IDS.why, label: t.nav.why },
    { id: SECTION_IDS.cities, label: t.nav.cities },
    { id: SECTION_IDS.invest, label: t.nav.invest },
    { id: SECTION_IDS.expansion, label: t.nav.expansion },
    { id: SECTION_IDS.contact, label: t.nav.contact },
  ];
  const social = [
    { href: SOCIAL_LINKS.instagram, label: t.footer.social.instagram, Icon: Instagram },
    { href: SOCIAL_LINKS.facebook, label: t.footer.social.facebook, Icon: Facebook },
    { href: SOCIAL_LINKS.linkedin, label: t.footer.social.linkedin, Icon: Linkedin },
  ];

  return (
    <footer className="bg-ink text-white/75">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-5 max-w-sm leading-relaxed">{t.footer.about}</p>
          <ul className="mt-6 flex gap-3">
            {social.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-gold hover:text-gold"
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label={t.footer.linksTitle} className="lg:col-span-3">
          <h2 className="mb-4 text-xl font-normal text-white">{t.footer.linksTitle}</h2>
          <ul className="space-y-2.5">
            {links.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="transition hover:text-gold">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-5">
          <h2 className="mb-4 text-xl font-normal text-white">{t.footer.legalTitle}</h2>
          <p className="text-sm leading-relaxed">{t.footer.disclaimer}</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-sm sm:px-6 lg:px-8">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Otrebol. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
