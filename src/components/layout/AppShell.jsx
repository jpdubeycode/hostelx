import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import useLocalStorage from '../../hooks/useLocalStorage'
import { navConfig } from '../../utils/navConfig'
import { cn } from '../../utils/cn'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import BottomNav from './BottomNav'

/** Shared frame for all roles. Each role's layout only decides which nav list to use. */
export default function AppShell({ navKey }) {
  const items = navConfig[navKey]
  const [collapsed, setCollapsed] = useLocalStorage('sidebarCollapsed', false)
  const { pathname } = useLocation()

  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lift">
        Skip to content
      </a>
      <Sidebar items={items} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className={cn('flex min-h-screen flex-col transition-[padding] duration-200', collapsed ? 'lg:pl-20' : 'lg:pl-64')}>
        <Topbar />
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 p-4 pb-28 sm:p-6 lg:pb-8">
          <Outlet />
        </main>
      </div>

      <BottomNav items={items} />
    </div>
  )
}
