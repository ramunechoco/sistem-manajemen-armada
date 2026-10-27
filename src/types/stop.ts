import type { JsonApiResource } from '@/types/api'

export interface StopAttributes {
  name: string
  latitude: number
  longitude: number
}

export type StopResource = JsonApiResource<'stop', StopAttributes>

export interface Stop {
  id: string
  name: string
  latitude: number
  longitude: number
}
