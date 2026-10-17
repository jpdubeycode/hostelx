import { cn } from '../../utils/cn'

export const tones = {
  neutral: 'bg-slate-100 text-slate-700',
  brand: 'bg-brand-50 text-brand-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-rose-50 text-rose-700',
  info: 'bg-sky-50 text-sky-700',
}
const dots = {
  neutral: 'bg-slate-400', brand: 'bg-brand-500', success: 'bg-emerald-500',
  warning: 'bg-amber-500', danger: 'bg-rose-500', info: 'bg-sky-500',
}

/** Props: tone, dot, icon */
export default function Badge({ tone = 'neutral', dot = false, icon: Icon, className, children }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ring-black/5', tones[tone], className)}>
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dots[tone])} />}
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  )
}
