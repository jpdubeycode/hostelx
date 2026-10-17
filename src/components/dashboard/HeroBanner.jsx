import { cn } from '../../utils/cn'

/** Gradient welcome banner for dashboards. Props: eyebrow, title, subtitle, icon, children (actions) */
export default function HeroBanner({ eyebrow, title, subtitle, icon: Icon, children, className }) {
  return (
    <section className={cn('relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 text-white shadow-lift sm:p-8', className)}>
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom_left,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-aurora/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/70">{eyebrow}</p>}
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1.5 max-w-xl text-sm text-white/80 sm:text-base">{subtitle}</p>}
          {children && <div className="mt-5 flex flex-wrap gap-2">{children}</div>}
        </div>
        {Icon && <Icon className="hidden h-24 w-24 shrink-0 text-white/20 sm:block" strokeWidth={1.25} />}
      </div>
    </section>
  )
}
