
import { useMemo, useState } from 'react'
import { Bell, Pin, Search, Megaphone, CalendarDays } from 'lucide-react'

import {
  Badge,
  Card,
  EmptyState,
  StatusBadge,
} from '../../components/common'
import PageHeader from '../../components/layout/PageHeader'
import { useAnnouncements } from '../../context/AnnouncementsContext'

function formatDate(date) {
  if (!date) return 'Date unavailable'

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) return 'Date unavailable'

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function Announcements() {
  const { announcements = [] } = useAnnouncements()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [priority, setPriority] = useState('all')

  const publishedAnnouncements = useMemo(() => {
    const query = search.trim().toLowerCase()

    return announcements
      .filter((item) => item.status === 'published')
      .filter((item) => {
        const matchesSearch =
          !query ||
          item.title?.toLowerCase().includes(query) ||
          item.body?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)

        const matchesCategory =
          category === 'all' || item.category === category

        const matchesPriority =
          priority === 'all' || item.priority === priority

        return matchesSearch && matchesCategory && matchesPriority
      })
      .sort((a, b) => {
        if (Boolean(a.pinned) !== Boolean(b.pinned)) {
          return Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))
        }

        return (
          new Date(b.updatedAt || b.createdAt || 0) -
          new Date(a.updatedAt || a.createdAt || 0)
        )
      })
  }, [announcements, search, category, priority])

  const categories = useMemo(
    () => [
      ...new Set(
        announcements
          .filter((item) => item.status === 'published')
          .map((item) => item.category || 'General')
      ),
    ],
    [announcements]
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Announcements"
        subtitle="Stay updated with the latest hostel notices and important information."
      />

      <Card className="overflow-hidden border-0 bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white shadow-card sm:p-7">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white/15 p-3">
            <Megaphone size={25} />
          </div>

          <div>
            <p className="text-sm font-medium text-white/75">
              Hostel communication
            </p>
            <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
              Never miss an important update
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              Check official announcements about hostel facilities, mess
              updates, safety notices, events, and other important information.
            </p>
          </div>
        </div>
      </Card>

      <Card padded={false}>
        <div className="space-y-4 border-b border-surface-border p-4 sm:p-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search announcements..."
              aria-label="Search announcements"
              className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="announcement-category"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Category
              </label>
              <select
                id="announcement-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-surface-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              >
                <option value="all">All categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="announcement-priority"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Priority
              </label>
              <select
                id="announcement-priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className="w-full rounded-xl border border-surface-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              >
                <option value="all">All priorities</option>
                <option value="emergency">Emergency</option>
                <option value="important">Important</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {publishedAnnouncements.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No announcements found"
              message={
                announcements.some((item) => item.status === 'published')
                  ? 'Try a different search term or filter.'
                  : 'There are no published announcements right now. Check back later for updates.'
              }
            />
          ) : (
            <div className="space-y-4">
              {publishedAnnouncements.map((announcement) => (
                <article
                  key={announcement.id}
                  className="rounded-2xl border border-surface-border bg-white p-4 transition hover:border-brand-200 sm:p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={announcement.priority || 'normal'} />
                    <Badge tone="neutral">
                      {announcement.category || 'General'}
                    </Badge>
                    {announcement.pinned && (
                      <Badge tone="brand" icon={Pin}>
                        Pinned
                      </Badge>
                    )}
                  </div>

                  <h2 className="mt-3 break-words text-base font-semibold text-ink sm:text-lg">
                    {announcement.title}
                  </h2>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-ink-soft">
                    {announcement.body}
                  </p>

                  <div className="mt-4 flex items-center gap-2 border-t border-surface-border pt-3 text-xs text-ink-muted">
                    <CalendarDays size={15} />
                    <span>
                      {formatDate(
                        announcement.updatedAt || announcement.createdAt
                      )}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
