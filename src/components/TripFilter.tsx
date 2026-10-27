import { useState } from 'react'
import { useTrips } from '@/hooks/useTrips'
import { formatTripLabel } from '@/utils/format'
import { getErrorInfo } from '@/utils/errors'
import MultiSelect, { MenuStatus, type SelectOption } from '@/components/MultiSelect'

export interface TripOption extends SelectOption {
  routeId: string | null
}

interface TripFilterProps {
  inputId: string
  routeIds: string[]
  value: TripOption[]
  onChange: (value: TripOption[]) => void
}

export default function TripFilter({ inputId, routeIds, value, onChange }: TripFilterProps) {
  const routesKey = [...routeIds].sort().join(',')
  const [openedFor, setOpenedFor] = useState<string | null>(null)
  const { data, error, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useTrips(routeIds, openedFor === routesKey)

  const isDisabled = routeIds.length === 0
  const options: TripOption[] =
    data?.pages.flatMap((page) =>
      page.trips.map((trip) => ({
        value: trip.id,
        label: formatTripLabel(trip),
        routeId: trip.routeId,
      })),
    ) ?? []
  const errorInfo = error ? getErrorInfo(error) : null

  const handleMenuOpen = () => {
    setOpenedFor(routesKey)
    if (error && !data) void refetch()
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage()
  }

  return (
    <MultiSelect
      inputId={inputId}
      placeholder={isDisabled ? 'Pilih rute terlebih dahulu' : 'Pilih trip'}
      options={options}
      value={value}
      onChange={onChange}
      onMenuOpen={handleMenuOpen}
      onLoadMore={handleLoadMore}
      isLoading={isFetching}
      isDisabled={isDisabled}
      loadingMessage="Memuat trip…"
      noOptionsMessage={
        errorInfo ? `${errorInfo.title}. ${errorInfo.message}` : 'Tidak ada trip hari ini'
      }
      menuFooter={
        <MenuStatus
          isLoadingMore={isFetchingNextPage}
          loadingText="Memuat trip…"
          errorInfo={options.length > 0 ? errorInfo : null}
        />
      }
    />
  )
}
