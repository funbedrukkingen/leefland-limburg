#!/usr/bin/env node
/**
 * bundle-singlefile.js
 *
 * Inspecteert de Next.js static export (`out/`) en bouwt één standalone
 * `index.html` waarin CSS en JS inline staan — geschikt voor Cloudflare Pages
 * single-file hosting of edge delivery zonder aparte asset-pipeline.
 *
 * Gebruik:
 *   node scripts/bundle-singlefile.js
 *   node scripts/bundle-singlefile.js --out ./out --dest ./out/single.html
 *
 * Vereist: `next build` met `output: 'export'` zodat `out/` bestaat.
 */

const fs = require('node:fs')
const path = require('node:path')

const DEFAULT_OUT_DIR = path.resolve(process.cwd(), 'out')
const DEFAULT_ENTRY = 'index.html'
const DEFAULT_DEST = 'index.single.html'

const MIME_BY_EXT = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function parseArgs(argv) {
  const options = {
    outDir: DEFAULT_OUT_DIR,
    entry: DEFAULT_ENTRY,
    dest: null,
    inlineAssets: true,
    maxAssetBytes: 256 * 1024,
    dryRun: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--out' || arg === '-o') {
      options.outDir = path.resolve(process.cwd(), argv[++i] ?? 'out')
    } else if (arg === '--entry' || arg === '-e') {
      options.entry = argv[++i] ?? DEFAULT_ENTRY
    } else if (arg === '--dest' || arg === '-d') {
      options.dest = path.resolve(process.cwd(), argv[++i] ?? DEFAULT_DEST)
    } else if (arg === '--no-assets') {
      options.inlineAssets = false
    } else if (arg === '--max-asset-kb') {
      const kb = Number(argv[++i])
      if (Number.isFinite(kb) && kb > 0) options.maxAssetBytes = kb * 1024
    } else if (arg === '--dry-run') {
      options.dryRun = true
    } else if (arg === '--help' || arg === '-h') {
      printHelpAndExit(0)
    } else {
      fail(`Onbekend argument: ${arg}. Gebruik --help voor opties.`)
    }
  }

  if (!options.dest) {
    options.dest = path.join(options.outDir, DEFAULT_DEST)
  }

  return options
}

function printHelpAndExit(code) {
  console.log(`Usage: node scripts/bundle-singlefile.js [options]

Options:
  --out, -o <dir>       Static export directory (default: ./out)
  --entry, -e <file>    HTML entry relative to out (default: index.html)
  --dest, -d <file>     Output path (default: <out>/index.single.html)
  --no-assets           Skip inlining local images/fonts as data URIs
  --max-asset-kb <n>    Max size per asset to inline (default: 256)
  --dry-run             Inspect and report without writing
  --help, -h            Show this help
`)
  process.exit(code)
}

function fail(message) {
  console.error(`[bundle-singlefile] ERROR: ${message}`)
  process.exit(1)
}

function ensureOutDir(outDir) {
  if (!fs.existsSync(outDir)) {
    fail(
      `Map niet gevonden: ${outDir}\n` +
        `  Voer eerst \`next build\` uit met output: 'export' zodat out/ bestaat.`,
    )
  }

  const stat = fs.statSync(outDir)
  if (!stat.isDirectory()) {
    fail(`Pad is geen map: ${outDir}`)
  }
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function safeResolveWithin(rootDir, maybeRelative) {
  const cleaned = maybeRelative.split(/[?#]/)[0]
  if (!cleaned || cleaned.startsWith('data:') || cleaned.startsWith('blob:')) {
    return null
  }

  if (/^(?:https?:)?\/\//i.test(cleaned) || cleaned.startsWith('mailto:')) {
    return null
  }

  const absolute = path.resolve(rootDir, cleaned.startsWith('/') ? `.${cleaned}` : cleaned)
  const relative = path.relative(rootDir, absolute)
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null
  }

  return absolute
}

function collectLinkedAssets(html) {
  const assets = {
    stylesheets: [],
    scripts: [],
    modulePreloads: [],
  }

  const linkRe = /<link\b([^>]*)>/gi
  let match
  while ((match = linkRe.exec(html)) !== null) {
    const attrs = match[1]
    const rel = /rel\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1]?.toLowerCase() ?? ''
    const href = /href\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1]
    if (!href) continue

    if (rel.split(/\s+/).includes('stylesheet')) {
      assets.stylesheets.push({ fullTag: match[0], href })
    } else if (rel === 'modulepreload' || rel === 'preload') {
      const asAttr = /as\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1]?.toLowerCase()
      if (asAttr === 'script' || href.endsWith('.js')) {
        assets.modulePreloads.push({ fullTag: match[0], href })
      }
    }
  }

  const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
  while ((match = scriptRe.exec(html)) !== null) {
    const attrs = match[1]
    const src = /src\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1]
    if (!src) continue
    assets.scripts.push({
      fullTag: match[0],
      src,
      isModule: /\btype\s*=\s*["']module["']/i.test(attrs),
    })
  }

  return assets
}

function inlineStylesheets(html, outDir, report) {
  let result = html
  const assets = collectLinkedAssets(result)

  for (const sheet of assets.stylesheets) {
    const filePath = safeResolveWithin(outDir, sheet.href)
    if (!filePath || !fs.existsSync(filePath)) {
      report.warnings.push(`CSS niet gevonden, overgeslagen: ${sheet.href}`)
      continue
    }

    let css = readText(filePath)
    css = rewriteCssUrls(css, path.dirname(filePath), outDir, report)
    const styleTag = `<style data-bundled-from="${escapeAttr(sheet.href)}">\n${css}\n</style>`
    result = result.replace(sheet.fullTag, styleTag)
    report.inlinedCss.push(path.relative(outDir, filePath))
  }

  return result
}

function rewriteCssUrls(css, cssDir, outDir, report) {
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (full, _quote, rawUrl) => {
    const trimmed = rawUrl.trim()
    if (
      trimmed.startsWith('data:') ||
      trimmed.startsWith('#') ||
      /^(?:https?:)?\/\//i.test(trimmed)
    ) {
      return full
    }

    const absolute = path.resolve(cssDir, trimmed.split(/[?#]/)[0])
    const relative = path.relative(outDir, absolute)
    if (relative.startsWith('..') || !fs.existsSync(absolute)) {
      report.warnings.push(`CSS url() asset ontbreekt: ${trimmed}`)
      return full
    }

    // Herschrijf naar pad relatief aan out/, zodat latere asset-inlining werkt.
    const webPath = `/${relative.split(path.sep).join('/')}`
    return `url("${webPath}")`
  })
}

function inlineScripts(html, outDir, report) {
  let result = html
  const assets = collectLinkedAssets(result)

  // Verwijder modulepreload-hints die na inlining overbodig zijn.
  for (const preload of assets.modulePreloads) {
    result = result.replace(preload.fullTag, '')
    report.removedPreloads.push(preload.href)
  }

  // Opnieuw verzamelen na preload-verwijdering (indices/tags kunnen verschuiven).
  const afterPreload = collectLinkedAssets(result)

  for (const script of afterPreload.scripts) {
    const filePath = safeResolveWithin(outDir, script.src)
    if (!filePath || !fs.existsSync(filePath)) {
      report.warnings.push(`JS niet gevonden, overgeslagen: ${script.src}`)
      continue
    }

    const source = readText(filePath)
    const typeAttr = script.isModule ? ' type="module"' : ''
    const scriptTag =
      `<script${typeAttr} data-bundled-from="${escapeAttr(script.src)}">\n` +
      `${source}\n` +
      `</script>`

    result = result.replace(script.fullTag, scriptTag)
    report.inlinedJs.push(path.relative(outDir, filePath))
  }

  return result
}

function inlineLocalAssets(html, outDir, maxBytes, report) {
  return html.replace(
    /\b(src|href|poster)\s*=\s*["']([^"']+)["']/gi,
    (full, attr, value) => {
      if (
        value.startsWith('data:') ||
        value.startsWith('#') ||
        value.startsWith('mailto:') ||
        /^(?:https?:)?\/\//i.test(value)
      ) {
        return full
      }

      // Alleen media/fonts — geen HTML-navigatielinks.
      const ext = path.extname(value.split(/[?#]/)[0]).toLowerCase()
      if (!MIME_BY_EXT[ext] || ext === '.css' || ext === '.js' || ext === '.mjs') {
        return full
      }

      const filePath = safeResolveWithin(outDir, value)
      if (!filePath || !fs.existsSync(filePath)) {
        return full
      }

      const size = fs.statSync(filePath).size
      if (size > maxBytes) {
        report.skippedLargeAssets.push({
          path: path.relative(outDir, filePath),
          bytes: size,
        })
        return full
      }

      const mime = MIME_BY_EXT[ext] ?? 'application/octet-stream'
      const base64 = fs.readFileSync(filePath).toString('base64')
      const dataUri = `data:${mime};base64,${base64}`
      report.inlinedAssets.push(path.relative(outDir, filePath))
      return `${attr}="${dataUri}"`
    },
  )
}

function escapeAttr(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function inspectExport(outDir) {
  const summary = {
    htmlFiles: [],
    cssFiles: [],
    jsFiles: [],
    otherFiles: [],
  }

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === '_next' || entry.name === 'images' || !entry.name.startsWith('.')) {
          walk(full)
        }
        continue
      }

      const rel = path.relative(outDir, full)
      const ext = path.extname(entry.name).toLowerCase()
      if (ext === '.html') summary.htmlFiles.push(rel)
      else if (ext === '.css') summary.cssFiles.push(rel)
      else if (ext === '.js' || ext === '.mjs') summary.jsFiles.push(rel)
      else summary.otherFiles.push(rel)
    }
  }

  walk(outDir)
  return summary
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function main() {
  const options = parseArgs(process.argv.slice(2))
  ensureOutDir(options.outDir)

  const entryPath = path.join(options.outDir, options.entry)
  if (!fs.existsSync(entryPath)) {
    fail(`Entry HTML niet gevonden: ${entryPath}`)
  }

  const inventory = inspectExport(options.outDir)
  console.log('[bundle-singlefile] Inspectie van static export:')
  console.log(`  HTML : ${inventory.htmlFiles.length}`)
  console.log(`  CSS  : ${inventory.cssFiles.length}`)
  console.log(`  JS   : ${inventory.jsFiles.length}`)
  console.log(`  Overig: ${inventory.otherFiles.length}`)

  const report = {
    inlinedCss: [],
    inlinedJs: [],
    inlinedAssets: [],
    removedPreloads: [],
    skippedLargeAssets: [],
    warnings: [],
  }

  let html = readText(entryPath)
  html = inlineStylesheets(html, options.outDir, report)
  html = inlineScripts(html, options.outDir, report)

  if (options.inlineAssets) {
    html = inlineLocalAssets(html, options.outDir, options.maxAssetBytes, report)
  }

  // Marker zodat je in de output ziet dat dit een gebundelde single-file is.
  if (!html.includes('data-leefland-singlefile')) {
    html = html.replace(/<html\b([^>]*)>/i, '<html$1 data-leefland-singlefile="1">')
  }

  console.log('[bundle-singlefile] Voorbereiding / inline-resultaat:')
  console.log(`  CSS geïnlined     : ${report.inlinedCss.length}`)
  console.log(`  JS geïnlined      : ${report.inlinedJs.length}`)
  console.log(`  Assets geïnlined  : ${report.inlinedAssets.length}`)
  console.log(`  Preloads verwijderd: ${report.removedPreloads.length}`)

  if (report.skippedLargeAssets.length > 0) {
    console.log(`  Assets overgeslagen (te groot): ${report.skippedLargeAssets.length}`)
  }

  for (const warning of report.warnings) {
    console.warn(`  ! ${warning}`)
  }

  if (options.dryRun) {
    console.log(`[bundle-singlefile] Dry-run — geen schrijfactie (${formatBytes(Buffer.byteLength(html, 'utf8'))}).`)
    return
  }

  fs.mkdirSync(path.dirname(options.dest), { recursive: true })
  fs.writeFileSync(options.dest, html, 'utf8')

  const size = fs.statSync(options.dest).size
  console.log(`[bundle-singlefile] Geschreven: ${options.dest} (${formatBytes(size)})`)
}

main()
