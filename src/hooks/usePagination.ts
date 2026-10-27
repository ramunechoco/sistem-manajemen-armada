import { useState } from 'react'
import { DEFAULT_PAGE_SIZE, type PageSize } from '@/constants'

export function usePagination() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSizeState] = useState<PageSize>(DEFAULT_PAGE_SIZE)

  const setPageSize = (size: PageSize) => {
    setPageSizeState(size)
    setPage(1)
  }

  const clampPage = (totalPages: number | null) => {
    if (totalPages !== null && page > totalPages) setPage(totalPages)
  }

  return { page, pageSize, setPage, setPageSize, clampPage }
}
