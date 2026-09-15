export default function Head(state) {
  const { store = {} } = state
  const { pageTitle = 'Leefland Limburg' } = store

  return `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>${pageTitle}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Spectral:ital,wght@0,300;0,400;0,600;0,700;1,400&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
      <style>
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #F4F6F1; color: #151D17; -webkit-font-smoothing: antialiased; }
        a { color: #1F5C38; text-decoration-color: rgba(31,92,56,.35); text-underline-offset: 4px; }
        a:hover { color: #9C7A2E; text-decoration-color: #9C7A2E; }
        ::selection { background: #9C7A2E; color: #F4F6F1; }
      </style>
      <script src="/_public/interactions.js" defer></script>
    </head>
`
}
