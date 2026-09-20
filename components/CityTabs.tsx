"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Home, Leaf, Sun, Users, type LucideIcon } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { SECTION_IDS } from "@/lib/config";
import type { CityId, LocationValue } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";
import { Reveal } from "./Reveal";

const LOCATION_FOR_CITY: Record<CityId, LocationValue> = {
  ocala: "ocala",
  marion: "marion-oaks",
  citrus: "citrus",
};

export function CityTabs() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<CityId>("ocala");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const cities = t.cities.items;
  const city = cities.find((c) => c.id === active) ?? cities[0];

  const blocks: { key: "overview" | "economy" | "market" | "climate"; icon: LucideIcon }[] = [
    { key: "overview", icon: Leaf },
    { key: "economy", icon: Users },
    { key: "market", icon: Home },
    { key: "climate", icon: Sun },
  ];

  // WAI-ARIA tabs: arrow keys / Home / End move between tabs.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = cities.findIndex((c) => c.id === active);
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % cities.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + cities.length) % cities.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = cities.length - 1;
    else return;
    e.preventDefault();
    setActive(cities[next].id);
    tabRefs.current[cities[next].id]?.focus();
  };

  const prefill = () =>
    window.dispatchEvent(new CustomEvent("otrebol:prefill", { detail: { location: LOCATION_FOR_CITY[active] } }));

  return (
    <section
      id={SECTION_IDS.cities}
      className="bg-gradient-to-b from-white to-sky/10 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-normal leading-[1.08] text-navy sm:text-5xl">{t.cities.title}</h2>
        </Reveal>

        {/* tab list */}
        <div
          role="tablist"
          aria-label={t.cities.tablist}
          onKeyDown={onKeyDown}
          className="mx-auto mt-12 flex w-full max-w-xl justify-center gap-1 rounded-full border border-slate-200 bg-white p-1.5 shadow-card"
        >
          {cities.map((c) => {
            const selected = c.id === active;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  tabRefs.current[c.id] = el;
                }}
                role="tab"
                id={`tab-${c.id}`}
                aria-selected={selected}
                aria-controls={`panel-${c.id}`}
                tabIndex={selected ? 0 : -1}
                type="button"
                onClick={() => setActive(c.id)}
                className={`relative flex-1 rounded-full px-3 py-3 text-sm font-semibold transition sm:px-6 sm:text-[0.95rem] ${
                  selected ? "text-white" : "text-muted hover:text-navy"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="city-pill"
                    className="absolute inset-0 rounded-full bg-navy"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{c.name}</span>
              </button>
            );
          })}
        </div>

        {/* dynamic content card */}
        <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-lift ring-1 ring-slate-200">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              id={`panel-${active}`}
              role="tabpanel"
              aria-labelledby={`tab-${active}`}
              tabIndex={0}
              className="grid lg:grid-cols-12"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* identity panel */}
              <div className="relative flex flex-col justify-between gap-10 bg-navy p-8 text-white sm:p-10 lg:col-span-5">
                <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-2xl border border-gold/40" />
                <div className="relative">
                  <h3 className="text-5xl font-normal leading-none sm:text-6xl">{city.name}</h3>
                  <p className="mt-5 max-w-sm text-lg leading-relaxed text-white/85">{city.tagline}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {city.highlights.map((h) => (
                      <li key={h} className="rounded-full border border-gold/50 bg-gold/10 px-3.5 py-1.5 text-sm text-gold">
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <a href={`#${SECTION_IDS.contact}`} onClick={prefill} className="btn-gold relative self-start">
                  {t.cities.cta}
                </a>
              </div>

              {/* detail grid */}
              <dl className="grid gap-x-10 gap-y-8 p-8 sm:grid-cols-2 sm:p-10 lg:col-span-7">
                {blocks.map(({ key, icon: Icon }) => (
                  <div key={key}>
                    <dt className="flex items-center gap-3 text-lg font-semibold text-navy">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-navy ring-1 ring-gold/50">
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      {t.cities.sectionTitles[key]}
                    </dt>
                    <dd className="mt-3 text-[0.95rem] leading-relaxed text-muted">{city[key]}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
