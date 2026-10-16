import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { cn } from '../utils/cn'

const ToastContext = createContext(null)
const icons = { success: CheckCircle2, error: XCircle, info: Info }
const colors = { success: 'text-emerald-600', error: 'text-rose-600', info: 'text-brand-600' }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const push = useCallback((message, type = 'success') => {
    const id = crypto.randomUUID()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => dismiss(id), 3500)
  }, [dismiss])

  // toast.success('Saved') / toast.error('Oops') / toast.info('FYI')
  const toast = useMemo(() => ({
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error'),
    info: (m) => push(m, 'info'),
  }), [push])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 top-4 z-[60] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-4" aria-live="polite">
        {toasts.map((t) => {
          const Icon = icons[t.type]
          return (
            <div key={t.id} className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-center gap-3 rounded-xl border border-surface-border bg-white px-4 py-3 shadow-lift">
              <Icon className={cn('h-5 w-5 shrink-0', colors[t.type])} />
              <p className="flex-1 text-sm font-medium">{t.message}</p>
              <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-ink-muted hover:text-ink"><X className="h-4 w-4" /></button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
