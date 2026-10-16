import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm hover:shadow-glow',
  secondary: 'bg-white text-ink border border-surface-border hover:bg-surface-alt',
  soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
  ghost: 'text-ink-soft hover:bg-slate-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
}
const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

/**
 * Props: variant, size, icon (Lucide component), loading, fullWidth, as (e.g. Link)
 */
export default function Button({
  variant = 'primary', size = 'md', icon: Icon, loading = false,
  fullWidth = false, as: Tag = 'button', className, children, disabled, ...props
}) {
  const isButton = Tag === 'button'
  return (
    <Tag
      {...(isButton ? { type: props.type ?? 'button', disabled: disabled || loading } : {})}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none',
        variants[variant], sizes[size], fullWidth && 'w-full', className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon && <Icon className="h-4 w-4 shrink-0" />}
      {children}
    </Tag>
  )
}
