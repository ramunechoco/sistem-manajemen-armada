import type { Route } from '@/types/route'
import type { Trip } from '@/types/trip'
import type { VehicleStatus } from '@/types/vehicle'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const ISO_TIMESTAMP =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:\d{2})$/

export const STATUS_LABELS: Record<VehicleStatus, string> = {
  IN_TRANSIT_TO: 'Dalam perjalanan',
  INCOMING_AT: 'Segera tiba',
  STOPPED_AT: 'Berhenti di halte',
}

export function formatStatus(status: VehicleStatus): string {
  return STATUS_LABELS[status] ?? status
}

export function formatTimestamp(timestamp: string): string {
  const match = ISO_TIMESTAMP.exec(timestamp)
  if (!match) return timestamp

  const [, year, month, day, hour, minute, second, offset] = match
  const zone = offset === 'Z' ? 'UTC' : `UTC${offset}`
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}, ${hour}:${minute}:${second} ${zone}`
}

export function formatCoordinate(value: number): string {
  return value.toFixed(5)
}

export function formatRouteLabel(route: Route): string {
  return route.shortName ? `${route.shortName} · ${route.longName}` : route.longName
}

export function formatTripLabel(trip: Trip): string {
  const route = trip.routeId ? `${trip.routeId} → ` : ''
  return `${route}${trip.headsign} (${trip.name || trip.id})`
}
