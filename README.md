# Leefland Limburg

Marketing site for Leefland Limburg, built with [Enhance](https://enhance.dev).

## Structure

- `app/pages/*.html` — file-based routes (`initiatieven.html` → `/initiatieven`)
- `app/elements/*.mjs` — shared HTML Web Components (`site-topbar`, `site-header`, `site-footer`)
- `app/api/*.mjs` — per-page data (currently just supplies `pageTitle`)
- `app/head.mjs` — shared `<head>` (fonts, base styles, global `interactions.js`)
- `public/` — static assets (images, `interactions.js` for hover/focus effects)

## Local development

```bash
npm install
npm start
```

Opens the standard Enhance/Architect dev server at `http://localhost:3333`.

## Deploying

**Important caveat:** Enhance's only official deployment target is AWS via
[Architect](https://enhance.dev/docs/deployment/architect) — there is no
official Cloudflare adapter. This project deploys to Cloudflare Pages via a
custom build step instead:

```bash
npm run build:static
```

This calls `@enhance/ssr` (the same rendering engine Architect uses)
directly, at build time, to pre-render every page in `app/pages/` into
plain static HTML in `dist/`. That static output is what Cloudflare Pages
serves — nothing runs Enhance server-side on Cloudflare.

**Consequence:** this only works because the site has no per-request
server logic today. If real dynamic behavior is ever needed (a database,
per-request personalization, form submissions handled server-side), it
will not run on Cloudflare with this setup. Options at that point:
deploy via Architect to AWS instead, or write a genuine Cloudflare Worker
that calls `@enhance/ssr` per request (bigger, separate undertaking).

See `scripts/build-static.mjs` for the build logic.
