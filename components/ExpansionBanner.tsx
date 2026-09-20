"use client";

import { CheckCircle2 } from "lucide-react";
import { SECTION_IDS } from "@/lib/config";
import { useLanguage } from "./LanguageProvider";
import { usePriorityModal } from "./PriorityModal";
import { Reveal } from "./Reveal";

/** Schematic corridor map (not geographic): the gold segment is the expansion route. */
function CorridorMap() {
  const { t } = useLanguage();
  const L = t.expansion.mapLabels;
  return (
    <svg viewBox="0 0 420 460" role="img" aria-label={`${L.citrus}, ${L.ocala}, ${L.marion}, ${L.landolakes}, ${L.tampa}`} className="h-auto w-full">
      {/* faint Gulf coastline */}
      <path
        d="M36 0 C 58 84, 26 140, 66 204 C 98 256, 58 322, 88 384 C 100 420, 82 446, 112 460"
        fill="none"
        style={{ stroke: "rgb(var(--sky))", strokeOpacity: 0.45 }}
        strokeWidth="2"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />

      {/* existing network */}
      <g fill="none" strokeWidth="1.6" strokeDasharray="4 7" strokeLinecap="round" style={{ stroke: "rgb(var(--gold))", strokeOpacity: 0.55 }}>
        <path d="M120 120 Q 170 170 255 185" />
        <path d="M270 70 L255 185" />
      </g>

      {/* expansion route */}
      <g fill="none" strokeWidth="3" strokeLinecap="round" style={{ stroke: "rgb(var(--gold))" }}>
        <path d="M255 185 Q 250 260 215 315" />
        <path d="M215 315 Q 195 360 170 410" strokeDasharray="2 8" />
      </g>

      {/* existing markets */}
      {[
        { x: 120, y: 120, label: L.citrus, dx: -14, anchor: "end" as const },
        { x: 270, y: 70, label: L.ocala, dx: 16, anchor: "start" as const },
        { x: 255, y: 185, label: L.marion, dx: 16, anchor: "start" as const },
      ].map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="7" style={{ fill: "rgb(var(--navy))", stroke: "rgb(var(--gold))" }} strokeWidth="2.5" />
          <text x={n.x + n.dx} y={n.y + 5} textAnchor={n.anchor} fill="white" fontSize="14" fontWeight="500">
            {n.label}
          </text>
        </g>
      ))}

      {/* Land O' Lakes: the featured node, pulsing */}
      <circle cx="215" cy="315" r="10" style={{ fill: "rgb(var(--gold))", fillOpacity: 0.35 }}>
        <animate attributeName="r" values="10;26;10" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="fill-opacity" values="0.45;0;0.45" dur="2.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="215" cy="315" r="10" style={{ fill: "rgb(var(--gold))" }} />
      <text x="235" y="320" style={{ fill: "rgb(var(--gold))" }} fontSize="17" fontWeight="700">
        {L.landolakes}
      </text>

      {/* Tampa */}
      <circle cx="170" cy="410" r="6" fill="white" />
      <text x="186" y="415" fill="white" fontSize="14" fontWeight="500">
        {L.tampa}
      </text>
    </svg>
  );
}

export function ExpansionBanner() {
  const { t } = useLanguage();
  const { openPriorityForm } = usePriorityModal();
  const e = t.expansion;

  return (
    <section id={SECTION_IDS.expansion} className="relative overflow-hidden bg-navy py-24 text-white lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 h-80 w-80 animate-float-slow rounded-full bg-sky/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div>
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold">
              {e.badge}
            </span>
            <h2 className="mt-5 text-4xl font-normal leading-[1.08] sm:text-5xl">{e.title}</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{e.lead}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-4">
              {e.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[1.02rem] leading-relaxed text-white/90">
                  <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <button type="button" onClick={openPriorityForm} className="btn-gold animate-glow mt-10">
              {e.cta}
            </button>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <figure className="lift relative rounded-3xl border border-gold/60 bg-ink/50 p-6 shadow-lift sm:p-8">
            {/* subtle blueprint grid */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative mx-auto max-w-sm">
              <CorridorMap />
            </div>
            <figcaption className="relative mt-2 text-center text-sm text-white/70">{e.mapCaption}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
