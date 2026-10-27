import { useState } from 'react'
import { useVehicles } from '@/hooks/useVehicles'
import type { VehicleFilterParams } from '@/api/vehicles'
import Loader, { Spinner } from '@/components/Loader'
import ErrorMessage from '@/components/ErrorMessage'
import VehicleGrid from '@/components/VehicleGrid'
import { DEFAULT_PAGE_SIZE, type PageSize } from '@/constants'

function App() {
  const [filters] = useState<VehicleFilterParams>({ routeIds: [], tripIds: [] })
  const [page] = useState(1)
  const [pageSize] = useState<PageSize>(DEFAULT_PAGE_SIZE)
  const { items, total, minTotal, isPending, isCountPending, isFetching, error, refresh } =
    useVehicles(filters, page, pageSize)

  const handleRefresh = () => void refresh()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold">Sistem Manajemen Armada</h1>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFetching && <Spinner className="size-4 border-2" />}
            {isFetching ? 'Refreshing page...' : 'Refresh'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <section
          aria-label="Filter kendaraan"
          className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-400"
        >
          Filter Rute &amp; Trip
        </section>

        <section aria-label="Daftar kendaraan" className="space-y-4">
          {isPending || !items ? (
            <div className="flex min-h-64 items-center justify-center rounded-lg border border-slate-200 bg-white p-4">
              {isPending ? (
                <Loader label="Memuat data kendaraan…" />
              ) : (
                <ErrorMessage error={error} onRetry={handleRefresh} />
              )}
            </div>
          ) : (
            <>
              {error && <ErrorMessage error={error} variant="inline" />}
              <p className="text-sm text-slate-600">
                {total !== null
                  ? `${total} kendaraan ditemukan`
                  : `Sedikitnya ${minTotal ?? items.length} kendaraan ditemukan`}
                {isCountPending && ' (menghitung total…)'}
                {` · ${items.length} dimuat di halaman ini`}
              </p>
              <VehicleGrid vehicles={items} />
            </>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
