import { NextResponse } from "next/server";
import { formatPhone, validateLead, type LeadInput } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lead capture endpoint.
 *
 * Delivery channels (configure at least one, see .env.example):
 *  - E-mail via Resend      -> RESEND_API_KEY + LEAD_FROM_EMAIL + LEAD_TO_EMAIL
 *  - Generic webhook (CRM, Zapier/Make/n8n, WhatsApp gateway...) -> LEAD_WEBHOOK_URL
 *
 * In production the endpoint answers 503 when no channel is configured, so a lead is never
 * silently dropped. In development it just logs the lead to the console.
 */

// ---- Naive in-memory rate limit (per server instance). Use Redis/Upstash for multi-instance. ----
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > MAX_HITS;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

const GOAL_LABEL: Record<string, string> = { home: "Moradia", investment: "Investimento", both: "Ambos" };
const LOCATION_LABEL: Record<string, string> = {
  ocala: "Ocala",
  "marion-oaks": "Marion Oaks",
  citrus: "Citrus County",
  "tampa-bay": "Tampa Bay / Land O' Lakes",
};

interface CleanLead {
  name: string;
  email: string;
  phone: string;
  country: string;
  goal: string;
  location: string;
  locale: string;
  source: string;
  receivedAt: string;
}

async function sendEmail(lead: CleanLead): Promise<void> {
  const { RESEND_API_KEY, LEAD_FROM_EMAIL, LEAD_TO_EMAIL } = process.env;
  const rows: [string, string][] = [
    ["Nome", lead.name],
    ["E-mail", lead.email],
    ["Telefone / WhatsApp", lead.phone],
    ["País", lead.country],
    ["Objetivo", GOAL_LABEL[lead.goal] ?? lead.goal],
    ["Localização", LOCATION_LABEL[lead.location] ?? lead.location],
    ["Idioma do site", lead.locale.toUpperCase()],
    ["Origem", lead.source],
    ["Recebido em", lead.receivedAt],
  ];
  const html = `<h2>Novo lead — Otrebol</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><td><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`)
    .join("")}</table>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: LEAD_FROM_EMAIL,
      to: (LEAD_TO_EMAIL ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      reply_to: lead.email,
      subject: `Novo lead (${LOCATION_LABEL[lead.location] ?? lead.location}): ${lead.name}`,
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}

async function postWebhook(lead: CleanLead): Promise<void> {
  const { LEAD_WEBHOOK_URL, LEAD_WEBHOOK_SECRET } = process.env;
  const res = await fetch(LEAD_WEBHOOK_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(LEAD_WEBHOOK_SECRET ? { "X-Webhook-Secret": LEAD_WEBHOOK_SECRET } : {}),
    },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: Partial<LeadInput>;
  try {
    body = (await req.json()) as Partial<LeadInput>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: pretend success so bots learn nothing.
  if (body.website) return NextResponse.json({ ok: true });

  const input: LeadInput = {
    name: String(body.name ?? "").slice(0, 120),
    email: String(body.email ?? "").slice(0, 254),
    phone: String(body.phone ?? "").slice(0, 30),
    dial: String(body.dial ?? "").replace(/\D/g, "").slice(0, 4),
    country: String(body.country ?? "").slice(0, 2).toUpperCase(),
    goal: (body.goal ?? "") as LeadInput["goal"],
    location: (body.location ?? "") as LeadInput["location"],
    consent: body.consent === true,
    locale: (["pt", "en", "es"].includes(String(body.locale)) ? body.locale : "pt") as LeadInput["locale"],
    source: String(body.source ?? "contact-form").slice(0, 40),
  };

  const errors = validateLead(input);
  if (Object.keys(errors).length || !input.dial) {
    return NextResponse.json({ ok: false, error: "validation", fields: errors }, { status: 422 });
  }

  const lead: CleanLead = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: formatPhone(input.dial, input.phone),
    country: input.country,
    goal: input.goal,
    location: input.location,
    locale: input.locale,
    source: input.source,
    receivedAt: new Date().toISOString(),
  };

  const tasks: Promise<void>[] = [];
  if (process.env.RESEND_API_KEY && process.env.LEAD_FROM_EMAIL && process.env.LEAD_TO_EMAIL) {
    tasks.push(sendEmail(lead));
  }
  if (process.env.LEAD_WEBHOOK_URL) tasks.push(postWebhook(lead));

  if (tasks.length === 0) {
    if (process.env.NODE_ENV === "production") {
      console.error("[leads] No delivery channel configured. Lead NOT delivered.");
      return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
    }
    console.log("[leads] (dev) new lead:", lead);
    return NextResponse.json({ ok: true });
  }

  const results = await Promise.allSettled(tasks);
  const delivered = results.some((r) => r.status === "fulfilled");
  results.forEach((r) => r.status === "rejected" && console.error("[leads] delivery failed:", r.reason));

  if (!delivered) return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
