import { useRef, useState } from 'react'
import { useVehicles } from '@/hooks/useVehicles'
import { usePagination } from '@/hooks/usePagination'
import type { VehicleFilterParams } from '@/api/vehicles'
import Loader, { Spinner } from '@/components/Loader'
import ErrorMessage from '@/components/ErrorMessage'
import VehicleGrid from '@/components/VehicleGrid'
import Pagination from '@/components/Pagination'

function App() {
  const [filters] = useState<VehicleFilterParams>({ routeIds: [], tripIds: [] })
  const { page, pageSize, setPage, setPageSize, clampPage } = usePagination()
  const { items, total, totalPages, isPending, isFetching, error, refresh } = useVehicles(
    filters,
    page,
    pageSize,
  )
  const listRef = useRef<HTMLElement>(null)

  clampPage(totalPages)

  const showPagination = total !== null ? total > 0 : items !== undefined

  const handleRefresh = () => void refresh()

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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

        <section ref={listRef} aria-label="Daftar kendaraan" className="scroll-mt-6 space-y-4">
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
              <VehicleGrid vehicles={items} />
            </>
          )}
          {showPagination && (
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              totalPages={totalPages}
              itemCount={items?.length ?? 0}
              onPageChange={handlePageChange}
              onPageSizeChange={setPageSize}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
