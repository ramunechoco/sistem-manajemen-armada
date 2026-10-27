interface EmptyStateProps {
  message: string
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  )
}
