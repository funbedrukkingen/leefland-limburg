export default function SiteTopbar({ html }) {
  return html`
    <div style="background: #1F5C38; color: rgba(244,246,241,.9); font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; letter-spacing: .1em; text-transform: uppercase">
      <div style="max-width: 1280px; margin: 0 auto; padding: 9px clamp(20px,5vw,56px); display: flex; flex-wrap: wrap; gap: 16px; justify-content: space-between">
        <span>Platform voor ecologisch-sociale wooninitiatieven</span>
        <span>Provincie Limburg</span>
      </div>
    </div>
  `
}
