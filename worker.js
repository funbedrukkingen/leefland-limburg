// Experimental Cloudflare Worker adapter for this Enhance app.
//
// Enhance has no official Cloudflare adapter (only Architect/AWS Lambda is
// documented: https://enhance.dev/docs/deployment/architect). This worker
// calls the same rendering engine Architect uses under the hood
// (@enhance/ssr) directly, per request, to do genuine server-side
// rendering on Cloudflare's edge — as opposed to scripts/build-static.mjs,
// which pre-renders everything to static files at build time instead.
//
// Routing here is a small hand-written map rather than arc-plugin-enhance's
// full file-based router (which depends on Node's `fs`/Architect's request
// shape). Page fragments are bundled in via Wrangler's built-in `.html`
// text-module support, so no filesystem access is needed at request time.

import enhance from '@enhance/ssr'
import styleTransform from '@enhance/enhance-style-transform'

import Head from './app/head.mjs'

import SiteTopbar from './app/elements/site-topbar.mjs'
import SiteHeader from './app/elements/site-header.mjs'
import SiteFooter from './app/elements/site-footer.mjs'
import LeeflandCard from './app/elements/leefland-card.mjs'
import LeeflandData from './app/elements/leefland-data.mjs'
import LeeflandFaq from './app/elements/leefland-faq.mjs'
import LeeflandInitiatievenGrid from './app/elements/leefland-initiatieven-grid.mjs'
import LeeflandJsonLd from './app/elements/leefland-jsonld.mjs'

import indexPage from './app/pages/index.html'
import doeMeePage from './app/pages/doe-mee.html'
import initiatievenPage from './app/pages/initiatieven.html'
import overOnsPage from './app/pages/over-ons.html'
import voorGemeentenPage from './app/pages/voor-gemeenten.html'
import homeRedactioneelPage from './app/pages/home-redactioneel.html'

import * as indexApi from './app/api/index.mjs'
import * as doeMeeApi from './app/api/doe-mee.mjs'
import * as initiatievenApi from './app/api/initiatieven.mjs'
import * as overOnsApi from './app/api/over-ons.mjs'
import * as voorGemeentenApi from './app/api/voor-gemeenten.mjs'
import * as homeRedactioneelApi from './app/api/home-redactioneel.mjs'

const elements = {
  'site-topbar': SiteTopbar,
  'site-header': SiteHeader,
  'site-footer': SiteFooter,
  'leefland-card': LeeflandCard,
  'leefland-data': LeeflandData,
  'leefland-faq': LeeflandFaq,
  'leefland-initiatieven-grid': LeeflandInitiatievenGrid,
  'leefland-jsonld': LeeflandJsonLd
}

const routes = {
  '/': { page: indexPage, api: indexApi },
  '/doe-mee': { page: doeMeePage, api: doeMeeApi },
  '/initiatieven': { page: initiatievenPage, api: initiatievenApi },
  '/over-ons': { page: overOnsPage, api: overOnsApi },
  '/voor-gemeenten': { page: voorGemeentenPage, api: voorGemeentenApi },
  '/home-redactioneel': { page: homeRedactioneelPage, api: homeRedactioneelApi }
}

async function renderPage(route, request) {
  const store = route.api?.get ? (await route.api.get({ request })).json || {} : {}
  const headMarkup = Head({ req: { url: request.url }, status: 200, error: false, store })

  const html = enhance({
    elements,
    styleTransforms: [styleTransform],
    initialState: store
  })

  return html(['', '', ''], headMarkup, route.page)
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    let pathname = url.pathname
    if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1)

    const route = routes[pathname]
    if (!route) {
      if (env.ASSETS) return env.ASSETS.fetch(request)
      return new Response('Not found', { status: 404 })
    }

    const body = await renderPage(route, request)
    return new Response(body, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'x-enhance-render': 'worker'
      }
    })
  }
}
