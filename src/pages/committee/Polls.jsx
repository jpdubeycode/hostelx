
import { useMemo, useState } from 'react'
import {
  Plus,
  X,
  Vote,
  Clock3,
  Users,
  CalendarDays,
  CheckCircle2,
  CircleStop,
  BarChart3,
  LoaderCircle,
  AlertCircle,
  ClipboardList,
} from 'lucide-react'
import { usePollsSuggestions } from '../../context/PollsSuggestionsContext'
import { useToast } from '../../context/ToastContext'
import PageHeader from '../../components/layout/PageHeader'

function formatDate(date) {
  if (!date) return 'No deadline'

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) return 'No deadline'

  return parsed.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function isExpired(poll) {
  return Boolean(poll.endsAt && new Date(poll.endsAt).getTime() <= Date.now())
}

function getVoteCount(poll) {
  return (poll.options || []).reduce(
    (total, option) => total + (Number(option.votes) || 0),
    0,
  )
}

function getStatus(poll) {
  if (poll.status === 'closed' || isExpired(poll)) return 'closed'
  return 'active'
}

function StatusPill({ status }) {
  const styles =
    status === 'active'
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-slate-100 text-slate-700'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
        }`}
      />
      {status === 'active' ? 'Active' : 'Closed'}
    </span>
  )
}

function PollForm({ onClose, onCreate, saving }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [endsAt, setEndsAt] = useState('')
  const [error, setError] = useState('')

  function updateOption(index, value) {
    setOptions((current) =>
      current.map((option, optionIndex) =>
        optionIndex === index ? value : option,
      ),
    )
  }

  function addOption() {
    setOptions((current) => [...current, ''])
  }

  function removeOption(index) {
    setOptions((current) =>
      current.filter((_, optionIndex) => optionIndex !== index),
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const cleanedOptions = options.map((option) => option.trim()).filter(Boolean)

    if (!title.trim()) {
      setError('Please enter a poll title.')
      return
    }

    if (!description.trim()) {
      setError('Please enter a description for the poll.')
      return
    }

    if (cleanedOptions.length < 2) {
      setError('Add at least two non-empty options.')
      return
    }

    const uniqueOptions = new Set(
      cleanedOptions.map((option) => option.toLowerCase()),
    )

    if (uniqueOptions.size !== cleanedOptions.length) {
      setError('Poll options must be unique.')
      return
    }

    let deadline = null

    if (endsAt) {
      const date = new Date(endsAt)

      if (Number.isNaN(date.getTime()) || date.getTime() <= Date.now()) {
        setError('The closing date and time must be in the future.')
        return
      }

      deadline = date.toISOString()
    }

    try {
      await onCreate({
        title: title.trim(),
        description: description.trim(),
        options: cleanedOptions,
        endsAt: deadline,
      })
    } catch (err) {
      setError(err.message || 'Could not create the poll.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-border bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-ink">Create a poll</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Ask students about their mess preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close poll form"
            className="rounded-xl p-2 text-ink-muted hover:bg-surface-alt disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          <div>
            <label
              htmlFor="poll-title"
              className="mb-2 block text-sm font-semibold text-ink"
            >
              Poll title
            </label>
            <input
              id="poll-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              placeholder="e.g. Which special dinner should we arrange?"
              required
              className="w-full rounded-xl border border-surface-border px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <label
              htmlFor="poll-description"
              className="mb-2 block text-sm font-semibold text-ink"
            >
              Description
            </label>
            <textarea
              id="poll-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={500}
              rows={3}
              required
              placeholder="Explain the purpose of this poll to students..."
              className="w-full resize-y rounded-xl border border-surface-border px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="text-sm font-semibold text-ink">
                Voting options
              </label>
              <span className="text-xs text-ink-muted">
                At least 2 options
              </span>
            </div>

            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={option}
                    onChange={(event) => updateOption(index, event.target.value)}
                    maxLength={100}
                    placeholder={`Option ${index + 1}`}
                    className="min-w-0 flex-1 rounded-xl border border-surface-border px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />

                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      aria-label={`Remove option ${index + 1}`}
                      className="rounded-xl px-3 text-rose-600 hover:bg-rose-50"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 10 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                <Plus size={16} />
                Add option
              </button>
            )}
          </div>

          <div>
            <label
              htmlFor="poll-deadline"
              className="mb-2 block text-sm font-semibold text-ink"
            >
              Voting deadline <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <input
              id="poll-deadline"
              type="datetime-local"
              value={endsAt}
              onChange={(event) => setEndsAt(event.target.value)}
              min={new Date(Date.now() + 60_000).toISOString().slice(0, 16)}
              className="w-full rounded-xl border border-surface-border px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
            <p className="mt-2 text-xs text-ink-muted">
              A poll with no deadline stays open until the Committee closes it.
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <LoaderCircle size={17} className="animate-spin" />}
              Create poll
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Polls() {
  const { polls = [], createPoll, closePoll } = usePollsSuggestions()
  const toast = useToast()

  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [busyPollId, setBusyPollId] = useState(null)
  const [filter, setFilter] = useState('all')

  const counts = useMemo(() => {
    return polls.reduce(
      (result, poll) => {
        result.total += 1
        if (getStatus(poll) === 'active') result.active += 1
        else result.closed += 1
        result.votes += getVoteCount(poll)
        return result
      },
      { total: 0, active: 0, closed: 0, votes: 0 },
    )
  }, [polls])

  const visiblePolls = useMemo(() => {
    const filtered = polls.filter((poll) => {
      if (filter === 'all') return true
      return getStatus(poll) === filter
    })

    return [...filtered].sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    )
  }, [polls, filter])

  async function handleCreate(pollData) {
    setSaving(true)

    try {
      await createPoll(pollData)
      toast.success('Poll created successfully.')
      setShowForm(false)
    } catch (error) {
      throw error
    } finally {
      setSaving(false)
    }
  }

  async function handleClose(poll) {
    if (!window.confirm(`Close "${poll.title}"? Students will no longer be able to vote.`)) {
      return
    }

    setBusyPollId(poll.id)

    try {
      await closePoll(poll.id)
      toast.success('Poll closed successfully.')
    } catch (error) {
      toast.error(error.message || 'Unable to close the poll.')
    } finally {
      setBusyPollId(null)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Polls"
        subtitle="Collect student preferences and use the results to prepare suggestions for Admin."
      />

      <section className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Vote size={18} />
            Student engagement
          </div>
          <h2 className="mt-2 text-xl font-bold sm:text-2xl">
            Make student preferences count.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">
            Create polls about meals and hostel life, monitor the results, and
            turn useful feedback into formal suggestions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-brand-800 transition hover:bg-brand-50"
        >
          <Plus size={18} />
          Create poll
        </button>
      </section>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: 'Total polls', value: counts.total, icon: ClipboardList },
          { label: 'Active polls', value: counts.active, icon: Vote },
          { label: 'Closed polls', value: counts.closed, icon: CircleStop },
          { label: 'Total votes', value: counts.votes, icon: Users },
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
            <h2 className="text-lg font-bold text-ink">Your polls</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Track participation and check the current results.
            </p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter polls"
            className="rounded-xl border border-surface-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500"
          >
            <option value="all">All polls</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {visiblePolls.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-ink-muted">
              <BarChart3 size={26} />
            </div>
            <h3 className="mt-4 font-bold text-ink">No polls yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-muted">
              Create your first poll to collect student preferences. Results
              will appear here as students vote.
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              <Plus size={17} />
              Create first poll
            </button>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {visiblePolls.map((poll) => {
              const status = getStatus(poll)
              const totalVotes = getVoteCount(poll)

              return (
                <article key={poll.id} className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-ink">
                          {poll.title}
                        </h3>
                        <StatusPill status={status} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-ink-soft">
                        {poll.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <Users size={14} />
                          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          Created {formatDate(poll.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 size={14} />
                          Closes {formatDate(poll.endsAt)}
                        </span>
                      </div>
                    </div>

                    {status === 'active' && poll.status === 'active' && (
                      <button
                        type="button"
                        disabled={busyPollId === poll.id}
                        onClick={() => handleClose(poll)}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-surface-border px-3 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-alt disabled:opacity-60"
                      >
                        {busyPollId === poll.id ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <CircleStop size={16} />
                        )}
                        Close poll
                      </button>
                    )}
                  </div>

                  <div className="mt-5 space-y-4">
                    {poll.options.map((option) => {
                      const percentage =
                        totalVotes > 0
                          ? Math.round((option.votes / totalVotes) * 100)
                          : 0

                      return (
                        <div key={option.id}>
                          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                            <span className="font-medium text-ink">
                              {option.label}
                            </span>
                            <span className="shrink-0 text-xs text-ink-muted">
                              {option.votes} {option.votes === 1 ? 'vote' : 'votes'} · {percentage}%
                            </span>
                          </div>

                          <div
                            className="h-2.5 overflow-hidden rounded-full bg-surface-alt"
                            role="progressbar"
                            aria-label={`${option.label} vote share`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={percentage}
                          >
                            <div
                              className="h-full rounded-full bg-brand-600 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {status === 'closed' && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-surface-alt p-3 text-sm text-ink-muted">
                      <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
                      Voting is closed. Review the results and use them when
                      preparing a suggestion for Admin.
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>

      {showForm && (
        <PollForm
          saving={saving}
          onClose={() => {
            if (!saving) setShowForm(false)
          }}
          onCreate={handleCreate}
        />
      )}
    </div>
  )
}
