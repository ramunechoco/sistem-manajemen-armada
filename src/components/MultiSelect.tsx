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
        unstyled
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
        classNames={{
          control: ({ isFocused, isDisabled: disabled }) =>
            `min-h-10 rounded-md border bg-white px-2 text-sm ${
              isFocused ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-300'
            } ${disabled ? 'cursor-not-allowed bg-slate-50 opacity-60' : 'cursor-pointer'}`,
          placeholder: () => 'text-slate-400',
          valueContainer: () => 'gap-1 py-1',
          multiValue: () => 'rounded bg-slate-100 text-xs text-slate-700',
          multiValueLabel: () => 'px-2 py-0.5',
          multiValueRemove: () => 'rounded-r px-1 hover:bg-red-100 hover:text-red-700',
          indicatorsContainer: () => 'gap-1 text-slate-400',
          clearIndicator: () => 'p-1 hover:text-slate-700',
          dropdownIndicator: () => 'p-1 hover:text-slate-700',
          indicatorSeparator: () => 'my-2 w-px bg-slate-200',
          loadingIndicator: () => 'px-1',
          menu: () => 'z-20 mt-1 rounded-md border border-slate-200 bg-white shadow-lg',
          menuList: () => 'py-1',
          option: ({ isFocused, isSelected }) =>
            `cursor-pointer px-3 py-2 text-sm ${isFocused ? 'bg-slate-100' : ''} ${
              isSelected ? 'font-medium text-blue-700' : 'text-slate-700'
            }`,
          noOptionsMessage: () => 'px-3 py-2 text-sm text-slate-500',
          loadingMessage: () => 'px-3 py-2 text-sm text-slate-500',
        }}
      />
    </MenuFooterContext.Provider>
  )
}
