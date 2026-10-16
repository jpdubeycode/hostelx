import { cn } from '../../utils/cn'

const fills = {
  brand: 'bg-brand-500', success: 'bg-emerald-500', warning: 'bg-amber-500',
  danger: 'bg-rose-500', info: 'bg-sky-500',
}

/** value: 0–100. Props: tone, label, showValue, height ('sm'|'md'|'lg') */
export default function ProgressBar({ value = 0, tone = 'brand', label, showValue = false, height = 'md', className }) {
  const v = Math.max(0, Math.min(100, value))
  const h = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }[height]
  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1.5 flex justify-between text-xs font-medium text-ink-soft">
          <span>{label}</span>{showValue && <span>{Math.round(v)}%</span>}
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-slate-100', h)} role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100}>
        <div className={cn('h-full rounded-full transition-all duration-700 ease-out', fills[tone])} style={{ width: `${v}%` }} />
      </div>
    </div>
  )
}
