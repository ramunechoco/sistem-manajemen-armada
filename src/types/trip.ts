import type { JsonApiResource, Relationship, ResourceIdentifier } from '@/types/api'

export interface TripAttributes {
  headsign: string
  name: string
  direction_id: 0 | 1
}

export interface TripRelationships {
  route: Relationship<ResourceIdentifier<'route'> | null>
}

export type TripResource = JsonApiResource<'trip', TripAttributes, TripRelationships>

export interface Trip {
  id: string
  headsign: string
  name: string
  directionId: 0 | 1
  routeId: string | null
}
