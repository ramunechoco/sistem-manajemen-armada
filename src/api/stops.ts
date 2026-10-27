import { apiClient } from '@/api/client'
import type { JsonApiDocument } from '@/types/api'
import type { Stop, StopResource } from '@/types/stop'

export async function getStop(id: string, signal?: AbortSignal): Promise<Stop> {
  const response = await apiClient.get<JsonApiDocument<StopResource>>(
    `/stops/${encodeURIComponent(id)}`,
    { params: { 'fields[stop]': 'name,latitude,longitude' }, signal },
  )

  const { id: stopId, attributes } = response.data.data
  return {
    id: stopId,
    name: attributes.name,
    latitude: attributes.latitude,
    longitude: attributes.longitude,
  }
}
