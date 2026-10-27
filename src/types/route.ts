import type { JsonApiResource } from '@/types/api'

export type RouteType = 0 | 1 | 2 | 3 | 4

export interface RouteAttributes {
  short_name: string
  long_name: string
  type: RouteType
}

export type RouteResource = JsonApiResource<'route', RouteAttributes>

export interface Route {
  id: string
  shortName: string
  longName: string
  type: RouteType
}
