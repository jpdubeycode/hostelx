import { cn } from '../../utils/cn'

const fills = {
  brand: 'bg-gradient-to-r from-brand-400 to-brand-600',
  success: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
  warning: 'bg-gradient-to-r from-amber-400 to-orange-500',
  danger: 'bg-gradient-to-r from-rose-400 to-rose-600',
  info: 'bg-gradient-to-r from-sky-400 to-sky-600',
}

/** value: 0–100. Props: tone, label, showValue, height ('sm'|'md'|'lg') */
export default function ProgressBar({ value = 0, tone = 'brand', label, showValue = false, height = 'md', className }) {
  const v = Math.max(0, Math.min(100, value))
  const h = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }[height]
  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1.5 flex justify-between text-xs font-semibold text-ink-soft">
          <span>{label}</span>{showValue && <span>{Math.round(v)}%</span>}
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-inset ring-slate-900/5', h)} role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100}>
        <div className={cn('h-full rounded-full transition-all duration-700 ease-out', fills[tone])} style={{ width: `${v}%` }} />
      </div>
    </div>
  )
}
