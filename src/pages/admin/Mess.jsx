
import { useMemo, useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  EyeOff,
  MessageSquareWarning,
  UtensilsCrossed,
  X,
  AlertCircle,
  LoaderCircle,
} from 'lucide-react'
import { useMess } from '../../context/MessContext'
import { useToast } from '../../context/ToastContext'
import PageHeader from '../../components/layout/PageHeader'

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const MEALS = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
]

const FILTERS = [
  { value: 'all', label: 'All menus' },
  { value: 'pending', label: 'Awaiting approval' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Changes requested' },
  { value: 'draft', label: 'Drafts' },
]

const STATUS_STYLES = {
  draft: 'bg-slate-100 text-slate-700',
  pending: 'bg-amber-100 text-amber-800',
  rejected: 'bg-rose-100 text-rose-700',
  published: 'bg-emerald-100 text-emerald-700',
  approved: 'bg-emerald-100 text-emerald-700',
}

const STATUS_LABELS = {
  draft: 'Draft',
  pending: 'Awaiting approval',
  rejected: 'Changes requested',
  published: 'Published',
  approved: 'Approved',
}

function formatDate(date) {
  if (!date) return '—'

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) return '—'

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] || STATUS_STYLES.draft
      }`}
    >
      {STATUS_LABELS[status] || 'Draft'}
    </span>
  )
}

function ReviewModal({ menu, onClose, onConfirm, saving }) {
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!note.trim()) {
      setError('Please explain what the Committee needs to change.')
      return
    }

    setError('')

    try {
      await onConfirm(note.trim())
    } catch (err) {
      setError(err.message || 'Unable to request changes.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <MessageSquareWarning size={22} />
            </div>
            <h2 className="mt-4 text-xl font-bold text-ink">
              Request menu changes
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {menu.day} menu
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close review dialog"
            className="rounded-xl p-2 text-ink-muted hover:bg-surface-alt"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <label
            htmlFor="review-note"
            className="mb-2 block text-sm font-semibold text-ink"
          >
            Feedback for the Committee
          </label>
          <textarea
            id="review-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Explain what needs to be corrected in this menu..."
            className="w-full resize-y rounded-xl border border-surface-border px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <p className="mt-1 text-right text-xs text-ink-muted">
            {note.length}/1000
          </p>

          {error && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="rounded-xl border border-surface-border px-4 py-3 text-sm font-semibold text-ink hover:bg-surface-alt disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
            >
              {saving && <LoaderCircle size={16} className="animate-spin" />}
              Request changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Mess() {
  const {
    messMenu = [],
    approveMenu,
    requestChanges,
    unpublishMenu,
  } = useMess()

  const toast = useToast()

  const [filter, setFilter] = useState('pending')
  const [reviewMenu, setReviewMenu] = useState(null)
  const [saving, setSaving] = useState(false)
  const [busyMenuId, setBusyMenuId] = useState(null)

  const counts = useMemo(() => {
    return messMenu.reduce(
      (result, menu) => {
        result.total += 1

        if (menu.status === 'pending') result.pending += 1
        if (menu.status === 'published') result.published += 1
        if (menu.status === 'rejected') result.rejected += 1
        if (menu.status === 'draft') result.draft += 1

        return result
      },
      { total: 0, pending: 0, published: 0, rejected: 0, draft: 0 },
    )
  }, [messMenu])

  const visibleMenus = useMemo(() => {
    const filtered = filter === 'all'
      ? messMenu
      : messMenu.filter((menu) => menu.status === filter)

    return [...filtered].sort((a, b) => {
      // Show pending approvals first when viewing all menus.
      if (filter === 'all' && a.status !== b.status) {
        if (a.status === 'pending') return -1
        if (b.status === 'pending') return 1
      }

      return DAYS.indexOf(a.day) - DAYS.indexOf(b.day)
    })
  }, [messMenu, filter])

  async function handleApprove(menu) {
    const confirmed = window.confirm(
      `Approve and publish the ${menu.day} menu? Students will be able to see it.`,
    )

    if (!confirmed) return

    setBusyMenuId(menu.id)

    try {
      await approveMenu(menu.id)
      toast.success(`${menu.day} menu approved and published.`)
    } catch (error) {
      toast.error(error.message || 'Unable to approve this menu.')
    } finally {
      setBusyMenuId(null)
    }
  }

  async function handleRequestChanges(note) {
    if (!reviewMenu) return

    setSaving(true)

    try {
      await requestChanges(reviewMenu.id, note)
      toast.success(
        `Changes requested for the ${reviewMenu.day} menu.`,
      )
      setReviewMenu(null)
    } catch (error) {
      throw error
    } finally {
      setSaving(false)
    }
  }

  async function handleUnpublish(menu) {
    const confirmed = window.confirm(
      `Unpublish the ${menu.day} menu? Students will no longer see it.`,
    )

    if (!confirmed) return

    setBusyMenuId(menu.id)

    try {
      await unpublishMenu(menu.id)
      toast.success(`${menu.day} menu has been unpublished.`)
    } catch (error) {
      toast.error(error.message || 'Unable to unpublish this menu.')
    } finally {
      setBusyMenuId(null)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Mess Management"
        subtitle="Review menus submitted by the Mess Committee and manage publication."
      />

      <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white shadow-card sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <UtensilsCrossed size={25} />
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">
              Mess administration
            </p>
            <h2 className="mt-1 text-xl font-bold sm:text-2xl">
              Review before publishing.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              Check meal items and timings, approve menus for students, or
              return menus to the Committee with clear feedback.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          {
            label: 'Total menus',
            value: counts.total,
            icon: CalendarDays,
            tone: 'text-ink',
          },
          {
            label: 'Awaiting approval',
            value: counts.pending,
            icon: Clock3,
            tone: 'text-amber-700',
          },
          {
            label: 'Published',
            value: counts.published,
            icon: CheckCircle2,
            tone: 'text-emerald-700',
          },
          {
            label: 'Changes requested',
            value: counts.rejected,
            icon: MessageSquareWarning,
            tone: 'text-rose-700',
          },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="rounded-2xl border border-surface-border bg-white p-4 shadow-card sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-ink-muted sm:text-sm">
                {label}
              </span>
              <Icon size={18} className={tone} />
            </div>
            <p className={`mt-3 text-2xl font-bold ${tone}`}>{value}</p>
          </div>
        ))}
      </div>

      {counts.pending > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <Clock3 size={20} className="mt-0.5 shrink-0 text-amber-700" />
          <div>
            <p className="font-semibold text-amber-900">
              {counts.pending} menu{counts.pending === 1 ? '' : 's'} awaiting review
            </p>
            <p className="mt-1 text-sm text-amber-800">
              Review the submitted menu and approve it or request changes.
            </p>
          </div>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card">
        <div className="flex flex-col gap-4 border-b border-surface-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-ink">Menu review queue</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Inspect each day’s meals and take the appropriate action.
            </p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter menus by status"
            className="rounded-xl border border-surface-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500"
          >
            {FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {visibleMenus.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-ink-muted">
              <CheckCircle2 size={25} />
            </div>
            <h3 className="mt-4 font-bold text-ink">
              {filter === 'pending'
                ? 'No menus awaiting approval'
                : 'No menus found'}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
              {filter === 'pending'
                ? 'You’re all caught up. Newly submitted menus will appear here.'
                : 'Try selecting a different status filter.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {visibleMenus.map((menu) => (
              <article key={menu.id} className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-ink">
                        {menu.day}
                      </h3>
                      <StatusPill status={menu.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                      <span>
                        Submitted: {formatDate(menu.submittedAt)}
                      </span>
                      <span>
                        Last updated: {formatDate(menu.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {menu.status === 'pending' && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busyMenuId === menu.id}
                        onClick={() => handleApprove(menu)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {busyMenuId === menu.id ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={16} />
                        )}
                        Approve & publish
                      </button>

                      <button
                        type="button"
                        disabled={busyMenuId === menu.id}
                        onClick={() => setReviewMenu(menu)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
                      >
                        <MessageSquareWarning size={16} />
                        Request changes
                      </button>
                    </div>
                  )}

                  {menu.status === 'published' && (
                    <button
                      type="button"
                      disabled={busyMenuId === menu.id}
                      onClick={() => handleUnpublish(menu)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-border px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-alt disabled:opacity-60"
                    >
                      {busyMenuId === menu.id ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <EyeOff size={16} />
                      )}
                      Unpublish
                    </button>
                  )}
                </div>

                {menu.status === 'rejected' && menu.reviewNote && (
                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-rose-700">
                      Previous review note
                    </p>
                    <p className="mt-1 text-sm leading-6 text-rose-800">
                      {menu.reviewNote}
                    </p>
                  </div>
                )}

                <div className="mt-5 grid gap-3 lg:grid-cols-3">
                  {MEALS.map(({ key, label }) => {
                    const meal = menu.meals?.[key] || {
                      items: [],
                      timings: '',
                    }

                    return (
                      <div
                        key={key}
                        className="rounded-xl bg-surface-alt p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-ink">{label}</h4>
                          <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                            <Clock3 size={13} />
                            {meal.timings || 'Timing not set'}
                          </span>
                        </div>

                        <ul className="mt-3 space-y-2">
                          {(meal.items || []).map((item, index) => (
                            <li
                              key={`${key}-${index}`}
                              className="flex items-start gap-2 text-sm text-ink-soft"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                              <span>{item}</span>
                            </li>
                          ))}

                          {!meal.items?.length && (
                            <li className="text-sm text-ink-muted">
                              No items added.
                            </li>
                          )}
                        </ul>
                      </div>
                    )
                  })}
                </div>

                {menu.status === 'pending' && (
                  <p className="mt-4 text-xs text-amber-800">
                    Approval publishes this menu for students. Requesting
                    changes returns it to the Committee for revision.
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {reviewMenu && (
        <ReviewModal
          key={reviewMenu.id}
          menu={reviewMenu}
          saving={saving}
          onClose={() => {
            if (!saving) setReviewMenu(null)
          }}
          onConfirm={handleRequestChanges}
        />
      )}
    </div>
  )
}
