"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Stat } from "@/lib/i18n";
import { Counter } from "./Counter";
import { useLanguage } from "./LanguageProvider";

function StatValue({ stat }: { stat: Stat }) {
  return (
    <span className="font-display text-4xl leading-none text-navy sm:text-5xl">
      {stat.value !== undefined ? (
        <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
      ) : (
        stat.text
      )}
    </span>
  );
}

/**
 * Floating stats bar. On md+ the three stats sit side by side; on mobile they become an
 * auto-sliding carousel (pauses on hover/focus, stopped for reduced-motion users).
 */
export function StatsBar() {
  const { t } = useLanguage();
  const stats = t.hero.stats;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % stats.length), 3500);
    return () => clearInterval(id);
  }, [paused, reduce, stats.length]);

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 translate-y-1/2 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/70 bg-white/90 shadow-lift backdrop-blur-xl">
        {/* md+: three columns */}
        <ul className="hidden divide-x divide-slate-200 md:grid md:grid-cols-3">
          {stats.map((s) => (
            <li key={s.label} className="flex flex-col items-center gap-2 px-6 py-7 text-center">
              <StatValue stat={s} />
              <span className="text-sm font-medium text-muted">{s.label}</span>
            </li>
          ))}
        </ul>

        {/* mobile: carousel */}
        <div
          className="md:hidden"
          role="region"
          aria-roledescription="carousel"
          aria-label={stats.map((s) => s.label).join(", ")}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="relative flex min-h-[124px] items-center justify-center overflow-hidden px-6 py-6" aria-live="off">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${index}-${stats[index].label}`}
                className="flex flex-col items-center gap-2 text-center"
                initial={reduce ? false : { opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -28 }}
                transition={{ duration: 0.35 }}
              >
                <StatValue stat={stats[index]} />
                <span className="text-sm font-medium text-muted">{stats[index].label}</span>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center gap-2 pb-4">
            {stats.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${t.a11y.goToSlide} ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-gold" : "w-2 bg-slate-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
