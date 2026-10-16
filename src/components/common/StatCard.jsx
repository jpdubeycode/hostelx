import { cn } from '../../utils/cn'
import Card from './Card'

const tints = {
  brand: 'bg-brand-50 text-brand-600', success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600', danger: 'bg-rose-50 text-rose-600', info: 'bg-sky-50 text-sky-600',
}

/** Props: label, value, icon, tone, hint */
export default function StatCard({ label, value, icon: Icon, tone = 'brand', hint }) {
  return (
    <Card hover className="flex items-center gap-4">
      {Icon && (
        <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', tints[tone])}>
          <Icon className="h-6 w-6" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-2xl font-bold leading-none text-ink">{value}</p>
        <p className="mt-1.5 truncate text-sm text-ink-soft">{label}</p>
        {hint && <p className="mt-0.5 truncate text-xs text-ink-muted">{hint}</p>}
      </div>
    </Card>
  )
}
