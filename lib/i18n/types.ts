export type Locale = "pt" | "en" | "es";
export const LOCALES: Locale[] = ["pt", "en", "es"];
export const DEFAULT_LOCALE: Locale = "pt";

export type CityId = "ocala" | "marion" | "citrus";
export type GoalValue = "home" | "investment" | "both";
export type LocationValue = "ocala" | "marion-oaks" | "citrus" | "tampa-bay";

export interface Stat {
  /** When `value` is set the number animates from 0 on scroll into view. */
  value?: number;
  prefix?: string;
  suffix?: string;
  /** Static text shown instead of a counter. */
  text?: string;
  label: string;
}

export interface CityContent {
  id: CityId;
  name: string;
  tagline: string;
  highlights: string[];
  overview: string;
  economy: string;
  market: string;
  climate: string;
}

export interface TitledText {
  title: string;
  text: string;
}

export interface Dictionary {
  meta: { title: string; description: string };
  a11y: {
    skip: string;
    openMenu: string;
    closeMenu: string;
    language: string;
    closeDialog: string;
    previous: string;
    next: string;
    goToSlide: string;
  };
  nav: { home: string; why: string; cities: string; invest: string; expansion: string; contact: string };
  whatsapp: { button: string; message: string };
  hero: {
    headline: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    imageAlt: string;
    badges: string[];
    stats: Stat[];
  };
  advantages: { title: string; items: TitledText[] };
  cities: {
    title: string;
    tablist: string;
    sectionTitles: { overview: string; economy: string; market: string; climate: string };
    items: CityContent[];
    cta: string;
  };
  expansion: {
    title: string;
    badge: string;
    lead: string;
    points: string[];
    cta: string;
    mapCaption: string;
    mapLabels: { citrus: string; ocala: string; marion: string; landolakes: string; tampa: string };
    modalTitle: string;
    modalSub: string;
  };
  quality: { title: string; sub: string; items: TitledText[] };
  contact: {
    title: string;
    subtitle: string;
    receiveTitle: string;
    receive: string[];
    fields: {
      name: string;
      namePh: string;
      email: string;
      emailPh: string;
      phone: string;
      phonePh: string;
      country: string;
      goal: string;
      location: string;
      select: string;
    };
    goals: { value: GoalValue; label: string }[];
    locations: { value: LocationValue; label: string }[];
    consent: string;
    submit: string;
    submitting: string;
    errors: { required: string; email: string; phone: string; consent: string };
    success: { title: string; text: string; whatsapp: string };
    failure: string;
  };
  footer: {
    about: string;
    linksTitle: string;
    legalTitle: string;
    disclaimer: string;
    rights: string;
    social: { instagram: string; facebook: string; linkedin: string };
  };
}
