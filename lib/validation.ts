import type { GoalValue, Locale, LocationValue } from "./i18n/types";

/** Shared by the browser (instant feedback) and the API route (never trust the client). */
export interface LeadInput {
  name: string;
  email: string;
  /** National number, as typed. */
  phone: string;
  /** Country dial code, digits only (e.g. "55"). */
  dial: string;
  country: string;
  goal: GoalValue | "";
  location: LocationValue | "";
  consent: boolean;
  locale: Locale;
  /** Where the lead came from: "contact-form" | "priority-expansion". */
  source: string;
  /** Honeypot: must stay empty. Bots fill it, humans never see it. */
  website?: string;
}

export type ErrorCode = "required" | "email" | "phone" | "consent";
export type LeadField = "name" | "email" | "phone" | "goal" | "location" | "consent";
export type FieldErrors = Partial<Record<LeadField, ErrorCode>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const GOALS: string[] = ["home", "investment", "both"];
const LOCATIONS: string[] = ["ocala", "marion-oaks", "citrus", "tampa-bay"];

export function validateLead(input: LeadInput): FieldErrors {
  const errors: FieldErrors = {};

  if (input.name.trim().length < 2) errors.name = "required";

  if (!input.email.trim()) errors.email = "required";
  else if (!EMAIL_RE.test(input.email.trim()) || input.email.length > 254) errors.email = "email";

  const digits = input.phone.replace(/\D/g, "");
  if (!digits) errors.phone = "required";
  else if (digits.length < 6 || digits.length > 14) errors.phone = "phone";

  if (!GOALS.includes(input.goal)) errors.goal = "required";
  if (!LOCATIONS.includes(input.location)) errors.location = "required";
  if (!input.consent) errors.consent = "consent";

  return errors;
}

/** "+55 11 99999-9999" style E.164-ish string for CRMs and WhatsApp. */
export function formatPhone(dial: string, phone: string): string {
  const digits = phone.replace(/\D/g, "").replace(/^0+/, "");
  return `+${dial}${digits}`;
}
