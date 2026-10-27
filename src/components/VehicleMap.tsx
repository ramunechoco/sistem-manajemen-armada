import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMap } from 'react-leaflet'

const DEFAULT_ZOOM = 16
const DEFAULT_COLOR = '2563EB'

function MapSync({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap()

  useEffect(() => {
    const frame = requestAnimationFrame(() => map.invalidateSize())
    return () => cancelAnimationFrame(frame)
  }, [map])

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom())
  }, [map, latitude, longitude])

  return null
}

interface VehicleMapProps {
  latitude: number
  longitude: number
  color?: string | null
}

export default function VehicleMap({ latitude, longitude, color }: VehicleMapProps) {
  const [hasTileError, setHasTileError] = useState(false)
  const fill = `#${color || DEFAULT_COLOR}`

  return (
    <div className="space-y-2">
      <MapContainer
        center={[latitude, longitude]}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        className="h-64 w-full rounded-lg border border-slate-200"
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
          eventHandlers={{ tileerror: () => setHasTileError(true) }}
        />
        <CircleMarker
          center={[latitude, longitude]}
          radius={9}
          pathOptions={{ color: '#0f172a', weight: 2, fillColor: fill, fillOpacity: 1 }}
        />
        <MapSync latitude={latitude} longitude={longitude} />
      </MapContainer>
      {hasTileError && (
        <p role="alert" className="text-sm text-amber-800">
          Peta tidak dapat dimuat sepenuhnya. Periksa koneksi internet Anda.
        </p>
      )}
    </div>
  )
}
