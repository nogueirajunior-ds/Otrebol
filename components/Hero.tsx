"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { HERO_IMAGE, SECTION_IDS, whatsappUrl } from "@/lib/config";
import { HeroArt } from "./HeroArt";
import { useLanguage } from "./LanguageProvider";
import { StatsBar } from "./StatsBar";

const FLOATING = [
  { pos: "right-[8%] top-[24%]", anim: "animate-float", delay: "0s" },
  { pos: "right-[30%] top-[16%]", anim: "animate-float-slow", delay: "-3s" },
  { pos: "right-[14%] top-[52%]", anim: "animate-float", delay: "-5s" },
];

export function Hero() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();

  // Orchestrated load-in: one staggered sequence, no other scattered entrance effects.
  const item = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay: 0.15 + i * 0.14, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
        };

  return (
    <section id={SECTION_IDS.home} className="relative isolate z-10 flex min-h-[100svh] items-center bg-navy pb-44 pt-32 sm:pb-40">
      {/* background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {HERO_IMAGE ? (
          <Image src={HERO_IMAGE} alt={t.hero.imageAlt} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <HeroArt />
        )}
        {/* dark navy overlay: keeps text at WCAG AA over any image */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-navy/70 to-navy/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/40" />
      </div>

      {/* floating decorative badges */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        {t.hero.badges.map((b, i) => (
          <div
            key={b}
            className={`glass absolute ${FLOATING[i].pos} ${FLOATING[i].anim} flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-card`}
            style={{ animationDelay: FLOATING[i].delay }}
          >
            <MapPin size={14} className="text-gold" />
            {b}
          </div>
        ))}
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.h1
            {...item(0)}
            className="text-[2.6rem] font-normal leading-[1.04] text-white sm:text-6xl lg:text-[4.6rem]"
          >
            {t.hero.headline}
          </motion.h1>
          <motion.p {...item(1)} className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            {t.hero.sub}
          </motion.p>
          <motion.div {...item(2)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a href={`#${SECTION_IDS.cities}`} className="btn-gold animate-glow">
              {t.hero.ctaPrimary}
            </a>
            <a
              href={whatsappUrl(t.whatsapp.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass"
            >
              {t.hero.ctaSecondary}
            </a>
          </motion.div>
        </div>
      </div>

      <StatsBar />
    </section>
  );
}
