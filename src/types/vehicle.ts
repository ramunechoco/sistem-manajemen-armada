import type { JsonApiResource, Relationship, ResourceIdentifier } from '@/types/api'

export type VehicleStatus = 'IN_TRANSIT_TO' | 'STOPPED_AT' | 'INCOMING_AT'

export type OccupancyStatus =
  | 'EMPTY'
  | 'MANY_SEATS_AVAILABLE'
  | 'FEW_SEATS_AVAILABLE'
  | 'STANDING_ROOM_ONLY'
  | 'CRUSHED_STANDING_ROOM_ONLY'
  | 'FULL'
  | 'NOT_ACCEPTING_PASSENGERS'
  | 'NO_DATA_AVAILABLE'
  | 'NOT_BOARDABLE'

export interface VehicleAttributes {
  label: string
  current_status: VehicleStatus
  latitude: number
  longitude: number
  bearing: number | null
  speed: number | null
  direction_id: 0 | 1 | null
  current_stop_sequence: number | null
  occupancy_status: OccupancyStatus | null
  revenue: 'REVENUE' | 'NON_REVENUE'
  updated_at: string
}

export interface VehicleRelationships {
  route: Relationship<ResourceIdentifier<'route'> | null>
  trip: Relationship<ResourceIdentifier<'trip'> | null>
  stop: Relationship<ResourceIdentifier<'stop'> | null>
}

export interface Vehicle {
  id: string
  label: string
  status: VehicleStatus
  latitude: number
  longitude: number
  updatedAt: string
  bearing: number | null
  speed: number | null
  directionId: 0 | 1 | null
  occupancyStatus: OccupancyStatus | null
  routeId: string | null
  tripId: string | null
  stopId: string | null
}

export type VehicleResource = JsonApiResource<'vehicle', VehicleAttributes, VehicleRelationships>
