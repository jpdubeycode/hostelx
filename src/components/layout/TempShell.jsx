import { NavLink, Outlet } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { navConfig } from '../../utils/navConfig'
import { ROLE_LABEL } from '../../utils/constants'
import { Badge, Button } from '../common'
import { cn } from '../../utils/cn'

// TEMPORARY. Delete once real layouts (Sidebar, Topbar, BottomNav) are built.
export default function TempShell({ navKey }) {
  const { user, role, logout } = useAuth()
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-surface-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-lg font-extrabold">Hostel<span className="text-brand-600">X</span></span>
            <Badge tone="brand">{ROLE_LABEL[role]}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-soft sm:inline">{user?.name}</span>
            <Button variant="secondary" size="sm" icon={LogOut} onClick={logout}>Logout</Button>
          </div>
        </div>
        <nav className="scrollbar-none mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2">
          {navConfig[navKey].map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => cn('whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium', isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-slate-100')}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl p-4 sm:p-6"><Outlet /></main>
    </div>
  )
}
