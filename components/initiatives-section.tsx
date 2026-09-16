'use client'

import { useEffect, useMemo, useState } from 'react'
import { getInitiatives } from '@/lib/api/client'
import type { Initiative, InitiativeCategory, LimburgRegion } from '@/types/backend'

type FilterValue = InitiativeCategory | 'alle'

const CATEGORY_ORDER: InitiativeCategory[] = ['cpo', 'vve', 'burgerinitiatief']

const CATEGORY_LABELS: Record<InitiativeCategory, string> = {
  cpo: 'CPO',
  vve: 'VVE',
  burgerinitiatief: 'Burgerinitiatief',
}

const REGION_LABELS: Record<LimburgRegion, string> = {
  'noord-limburg': 'Noord-Limburg',
  'midden-limburg': 'Midden-Limburg',
  'zuid-limburg': 'Zuid-Limburg',
}

const CATEGORY_GRADIENTS: Record<InitiativeCategory, string> = {
  cpo: 'linear-gradient(160deg, var(--color-ink), var(--color-accent-nature))',
  vve: 'linear-gradient(160deg, var(--color-ink), var(--color-accent-action))',
  burgerinitiatief: 'linear-gradient(200deg, var(--color-ink), var(--color-accent-nature))',
}

/** Lokale fallback wanneer de API onbereikbaar is (statische export / offline). */
const FALLBACK_INITIATIVES: Initiative[] = [
  {
    id: '1',
    title: 'CPO De Groene Hof',
    excerpt: 'Collectief particulier opdrachtgeverschap voor een ecologisch woonhof op voormalige landbouwgrond.',
    category: 'cpo',
    region: 'zuid-limburg',
    slug: 'cpo-de-groene-hof',
    featuredImage: {
      url: '/images/initiatives/groene-hof.jpg',
      alt: 'Impressie van het woonhof CPO De Groene Hof in Maastricht',
    },
  },
  {
    id: '2',
    title: 'VVE Zonnehof',
    excerpt: 'Vereniging van eigenaars die gezamenlijk verduurzaamt en deelt in energie en beheer.',
    category: 'vve',
    region: 'zuid-limburg',
    slug: 'vve-zonnehof',
    featuredImage: {
      url: '/images/initiatives/zonnehof.jpg',
      alt: 'Zonnepanelen op de daken van VVE Zonnehof in Sittard-Geleen',
    },
  },
  {
    id: '3',
    title: 'CPO Aardse Buren',
    excerpt: 'Generatiebestendig woonerf van zelfbouwers rond een gedeelde moestuin en gemeenschapshuis.',
    category: 'cpo',
    region: 'zuid-limburg',
    slug: 'cpo-aardse-buren',
    featuredImage: {
      url: '/images/initiatives/aardse-buren.jpg',
      alt: 'Gemeenschapshuis en moestuin van CPO Aardse Buren in Heerlen',
    },
  },
  {
    id: '4',
    title: 'Burgerinitiatief Leefbaar Venlo-Noord',
    excerpt: 'Bewonersgroep die pleit voor betaalbare, klimaatbestendige woningbouw op braakliggende kavels.',
    category: 'burgerinitiatief',
    region: 'noord-limburg',
    slug: 'leefbaar-venlo-noord',
    featuredImage: {
      url: '/images/initiatives/venlo-noord.jpg',
      alt: 'Braakliggend terrein in Venlo-Noord dat wordt herontwikkeld',
    },
  },
]

function filterByCategory(items: Initiative[], category: FilterValue): Initiative[] {
  if (category === 'alle') return items
  return items.filter((item) => item.category === category)
}

function buildFilters(items: Initiative[]): { value: FilterValue; label: string }[] {
  const present = new Set(items.map((item) => item.category))
  const categoryFilters = CATEGORY_ORDER.filter((category) => present.has(category)).map((category) => ({
    value: category as FilterValue,
    label: CATEGORY_LABELS[category],
  }))

  return [{ value: 'alle', label: 'Alle' }, ...categoryFilters]
}

export function InitiativesSection() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterValue>('alle')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)

      try {
        const data = await getInitiatives()
        if (!cancelled) {
          setInitiatives(data.length > 0 ? data : FALLBACK_INITIATIVES)
        }
      } catch {
        if (!cancelled) {
          setInitiatives(FALLBACK_INITIATIVES)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  const filters = useMemo(() => buildFilters(initiatives), [initiatives])

  const visibleInitiatives = useMemo(
    () => filterByCategory(initiatives, activeFilter),
    [initiatives, activeFilter],
  )

  useEffect(() => {
    if (activeFilter !== 'alle' && !filters.some((filter) => filter.value === activeFilter)) {
      setActiveFilter('alle')
    }
  }, [activeFilter, filters])

  return (
    <section
      id="initiatieven"
      aria-labelledby="initiatieven-heading"
      className="bg-background"
      aria-busy={isLoading}
    >
      <div
        className="mx-auto max-w-7xl"
        style={{ paddingBlock: 'clamp(4rem, 9vw, 7rem)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
      >
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border-subtle pb-6">
          <div>
            <p className="eyebrow text-accent-nature">Netwerk</p>
            <h2
              id="initiatieven-heading"
              className="mt-4 text-balance font-sans text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
            >
              Initiatieven
            </h2>
          </div>

          <div role="tablist" aria-label="Filter initiatieven" className="flex flex-wrap gap-6">
            {filters.map((filter) => {
              const isActive = filter.value === activeFilter
              return (
                <button
                  key={filter.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  disabled={isLoading}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`relative pb-2 font-mono text-xs uppercase tracking-[0.16em] transition-colors disabled:opacity-50 ${
                    isActive
                      ? 'text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-accent-action'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>

        {isLoading ? (
          <InitiativesSkeleton />
        ) : (
          <ul
            className="mt-10 grid"
            style={{ gap: 'clamp(1.25rem, 2.5vw, 2rem)', gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))' }}
          >
            {visibleInitiatives.map((item) => (
              <li
                key={item.id}
                className="group border border-border-subtle bg-background-alt transition-colors motion-safe:hover:border-accent-action motion-safe:focus-within:border-accent-action"
              >
                <a href="#doe-mee" className="block outline-none">
                  <div className="relative aspect-4/3 overflow-hidden">
                    <div
                      className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-105 motion-safe:group-focus-within:scale-105"
                      style={{ background: CATEGORY_GRADIENTS[item.category] }}
                      aria-hidden="true"
                    />
                    <span className="sr-only">{item.featuredImage.alt}</span>
                  </div>
                  <div style={{ padding: 'clamp(0.875rem, 1.5vw, 1.1rem)' }}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent-nature">
                      {REGION_LABELS[item.region]} · {CATEGORY_LABELS[item.category]}
                    </p>
                    <p className="mt-1.5 font-sans text-lg font-bold text-foreground">{item.title}</p>
                    <p className="mt-1.5 font-serif text-sm leading-relaxed text-muted-foreground">
                      {item.excerpt}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && visibleInitiatives.length === 0 ? (
          <p className="mt-10 font-serif text-sm text-muted-foreground" role="status">
            Geen initiatieven gevonden voor dit filter.
          </p>
        ) : null}
      </div>
    </section>
  )
}

function InitiativesSkeleton() {
  return (
    <ul
      className="mt-10 grid"
      style={{ gap: 'clamp(1.25rem, 2.5vw, 2rem)', gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))' }}
      aria-hidden="true"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <li key={index} className="border border-border-subtle bg-background-alt">
          <div className="aspect-4/3 animate-pulse bg-border-subtle/40" />
          <div style={{ padding: 'clamp(0.875rem, 1.5vw, 1.1rem)' }} className="space-y-3">
            <div className="h-2 w-24 animate-pulse bg-border-subtle/50" />
            <div className="h-5 w-3/4 animate-pulse bg-border-subtle/60" />
            <div className="h-3 w-full animate-pulse bg-border-subtle/40" />
            <div className="h-3 w-5/6 animate-pulse bg-border-subtle/40" />
          </div>
        </li>
      ))}
    </ul>
  )
}
