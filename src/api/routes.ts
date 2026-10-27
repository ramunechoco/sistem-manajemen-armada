import { apiClient } from '@/api/client'
import type { JsonApiCollection } from '@/types/api'
import type { Route, RouteResource } from '@/types/route'
import { getPageOffset } from '@/utils/jsonapi'

export function toRoute(resource: RouteResource): Route {
  return {
    id: resource.id,
    shortName: resource.attributes.short_name,
    longName: resource.attributes.long_name,
    type: resource.attributes.type,
  }
}

export interface RoutePage {
  routes: Route[]
  nextOffset: number | null
}

export async function getRoutePage(
  { offset, limit }: { offset: number; limit: number },
  signal?: AbortSignal,
): Promise<RoutePage> {
  const response = await apiClient.get<JsonApiCollection<RouteResource>>('/routes', {
    params: {
      sort: 'sort_order',
      'fields[route]': 'short_name,long_name,type',
      'page[offset]': offset,
      'page[limit]': limit,
    },
    signal,
  })

  const { data, links } = response.data
  return { routes: data.map(toRoute), nextOffset: getPageOffset(links?.next) }
}
