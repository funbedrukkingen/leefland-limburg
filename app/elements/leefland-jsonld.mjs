import { generateInitiatives } from '../models/initiatieven-data.mjs'

export default function LeeflandJsonLd({ html, state }) {
  const { attrs } = state
  const count = Number(attrs.count) || 54
  const initiatives = generateInitiatives(count)

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.leeflandlimburg.nl/#organization',
        name: 'Leefland Limburg',
        url: 'https://www.leeflandlimburg.nl/',
        description: 'Platform voor ecologisch-sociale wooninitiatieven in de provincie Limburg.',
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Provincie Limburg, Nederland'
        },
        email: 'info@leeflandlimburg.nl'
      },
      {
        '@type': 'ItemList',
        '@id': 'https://www.leeflandlimburg.nl/#initiatieven',
        name: 'Wooninitiatieven in Limburg',
        numberOfItems: initiatives.length,
        itemListElement: initiatives.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Place',
            name: item.name,
            description: item.description,
            address: {
              '@type': 'PostalAddress',
              addressLocality: item.place,
              addressRegion: 'Limburg',
              addressCountry: 'NL'
            },
            additionalProperty: [
              { '@type': 'PropertyValue', name: 'fase', value: item.phase },
              { '@type': 'PropertyValue', name: 'typologie', value: item.typology }
            ]
          }
        }))
      }
    ]
  }

  const json = JSON.stringify(data).replace(/</g, '\\u003c')

  return html`<script type="application/ld+json">${json}</script>`
}
