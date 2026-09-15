export default function LeeflandData({ html, state }) {
  const { attrs } = state
  const {
    value = '00',
    label = 'Label ontbreekt',
    detail = '',
    accent = '#9C7A2E'
  } = attrs

  return html`
    <div style="min-width: 0; border-top: 2px solid ${accent}; padding-top: 16px">
      <p style="font-weight: 800; font-size: clamp(1.9rem,3.4vw,2.6rem); line-height: 1; letter-spacing: -.03em; margin: 0 0 8px; color: #151D17">${value}</p>
      <p style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .09em; text-transform: uppercase; line-height: 1.5; margin: 0 0 6px; color: rgba(21,29,23,.68)">${label}</p>
      <p style="font-family: 'Spectral', Georgia, serif; font-size: .92rem; line-height: 1.5; margin: 0; color: rgba(21,29,23,.62)">${detail}</p>
    </div>
  `
}
