import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getVehicleBatch, getVehicleCount, type VehicleFilterParams } from '@/api/vehicles'
import { VEHICLE_BATCH_SIZE } from '@/constants'

function normalizeFilters({ routeIds = [], tripIds = [] }: VehicleFilterParams) {
  return {
    routeIds: [...routeIds].sort(),
    tripIds: [...tripIds].sort(),
  }
}

export function useVehicles(filters: VehicleFilterParams, page: number, pageSize: number) {
  const queryClient = useQueryClient()
  const normalizedFilters = normalizeFilters(filters)
  const baseKey = ['vehicles', normalizedFilters] as const

  const firstItem = (page - 1) * pageSize
  const batchIndex = Math.floor(firstItem / VEHICLE_BATCH_SIZE)
  const sliceStart = firstItem % VEHICLE_BATCH_SIZE

  const batchQuery = useQuery({
    queryKey: [...baseKey, 'batch', batchIndex],
    queryFn: ({ signal }) =>
      getVehicleBatch(
        normalizedFilters,
        { offset: batchIndex * VEHICLE_BATCH_SIZE, limit: VEHICLE_BATCH_SIZE },
        signal,
      ),
  })

  const batch = batchQuery.data
  const needsCount = batch !== undefined && batch.total === null

  const countQuery = useQuery({
    queryKey: [...baseKey, 'count'],
    queryFn: ({ signal }) => getVehicleCount(normalizedFilters, signal),
    enabled: needsCount,
  })

  const total = batch?.total ?? countQuery.data ?? null

  return {
    items: batch?.vehicles.slice(sliceStart, sliceStart + pageSize),
    total,
    totalPages: total === null ? null : Math.max(1, Math.ceil(total / pageSize)),
    isPending: batchQuery.isPending,
    isFetching: batchQuery.isFetching || countQuery.isFetching,
    error: batchQuery.error ?? countQuery.error,
    refresh: () => queryClient.invalidateQueries({ queryKey: baseKey }),
  }
}
