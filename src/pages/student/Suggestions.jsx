
import { useMemo, useState } from 'react'
import {
  MessageSquarePlus,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Lightbulb,
  MessageSquare,
  Search,
} from 'lucide-react'

import PageHeader from '../../components/layout/PageHeader'
import { Button, Card, EmptyState } from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { usePollsSuggestions } from '../../context/PollsSuggestionsContext'

const statusConfig = {
  pending: {
    label: 'Pending Review',
    icon: Clock,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  changes_requested: {
    label: 'Changes Requested',
    icon: RefreshCw,
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle2,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200',
  },
}

function getUserId(user) {
  return user?.studentId || user?.id || user?._id || user?.userId || null
}

function formatDate(date) {
  if (!date) return 'Date unavailable'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return 'Date unavailable'

  return parsedDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function Suggestions() {
  const { user } = useAuth()
  const toast = useToast()
  const { suggestions, createSuggestion, resubmitSuggestion } =
    usePollsSuggestions()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const userId = getUserId(user)

  // Only student-submitted suggestions belonging to this student.
  const mySuggestions = useMemo(() => {
    return suggestions
      .filter(
        (suggestion) =>
          suggestion.source === 'student' &&
          String(suggestion.submittedBy ?? '') === String(userId ?? ''),
      )
      .filter((suggestion) => {
        const query = search.trim().toLowerCase()
        const matchesSearch =
          !query ||
          `${suggestion.title} ${suggestion.description}`
            .toLowerCase()
            .includes(query)

        const matchesFilter =
          filter === 'all' || suggestion.status === filter

        return matchesSearch && matchesFilter
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      )
  }, [suggestions, userId, search, filter])

  const editingSuggestion = suggestions.find(
    (suggestion) =>
      suggestion.id === editingId &&
      suggestion.source === 'student' &&
      String(suggestion.submittedBy ?? '') === String(userId ?? ''),
  )

  const counts = useMemo(() => ({
    total: mySuggestions.length,
    pending: mySuggestions.filter((item) => item.status === 'pending').length,
    approved: mySuggestions.filter((item) => item.status === 'approved').length,
    changes: mySuggestions.filter(
      (item) => item.status === 'changes_requested',
    ).length,
  }), [mySuggestions])

  function resetForm() {
    setTitle('')
    setDescription('')
    setEditingId(null)
  }

  function handleEdit(suggestion) {
    if (suggestion.source !== 'student') return
    if (String(suggestion.submittedBy ?? '') !== String(userId ?? '')) return
    if (suggestion.status !== 'changes_requested') return

    setEditingId(suggestion.id)
    setTitle(suggestion.title || '')
    setDescription(suggestion.description || '')

    document
      .getElementById('student-suggestion-form')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!userId) {
      toast.error('Unable to identify your student account. Please sign in again.')
      return
    }

    if (!title.trim() || !description.trim()) {
      toast.error('Please enter both a title and a description.')
      return
    }

    if (editingId && !editingSuggestion) {
      toast.error('This suggestion cannot be edited from your account.')
      return
    }

    setSubmitting(true)

    try {
      if (editingId) {
        if (editingSuggestion.status !== 'changes_requested') {
          toast.error('Only suggestions requiring changes can be resubmitted.')
          return
        }

        await resubmitSuggestion(editingId, {
          title: title.trim(),
          description: description.trim(),
        })

        toast.success('Your updated suggestion has been resubmitted.')
      } else {
        await createSuggestion(
          {
            title: title.trim(),
            description: description.trim(),
          },
          userId,
          'student',
        )

        toast.success('Your suggestion has been submitted successfully.')
      }

      resetForm()
    } catch (error) {
      toast.error(error?.message || 'Could not submit your suggestion.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Suggestions"
        subtitle="Share ideas to improve hostel life and track your own submissions."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: 'My Submissions',
            value: counts.total,
            icon: MessageSquare,
            color: 'text-indigo-600 bg-indigo-50',
          },
          {
            label: 'Pending Review',
            value: counts.pending,
            icon: Clock,
            color: 'text-amber-600 bg-amber-50',
          },
          {
            label: 'Approved',
            value: counts.approved,
            icon: CheckCircle2,
            color: 'text-emerald-600 bg-emerald-50',
          },
          {
            label: 'Needs Changes',
            value: counts.changes,
            icon: RefreshCw,
            color: 'text-blue-600 bg-blue-50',
          },
        ].map((stat) => {
          const Icon = stat.icon

          return (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-ink-muted">{stat.label}</span>
                <span className={`rounded-xl p-2 ${stat.color}`}>
                  <Icon size={18} />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
            </Card>
          )
        })}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5 sm:p-6" id="student-suggestion-form">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-xl bg-brand-50 p-3 text-brand-600">
              <MessageSquarePlus size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">
                {editingId ? 'Revise your suggestion' : 'Share an idea'}
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Tell us what could be improved and why it matters.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="student-suggestion-title"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Suggestion title
              </label>
              <input
                id="student-suggestion-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={120}
                required
                placeholder="e.g. Improve drinking water facilities"
                className="w-full rounded-xl border border-surface-border bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <div>
              <label
                htmlFor="student-suggestion-description"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Description
              </label>
              <textarea
                id="student-suggestion-description"
                rows={5}
                maxLength={1500}
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Explain your idea and how it could help students..."
                className="w-full resize-y rounded-xl border border-surface-border bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <p className="mt-1 text-right text-xs text-ink-muted">
                {description.length}/1500 characters
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={submitting}>
                <Send size={16} className="mr-2" />
                {submitting
                  ? 'Submitting...'
                  : editingId
                    ? 'Resubmit Suggestion'
                    : 'Submit Suggestion'}
              </Button>

              {editingId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>

          <div className="mt-5 flex gap-3 rounded-xl bg-surface-alt p-4">
            <Lightbulb size={20} className="mt-0.5 shrink-0 text-amber-500" />
            <p className="text-sm leading-6 text-ink-muted">
              Your student suggestions are tracked separately from proposals
              created by the Mess Committee.
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">My Suggestions</h2>
              <p className="text-sm text-ink-muted">
                Only your own student submissions appear here.
              </p>
            </div>

            <div className="relative sm:w-52">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search suggestions"
                className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Changes Requested', value: 'changes_requested' },
              { label: 'Approved', value: 'approved' },
              { label: 'Rejected', value: 'rejected' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  filter === option.value
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-surface-border bg-white text-ink-muted hover:border-brand-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {mySuggestions.length === 0 ? (
            <Card className="p-6">
              <EmptyState
                title="No student suggestions found"
                description={
                  search || filter !== 'all'
                    ? 'Try another search or filter.'
                    : 'Submit your first suggestion and it will appear here.'
                }
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {mySuggestions.map((suggestion) => {
                const status =
                  statusConfig[suggestion.status] || statusConfig.pending
                const StatusIcon = status.icon

                return (
                  <Card key={suggestion.id} className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-semibold text-ink">
                          {suggestion.title}
                        </h3>
                        <p className="mt-1 text-xs text-ink-muted">
                          Submitted {formatDate(suggestion.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                      >
                        <StatusIcon size={14} />
                        {status.label}
                      </span>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-ink-soft">
                      {suggestion.description}
                    </p>

                    {suggestion.status === 'changes_requested' &&
                      suggestion.reviewNote && (
                        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3">
                          <p className="text-sm font-semibold text-blue-800">
                            Feedback
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-blue-700">
                            {suggestion.reviewNote}
                          </p>
                          <Button
                            type="button"
                            className="mt-3"
                            onClick={() => handleEdit(suggestion)}
                          >
                            <RefreshCw size={15} className="mr-2" />
                            Revise Suggestion
                          </Button>
                        </div>
                      )}

                    {suggestion.status === 'approved' && (
                      <p className="mt-3 text-sm text-emerald-700">
                        Your suggestion has been approved.
                      </p>
                    )}

                    {suggestion.status === 'rejected' && (
                      <p className="mt-3 text-sm text-red-700">
                        This suggestion was not approved.
                      </p>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
