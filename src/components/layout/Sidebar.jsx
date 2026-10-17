import { NavLink } from 'react-router-dom'
import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABEL } from '../../utils/constants'
import { cn } from '../../utils/cn'
import { Avatar } from '../common'
import Logo from './Logo'

/** Desktop sidebar (lg and up). Dark themed; the icon button at the top collapses it to an icon rail. */
export default function Sidebar({ items, collapsed, onToggle }) {
  const { user, role, logout } = useAuth()
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <aside
      className={cn(
        'sidebar-bg fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-white/5 text-white shadow-[10px_0_40px_-10px_rgb(var(--brand-600)/0.45)] transition-[width] duration-200 lg:flex',
        collapsed ? 'w-20' : 'w-64',
      )}
    >
      <div className={cn('flex items-center border-b border-white/10', collapsed ? 'flex-col justify-center gap-2 py-3' : 'h-16 justify-between px-5')}>
        <Logo compact={collapsed} tone="dark" />
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ToggleIcon className="h-5 w-5" />
        </button>
      </div>

      {!collapsed && (
        <div className="px-5 pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/80 ring-1 ring-inset ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {ROLE_LABEL[role]}
          </span>
        </div>
      )}

      <nav aria-label="Main" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200',
                collapsed ? 'justify-center px-0' : 'px-3',
                isActive
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-glow'
                  : 'text-white/65 hover:bg-white/10 hover:text-white',
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className={cn('flex items-center gap-3 rounded-xl bg-white/10 p-2.5 ring-1 ring-inset ring-white/10', collapsed && 'justify-center')}>
          <Avatar name={user?.name} size="sm" />
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user?.name}</p>
                <p className="truncate text-xs text-white/50">{ROLE_LABEL[role]}</p>
              </div>
              <button onClick={logout} aria-label="Log out" className="rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-rose-300">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
