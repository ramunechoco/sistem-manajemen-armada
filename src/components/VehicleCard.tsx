import type { Vehicle } from '@/types/vehicle'
import { formatCoordinate, formatTimestamp } from '@/utils/format'
import StatusBadge from '@/components/StatusBadge'

interface VehicleCardProps {
  vehicle: Vehicle
  onSelect: (vehicle: Vehicle) => void
}

export default function VehicleCard({ vehicle, onSelect }: VehicleCardProps) {
  return (
    <article className="relative flex h-full flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-blue-600">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-slate-500">Kendaraan</p>
          <h2 className="text-lg font-semibold">{vehicle.label}</h2>
        </div>
        {vehicle.routeId && (
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            Rute {vehicle.routeId}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={vehicle.status} />
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-slate-500">Latitude</dt>
        <dd className="font-mono">{formatCoordinate(vehicle.latitude)}</dd>
        <dt className="text-slate-500">Longitude</dt>
        <dd className="font-mono">{formatCoordinate(vehicle.longitude)}</dd>
        <dt className="text-slate-500">Pembaruan terakhir</dt>
        <dd>{formatTimestamp(vehicle.updatedAt)}</dd>
      </dl>

      <button
        type="button"
        onClick={() => onSelect(vehicle)}
        aria-label={`Lihat detail kendaraan ${vehicle.label}`}
        className="absolute inset-0 cursor-pointer rounded-lg focus-visible:outline-none"
      />
    </article>
  )
}
