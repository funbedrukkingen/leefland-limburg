const PHASE_COLORS = {
  'Idee': '#9C7A2E',
  'Locatie gezocht': '#B08A2E',
  'In voorbereiding': '#3E7A52',
  'In ontwikkeling': '#1F5C38',
  'Gerealiseerd': '#17492c'
}

export default function LeeflandCard({ html, state }) {
  const { attrs } = state
  const {
    name = 'Naam initiatief',
    place = 'Limburg',
    phase = 'Idee',
    units = 'Omvang nog open',
    description = '',
    typology = 'nieuwbouw'
  } = attrs
  const phaseColor = PHASE_COLORS[phase] || '#1F5C38'

  return html`
    <article style="background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 2px rgba(21,29,23,.07); display: flex; flex-direction: column; transition: transform .22s ease, box-shadow .22s ease" style-hover="transform: translateY(-4px); box-shadow: 0 16px 34px rgba(21,29,23,.11)">
      <div style="position: relative; aspect-ratio: 3 / 2; background-color: #DDE3D6; background-image: repeating-linear-gradient(135deg, rgba(31,92,56,.14) 0 2px, transparent 2px 11px); display: flex; align-items: flex-start; justify-content: space-between; padding: 14px">
        <span style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .07em; text-transform: uppercase; background: #1F5C38; color: #fff; padding: 6px 11px; border-radius: 6px">${place}</span>
        <span style="width: 34px; height: 34px; border-radius: 50%; background: rgba(244,246,241,.9); display: grid; place-items: center; color: #1F5C38"><svg width="18" height="18"><use href="#i-${typology}"></use></svg></span>
      </div>
      <div style="padding: clamp(16px,2vw,22px); display: flex; flex-direction: column; gap: 8px; flex: 1">
        <h3 style="font-weight: 700; font-size: 1.05rem; line-height: 1.3; margin: 0">${name}</h3>
        <p style="font-family: 'Spectral', Georgia, serif; font-size: .93rem; line-height: 1.5; color: rgba(21,29,23,.75); margin: 0">${description}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: auto; padding-top: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: .06em; text-transform: uppercase">
          <span style="color: ${phaseColor}">${phase}</span>
          <span style="color: rgba(21,29,23,.45)">${units}</span>
        </div>
      </div>
    </article>
  `
}
