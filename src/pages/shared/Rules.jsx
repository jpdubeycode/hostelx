
import { useMemo, useState } from 'react'
import {
  BookOpen,
  Search,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Filter,
} from 'lucide-react'

import {
  Badge,
  Card,
  EmptyState,
  StatusBadge,
} from '../../components/common'
import PageHeader from '../../components/layout/PageHeader'
import { useRules } from '../../context/RulesContext'

const categories = [
  'All',
  'Hostel',
  'Mess',
  'Conduct',
  'Cleanliness',
  'Safety',
  'Visitors',
  'General',
]

function formatDate(date) {
  if (!date) return 'Date unavailable'

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return 'Date unavailable'
  }

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function Rules() {
  const { rules = [] } = useRules()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const publishedRules = useMemo(
    () => rules.filter((rule) => rule.status === 'published'),
    [rules],
  )

  const availableCategories = useMemo(() => {
    const present = new Set(
      publishedRules.map((rule) => rule.category || 'General'),
    )

    return categories.filter(
      (category) => category === 'All' || present.has(category),
    )
  }, [publishedRules])

  const filteredRules = useMemo(() => {
    const query = search.trim().toLowerCase()

    return [...publishedRules]
      .filter((rule) => {
        const matchesSearch =
          !query ||
          rule.title?.toLowerCase().includes(query) ||
          rule.description?.toLowerCase().includes(query) ||
          rule.category?.toLowerCase().includes(query)

        const matchesCategory =
          selectedCategory === 'All' ||
          (rule.category || 'General') === selectedCategory

        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        const severityOrder = {
          critical: 0,
          important: 1,
          normal: 2,
        }

        const severityDifference =
          (severityOrder[a.severity] ?? 2) -
          (severityOrder[b.severity] ?? 2)

        if (severityDifference !== 0) return severityDifference

        return new Date(b.updatedAt || b.createdAt || 0) -
          new Date(a.updatedAt || a.createdAt || 0)
      })
  }, [publishedRules, search, selectedCategory])

  const criticalCount = publishedRules.filter(
    (rule) => rule.severity === 'critical',
  ).length

  const categoryCount = new Set(
    publishedRules.map((rule) => rule.category || 'General'),
  ).size

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Rules & Regulations"
        subtitle="Everything you need to know about hostel living, safety, and student conduct."
      />

      <Card className="overflow-hidden border-0 bg-gradient-to-br from-brand-700 to-brand-500 p-5 text-white shadow-card sm:p-7">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white/15 p-3">
            <BookOpen size={28} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold sm:text-xl">
              A better hostel experience starts with awareness
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85">
              Browse the published hostel rules and guidelines. Please read
              them carefully and contact your hostel authorities if you need
              clarification.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ink-muted">Published rules</p>
              <p className="mt-2 text-2xl font-semibold text-ink">
                {publishedRules.length}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <ShieldCheck size={21} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ink-muted">Categories</p>
              <p className="mt-2 text-2xl font-semibold text-ink">
                {categoryCount}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Filter size={21} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ink-muted">Critical rules</p>
              <p className="mt-2 text-2xl font-semibold text-ink">
                {criticalCount}
              </p>
            </div>
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <AlertTriangle size={21} />
            </div>
          </div>
        </Card>
      </div>

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
              placeholder="Search rules by title or keyword..."
              aria-label="Search published rules"
              className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-ink">
              Browse by category
            </p>

            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => {
                const active = selectedCategory === category

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={active}
                    className={`rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                      active
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-surface-border bg-white text-ink-soft hover:border-brand-300 hover:bg-brand-50'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-ink">
              {selectedCategory === 'All'
                ? 'All published rules'
                : `${selectedCategory} rules`}
            </h2>
            <span className="text-sm text-ink-muted">
              {filteredRules.length}{' '}
              {filteredRules.length === 1 ? 'rule' : 'rules'}
            </span>
          </div>

          {filteredRules.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title={
                publishedRules.length === 0
                  ? 'No published rules yet'
                  : 'No matching rules'
              }
              message={
                publishedRules.length === 0
                  ? 'Published hostel rules will appear here when they become available.'
                  : 'Try another keyword or select a different category.'
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredRules.map((rule, index) => (
                <article
                  key={rule.id}
                  className="rounded-2xl border border-surface-border bg-white p-4 transition hover:border-brand-200 sm:p-5"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        rule.severity === 'critical'
                          ? 'bg-red-50 text-red-600'
                          : rule.severity === 'important'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-brand-50 text-brand-600'
                      }`}
                    >
                      {rule.severity === 'critical' ? (
                        <AlertTriangle size={20} />
                      ) : (
                        <BookOpen size={20} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="neutral">
                          {rule.category || 'General'}
                        </Badge>
                        <StatusBadge status={rule.severity || 'normal'} />
                      </div>

                      <h3 className="mt-3 break-words text-base font-semibold text-ink sm:text-lg">
                        {rule.title}
                      </h3>

                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-ink-soft">
                        {rule.description}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
                        <Clock size={14} />
                        <span>
                          Updated {formatDate(rule.updatedAt || rule.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </Card>

      <p className="text-center text-xs leading-5 text-ink-muted">
        Please follow the official hostel guidelines. For clarification or
        exceptions, contact the relevant hostel authority.
      </p>
    </div>
  )
}
