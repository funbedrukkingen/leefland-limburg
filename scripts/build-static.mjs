// Experimental Cloudflare Pages build for this Enhance app.
//
// Enhance has no official Cloudflare adapter (only Architect/AWS Lambda is
// documented: https://enhance.dev/docs/deployment/architect). This script
// bypasses Architect entirely and instead calls the same rendering engine
// Architect uses under the hood (@enhance/ssr) directly, at build time, to
// pre-render every app/pages/*.html file to plain static HTML. That static
// output is what gets deployed to Cloudflare Pages.
//
// Consequence: this only works because the site has no per-request server
// logic. app/api/*.mjs files here only supply build-time data (e.g. page
// titles) via their `get` export. If real per-request dynamic behaviour is
// ever needed, it will not run on Cloudflare with this setup — that would
// require either deploying via Architect to AWS, or writing a genuine
// Cloudflare Worker that calls @enhance/ssr per-request (a separate,
// bigger undertaking).

import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, rmSync, existsSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join, basename } from 'path'

import enhance from '@enhance/ssr'
import styleTransform from '@enhance/enhance-style-transform'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PAGES_DIR = join(ROOT, 'app', 'pages')
const ELEMENTS_DIR = join(ROOT, 'app', 'elements')
const API_DIR = join(ROOT, 'app', 'api')
const PUBLIC_DIR = join(ROOT, 'public')
const DIST_DIR = join(ROOT, 'dist')

async function loadElements() {
  const elements = {}
  if (!existsSync(ELEMENTS_DIR)) return elements
  for (const file of readdirSync(ELEMENTS_DIR)) {
    if (!file.endsWith('.mjs')) continue
    const tag = basename(file, '.mjs')
    const mod = await import(pathToFileURL(join(ELEMENTS_DIR, file)).href)
    elements[tag] = mod.default
  }
  return elements
}

async function loadStore(pageName) {
  const apiPath = join(API_DIR, `${pageName}.mjs`)
  if (!existsSync(apiPath)) return {}
  const mod = await import(pathToFileURL(apiPath).href)
  if (typeof mod.get !== 'function') return {}
  const result = await mod.get({})
  return result?.json || {}
}

async function build() {
  rmSync(DIST_DIR, { recursive: true, force: true })
  mkdirSync(DIST_DIR, { recursive: true })

  const elements = await loadElements()
  const { default: Head } = await import(pathToFileURL(join(ROOT, 'app', 'head.mjs')).href)

  const pageFiles = readdirSync(PAGES_DIR).filter(f => f.endsWith('.html'))
  for (const file of pageFiles) {
    const pageName = basename(file, '.html')
    const raw = readFileSync(join(PAGES_DIR, file)).toString()
    const store = await loadStore(pageName)

    const html = enhance({
      elements,
      styleTransforms: [styleTransform],
      initialState: store
    })

    const headMarkup = Head({ req: {}, status: 200, error: false, store })
    const fullPage = html(['', '', ''], headMarkup, raw)

    writeFileSync(join(DIST_DIR, file), fullPage)
    console.log(`prerendered ${file}`)
  }

  if (existsSync(PUBLIC_DIR)) {
    cpSync(PUBLIC_DIR, join(DIST_DIR, '_public'), { recursive: true })
    console.log('copied public/ -> dist/_public/')
  }
}

build().catch(err => {
  console.error(err)
  process.exit(1)
})
