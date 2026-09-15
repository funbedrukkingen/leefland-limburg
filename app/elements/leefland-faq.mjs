export default function LeeflandFaq({ html, state }) {
  const { attrs } = state
  const { question = 'Vraag ontbreekt', category = 'Algemeen' } = attrs

  return html`
    <details style="border-top: 1px solid rgba(21,29,23,.14); padding: 18px 0">
      <summary style="cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 16px; font-weight: 700; font-size: 1.04rem; line-height: 1.35; color: #151D17">
        <span>
          <span style="display: block; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; color: #9C7A2E; margin-bottom: 4px">${category}</span>
          ${question}
        </span>
        <span aria-hidden="true" style="flex: 0 0 auto; width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid rgba(21,29,23,.3); display: grid; place-items: center; font-size: 14px">+</span>
      </summary>
      <div style="font-family: 'Spectral', Georgia, serif; font-size: 1rem; line-height: 1.62; color: rgba(21,29,23,.82); padding: 12px 0 0; max-width: 62ch">
        <slot></slot>
      </div>
    </details>
  `
}
