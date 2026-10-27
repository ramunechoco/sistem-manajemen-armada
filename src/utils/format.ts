import type { Route } from '@/types/route'
import type { Trip } from '@/types/trip'
import type { OccupancyStatus, Vehicle, VehicleStatus } from '@/types/vehicle'

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
  return [route.shortName, route.longName].filter(Boolean).join(' · ') || route.id
}

const ROUTE_TYPE_LABELS: Record<Route['type'], string> = {
  0: 'Light rail',
  1: 'Kereta bawah tanah',
  2: 'Kereta komuter',
  3: 'Bus',
  4: 'Kapal feri',
}

export function formatRouteType(type: Route['type']): string {
  return ROUTE_TYPE_LABELS[type] ?? String(type)
}

const OCCUPANCY_LABELS: Record<OccupancyStatus, string> = {
  EMPTY: 'Kosong',
  MANY_SEATS_AVAILABLE: 'Banyak kursi tersedia',
  FEW_SEATS_AVAILABLE: 'Sedikit kursi tersedia',
  STANDING_ROOM_ONLY: 'Hanya tempat berdiri',
  CRUSHED_STANDING_ROOM_ONLY: 'Sangat padat',
  FULL: 'Penuh',
  NOT_ACCEPTING_PASSENGERS: 'Tidak menerima penumpang',
  NO_DATA_AVAILABLE: 'Tidak ada data',
  NOT_BOARDABLE: 'Tidak dapat dinaiki',
}

export function formatOccupancy(status: OccupancyStatus | null): string {
  return status ? (OCCUPANCY_LABELS[status] ?? status) : 'Tidak ada data'
}

export function formatRevenue(revenue: Vehicle['revenue']): string {
  return revenue === 'REVENUE' ? 'Melayani penumpang' : 'Tidak melayani penumpang'
}

export function formatTripLabel(trip: Trip): string {
  const route = trip.routeId ? `${trip.routeId} → ` : ''
  return `${route}${trip.headsign} (${trip.name || trip.id})`
}
