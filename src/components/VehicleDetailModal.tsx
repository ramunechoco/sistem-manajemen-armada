import { Suspense, lazy, useEffect, useRef, type ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import type { Vehicle } from '@/types/vehicle'
import type { RouteDetail } from '@/types/route'
import { useVehicleDetails } from '@/hooks/useVehicleDetails'
import {
  formatCoordinate,
  formatOccupancy,
  formatRevenue,
  formatRouteLabel,
  formatRouteType,
  formatTimestamp,
} from '@/utils/format'
import StatusBadge from '@/components/StatusBadge'
import ErrorMessage from '@/components/ErrorMessage'
import ErrorBoundary from '@/components/ErrorBoundary'
import Loader, { Spinner } from '@/components/Loader'

const VehicleMap = lazy(() => import('@/components/VehicleMap'))

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold tracking-wide text-slate-500 uppercase">{title}</h3>
      {children}
    </section>
  )
}

function Fields({ children }: { children: ReactNode }) {
  return (
    <dl className="grid grid-cols-[minmax(0,10rem)_1fr] gap-x-4 gap-y-2 text-sm">{children}</dl>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-slate-500">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </>
  )
}

interface QueryContentProps<T> {
  query: UseQueryResult<T>
  loadingText: string
  children: (data: T) => ReactNode
}

function QueryContent<T>({ query, loadingText, children }: QueryContentProps<T>) {
  if (query.isPending) {
    return (
      <p role="status" className="flex items-center gap-2 text-sm text-slate-500">
        <Spinner className="size-4 border-2" />
        {loadingText}
      </p>
    )
  }
  if (query.isError) {
    if (isAxiosError(query.error) && query.error.response?.status === 404) return unavailable
    return <ErrorMessage error={query.error} onRetry={() => void query.refetch()} />
  }
  return <>{children(query.data)}</>
}

function formatDirection(route: RouteDetail | undefined, directionId: 0 | 1): string {
  const name = route?.directionNames[directionId]
  const destination = route?.directionDestinations[directionId]
  if (name && destination) return `${name} → ${destination}`
  return name ?? destination ?? `Arah ${directionId}`
}

const unavailable = <p className="text-sm text-slate-500">Tidak tersedia</p>

interface VehicleDetailModalProps {
  vehicle: Vehicle
  onClose: () => void
}

export default function VehicleDetailModal({ vehicle, onClose }: VehicleDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { route, trip, stop } = useVehicleDetails(vehicle)
  const pressedBackdrop = useRef(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  const closeDialog = () => dialogRef.current?.close()

  let stopName = '—'
  if (vehicle.stopId !== null) {
    if (stop.isPending) stopName = 'Memuat…'
    else if (stop.isError) stopName = 'Tidak tersedia'
    else stopName = stop.data.name
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onPointerDown={(e) => {
        pressedBackdrop.current = e.target === e.currentTarget
      }}
      onClick={(e) => {
        if (pressedBackdrop.current && e.target === e.currentTarget) closeDialog()
      }}
      aria-labelledby="vehicle-detail-title"
      className="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-xl bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-900/50"
    >
      <div className="flex max-h-[85vh] flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <p className="text-xs text-slate-500">Detail kendaraan</p>
            <h2 id="vehicle-detail-title" className="text-xl font-semibold">
              {vehicle.label}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Tutup"
            className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            ✕
          </button>
        </header>

        <div className="space-y-6 overflow-y-auto p-5">
          <Section title="Kendaraan">
            <Fields>
              <Field label="Status">
                <StatusBadge status={vehicle.status} />
              </Field>
              <Field
                label={vehicle.status === 'STOPPED_AT' ? 'Halte saat ini' : 'Halte berikutnya'}
              >
                {stopName}
              </Field>
              <Field label="Latitude">
                <span className="font-mono">{formatCoordinate(vehicle.latitude)}</span>
              </Field>
              <Field label="Longitude">
                <span className="font-mono">{formatCoordinate(vehicle.longitude)}</span>
              </Field>
              <Field label="Pembaruan terakhir">{formatTimestamp(vehicle.updatedAt)}</Field>
              <Field label="Okupansi">{formatOccupancy(vehicle.occupancyStatus)}</Field>
              <Field label="Layanan">{formatRevenue(vehicle.revenue)}</Field>
            </Fields>
          </Section>

          <Section title="Lokasi">
            <ErrorBoundary
              fallback={
                <p role="alert" className="text-sm text-amber-800">
                  Peta tidak dapat dimuat. Periksa koneksi internet Anda, lalu muat ulang halaman di
                  browser.
                </p>
              }
            >
              <Suspense
                fallback={
                  <div className="flex h-64 items-center justify-center rounded-lg border border-slate-200">
                    <Loader label="Memuat peta…" />
                  </div>
                }
              >
                <VehicleMap
                  latitude={vehicle.latitude}
                  longitude={vehicle.longitude}
                  color={route.data?.color}
                />
              </Suspense>
            </ErrorBoundary>
          </Section>

          <Section title="Rute">
            {vehicle.routeId === null ? (
              unavailable
            ) : (
              <QueryContent query={route} loadingText="Memuat data rute…">
                {(data) => (
                  <Fields>
                    <Field label="ID rute">{data.id}</Field>
                    <Field label="Nama">
                      <span className="inline-flex items-center gap-2">
                        {data.color && (
                          <span
                            aria-hidden="true"
                            className="size-3 shrink-0 rounded-full ring-1 ring-slate-900/10"
                            style={{ backgroundColor: `#${data.color}` }}
                          />
                        )}
                        {formatRouteLabel(data)}
                      </span>
                    </Field>
                    <Field label="Jenis">{formatRouteType(data.type)}</Field>
                    {data.description && <Field label="Keterangan">{data.description}</Field>}
                  </Fields>
                )}
              </QueryContent>
            )}
          </Section>

          <Section title="Trip">
            {vehicle.tripId === null ? (
              unavailable
            ) : (
              <QueryContent query={trip} loadingText="Memuat data trip…">
                {(data) => (
                  <Fields>
                    <Field label="ID trip">{data.id}</Field>
                    <Field label="Tujuan">{data.headsign || '—'}</Field>
                    {data.name && <Field label="Nomor trip">{data.name}</Field>}
                    <Field label="Arah">{formatDirection(route.data, data.directionId)}</Field>
                  </Fields>
                )}
              </QueryContent>
            )}
          </Section>
        </div>
      </div>
    </dialog>
  )
}
