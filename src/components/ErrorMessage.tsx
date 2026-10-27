import { getErrorInfo } from '@/utils/errors'

interface ErrorMessageProps {
  error: unknown
  onRetry?: () => void
  variant?: 'block' | 'inline'
}

export default function ErrorMessage({ error, onRetry, variant = 'block' }: ErrorMessageProps) {
  const { title, message } = getErrorInfo(error)

  if (variant === 'inline') {
    return (
      <div
        role="alert"
        className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
      >
        <span className="font-medium">{title}.</span> {message}
      </div>
    )
  }

  return (
    <div role="alert" className="flex max-w-md flex-col items-center gap-2 text-center">
      <p className="font-semibold text-red-700">{title}</p>
      <p className="text-sm text-slate-600">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Coba lagi
        </button>
      )}
    </div>
  )
}
