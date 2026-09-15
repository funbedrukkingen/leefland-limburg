function navLink(href, label, key, active) {
  return active === key
    ? `<a href="${href}" style="color: #1F5C38; text-decoration: none; padding: 8px 0; border-bottom: 2px solid #9C7A2E">${label}</a>`
    : `<a href="${href}" style="color: #151D17; text-decoration: none; padding: 8px 0; border-bottom: 2px solid transparent" style-hover="color: #1F5C38; border-color: #9C7A2E">${label}</a>`
}

export default function SiteHeader({ html, state }) {
  const { attrs } = state
  const { active = '' } = attrs
  const ctaStyle = active === 'doe-mee'
    ? 'font-size: 14.5px; font-weight: 600; background: #9C7A2E; color: #151D17; text-decoration: none; padding: 13px 22px; border-radius: 8px'
    : 'font-size: 14.5px; font-weight: 600; background: #1F5C38; color: #fff; text-decoration: none; padding: 13px 22px; border-radius: 8px; transition: background .18s ease, box-shadow .18s ease'

  return html`
    <header style="position: sticky; top: 0; z-index: 40; background: rgba(255,255,255,.94); backdrop-filter: blur(10px); box-shadow: 0 1px 0 rgba(21,29,23,.1)">
      <div style="max-width: 1280px; margin: 0 auto; padding: 12px clamp(20px,5vw,56px); display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap">
        <a href="/" style="display: block; flex: 0 0 auto">
          <img src="/_public/leefland-logo-breed.jpg" alt="Leefland Limburg" style="display: block; height: clamp(48px,5.6vw,68px); width: auto">
        </a>
        <nav style="display: flex; align-items: center; gap: clamp(14px,2.2vw,30px); flex-wrap: wrap; font-size: 15px; font-weight: 500">
          ${navLink('/#aanpak', 'Onze aanpak', 'aanpak', active)}
          ${navLink('/initiatieven', 'Initiatieven', 'initiatieven', active)}
          ${navLink('/voor-gemeenten', 'Voor gemeenten', 'voor-gemeenten', active)}
          ${navLink('/over-ons', 'Over ons', 'over-ons', active)}
          <a href="/doe-mee" style="${ctaStyle}" style-hover="background: #17492c; box-shadow: 0 8px 18px rgba(31,92,56,.28)">Doe mee</a>
        </nav>
      </div>
    </header>
  `
}
