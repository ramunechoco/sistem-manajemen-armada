import { useInfiniteQuery } from '@tanstack/react-query'
import { getRoutePage } from '@/api/routes'
import { DROPDOWN_BATCH_SIZE } from '@/constants'

export function useRoutes(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ['routes'],
    queryFn: ({ pageParam, signal }) =>
      getRoutePage({ offset: pageParam, limit: DROPDOWN_BATCH_SIZE }, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    enabled,
    staleTime: Infinity,
  })
}
