import type { Vehicle, VehicleStatus } from '@/types/vehicle'
import { formatCoordinate, formatStatus, formatTimestamp } from '@/utils/format'

const STATUS_STYLES: Record<VehicleStatus, string> = {
  IN_TRANSIT_TO: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  INCOMING_AT: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  STOPPED_AT: 'bg-green-50 text-green-700 ring-green-600/20',
}

interface VehicleCardProps {
  vehicle: Vehicle
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const statusStyle =
    STATUS_STYLES[vehicle.status] ?? 'bg-slate-50 text-slate-700 ring-slate-500/20'

  return (
    <article className="flex h-full flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-slate-500">Kendaraan</p>
          <h3 className="text-lg font-semibold">{vehicle.label}</h3>
        </div>
        {vehicle.routeId && (
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            Rute {vehicle.routeId}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyle}`}
        >
          {formatStatus(vehicle.status)}
        </span>
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-slate-500">Latitude</dt>
        <dd className="font-mono">{formatCoordinate(vehicle.latitude)}</dd>
        <dt className="text-slate-500">Longitude</dt>
        <dd className="font-mono">{formatCoordinate(vehicle.longitude)}</dd>
        <dt className="text-slate-500">Pembaruan terakhir</dt>
        <dd>{formatTimestamp(vehicle.updatedAt)}</dd>
      </dl>
    </article>
  )
}
