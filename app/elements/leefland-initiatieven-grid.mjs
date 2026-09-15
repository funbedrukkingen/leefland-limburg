import { generateInitiatives } from '../models/initiatieven-data.mjs'

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

const PHASES = ['Alle fases', 'Idee', 'Locatie gezocht', 'In voorbereiding', 'In ontwikkeling', 'Gerealiseerd']

const SPRITE = `<svg style="display:none" aria-hidden="true">
  <symbol id="i-coop" viewBox="0 0 48 48" fill="none"><path d="M24 5 44 20v23H4V20Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M18 43V27h12v16" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="24" cy="17" r="3.4" stroke="currentColor" stroke-width="2"/></symbol>
  <symbol id="i-renovatie" viewBox="0 0 48 48" fill="none"><rect x="7" y="14" width="34" height="27" rx="1.5" stroke="currentColor" stroke-width="2.2"/><path d="M7 22h34M16 14V7h16v7" stroke="currentColor" stroke-width="2.2"/><path d="M19 30h10v11H19z" stroke="currentColor" stroke-width="2"/></symbol>
  <symbol id="i-nieuwbouw" viewBox="0 0 48 48" fill="none"><path d="M6 24 24 8l18 16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 21v19h26V21" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M20 40v-9h8v9" stroke="currentColor" stroke-width="2"/></symbol>
</svg>`

export default function LeeflandInitiatievenGrid({ html, state }) {
  const { attrs } = state
  const count = Number(attrs.count) || 54
  const initiatives = generateInitiatives(count)

  const pills = PHASES.map((phase, i) => {
    const active = i === 0
    return active
      ? `<span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: .07em; text-transform: uppercase; background: #1F5C38; color: #fff; padding: 10px 18px; border-radius: 999px">${phase}</span>`
      : `<span style="font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: .07em; text-transform: uppercase; color: rgba(21,29,23,.72); padding: 10px 18px; border: 1px solid rgba(21,29,23,.22); border-radius: 999px; cursor: pointer; transition: border-color .18s ease, color .18s ease" style-hover="border-color: #1F5C38; color: #1F5C38">${phase}</span>`
  }).join('')

  const cards = initiatives.map(item =>
    `<leefland-card name="${escapeAttr(item.name)}" place="${escapeAttr(item.place)}" phase="${escapeAttr(item.phase)}" units="${escapeAttr(item.units)}" description="${escapeAttr(item.description)}" typology="${escapeAttr(item.typology)}"></leefland-card>`
  ).join('')

  return html`
    ${SPRITE}
    <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: clamp(28px,4vh,44px)">
      ${pills}
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 290px), 1fr)); gap: clamp(18px,2.4vw,26px)">
      ${cards}
    </div>
  `
}
