
import { useMemo, useState } from 'react'
import {
  Vote,
  Clock3,
  Users,
  CheckCircle2,
  CalendarDays,
  BarChart3,
  CircleStop,
  LoaderCircle,
  AlertCircle,
  ClipboardList,
} from 'lucide-react'
import { usePollsSuggestions } from '../../context/PollsSuggestionsContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import PageHeader from '../../components/layout/PageHeader'

function getUserId(user) {
  return user?.studentId || user?.id || user?._id || user?.userId || null
}

function isExpired(poll) {
  return Boolean(
    poll.endsAt && new Date(poll.endsAt).getTime() <= Date.now(),
  )
}

function getStatus(poll) {
  return poll.status === 'closed' || isExpired(poll) ? 'closed' : 'active'
}

function getVoteCount(poll) {
  return (poll.options || []).reduce(
    (total, option) => total + (Number(option.votes) || 0),
    0,
  )
}

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

function StatusPill({ status }) {
  const active = status === 'active'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-slate-100 text-slate-700'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? 'bg-emerald-500' : 'bg-slate-400'
        }`}
      />
      {active ? 'Voting open' : 'Voting closed'}
    </span>
  )
}

function PollCard({ poll, userId, onVote, voting }) {
  const [selectedOption, setSelectedOption] = useState('')
  const [error, setError] = useState('')

  const status = getStatus(poll)
  const totalVotes = getVoteCount(poll)
  const previousVote = userId ? poll.votesByUser?.[userId] : null
  const hasVoted = Boolean(previousVote)
  const canVote = status === 'active' && !hasVoted && Boolean(userId)
  const showResults = status === 'closed' || hasVoted

  async function handleVote() {
    setError('')

    if (!userId) {
      setError('Your account could not be identified. Please sign in again.')
      return
    }

    if (!selectedOption) {
      setError('Please select an option before voting.')
      return
    }

    try {
      await onVote(poll.id, selectedOption, userId)
    } catch (err) {
      setError(err.message || 'Your vote could not be submitted.')
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill status={status} />

              {hasVoted && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  <CheckCircle2 size={13} />
                  Your vote recorded
                </span>
              )}
            </div>

            <h2 className="mt-3 text-lg font-bold text-ink sm:text-xl">
              {poll.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {poll.description}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-sm text-ink-muted">
            <Users size={16} />
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} />
            Created {formatDate(poll.createdAt)}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={14} />
            {status === 'closed' ? 'Closed' : 'Closes'}:{' '}
            {formatDate(poll.endsAt)}
          </span>
        </div>

        <div className="mt-5 border-t border-surface-border pt-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-ink">
              {showResults ? 'Poll results' : 'Choose your answer'}
            </h3>

            {showResults && (
              <span className="text-xs text-ink-muted">
                {totalVotes} total {totalVotes === 1 ? 'vote' : 'votes'}
              </span>
            )}
          </div>

          <div className="space-y-3">
            {(poll.options || []).map((option) => {
              const percentage =
                totalVotes > 0
                  ? Math.round((option.votes / totalVotes) * 100)
                  : 0

              const isSelected = selectedOption === option.id
              const isVotedOption = previousVote === option.id

              return (
                <div key={option.id}>
                  {showResults ? (
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm font-medium text-ink">
                        {isVotedOption && (
                          <CheckCircle2
                            size={16}
                            className="shrink-0 text-emerald-600"
                          />
                        )}

                        {option.label}

                        {isVotedOption && (
                          <span className="text-xs font-semibold text-emerald-700">
                            Your vote
                          </span>
                        )}
                      </span>

                      <span className="shrink-0 text-xs text-ink-muted">
                        {option.votes} · {percentage}%
                      </span>
                    </div>
                  ) : (
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-surface-border hover:border-brand-300 hover:bg-surface-alt'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`poll-${poll.id}`}
                        value={option.id}
                        checked={isSelected}
                        onChange={() => setSelectedOption(option.id)}
                        className="h-4 w-4 accent-brand-600"
                      />

                      <span className="text-sm font-medium text-ink">
                        {option.label}
                      </span>
                    </label>
                  )}

                  {showResults && (
                    <div
                      className="h-2 overflow-hidden rounded-full bg-surface-alt"
                      role="progressbar"
                      aria-label={`${option.label} vote share`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={percentage}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isVotedOption ? 'bg-emerald-500' : 'bg-brand-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {canVote && (
            <button
              type="button"
              disabled={!selectedOption || voting}
              onClick={handleVote}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {voting ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Vote size={17} />
              )}
              Submit vote
            </button>
          )}

          {!userId && status === 'active' && (
            <p className="mt-4 text-sm text-rose-700">
              Sign in again to participate in this poll.
            </p>
          )}

          {hasVoted && status === 'active' && (
            <p className="mt-4 flex items-start gap-2 text-sm text-emerald-700">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
              Your vote has been recorded. Results are now available.
            </p>
          )}

          {status === 'closed' && (
            <p className="mt-4 flex items-start gap-2 text-sm text-ink-muted">
              <CircleStop size={17} className="mt-0.5 shrink-0" />
              Voting has ended. You can review the final results.
            </p>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Polls() {
  const { polls = [], voteInPoll } = usePollsSuggestions()
  const { user } = useAuth()
  const toast = useToast()

  const userId = getUserId(user)

  const [filter, setFilter] = useState('all')
  const [votingPollId, setVotingPollId] = useState(null)

  const counts = useMemo(() => {
    return polls.reduce(
      (result, poll) => {
        const status = getStatus(poll)

        result.total += 1

        if (status === 'active') result.active += 1
        else result.closed += 1

        if (userId && poll.votesByUser?.[userId]) result.voted += 1

        return result
      },
      { total: 0, active: 0, closed: 0, voted: 0 },
    )
  }, [polls, userId])

  const visiblePolls = useMemo(() => {
    const filtered = polls.filter((poll) => {
      const status = getStatus(poll)

      if (filter === 'active') return status === 'active'
      if (filter === 'closed') return status === 'closed'

      if (filter === 'voted') {
        return Boolean(userId && poll.votesByUser?.[userId])
      }

      return true
    })

    return [...filtered].sort((a, b) => {
      const statusDifference =
        (getStatus(a) === 'closed' ? 1 : 0) -
        (getStatus(b) === 'closed' ? 1 : 0)

      if (statusDifference !== 0) return statusDifference

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })
  }, [polls, filter, userId])

  async function handleVote(pollId, optionId, voterId) {
    setVotingPollId(pollId)

    try {
      await voteInPoll(pollId, optionId, voterId)
      toast.success('Your vote has been recorded.')
    } catch (error) {
      toast.error(error.message || 'Unable to submit your vote.')
      throw error
    } finally {
      setVotingPollId(null)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Mess Polls"
        subtitle="Share your preferences and help improve hostel life."
      />

      <section className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white shadow-card sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <Vote size={25} />
          </div>

          <div>
            <p className="text-sm font-medium text-white/80">
              Your voice matters
            </p>

            <h2 className="mt-1 text-xl font-bold sm:text-2xl">
              Help shape your mess experience.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              Vote on active polls created by the Mess Committee. Your
              preferences can help the Committee prepare suggestions for Admin.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: 'Total polls', value: counts.total, icon: ClipboardList },
          { label: 'Voting open', value: counts.active, icon: Vote },
          { label: 'Voting closed', value: counts.closed, icon: CircleStop },
          { label: 'You participated', value: counts.voted, icon: CheckCircle2 },
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

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Available polls</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Vote once in each poll. Results appear after you vote or when the
              poll closes.
            </p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter polls"
            className="rounded-xl border border-surface-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500"
          >
            <option value="all">All polls</option>
            <option value="active">Voting open</option>
            <option value="closed">Voting closed</option>
            <option value="voted">Polls I voted in</option>
          </select>
        </div>

        {visiblePolls.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-surface-border bg-white px-5 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-ink-muted">
              <BarChart3 size={26} />
            </div>

            <h3 className="mt-4 font-bold text-ink">No polls to show</h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ink-muted">
              {filter === 'voted'
                ? "You haven't participated in any polls yet."
                : 'There are no polls matching this filter right now. Please check again later.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visiblePolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                userId={userId}
                voting={votingPollId === poll.id}
                onVote={handleVote}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
