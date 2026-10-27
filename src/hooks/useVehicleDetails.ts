import { useQuery } from '@tanstack/react-query'
import { getRoute } from '@/api/routes'
import { getTrip } from '@/api/trips'
import { getStop } from '@/api/stops'
import type { Vehicle } from '@/types/vehicle'

export function useVehicleDetails({ routeId, tripId, stopId }: Vehicle) {
  const route = useQuery({
    queryKey: ['route', routeId],
    queryFn: ({ signal }) => getRoute(routeId!, signal),
    enabled: routeId !== null,
    staleTime: Infinity,
  })

  const trip = useQuery({
    queryKey: ['trip', tripId],
    queryFn: ({ signal }) => getTrip(tripId!, signal),
    enabled: tripId !== null,
    staleTime: Infinity,
  })

  const stop = useQuery({
    queryKey: ['stop', stopId],
    queryFn: ({ signal }) => getStop(stopId!, signal),
    enabled: stopId !== null,
    staleTime: Infinity,
  })

  return { route, trip, stop }
}
