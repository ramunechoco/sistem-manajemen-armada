import type { VehicleStatus } from '@/types/vehicle'
import { formatStatus } from '@/utils/format'

const STATUS_STYLES: Record<VehicleStatus, string> = {
  IN_TRANSIT_TO: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  INCOMING_AT: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  STOPPED_AT: 'bg-green-50 text-green-700 ring-green-600/20',
}

export default function StatusBadge({ status }: { status: VehicleStatus }) {
  const style = STATUS_STYLES[status] ?? 'bg-slate-50 text-slate-700 ring-slate-500/20'

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}>
      {formatStatus(status)}
    </span>
  )
}
