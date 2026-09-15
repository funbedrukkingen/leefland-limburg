# Leefland Limburg

Marketing site for Leefland Limburg, built with [Enhance](https://enhance.dev).

## Structure

- `app/pages/*.html` — file-based routes (`initiatieven.html` → `/initiatieven`)
- `app/elements/*.mjs` — shared HTML Web Components (`site-topbar`, `site-header`,
  `site-footer`, `leefland-card`, `leefland-data`, `leefland-faq`,
  `leefland-initiatieven-grid`, `leefland-jsonld`)
- `app/models/initiatieven-data.mjs` — deterministic generator for the fictional
  initiatives dataset used by both the card grid and the JSON-LD block
- `app/api/*.mjs` — per-page data (currently just supplies `pageTitle`)
- `app/head.mjs` — shared `<head>` (fonts, base styles, global `interactions.js`)
- `public/` — static assets (images, `interactions.js` for hover/focus effects)

## Local development

```bash
npm install
npm start
```

Opens the standard Enhance/Architect dev server at `http://localhost:3333`.

## Deploying to Cloudflare (experimental)

**Important caveat:** Enhance's only official deployment target is AWS via
[Architect](https://enhance.dev/docs/deployment/architect) — there is no
official Cloudflare adapter. Everything below is a hand-built, unofficial
bridge, kept as two separate paths:

### 1. Live Cloudflare Worker (`worker.js`) — primary path

```bash
npm run build:static   # produces dist/_public/* for the [assets] binding
npx wrangler dev        # local test
npx wrangler deploy     # ships worker.js + dist/ to Cloudflare
```

`worker.js` imports `@enhance/ssr` and calls it per request, on Cloudflare's
edge — genuine server-side rendering, not a pre-baked file. Since Workers
can't read the filesystem at request time, `app/pages/*.html` and the
`app/elements`/`app/api` modules are all bundled in at build time via
Wrangler's built-in `.html`-as-text module support (no extra config
needed). Routing is a small hand-written map in `worker.js` — it does not
replicate Architect's full file-based router (params, middleware, etc.),
just the static routes this site actually has.

Static files (images, `interactions.js`) are served via the Workers
`[assets]` binding pointed at `dist/` (see `wrangler.toml`), with
`html_handling = "none"` so a request like `/doe-mee` isn't silently
resolved to a prerendered static file — it always goes through the worker.

### 2. Static prerender (`scripts/build-static.mjs`) — fallback path

```bash
npm run build:static
```

Same `@enhance/ssr` call, but done once at build time instead of per
request, writing plain HTML files to `dist/`. Deployable to Cloudflare
Pages (or any static host) with zero Workers runtime involved. Useful as
a simpler fallback if the Worker path ever misbehaves.

**Consequence of both paths:** nothing here uses Architect's AWS deploy
pipeline. If real dynamic behavior is ever needed beyond what
`app/api/*.mjs`'s build/request-time `get()` supplies today (a database,
sessions, form submissions handled server-side), either path can still
express it in code, but you'd be extending this hand-built adapter
further rather than relying on anything Enhance ships or documents.

## Content-size experiment on the homepage

`app/pages/index.html` was deliberately built up into a large, single
rendered document (~184,000 characters as currently configured) to
exercise the Worker/prerender pipeline at scale: a 50-item generated
initiative grid (`leefland-initiatieven-grid`, backed by
`app/models/initiatieven-data.mjs`), 8 `leefland-data` stat tiles, a
10-item `leefland-faq` list, several long-form copy sections, two inline
decorative SVG patterns, and a JSON-LD block describing all 50
initiatives.

Note this landed above the original ~120,000-character target — see the
final chat message for why (attribute duplication in Enhance's
progressive-enhancement element pattern) and the trade-offs involved in
tuning it further.

All initiative names, descriptions and the "afgewezen plannen" (rejected
plans) vignettes are fictional/composite placeholder content, consistent
with the rest of this demo site's existing placeholders (`cijfer
aanvullen`, `Naam initiatief`, etc.). Real Limburg municipality names are
used only as scene-setting.
