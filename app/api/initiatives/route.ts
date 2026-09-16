import { NextResponse } from 'next/server'
import type { ApiResponse, Initiative } from '@/types/backend'

export const dynamic = 'force-static'

const MOCK_INITIATIVES: Initiative[] = [
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

/** Static export: geen request-afhankelijke filters; filtering gebeurt client-side. */
export async function GET() {
  const body: ApiResponse<Initiative[]> = { success: true, data: MOCK_INITIATIVES }
  return NextResponse.json(body)
}
