"use client";

import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent, type PointerEvent, type ReactNode } from "react";
import { COUNTRIES } from "@/lib/countries";
import { SECTION_IDS, whatsappUrl } from "@/lib/config";
import type { GoalValue, LocationValue } from "@/lib/i18n";
import { validateLead, type FieldErrors, type LeadField } from "@/lib/validation";
import { useLanguage } from "./LanguageProvider";
import { Reveal } from "./Reveal";

/* ------------------------------------------------------------------ */
/* Gold submit button with a ripple on hover and press                 */
/* ------------------------------------------------------------------ */
interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

function RippleButton({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const counter = useRef(0);

  const spawn = (e: PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    setRipples((r) => [
      ...r.slice(-4),
      { id: counter.current++, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size },
    ]);
  };

  return (
    <button
      type="submit"
      disabled={disabled}
      onPointerEnter={spawn}
      onPointerDown={spawn}
      className="btn-gold animate-glow w-full !py-4 text-base disabled:cursor-not-allowed disabled:opacity-70"
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          className="pointer-events-none absolute animate-ripple rounded-full bg-white/70"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          onAnimationEnd={() => setRipples((rs) => rs.filter((x) => x.id !== r.id))}
        />
      ))}
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */
interface ContactFormProps {
  /** "page" renders the full section; "modal" renders only the form (used by the priority dialog). */
  variant?: "page" | "modal";
  source?: string;
  defaultLocation?: LocationValue;
  defaultGoal?: GoalValue;
}

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({
  variant = "page",
  source = "contact-form",
  defaultLocation,
  defaultGoal,
}: ContactFormProps) {
  const { t, locale } = useLanguage();
  const uid = useId();
  const c = t.contact;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("BR");
  const [goal, setGoal] = useState<GoalValue | "">(defaultGoal ?? "");
  const [location, setLocation] = useState<LocationValue | "">(defaultLocation ?? "");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  // "Talk about this region" buttons elsewhere on the page pre-select a location.
  useEffect(() => {
    if (variant !== "page") return;
    const onPrefill = (e: Event) => {
      const loc = (e as CustomEvent<{ location?: LocationValue }>).detail?.location;
      if (loc) setLocation(loc);
    };
    window.addEventListener("otrebol:prefill", onPrefill);
    return () => window.removeEventListener("otrebol:prefill", onPrefill);
  }, [variant]);

  const id = (f: string) => `${uid}-${f}`;
  const dial = COUNTRIES.find((x) => x.iso === country)?.dial ?? "55";

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const payload = { name, email, phone, dial, country, goal, location, consent, locale, source, website };
    const found = validateLead(payload);
    setErrors(found);

    const order: LeadField[] = ["name", "email", "phone", "goal", "location", "consent"];
    const firstInvalid = order.find((f) => found[f]);
    if (firstInvalid) {
      document.getElementById(id(firstInvalid))?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const err = (f: LeadField) => (errors[f] ? c.errors[errors[f] as keyof typeof c.errors] : null);
  const fieldProps = (f: LeadField) => ({
    id: id(f),
    "aria-invalid": errors[f] ? (true as const) : undefined,
    "aria-describedby": errors[f] ? id(`${f}-err`) : undefined,
  });
  const ErrorText = ({ f }: { f: LeadField }) =>
    err(f) ? (
      <p id={id(`${f}-err`)} className="mt-1.5 text-sm font-medium text-red-600">
        {err(f)}
      </p>
    ) : null;

  const labelCls = "mb-1.5 block text-sm font-semibold text-navy";

  const card =
    status === "success" ? (
      <div className="flex flex-col items-center gap-4 py-8 text-center" role="status">
        <CheckCircle2 size={48} className="text-gold" aria-hidden="true" />
        <h3 className="text-3xl font-normal text-navy">{c.success.title}</h3>
        <p className="max-w-sm text-[0.97rem] leading-relaxed text-muted">{c.success.text}</p>
        <a href={whatsappUrl(t.whatsapp.message)} target="_blank" rel="noopener noreferrer" className="btn-gold mt-2">
          <MessageCircle size={18} aria-hidden="true" />
          {c.success.whatsapp}
        </a>
      </div>
    ) : (
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {/* honeypot: hidden from people and assistive tech */}
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label>
            Website
            <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
        </div>

        <div>
          <label htmlFor={id("name")} className={labelCls}>
            {c.fields.name}
          </label>
          <input {...fieldProps("name")} className="field" type="text" autoComplete="name" placeholder={c.fields.namePh} value={name} onChange={(e) => setName(e.target.value)} />
          <ErrorText f="name" />
        </div>

        <div>
          <label htmlFor={id("email")} className={labelCls}>
            {c.fields.email}
          </label>
          <input {...fieldProps("email")} className="field" type="email" autoComplete="email" inputMode="email" placeholder={c.fields.emailPh} value={email} onChange={(e) => setEmail(e.target.value)} />
          <ErrorText f="email" />
        </div>

        <div>
          <label htmlFor={id("phone")} className={labelCls}>
            {c.fields.phone}
          </label>
          <div className="flex gap-2">
            <select
              aria-label={c.fields.country}
              className="field !w-[7.5rem] shrink-0 !px-3"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {COUNTRIES.map((x) => (
                <option key={x.iso} value={x.iso}>
                  {x.iso} +{x.dial}
                </option>
              ))}
            </select>
            <input {...fieldProps("phone")} className="field" type="tel" autoComplete="tel-national" inputMode="tel" placeholder={c.fields.phonePh} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <ErrorText f="phone" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={id("goal")} className={labelCls}>
              {c.fields.goal}
            </label>
            <select {...fieldProps("goal")} className="field" value={goal} onChange={(e) => setGoal(e.target.value as GoalValue)}>
              <option value="">{c.fields.select}</option>
              {c.goals.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
            <ErrorText f="goal" />
          </div>
          <div>
            <label htmlFor={id("location")} className={labelCls}>
              {c.fields.location}
            </label>
            <select {...fieldProps("location")} className="field" value={location} onChange={(e) => setLocation(e.target.value as LocationValue)}>
              <option value="">{c.fields.select}</option>
              {c.locations.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            <ErrorText f="location" />
          </div>
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
            <input
              {...fieldProps("consent")}
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-navy"
            />
            <span>{c.consent}</span>
          </label>
          <ErrorText f="consent" />
        </div>

        <RippleButton disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              {c.submitting}
            </>
          ) : (
            c.submit
          )}
        </RippleButton>

        <div aria-live="polite">
          {status === "error" && (
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {c.failure}
            </p>
          )}
        </div>
      </form>
    );

  if (variant === "modal") return card;

  return (
    <section id={SECTION_IDS.contact} className="relative overflow-hidden bg-navy py-24 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-16 h-80 w-80 animate-float rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="text-white lg:col-span-5">
          <Reveal>
            <h2 className="text-4xl font-normal leading-[1.08] sm:text-5xl">{c.title}</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/85">{c.subtitle}</p>
            <h3 className="mb-4 mt-10 text-xl font-normal text-gold">{c.receiveTitle}</h3>
            <ul className="space-y-3">
              {c.receive.map((r) => (
                <li key={r} className="flex items-start gap-3 text-white/90">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="relative rounded-3xl border border-white/60 bg-white p-6 shadow-lift sm:p-9">{card}</div>
        </Reveal>
      </div>
    </section>
  );
}
