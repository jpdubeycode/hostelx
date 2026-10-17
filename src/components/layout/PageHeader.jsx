/** Props: title, subtitle, action (node), eyebrow (small label above the title) */
export default function PageHeader({ title, subtitle, action, eyebrow }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-600">{eyebrow}</p>}
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
        <div className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-brand-500 to-aurora" />
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
