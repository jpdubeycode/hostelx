import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Bottom sheet on mobile, centred dialog on desktop.
 * Props: open, onClose, title, size ('sm'|'md'|'lg'), footer
 */
const widths = { sm: 'sm:max-w-sm', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl' }

export default function Modal({ open, onClose, title, size = 'md', footer, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 animate-fade-in bg-slate-900/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        role="dialog" aria-modal="true" aria-label={title}
        className={cn('relative flex max-h-[90vh] w-full animate-slide-up flex-col rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl', widths[size])}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-ink-soft hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="safe-bottom flex flex-col-reverse gap-2 border-t border-surface-border px-5 py-3 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  )
}
