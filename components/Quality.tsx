"use client";

import { DoorOpen, Gem, Wind, Zap, type LucideIcon } from "lucide-react";
import { SECTION_IDS } from "@/lib/config";
import { useLanguage } from "./LanguageProvider";
import { Reveal } from "./Reveal";

const ICONS: LucideIcon[] = [Zap, Gem, DoorOpen, Wind];

export function Quality() {
  const { t } = useLanguage();
  return (
    <section id={SECTION_IDS.invest} className="bg-surface py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-5">
          <Reveal>
            <h2 className="text-4xl font-normal leading-[1.08] text-navy sm:text-5xl">{t.quality.title}</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{t.quality.sub}</p>
          </Reveal>
        </div>

        {/* ruled list instead of cards: this is a spec sheet, not a feature grid */}
        <ul className="divide-y divide-slate-200 border-y border-slate-200 lg:col-span-7">
          {t.quality.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <li key={item.title}>
                <Reveal delay={i * 0.08} className="group flex gap-5 py-7 sm:gap-7">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-navy text-gold transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lift">
                    <Icon size={26} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-2xl font-normal text-navy">{item.title}</h3>
                    <p className="mt-2 max-w-lg text-[0.97rem] leading-relaxed text-muted">{item.text}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
