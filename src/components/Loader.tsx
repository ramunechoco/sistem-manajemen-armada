interface SpinnerProps {
  className?: string
}

export function Spinner({ className = 'size-8 border-4' }: SpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-slate-200 border-t-blue-600 ${className}`}
    />
  )
}

interface LoaderProps {
  label?: string
}

export default function Loader({ label = 'Memuat…' }: LoaderProps) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 text-sm text-slate-500">
      <Spinner />
      <span>{label}</span>
    </div>
  )
}
