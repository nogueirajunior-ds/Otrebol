# Otrebol — site institucional e de geração de leads

Next.js 14 (App Router) · React 18 · Tailwind CSS 3 · Framer Motion · Lucide.
Multilíngue (PT-BR padrão, EN, ES), responsivo (320px → 1920px+), acessível (WCAG AA).

## Rodando

```bash
npm install
cp .env.example .env.local   # preencha os valores
npm run dev                  # http://localhost:3000
npm run build && npm start   # produção
```

## Antes de publicar (checklist)

1. **WhatsApp**: defina `NEXT_PUBLIC_WHATSAPP_NUMBER` (somente dígitos, com DDI).
2. **Captura de leads**: configure ao menos um canal em `.env.local` (e-mail via Resend e/ou `LEAD_WEBHOOK_URL`).
   Em produção, a API responde `503` se nenhum canal estiver configurado, para nunca perder um lead em silêncio.
3. **Foto do hero**: coloque uma imagem em `public/images/` e aponte `HERO_IMAGE` em `lib/config.ts`.
   O `next/image` entrega AVIF/WebP com fallback automático. Até lá, aparece uma ilustração arquitetônica embutida.
4. **Redes sociais**: troque os links em `SOCIAL_LINKS` (`lib/config.ts`).
5. **Jurídico**: revise o aviso legal (`footer.disclaimer`) e o texto de consentimento com um advogado. Publique uma
   Política de Privacidade (LGPD) e linke no consentimento do formulário.
6. **Afirmações de mercado**: os textos sobre valorização acima da média, custo por m² e demanda de locação seguem o briefing.
   Antes de publicar, garanta que cada uma tenha fonte e data que a Otrebol possa citar.

## Estrutura

```
app/
  layout.tsx            fontes, metadados, providers
  page.tsx              composição das seções (imports dinâmicos abaixo da dobra)
  globals.css           tokens de marca (CSS variables), botões, glass, reduced-motion
  api/leads/route.ts    endpoint de leads (validação, honeypot, rate limit, Resend/webhook)
components/
  Header, Hero (+HeroArt, StatsBar), Advantages, CityTabs, ExpansionBanner,
  Quality, ContactForm, Footer, PriorityModal, LanguageProvider/Switcher, Reveal, Counter, Logo
lib/
  config.ts             WhatsApp, hero, redes sociais, IDs de seção
  countries.ts          códigos de país do seletor de telefone
  validation.ts         validação compartilhada (navegador + servidor)
  i18n/                 pt.ts, en.ts, es.ts tipados por types.ts
```

## Onde editar

- **Textos**: `lib/i18n/{pt,en,es}.ts`. O TypeScript acusa se um idioma ficar sem alguma chave.
- **Cores**: variáveis `--navy`, `--gold`, `--sky`, `--surface`, `--ink`, `--muted` em `app/globals.css`
  (canais RGB, então `bg-navy/80` funciona). Nunca use hex direto nos componentes.
- **Mapeamento do menu**: "Por que a Flórida" → vantagens; "Investimento" → padrão de construção (`#investimento`).

## Notas de desenvolvimento

- O idioma é salvo em `localStorage` e aplicado em `<html lang>`, `<title>` e meta description. PT-BR é sempre o estado inicial.
- A troca de idioma é feita no cliente (SPA de página única). Para SEO por idioma, migre depois para rotas `/pt`, `/en`, `/es`
  com `app/[locale]/`; os dicionários já estão prontos para isso.
- O rate limit da API é em memória (por instância). Em ambiente serverless com várias instâncias, use Upstash/Redis.
- Movimento respeita `prefers-reduced-motion`; o carrossel de estatísticas (mobile) pausa em hover/foco.
- Contraste: o azul céu `#4A90E2` só é usado em elementos decorativos e sobre fundos escuros; textos usam navy, ink, muted ou dourado sobre navy.
