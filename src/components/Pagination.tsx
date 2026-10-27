import { PAGE_SIZE_OPTIONS, type PageSize } from '@/constants'

type PageItem = number | 'gap'

function getPageItems(current: number, totalPages: number): PageItem[] {
  const pages = [...new Set([1, current - 1, current, current + 1, totalPages])]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b)

  const items: PageItem[] = []
  pages.forEach((p, i) => {
    const prev = pages[i - 1]
    if (prev !== undefined && p - prev === 2) items.push(prev + 1)
    else if (prev !== undefined && p - prev > 2) items.push('gap')
    items.push(p)
  })
  return items
}

const formatNumber = (value: number) => value.toLocaleString('id-ID')

const buttonBase =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'

interface PaginationProps {
  page: number
  pageSize: PageSize
  total: number | null
  totalPages: number | null
  itemCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: PageSize) => void
}

export default function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  itemCount,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const start = (page - 1) * pageSize + 1
  const end = total !== null ? Math.min(page * pageSize, total) : start + itemCount - 1
  const range = end >= start ? `${formatNumber(start)}–${formatNumber(end)}` : '0'
  const items = totalPages === null ? [page] : getPageItems(page, totalPages)
  const hasNext = totalPages !== null ? page < totalPages : itemCount === pageSize

  return (
    <nav
      aria-label="Navigasi halaman"
      className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="text-sm text-slate-600">
        <p>
          Menampilkan {range} dari {total === null ? '…' : formatNumber(total)} Data
        </p>
        <p className="text-slate-500">
          Halaman {formatNumber(page)} dari {totalPages === null ? '…' : formatNumber(totalPages)}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Data per halaman
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value) as PageSize)}
            className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <ul className="flex flex-wrap items-center gap-1">
          <li>
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Halaman sebelumnya"
              className={`${buttonBase} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              ‹
            </button>
          </li>
          {items.map((item, i) =>
            item === 'gap' ? (
              <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-slate-400">
                …
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => onPageChange(item)}
                  aria-current={item === page ? 'page' : undefined}
                  className={`${buttonBase} ${
                    item === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {formatNumber(item)}
                </button>
              </li>
            ),
          )}
          <li>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={!hasNext}
              aria-label="Halaman berikutnya"
              className={`${buttonBase} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              ›
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
