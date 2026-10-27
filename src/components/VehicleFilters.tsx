import { useState } from 'react'
import type { VehicleFilterParams } from '@/api/vehicles'
import type { SelectOption } from '@/components/MultiSelect'
import RouteFilter from '@/components/RouteFilter'
import TripFilter, { type TripOption } from '@/components/TripFilter'

const toKey = (ids: string[] = []) => [...ids].sort().join(',')

interface VehicleFiltersProps {
  applied: VehicleFilterParams
  onApply: (filters: VehicleFilterParams) => void
}

export default function VehicleFilters({ applied, onApply }: VehicleFiltersProps) {
  const [routes, setRoutes] = useState<SelectOption[]>([])
  const [trips, setTrips] = useState<TripOption[]>([])

  const routeIds = routes.map((route) => route.value)
  const tripIds = trips.map((trip) => trip.value)
  const isDirty =
    toKey(routeIds) !== toKey(applied.routeIds) || toKey(tripIds) !== toKey(applied.tripIds)

  const handleRoutesChange = (nextRoutes: SelectOption[]) => {
    const nextIds = new Set(nextRoutes.map((route) => route.value))
    const removedRoute = routes.some((route) => !nextIds.has(route.value))
    if (removedRoute) {
      setTrips((current) =>
        current.filter((trip) => trip.routeId !== null && nextIds.has(trip.routeId)),
      )
    }
    setRoutes(nextRoutes)
  }

  return (
    <section
      aria-label="Filter kendaraan"
      className="rounded-lg border border-slate-200 bg-white p-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="route-filter" className="mb-1 block text-sm font-medium text-slate-700">
            Rute
          </label>
          <RouteFilter inputId="route-filter" value={routes} onChange={handleRoutesChange} />
        </div>
        <div className="min-w-0 flex-1">
          <label htmlFor="trip-filter" className="mb-1 block text-sm font-medium text-slate-700">
            Trip
          </label>
          <TripFilter inputId="trip-filter" routeIds={routeIds} value={trips} onChange={setTrips} />
        </div>
        <button
          type="button"
          onClick={() => onApply({ routeIds, tripIds })}
          disabled={!isDirty}
          className="h-10 rounded-md bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Apply
        </button>
      </div>
    </section>
  )
}
