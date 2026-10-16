import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-2.5 py-16 text-sm text-ink-soft" role="status">
      <Loader2 className="h-5 w-5 animate-spin text-brand-600" />{label}
    </div>
  )
}
