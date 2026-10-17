import { cn } from '../../utils/cn'

/** Brand mark. `compact` shows only the "X". `tone="dark"` is for the dark sidebar. */
export default function Logo({ compact = false, tone = 'light', className }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 text-lg font-extrabold text-white shadow-glow ring-1 ring-white/20">X</span>
      {!compact && (
        <span className={cn('text-xl font-extrabold tracking-tight', tone === 'dark' ? 'text-white' : 'text-ink')}>
          Hostel<span className={tone === 'dark' ? 'text-brand-300' : 'text-brand-600'}>X</span>
        </span>
      )}
    </div>
  )
}
