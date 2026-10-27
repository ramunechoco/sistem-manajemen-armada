export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-v3.mbta.com'
export const API_KEY = import.meta.env.VITE_API_KEY || undefined

export const PAGE_SIZE_OPTIONS = [6, 12, 24] as const
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]
export const DEFAULT_PAGE_SIZE: PageSize = 12

// Number of routes/trips fetched per lazy loading in the filter dropdowns
export const DROPDOWN_BATCH_SIZE = 20
