import { createContext, useContext, type ReactNode } from 'react'
import Select, { components, type MenuListProps } from 'react-select'
import { Spinner } from '@/components/Loader'
import type { ErrorInfo } from '@/utils/errors'

export interface SelectOption {
  value: string
  label: string
}

const MenuFooterContext = createContext<ReactNode>(null)

function MenuList<Option extends SelectOption>(props: MenuListProps<Option, true>) {
  const footer = useContext(MenuFooterContext)
  return (
    <components.MenuList {...props}>
      {props.children}
      {footer && <div className="px-3 py-2 text-sm text-slate-500">{footer}</div>}
    </components.MenuList>
  )
}

interface MenuStatusProps {
  isLoadingMore: boolean
  loadingText: string
  errorInfo: ErrorInfo | null
}

export function MenuStatus({ isLoadingMore, loadingText, errorInfo }: MenuStatusProps) {
  if (isLoadingMore) {
    return (
      <span className="flex items-center gap-2">
        <Spinner className="size-4 border-2" />
        {loadingText}
      </span>
    )
  }
  if (errorInfo) {
    return (
      <span role="alert" className="text-amber-800">
        {errorInfo.title}. Gulir ke bawah untuk mencoba lagi.
      </span>
    )
  }
  return null
}

interface MultiSelectProps<Option extends SelectOption> {
  inputId: string
  placeholder: string
  options: Option[]
  value: Option[]
  onChange: (value: Option[]) => void
  onMenuOpen?: () => void
  onLoadMore?: () => void
  isLoading?: boolean
  isDisabled?: boolean
  loadingMessage: string
  noOptionsMessage: string
  menuFooter?: ReactNode
  isSearchable?: boolean
  onInputChange?: (value: string) => void
}

export default function MultiSelect<Option extends SelectOption>({
  inputId,
  placeholder,
  options,
  value,
  onChange,
  onMenuOpen,
  onLoadMore,
  isLoading,
  isDisabled,
  loadingMessage,
  noOptionsMessage,
  menuFooter,
  isSearchable = false,
  onInputChange,
}: MultiSelectProps<Option>) {
  return (
    <MenuFooterContext.Provider value={menuFooter}>
      <Select<Option, true>
        isMulti
        isClearable
        isSearchable={isSearchable}
        onInputChange={(inputValue) => onInputChange?.(inputValue)}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        inputId={inputId}
        instanceId={inputId}
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={(selected) => onChange([...selected])}
        onMenuOpen={onMenuOpen}
        onMenuScrollToBottom={onLoadMore}
        isLoading={isLoading}
        isDisabled={isDisabled}
        loadingMessage={() => loadingMessage}
        noOptionsMessage={() => noOptionsMessage}
        components={{ MenuList }}
      />
    </MenuFooterContext.Provider>
  )
}
