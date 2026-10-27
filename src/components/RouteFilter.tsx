import { useEffect, useState } from 'react'
import { useRoutes } from '@/hooks/useRoutes'
import { formatRouteLabel } from '@/utils/format'
import { getErrorInfo } from '@/utils/errors'
import MultiSelect, { MenuStatus, type SelectOption } from '@/components/MultiSelect'

interface RouteFilterProps {
  inputId: string
  value: SelectOption[]
  onChange: (value: SelectOption[]) => void
}

export default function RouteFilter({ inputId, value, onChange }: RouteFilterProps) {
  const [hasOpened, setHasOpened] = useState(false)
  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useRoutes(hasOpened)

  const [search, setSearch] = useState('')
  const isSearching = search.trim() !== ''

  useEffect(() => {
    if (isSearching && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      void fetchNextPage()
    }
  }, [isSearching, hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage])

  const options =
    data?.pages.flatMap((page) =>
      page.routes.map((route) => ({ value: route.id, label: formatRouteLabel(route) })),
    ) ?? []
  const errorInfo = error ? getErrorInfo(error) : null

  const handleMenuOpen = () => {
    setHasOpened(true)
    if (error && !data) void refetch()
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage()
  }

  return (
    <MultiSelect
      inputId={inputId}
      placeholder="Pilih atau ketik rute"
      isSearchable
      onInputChange={setSearch}
      options={options}
      value={value}
      onChange={onChange}
      onMenuOpen={handleMenuOpen}
      onLoadMore={handleLoadMore}
      isLoading={isFetching}
      loadingMessage="Memuat rute…"
      noOptionsMessage={errorInfo ? `${errorInfo.title}. ${errorInfo.message}` : 'Tidak ada rute'}
      menuFooter={
        <MenuStatus
          isLoadingMore={isFetchingNextPage}
          loadingText="Memuat rute…"
          errorInfo={options.length > 0 ? errorInfo : null}
        />
      }
    />
  )
}
