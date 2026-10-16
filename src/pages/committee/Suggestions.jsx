
import { useMemo, useState } from 'react'
import {
  Plus,
  X,
  Lightbulb,
  ClipboardList,
  Clock3,
  CheckCircle2,
  AlertCircle,
  MessageSquareWarning,
  Pencil,
  LoaderCircle,
} from 'lucide-react'

import { usePollsSuggestions } from '../../context/PollsSuggestionsContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import PageHeader from '../../components/layout/PageHeader'

const STATUS_LABELS = {
  pending: 'Pending Admin review',
  changes_requested: 'Changes requested',
  approved: 'Approved',
  rejected: 'Rejected',
}

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-800',
  changes_requested: 'bg-orange-50 text-orange-800',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-rose-50 text-rose-700',
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
        STATUS_STYLES[status] || 'bg-slate-100 text-slate-700'
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  )
}

function SuggestionForm({ suggestion, polls, onClose, onSave, saving }) {
  const [title, setTitle] = useState(suggestion?.title || '')
  const [description, setDescription] = useState(
    suggestion?.description || '',
  )
  const [pollId, setPollId] = useState(suggestion?.pollId || '')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Please enter a suggestion title.')
      return
    }

    if (!description.trim()) {
      setError('Please describe your proposal.')
      return
    }

    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        pollId: pollId || null,
      })
    } catch (err) {
      setError(err.message || 'Unable to save the suggestion.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-border bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-ink">
              {suggestion ? 'Revise proposal' : 'Create committee proposal'}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Submit a proposal for the later Admin review workflow.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close proposal form"
            className="rounded-xl p-2 text-ink-muted hover:bg-surface-alt disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          <div>
            <label
              htmlFor="committee-suggestion-title"
              className="mb-2 block text-sm font-semibold text-ink"
            >
              Proposal title
            </label>
            <input
              id="committee-suggestion-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              required
              placeholder="e.g. Introduce a weekly special dinner"
              className="w-full rounded-xl border border-surface-border px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label
              htmlFor="committee-suggestion-description"
              className="mb-2 block text-sm font-semibold text-ink"
            >
              Proposal and reasoning
            </label>
            <textarea
              id="committee-suggestion-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              maxLength={2000}
              required
              placeholder="Describe the proposed change, why it is needed, and how it may benefit students..."
              className="w-full resize-y rounded-xl border border-surface-border px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            <p className="mt-1 text-right text-xs text-ink-muted">
              {description.length}/2000
            </p>
          </div>

          <div>
            <label
              htmlFor="committee-suggestion-poll"
              className="mb-2 block text-sm font-semibold text-ink"
            >
              Supporting poll{' '}
              <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <select
              id="committee-suggestion-poll"
              value={pollId}
              onChange={(event) => setPollId(event.target.value)}
              className="w-full rounded-xl border border-surface-border bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              <option value="">No linked poll</option>
              {polls.map((poll) => (
                <option key={poll.id} value={poll.id}>
                  {poll.title}
                  {poll.status === 'closed' ? ' (Closed)' : ' (Active)'}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-ink-muted">
              Link a poll to show which student preferences informed this proposal.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-surface-border pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-surface-border px-5 py-3 text-sm font-semibold text-ink hover:bg-surface-alt disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {saving && <LoaderCircle size={17} className="animate-spin" />}
              {suggestion ? 'Resubmit proposal' : 'Submit to Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Suggestions() {
  const {
    polls = [],
    suggestions = [],
    createSuggestion,
    resubmitSuggestion,
  } = usePollsSuggestions()

  const { user } = useAuth()
  const toast = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editingSuggestion, setEditingSuggestion] = useState(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')

  // Legacy records without a source remain visible to the Committee.
  const committeeSuggestions = useMemo(
    () => suggestions.filter((item) => item.source !== 'student'),
    [suggestions],
  )

  const counts = useMemo(
    () =>
      committeeSuggestions.reduce(
        (result, suggestion) => {
          result.total += 1
          if (suggestion.status === 'pending') result.pending += 1
          if (suggestion.status === 'changes_requested') result.changes += 1
          if (suggestion.status === 'approved') result.approved += 1
          if (suggestion.status === 'rejected') result.rejected += 1
          return result
        },
        { total: 0, pending: 0, changes: 0, approved: 0, rejected: 0 },
      ),
    [committeeSuggestions],
  )

  const visibleSuggestions = useMemo(() => {
    const filtered =
      filter === 'all'
        ? committeeSuggestions
        : committeeSuggestions.filter((item) => item.status === filter)

    return [...filtered].sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt || 0) -
        new Date(a.updatedAt || a.createdAt || 0),
    )
  }, [committeeSuggestions, filter])

  async function handleSave(data) {
    setSaving(true)

    try {
      if (editingSuggestion) {
        await resubmitSuggestion(editingSuggestion.id, data)
        toast.success('Proposal resubmitted for review.')
      } else {
        await createSuggestion(
          data,
          user?.studentId || user?.id || user?.name || null,
          'committee',
        )
        toast.success('Committee proposal submitted successfully.')
      }

      setShowForm(false)
      setEditingSuggestion(null)
    } finally {
      setSaving(false)
    }
  }

  function openNewSuggestion() {
    setEditingSuggestion(null)
    setShowForm(true)
  }

  function openRevision(suggestion) {
    if (suggestion.source === 'student') return
    if (suggestion.status !== 'changes_requested') return

    setEditingSuggestion(suggestion)
    setShowForm(true)
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Committee Proposals"
        subtitle="Use student poll results and committee observations to propose improvements."
      />

      <section className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Lightbulb size={18} />
            Mess Committee proposals
          </div>
          <h2 className="mt-2 text-xl font-bold sm:text-2xl">
            Turn feedback into action.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">
            Create proposals based on student polls and observations. These
            proposals are tracked separately from suggestions submitted by
            individual students.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewSuggestion}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-brand-800 transition hover:bg-brand-50"
        >
          <Plus size={18} />
          New proposal
        </button>
      </section>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: 'Committee proposals', value: counts.total, icon: ClipboardList },
          { label: 'Pending review', value: counts.pending, icon: Clock3 },
          { label: 'Changes requested', value: counts.changes, icon: MessageSquareWarning },
          { label: 'Approved', value: counts.approved, icon: CheckCircle2 },
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
            <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card">
        <div className="flex flex-col gap-4 border-b border-surface-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-ink">Your proposals</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Track committee proposals and their current review statuses.
            </p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter proposals by status"
            className="rounded-xl border border-surface-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending review</option>
            <option value="changes_requested">Changes requested</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {visibleSuggestions.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-ink-muted">
              <Lightbulb size={26} />
            </div>
            <h3 className="mt-4 font-bold text-ink">No committee proposals found</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-muted">
              Create a proposal based on student feedback or choose another status filter.
            </p>
            <button
              type="button"
              onClick={openNewSuggestion}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              <Plus size={17} />
              Create proposal
            </button>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {visibleSuggestions.map((suggestion) => {
              const linkedPoll = polls.find(
                (poll) => poll.id === suggestion.pollId,
              )

              return (
                <article key={suggestion.id} className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-ink">
                          {suggestion.title}
                        </h3>
                        <StatusPill status={suggestion.status} />
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink-soft">
                        {suggestion.description}
                      </p>
                      <p className="mt-3 text-xs text-ink-muted">
                        Submitted {formatDate(suggestion.createdAt)}
                        {' · '}Updated {formatDate(suggestion.updatedAt)}
                      </p>
                    </div>

                    {suggestion.status === 'changes_requested' && (
                      <button
                        type="button"
                        onClick={() => openRevision(suggestion)}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
                      >
                        <Pencil size={16} />
                        Revise & resubmit
                      </button>
                    )}
                  </div>

                  {linkedPoll && (
                    <div className="mt-4 rounded-xl border border-surface-border bg-surface-alt p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                        Supporting poll
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
                  )}

                  {suggestion.reviewNote && (
                    <div
                      className={`mt-4 rounded-xl border p-3 ${
                        suggestion.status === 'approved'
                          ? 'border-emerald-200 bg-emerald-50'
                          : suggestion.status === 'rejected'
                            ? 'border-rose-200 bg-rose-50'
                            : 'border-amber-200 bg-amber-50'
                      }`}
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-ink">
                        Review feedback
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-ink-soft">
                        {suggestion.reviewNote}
                      </p>
                    </div>
                  )}

                  {suggestion.status === 'pending' && (
                    <p className="mt-4 text-sm text-amber-800">
                      <Clock3 size={15} className="mr-1 inline-block" />
                      Awaiting review. Admin approval integration is deferred.
                    </p>
                  )}

                  {suggestion.status === 'approved' && (
                    <p className="mt-4 text-sm text-emerald-700">
                      <CheckCircle2 size={15} className="mr-1 inline-block" />
                      Approved.
                    </p>
                  )}

                  {suggestion.status === 'rejected' && (
                    <p className="mt-4 text-sm text-rose-700">
                      <AlertCircle size={15} className="mr-1 inline-block" />
                      This proposal was rejected.
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>

      {showForm && (
        <SuggestionForm
          key={editingSuggestion?.id || 'new-committee-proposal'}
          suggestion={editingSuggestion}
          polls={polls}
          saving={saving}
          onClose={() => {
            if (!saving) {
              setShowForm(false)
              setEditingSuggestion(null)
            }
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
