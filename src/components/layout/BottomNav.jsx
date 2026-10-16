import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Modal } from '../common'

/** Mobile/tablet bottom navigation. `primary` items sit in the bar, the rest go in a "More" sheet. */
export default function BottomNav({ items }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const { pathname } = useLocation()

  const primary = items.filter((i) => i.primary)
  const more = items.filter((i) => !i.primary)
  const moreActive = more.some((i) => pathname === i.to || pathname.startsWith(`${i.to}/`))
  const cols = primary.length + (more.length ? 1 : 0)

  const tab = 'flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors'

  return (
    <>
      <nav
        aria-label="Primary"
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-surface-border bg-white/95 backdrop-blur-md lg:hidden"
      >
        <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {primary.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => cn(tab, isActive ? 'text-brand-600' : 'text-ink-muted')}>
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
          {more.length > 0 && (
            <button onClick={() => setMoreOpen(true)} className={cn(tab, moreActive ? 'text-brand-600' : 'text-ink-muted')}>
              <MoreHorizontal className="h-5 w-5" />
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
                cn('flex flex-col items-center gap-2 rounded-2xl p-3 text-center text-xs font-medium', isActive ? 'bg-brand-50 text-brand-700' : 'bg-surface-alt text-ink-soft')
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
