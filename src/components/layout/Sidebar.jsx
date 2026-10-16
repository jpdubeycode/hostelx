import { NavLink } from 'react-router-dom'
import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABEL } from '../../utils/constants'
import { cn } from '../../utils/cn'
import { Avatar, Badge } from '../common'
import Logo from './Logo'

/** Desktop sidebar (lg and up). Collapses to an icon rail. */
export default function Sidebar({ items, collapsed, onToggle }) {
  const { user, role, logout } = useAuth()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-surface-border bg-white transition-[width] duration-200 lg:flex',
        collapsed ? 'w-20' : 'w-64',
      )}
    >
      <div className={cn('flex h-16 items-center border-b border-surface-border', collapsed ? 'justify-center' : 'px-5')}>
        <Logo compact={collapsed} />
      </div>

      {!collapsed && (
        <div className="px-5 pt-4">
          <Badge tone="brand">{ROLE_LABEL[role]}</Badge>
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
                'flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-colors',
                collapsed ? 'justify-center px-0' : 'px-3',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-soft hover:bg-slate-100 hover:text-ink',
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-surface-border p-3">
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn('mb-2 flex w-full items-center gap-3 rounded-xl py-2 text-sm text-ink-soft hover:bg-slate-100', collapsed ? 'justify-center' : 'px-3')}
        >
          {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <><PanelLeftClose className="h-5 w-5" /> Collapse</>}
        </button>

        <div className={cn('flex items-center gap-3 rounded-xl bg-surface-alt p-2.5', collapsed && 'justify-center')}>
          <Avatar name={user?.name} size="sm" />
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user?.name}</p>
                <p className="truncate text-xs text-ink-muted">{ROLE_LABEL[role]}</p>
              </div>
              <button onClick={logout} aria-label="Log out" className="rounded-lg p-1.5 text-ink-soft hover:bg-white hover:text-rose-600">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
