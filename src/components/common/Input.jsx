import { useId } from 'react'
import { cn } from '../../utils/cn'

export const fieldBase =
  'w-full rounded-xl border bg-white px-3.5 text-sm text-ink placeholder:text-ink-muted transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20'

/** Props: label, error, hint, icon, multiline (renders a textarea) */
export default function Input({ label, error, hint, icon: Icon, multiline = false, className, ...props }) {
  const id = useId()
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-ink-muted" />}
        <Tag
          id={id}
          aria-invalid={!!error}
          className={cn(fieldBase, multiline ? 'min-h-[110px] py-2.5' : 'h-10', Icon && 'pl-10', error ? 'border-rose-400' : 'border-surface-border')}
          {...props}
        />
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  )
}
