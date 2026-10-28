export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api-v3.mbta.com'
export const API_KEY = import.meta.env.VITE_API_KEY || undefined

export const PAGE_SIZE_OPTIONS = [6, 12, 24] as const
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]
export const DEFAULT_PAGE_SIZE: PageSize = 12

export const VEHICLE_BATCH_SIZE = 120

if (import.meta.env.DEV && PAGE_SIZE_OPTIONS.some((size) => VEHICLE_BATCH_SIZE % size !== 0)) {
  throw new Error('VEHICLE_BATCH_SIZE must be a multiple of every PAGE_SIZE_OPTIONS value')
}

// Number of routes/trips fetched per lazy loading in the filter dropdowns
export const DROPDOWN_BATCH_SIZE = 20
export const TRIP_BATCH_SIZE = 100
