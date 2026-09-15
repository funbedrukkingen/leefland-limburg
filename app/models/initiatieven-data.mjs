// Deterministic generator for fictional Leefland Limburg initiatives.
// Real Limburg municipality names are used as scene-setting only —
// every initiative, name and description below is invented placeholder
// content for this demo site, same spirit as its existing "Naam
// initiatief" / "cijfer aanvullen" placeholders.

const MUNICIPALITIES = [
  'Sittard-Geleen', 'Roermond', 'Gulpen-Wittem', 'Venray', 'Weert', 'Maastricht',
  'Heerlen', 'Kerkrade', 'Venlo', 'Nederweert', 'Echt-Susteren', 'Beek',
  'Stein', 'Meerssen', 'Valkenburg a/d Geul', 'Vaals', 'Simpelveld',
  'Voerendaal', 'Brunssum', 'Landgraaf', 'Peel en Maas', 'Leudal',
  'Horst aan de Maas', 'Bergen (L)', 'Gennep', 'Mook en Middelaar',
  'Beesel', 'Roerdalen', 'Eijsden-Margraten'
]

const NAME_PREFIXES = [
  'Hof van', 'Buurtschap', 'Wooncoöperatie', 'Erf', 'Tuinwijk', 'Kloosterhof',
  'Beekdal', 'Veldhof', 'Molenerf', 'Kloostertuin', 'Landgoed', 'Kwartier',
  'Domein', 'Hofstede', 'Groep'
]

const NAME_SUFFIXES = [
  'De Linde', 'Zonnedael', 'De Maasweide', 'Het Heuvelland', 'De Wilgenhof',
  'Sint-Pieter', 'Het Beekdal', 'De Kloostertuin', 'Groene Kern', 'De Watermolen',
  'De Vlierhof', 'De Korenmaat', 'Het Munnikenveld', 'De Boomgaard', 'Vrijstaat',
  'De Kalkovens', 'Het Rozenhof', 'De Meander', 'Sint-Antonius', 'De Vlashof'
]

const TYPOLOGIES = ['coop', 'renovatie', 'nieuwbouw']

const PHASES = ['Idee', 'Locatie gezocht', 'In voorbereiding', 'In ontwikkeling', 'Gerealiseerd']

const FEATURES = [
  'moestuin', 'werkplaats', 'zonnedaken', 'wasserette', 'warmtepomp', 'autovrije tuin',
  'dorpskamer', 'regenwateropvang', 'fietsenstalling', 'dakmoestuin', 'gemeenschapsruimte', 'boomgaard'
]

// Short templates — kept terse on purpose: each initiative's description
// is rendered both as a `<leefland-card description="...">` attribute and
// as visible card text, so its length effectively counts twice.
const TEMPLATES = [
  (units, feature) => `${units} woningen rond een gedeelde ${feature}.`,
  (units, feature) => `Groep van ${units} huishoudens bouwt met ${feature}.`,
  (units, feature) => `Herbestemming tot ${units} woningen met ${feature}.`,
  (units, feature) => `${units} huurwoningen, gedeelde ${feature}.`,
  (units, feature) => `Coöperatie van ${units} leden, hart is de ${feature}.`,
  (units, feature) => `Natuurinclusief, ${units} won., met ${feature}.`,
  (units, feature) => `${units} woningen in eigen beheer, met ${feature}.`,
  (units, feature) => `Kleinschalig, ${units} won., buurt-${feature}.`
]

function seededPick(list, seed) {
  return list[seed % list.length]
}

export function generateInitiatives(count = 54) {
  const initiatives = []
  for (let i = 0; i < count; i++) {
    const place = seededPick(MUNICIPALITIES, i)
    const prefix = seededPick(NAME_PREFIXES, i * 3 + 1)
    const suffix = seededPick(NAME_SUFFIXES, i * 5 + 2)
    const typology = seededPick(TYPOLOGIES, i)
    const phase = seededPick(PHASES, i * 2 + 1)
    const feature = seededPick(FEATURES, i * 7 + 3)
    const template = seededPick(TEMPLATES, i)
    const units = 6 + ((i * 3) % 34)

    initiatives.push({
      id: `initiatief-${i + 1}`,
      name: `${prefix} ${suffix}`,
      place,
      typology,
      phase,
      units: `${units} won.`,
      description: template(units, feature)
    })
  }
  return initiatives
}
