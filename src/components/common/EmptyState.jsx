import { Inbox } from 'lucide-react'

/** Props: icon, title, message, action (a <Button/>) */
export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border bg-white px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Icon className="h-7 w-7" /></div>
      <h3 className="text-base font-semibold">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-ink-soft">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
