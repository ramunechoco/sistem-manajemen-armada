import { useInfiniteQuery } from '@tanstack/react-query'
import { getServiceDate, getTripPage } from '@/api/trips'
import { TRIP_BATCH_SIZE } from '@/constants'

export function useTrips(routeIds: string[], enabled: boolean) {
  const sortedRouteIds = [...routeIds].sort()
  const date = getServiceDate()

  return useInfiniteQuery({
    queryKey: ['trips', sortedRouteIds, date],
    queryFn: ({ pageParam, signal }) =>
      getTripPage(
        { routeIds: sortedRouteIds, date },
        { offset: pageParam, limit: TRIP_BATCH_SIZE },
        signal,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    enabled: enabled && sortedRouteIds.length > 0,
    staleTime: Infinity,
  })
}
