import { apiClient } from '@/api/client'
import type { JsonApiCollection } from '@/types/api'
import type { Vehicle, VehicleResource } from '@/types/vehicle'
import { getPageOffset } from '@/utils/jsonapi'

export interface VehicleFilterParams {
  routeIds?: string[]
  tripIds?: string[]
}

export function toVehicle(resource: VehicleResource): Vehicle {
  const a = resource.attributes
  const r = resource.relationships

  return {
    id: resource.id,
    label: a.label,
    status: a.current_status,
    latitude: a.latitude,
    longitude: a.longitude,
    updatedAt: a.updated_at,
    bearing: a.bearing,
    speed: a.speed,
    directionId: a.direction_id,
    occupancyStatus: a.occupancy_status,
    routeId: r?.route?.data?.id ?? null,
    tripId: r?.trip?.data?.id ?? null,
    stopId: r?.stop?.data?.id ?? null,
  }
}

function buildVehicleParams({ routeIds = [], tripIds = [] }: VehicleFilterParams) {
  if (tripIds.length > 0) return { 'filter[trip]': tripIds.join(',') }
  if (routeIds.length > 0) return { 'filter[route]': routeIds.join(',') }
  return {}
}

export interface VehicleBatch {
  vehicles: Vehicle[]
  total: number | null
  lastOffset: number | null
}

export async function getVehicleBatch(
  filters: VehicleFilterParams,
  { offset, limit }: { offset: number; limit: number },
  signal?: AbortSignal,
): Promise<VehicleBatch> {
  const response = await apiClient.get<JsonApiCollection<VehicleResource>>('/vehicles', {
    params: {
      ...buildVehicleParams(filters),
      sort: 'label,id',
      'page[offset]': offset,
      'page[limit]': limit,
    },
    signal,
  })

  const { data, links } = response.data
  const lastOffset = getPageOffset(links?.last)

  let total: number | null = null
  if (lastOffset === null) total = data.length
  else if (lastOffset === offset) total = offset + data.length

  return { vehicles: data.map(toVehicle), total, lastOffset }
}

export async function getVehicleCount(
  filters: VehicleFilterParams,
  signal?: AbortSignal,
): Promise<number> {
  const response = await apiClient.get<JsonApiCollection<VehicleResource>>('/vehicles', {
    params: {
      ...buildVehicleParams(filters),
      'fields[vehicle]': 'label',
      'page[limit]': 1,
    },
    signal,
  })

  const { data, links } = response.data
  const lastOffset = getPageOffset(links?.last)

  return lastOffset === null ? data.length : lastOffset + 1
}
