export default function SiteFooter({ html, state }) {
  const { attrs } = state
  const { bg = '#151D17' } = attrs

  return html`
    <footer style="background: ${bg}; color: #F4F6F1">
      <div style="max-width: 1280px; margin: 0 auto; padding: clamp(36px,5vh,64px) clamp(20px,5vw,56px) clamp(28px,4vh,40px); display: flex; flex-wrap: wrap; gap: 22px; align-items: center; justify-content: space-between; font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; letter-spacing: .08em; text-transform: uppercase; color: rgba(244,246,241,.6)">
        <img src="/_public/leefland-zegel.jpg" alt="Leefland Limburg" style="height: 64px; width: auto; mix-blend-mode: lighten; opacity: .95">
        <nav style="display: flex; flex-wrap: wrap; gap: 20px">
          <a href="/#aanpak" style="color: rgba(244,246,241,.6); text-decoration: none" style-hover="color: #9C7A2E">Onze aanpak</a>
          <a href="/initiatieven" style="color: rgba(244,246,241,.6); text-decoration: none" style-hover="color: #9C7A2E">Initiatieven</a>
          <a href="/voor-gemeenten" style="color: rgba(244,246,241,.6); text-decoration: none" style-hover="color: #9C7A2E">Voor gemeenten</a>
          <a href="/over-ons" style="color: rgba(244,246,241,.6); text-decoration: none" style-hover="color: #9C7A2E">Over ons</a>
          <a href="/doe-mee" style="color: rgba(244,246,241,.6); text-decoration: none" style-hover="color: #9C7A2E">Doe mee</a>
        </nav>
        <span>Samen bouwen aan een leefbare toekomst</span>
      </div>
    </footer>
  `
}
