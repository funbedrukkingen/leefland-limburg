import type { ApiResponse, Initiative, InitiativeCategory, LimburgRegion, ZienswijzeSubmission } from '@/types/backend'

// Empty by default: GET /api/initiatives resolves against the static Route Handler export.
// Point NEXT_PUBLIC_API_BASE_URL at the Cloudflare Worker once the VPS backend is live.
const API_BASE_URL = 'https://api-leef-land.4one.group'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const POSTAL_CODE_PATTERN = /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/

const CATEGORIES: InitiativeCategory[] = ['cpo', 'vve', 'burgerinitiatief']
const REGIONS: LimburgRegion[] = ['noord-limburg', 'midden-limburg', 'zuid-limburg']

export class ApiClientError extends Error {
  readonly status: number
  readonly fields?: Partial<Record<string, string>>

  constructor(message: string, status: number, fields?: Partial<Record<string, string>>) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.fields = fields
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: rest.cache ?? 'no-store',
    })
  } catch {
    throw new ApiClientError('Kan geen verbinding maken met de server.', 0)
  }

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null

  if (!response.ok || !payload || payload.success === false) {
    const message = payload && payload.success === false ? payload.error.message : `Onverwachte fout (${response.status})`
    const fields = payload && payload.success === false ? payload.error.fields : undefined
    throw new ApiClientError(message, response.status, fields)
  }

  return payload.data
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
}

function filterInitiatives(
  items: Initiative[],
  params?: { category?: string; region?: string },
): Initiative[] {
  const { category, region } = params ?? {}

  if (category && !CATEGORIES.includes(category as InitiativeCategory)) {
    throw new ApiClientError(`Onbekende categorie: ${category}`, 400)
  }

  if (region && !REGIONS.includes(region as LimburgRegion)) {
    throw new ApiClientError(`Onbekende regio: ${region}`, 400)
  }

  return items.filter(
    (item) => (!category || item.category === category) && (!region || item.region === region),
  )
}

export async function getInitiatives(params?: { category?: string; region?: string }): Promise<Initiative[]> {
  // Static export serves a single JSON payload; category/region filters apply client-side.
  const data = await apiClient.get<Initiative[]>('/api/initiatives')
  return filterInitiatives(data, params)
}

function validateZienswijze(
  payload: ZienswijzeSubmission,
): Partial<Record<keyof ZienswijzeSubmission, string>> {
  const fields: Partial<Record<keyof ZienswijzeSubmission, string>> = {}

  if (typeof payload.name !== 'string' || payload.name.trim().length < 2) {
    fields.name = 'Vul een geldige naam in.'
  }

  if (typeof payload.email !== 'string' || !EMAIL_PATTERN.test(payload.email)) {
    fields.email = 'Vul een geldig e-mailadres in.'
  }

  if (typeof payload.postalCode !== 'string' || !POSTAL_CODE_PATTERN.test(payload.postalCode.trim())) {
    fields.postalCode = 'Vul een geldige postcode in, bijvoorbeeld 6211 AB.'
  }

  if (typeof payload.newsletterConsent !== 'boolean') {
    fields.newsletterConsent = 'Geef aan of je de nieuwsbrief wilt ontvangen.'
  }

  return fields
}

/**
 * Zienswijze-inschrijving.
 * - Met NEXT_PUBLIC_API_BASE_URL: POST naar de remote Worker/API.
 * - Zonder (static export / Cloudflare Pages HTML): typesafe client-side mock,
 *   omdat POST Route Handlers niet compatible zijn met `output: 'export'`.
 */
export async function submitZienswijze(payload: ZienswijzeSubmission): Promise<{ id: string }> {
  const fields = validateZienswijze(payload)

  if (Object.keys(fields).length > 0) {
    throw new ApiClientError('Controleer de ingevulde gegevens.', 422, fields)
  }

  if (API_BASE_URL) {
    return apiClient.post<{ id: string }>('/api/subscribe', {
      name: payload.name.trim(),
      email: payload.email.trim(),
      postalCode: payload.postalCode.trim(),
      newsletterConsent: payload.newsletterConsent,
    })
  }

  // Client-side mock for static hosting — replace with Worker endpoint later.
  await Promise.resolve()
  return { id: crypto.randomUUID() }
}
