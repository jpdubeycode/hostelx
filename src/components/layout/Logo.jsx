import { cn } from '../../utils/cn'

/** Brand mark. `compact` shows only the square "X". */
export default function Logo({ compact = false, className }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-lg font-extrabold text-white shadow-glow">X</span>
      {!compact && <span className="text-xl font-extrabold tracking-tight">Hostel<span className="text-brand-600">X</span></span>}
    </div>
  )
}
