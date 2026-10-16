
import { useMemo, useState } from 'react'
import {
  Search,
  CheckCircle2,
  Clock3,
  XCircle,
  MessageSquareWarning,
  ClipboardCheck,
  CalendarDays,
  FileText,
  Lightbulb,
  Filter,
} from 'lucide-react'
import { usePollsSuggestions } from '../../context/PollsSuggestionsContext'
import PageHeader from '../../components/layout/PageHeader'

const STATUS_CONFIG = {
  approved: {
    label: 'Approved',
    icon: CheckCircle2,
    badge: 'bg-emerald-50 text-emerald-700',
    panel: 'border-emerald-200 bg-emerald-50',
    description: 'Admin has approved this suggestion.',
  },
  pending: {
    label: 'Awaiting review',
    icon: Clock3,
    badge: 'bg-amber-50 text-amber-800',
    panel: 'border-amber-200 bg-amber-50',
    description: 'This suggestion is waiting for Admin to review it.',
  },
  changes_requested: {
    label: 'Changes requested',
    icon: MessageSquareWarning,
    badge: 'bg-orange-50 text-orange-800',
    panel: 'border-orange-200 bg-orange-50',
    description: 'Admin has requested changes before making a decision.',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    badge: 'bg-rose-50 text-rose-700',
    panel: 'border-rose-200 bg-rose-50',
    description: 'Admin has rejected this suggestion.',
  },
}

function formatDate(date) {
  if (!date) return 'Not available'

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) return 'Not available'

  return parsed.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.badge}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  )
}

function DecisionCard({ suggestion, linkedPoll }) {
  const config = STATUS_CONFIG[suggestion.status] || STATUS_CONFIG.pending
  const Icon = config.icon

  return (
    <article className="rounded-2xl border border-surface-border bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={suggestion.status} />
            <span className="text-xs text-ink-muted">
              Submitted {formatDate(suggestion.createdAt)}
            </span>
          </div>

          <h3 className="text-lg font-bold text-ink">
            {suggestion.title}
          </h3>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink-soft">
            {suggestion.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 text-xs text-ink-muted">
          <CalendarDays size={15} />
          <span>
            Reviewed {formatDate(suggestion.reviewedAt)}
          </span>
        </div>
      </div>

      <div className={`mt-5 rounded-xl border p-4 ${config.panel}`}>
        <div className="flex items-start gap-3">
          <Icon size={19} className="mt-0.5 shrink-0" />

          <div className="min-w-0">
            <p className="text-sm font-bold">
              {config.label}
            </p>

            <p className="mt-1 text-sm leading-6">
              {suggestion.reviewNote ||
                (suggestion.status === 'approved'
                  ? 'No additional feedback was provided by Admin.'
                  : suggestion.status === 'rejected'
                    ? 'No rejection reason was provided.'
                    : suggestion.status === 'changes_requested'
                      ? 'Please check the Suggestions page for the review feedback.'
                      : config.description)}
            </p>
          </div>
        </div>
      </div>

      {linkedPoll && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-surface-border bg-surface-alt p-4">
          <Lightbulb size={18} className="mt-0.5 shrink-0 text-brand-700" />

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Supporting student poll
            </p>

            <p className="mt-1 text-sm font-semibold text-ink">
              {linkedPoll.title}
            </p>

            <p className="mt-1 text-xs text-ink-muted">
              {linkedPoll.options.reduce(
                (total, option) =>
                  total + (Number(option.votes) || 0),
                0,
              )}{' '}
              total votes
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-border pt-4">
        <span className="text-xs text-ink-muted">
          Last updated: {formatDate(suggestion.updatedAt)}
        </span>

        {suggestion.status === 'changes_requested' && (
          <p className="text-sm font-semibold text-orange-800">
            Revise this proposal from the Suggestions page.
          </p>
        )}

        {suggestion.status === 'approved' && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={16} />
            Final decision
          </span>
        )}

        {suggestion.status === 'rejected' && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-700">
            <XCircle size={16} />
            Final decision
          </span>
        )}
      </div>
    </article>
  )
}

export default function Decisions() {
  const { suggestions = [], polls = [] } = usePollsSuggestions()

  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const counts = useMemo(
    () =>
      suggestions.reduce(
        (result, suggestion) => {
          result.total += 1

          if (suggestion.status === 'approved') result.approved += 1
          if (suggestion.status === 'pending') result.pending += 1
          if (suggestion.status === 'changes_requested') result.changes += 1
          if (suggestion.status === 'rejected') result.rejected += 1

          return result
        },
        {
          total: 0,
          approved: 0,
          pending: 0,
          changes: 0,
          rejected: 0,
        },
      ),
    [suggestions],
  )

  const visibleSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase()

    return [...suggestions]
      .filter((suggestion) => {
        const matchesFilter =
          filter === 'all' || suggestion.status === filter

        const matchesSearch =
          !query ||
          suggestion.title?.toLowerCase().includes(query) ||
          suggestion.description?.toLowerCase().includes(query) ||
          suggestion.reviewNote?.toLowerCase().includes(query)

        return matchesFilter && matchesSearch
      })
      .sort((a, b) => {
        const dateA = new Date(
          a.reviewedAt || a.updatedAt || a.createdAt || 0,
        ).getTime()

        const dateB = new Date(
          b.reviewedAt || b.updatedAt || b.createdAt || 0,
        ).getTime()

        return dateB - dateA
      })
  }, [suggestions, filter, search])

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Decisions"
        subtitle="Track Admin decisions and review the outcomes of Committee proposals."
      />

      <section className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white shadow-card sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <ClipboardCheck size={25} />
          </div>

          <div>
            <p className="text-sm font-medium text-white/80">
              Decision tracking
            </p>

            <h2 className="mt-1 text-xl font-bold sm:text-2xl">
              Every proposal has an outcome.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              Check which suggestions were approved, which were rejected,
              and which need further work. Admin retains final approval
              authority.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            label: 'Total proposals',
            value: counts.total,
            icon: FileText,
          },
          {
            label: 'Approved',
            value: counts.approved,
            icon: CheckCircle2,
          },
          {
            label: 'Awaiting review',
            value: counts.pending,
            icon: Clock3,
          },
          {
            label: 'Changes requested',
            value: counts.changes,
            icon: MessageSquareWarning,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-surface-border bg-white p-4 shadow-card sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-ink-muted sm:text-sm">
                {label}
              </span>

              <Icon size={18} className="text-brand-700" />
            </div>

            <p className="mt-3 text-2xl font-bold text-ink">
              {value}
            </p>
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-ink">
            Proposal outcomes
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            These statuses update when Admin reviews a suggestion.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search proposals or Admin feedback..."
              aria-label="Search proposals"
              className="w-full rounded-xl border border-surface-border bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div className="relative">
            <Filter
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter decisions by status"
              className="w-full appearance-none rounded-xl border border-surface-border bg-white py-3 pl-9 pr-9 text-sm outline-none focus:border-brand-500 sm:w-auto"
            >
              <option value="all">All proposals</option>
              <option value="approved">Approved</option>
              <option value="pending">Awaiting review</option>
              <option value="changes_requested">Changes requested</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {visibleSuggestions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-border bg-white px-5 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-ink-muted">
              <ClipboardCheck size={26} />
            </div>

            <h3 className="mt-4 font-bold text-ink">
              No matching decisions
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-muted">
              {suggestions.length === 0
                ? 'Once the Committee submits suggestions, their review status and outcomes will appear here.'
                : 'Try another search term or status filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visibleSuggestions.map((suggestion) => {
              const linkedPoll = polls.find(
                (poll) => poll.id === suggestion.pollId,
              )

              return (
                <DecisionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  linkedPoll={linkedPoll}
                />
              )
            })}
          </div>
        )}
      </section>

      <p className="text-xs leading-5 text-ink-muted">
        Note: this page displays decisions recorded in the shared frontend
        context. Only the Admin review workflow should change approval
        statuses.
      </p>
    </div>
  )
}
