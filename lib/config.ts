/**
 * Central place for the few values a non-developer will want to change.
 */

/** International format, digits only. Set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local */
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5500000000000";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.otrebol.com";

export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Hero photography.
 * Drop a high-resolution photo into /public/images (e.g. hero.jpg, 2400px wide, < 400 KB after
 * compression) and set it here: `export const HERO_IMAGE = "/images/hero.jpg";`
 * next/image converts it to AVIF/WebP automatically and keeps the original as fallback.
 * While this is null, the built-in architectural illustration is shown.
 */
export const HERO_IMAGE: string | null = null;

/** TODO: replace with the company's real profiles. */
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  linkedin: "https://www.linkedin.com/",
};

/** Section anchors, shared by the header, the CTAs and the sections themselves. */
export const SECTION_IDS = {
  home: "inicio",
  why: "por-que-florida",
  cities: "cidades",
  invest: "investimento",
  expansion: "expansao",
  contact: "contato",
} as const;
