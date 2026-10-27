import type { Vehicle } from '@/types/vehicle'
import VehicleCard from '@/components/VehicleCard'
import EmptyState from '@/components/EmptyState'

interface VehicleGridProps {
  vehicles: Vehicle[]
}

export default function VehicleGrid({ vehicles }: VehicleGridProps) {
  if (vehicles.length === 0) return <EmptyState message="Tidak ada kendaraan" />

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <li key={vehicle.id}>
          <VehicleCard vehicle={vehicle} />
        </li>
      ))}
    </ul>
  )
}
