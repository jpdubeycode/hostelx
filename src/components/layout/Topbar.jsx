import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { announcementsPathFor, searchPathFor } from '../../utils/navConfig'
import { SearchBar } from '../common'
import Logo from './Logo'
import ProfileMenu from './ProfileMenu'

export default function Topbar() {
  const { role } = useAuth()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const term = q.trim()
    navigate(term ? `${searchPathFor(role)}?q=${encodeURIComponent(term)}` : searchPathFor(role))
    setQ('')
  }

  const iconBtn = 'relative flex h-10 w-10 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-slate-100 hover:text-ink'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-brand-200/60 bg-gradient-to-r from-brand-200/70 via-white/60 to-aurora/15 px-4 shadow-sm shadow-brand-600/5 backdrop-blur-xl sm:px-6">
      <Logo className="lg:hidden" />

      <form onSubmit={submit} role="search" className="hidden max-w-md flex-1 md:block">
        <SearchBar value={q} onChange={setQ} placeholder="Search students, rooms, branch…" />
      </form>

      <div className="ml-auto flex items-center gap-1">
        <Link to={searchPathFor(role)} aria-label="Search" className={`${iconBtn} md:hidden`}>
          <Search className="h-5 w-5" />
        </Link>
        {/* TODO: drive the dot from unread announcements once that data is wired */}
        <Link to={announcementsPathFor(role)} aria-label="Announcements" className={iconBtn}>
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </Link>
        <ProfileMenu />
      </div>
    </header>
  )
}
