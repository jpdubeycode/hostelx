import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-rose-100 bg-rose-50/50 px-6 py-10 text-center">
      <AlertTriangle className="mb-3 h-8 w-8 text-rose-500" />
      <p className="text-sm font-medium text-rose-700">{message}</p>
      {onRetry && <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>Try again</Button>}
    </div>
  )
}
