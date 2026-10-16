import { cn } from '../../utils/cn'

/** Props: hover (lift on hover), padded (default true), as */
export default function Card({ as: Tag = 'div', hover = false, padded = true, className, children, ...props }) {
  return (
    <Tag
      className={cn(
        'rounded-2xl border border-surface-border bg-surface shadow-card',
        padded && 'p-4 sm:p-5',
        hover && 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
