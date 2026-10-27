import { apiClient } from '@/api/client'
import type { JsonApiCollection } from '@/types/api'
import type { Trip, TripResource } from '@/types/trip'
import { getPageOffset } from '@/utils/jsonapi'

export function toTrip(resource: TripResource): Trip {
  return {
    id: resource.id,
    headsign: resource.attributes.headsign,
    name: resource.attributes.name,
    directionId: resource.attributes.direction_id,
    routeId: resource.relationships?.route?.data?.id ?? null,
  }
}

export function getServiceDate(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date())
}

export interface TripPage {
  trips: Trip[]
  nextOffset: number | null
}

export async function getTripPage(
  { routeIds, date }: { routeIds: string[]; date: string },
  { offset, limit }: { offset: number; limit: number },
  signal?: AbortSignal,
): Promise<TripPage> {
  const response = await apiClient.get<JsonApiCollection<TripResource>>('/trips', {
    params: {
      'filter[route]': routeIds.join(','),
      'filter[date]': date,
      sort: 'headsign,id',
      'fields[trip]': 'headsign,name,direction_id,route',
      'page[offset]': offset,
      'page[limit]': limit,
    },
    signal,
  })

  const { data, links } = response.data
  return { trips: data.map(toTrip), nextOffset: getPageOffset(links?.next) }
}
