import { cn } from '../../utils/cn'
import Card from './Card'

const tiles = {
  brand: 'from-brand-400 to-brand-600 shadow-brand-600/30',
  success: 'from-emerald-400 to-emerald-600 shadow-emerald-600/30',
  warning: 'from-amber-400 to-orange-500 shadow-orange-500/30',
  danger: 'from-rose-400 to-rose-600 shadow-rose-600/30',
  info: 'from-sky-400 to-sky-600 shadow-sky-600/30',
}
const blobs = { brand: 'bg-brand-400', success: 'bg-emerald-400', warning: 'bg-amber-400', danger: 'bg-rose-400', info: 'bg-sky-400' }

/** Props: label, value, icon, tone, hint */
export default function StatCard({ label, value, icon: Icon, tone = 'brand', hint }) {
  return (
    <Card hover className="relative flex items-center gap-4 overflow-hidden">
      <div className={cn('pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl', blobs[tone])} />
      {Icon && (
        <div className={cn('relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg', tiles[tone])}>
          <Icon className="h-6 w-6" />
        </div>
      )}
      <div className="relative min-w-0">
        <p className="text-3xl font-extrabold leading-none tracking-tight text-ink">{value}</p>
        <p className="mt-1.5 truncate text-sm font-medium text-ink-soft">{label}</p>
        {hint && <p className="mt-0.5 truncate text-xs text-ink-muted">{hint}</p>}
      </div>
    </Card>
  )
}
