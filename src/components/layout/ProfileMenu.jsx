import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, RotateCcw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { resetDemoData } from '../../hooks/useLocalStorage'
import { ROLE_LABEL } from '../../utils/constants'
import { Avatar } from '../common'

/** Avatar button in the topbar with a small dropdown (logout, reset demo). */
export default function ProfileMenu() {
  const { user, role, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors hover:bg-slate-100"
      >
        <Avatar name={user?.name} size="sm" />
        <span className="hidden max-w-[9rem] truncate text-sm font-medium md:block">{user?.name}</span>
        <ChevronDown className="hidden h-4 w-4 text-ink-muted md:block" />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-60 animate-fade-in overflow-hidden rounded-2xl border border-surface-border bg-white shadow-lift">
          <div className="border-b border-surface-border px-4 py-3">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-ink-muted">{ROLE_LABEL[role]}</p>
          </div>
          <div className="p-1.5">
            <button role="menuitem" onClick={logout} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-slate-100">
              <LogOut className="h-4 w-4 text-ink-soft" /> Log out
            </button>
            <button role="menuitem" onClick={resetDemoData} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-slate-100">
              <RotateCcw className="h-4 w-4 text-ink-soft" /> Reset demo data
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
