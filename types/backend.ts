export type InitiativeCategory = 'cpo' | 'vve' | 'burgerinitiatief'

export type LimburgRegion = 'noord-limburg' | 'midden-limburg' | 'zuid-limburg'

export interface InitiativeImage {
  url: string
  alt: string
  width?: number
  height?: number
}

export interface Initiative {
  id: string
  title: string
  excerpt: string
  category: InitiativeCategory
  region: LimburgRegion
  slug: string
  featuredImage: InitiativeImage
}

export interface ZienswijzeSubmission {
  name: string
  email: string
  postalCode: string
  newsletterConsent: boolean
}

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: {
    message: string
    fields?: Partial<Record<string, string>>
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
