import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Modal } from '../common'

/** Mobile/tablet floating bottom navigation. `primary` items sit in the bar, the rest go in a "More" sheet. */
export default function BottomNav({ items }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const { pathname } = useLocation()

  const primary = items.filter((i) => i.primary)
  const more = items.filter((i) => !i.primary)
  const moreActive = more.some((i) => pathname === i.to || pathname.startsWith(`${i.to}/`))
  const cols = primary.length + (more.length ? 1 : 0)

  const tab = 'flex flex-col items-center justify-center gap-0.5 py-1.5 text-[11px] font-semibold transition-colors'
  const pill = (active) => cn('flex h-7 w-12 items-center justify-center rounded-full transition-all', active ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow' : '')

  return (
    <>
      <nav aria-label="Primary" className="fixed inset-x-3 bottom-3 z-40 lg:hidden" style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="glass grid rounded-2xl px-1 shadow-lift" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {primary.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => cn(tab, isActive ? 'text-brand-700' : 'text-ink-muted')}>
              {({ isActive }) => (<><span className={pill(isActive)}><Icon className="h-5 w-5" /></span>{label}</>)}
            </NavLink>
          ))}
          {more.length > 0 && (
            <button onClick={() => setMoreOpen(true)} className={cn(tab, moreActive ? 'text-brand-700' : 'text-ink-muted')}>
              <span className={pill(moreActive)}><MoreHorizontal className="h-5 w-5" /></span>
              More
            </button>
          )}
        </div>
      </nav>

      <Modal open={moreOpen} onClose={() => setMoreOpen(false)} title="More" size="sm">
        <div className="grid grid-cols-3 gap-3 pb-2">
          {more.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMoreOpen(false)}
              className={({ isActive }) =>
                cn('flex flex-col items-center gap-2 rounded-2xl p-3 text-center text-xs font-semibold', isActive ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200' : 'bg-surface-alt text-ink-soft')
              }
            >
              <Icon className="h-6 w-6" />
              {label}
            </NavLink>
          ))}
        </div>
      </Modal>
    </>
  )
}
