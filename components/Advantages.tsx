"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Landmark, Ruler, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { SECTION_IDS } from "@/lib/config";
import { useLanguage } from "./LanguageProvider";
import { Reveal } from "./Reveal";

const ICONS: LucideIcon[] = [TrendingUp, Ruler, Users, Landmark];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13 } },
};
const card: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Advantages() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();

  return (
    <section id={SECTION_IDS.why} className="relative overflow-hidden bg-surface pb-24 pt-44 sm:pt-40 lg:pb-32">
      {/* ambient floating shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-40 h-72 w-72 animate-float-slow rounded-full bg-gold/10 blur-2xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 bottom-10 h-64 w-64 animate-float rounded-full bg-sky/10 blur-2xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <h2 className="text-4xl font-normal leading-[1.08] text-navy sm:text-5xl">{t.advantages.title}</h2>
              <div className="mt-6 h-0.5 w-16 bg-gold" />
            </Reveal>
          </div>
        </div>

        <motion.ul
          className="grid gap-5 sm:grid-cols-2 lg:col-span-8"
          variants={container}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {t.advantages.items.map((item, i) => {
            const Icon = ICONS[i];
            const dark = i === 0 || i === 3;
            return (
              <motion.li
                key={item.title}
                variants={card}
                className={`lift group rounded-2xl p-7 shadow-card sm:p-8 ${
                  dark ? "bg-navy text-white" : "border border-slate-200 bg-white text-ink"
                }`}
              >
                <span
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-full transition duration-300 group-hover:rotate-6 group-hover:scale-110 ${
                    dark ? "bg-gold/15 text-gold ring-1 ring-gold/40" : "bg-navy text-gold"
                  }`}
                >
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className={`text-2xl font-normal leading-snug ${dark ? "text-white" : "text-navy"}`}>{item.title}</h3>
                <p className={`mt-3 text-[0.95rem] leading-relaxed ${dark ? "text-white/80" : "text-muted"}`}>{item.text}</p>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
