
import {
  createContext,
  useCallback,
  useContext,
} from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import {
  initialPolls,
  initialSuggestions,
} from '../data/pollsSuggestions'

const PollsSuggestionsContext = createContext(null)

const SUGGESTION_STATUSES = [
  'pending',
  'changes_requested',
  'approved',
  'rejected',
]

function createId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function requireText(value, message) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(message)
  }
}

function validatePoll(pollData) {
  requireText(pollData.title, 'Please enter a poll title.')
  requireText(pollData.description, 'Please enter a poll description.')

  if (!Array.isArray(pollData.options) || pollData.options.length < 2) {
    throw new Error('A poll must have at least two options.')
  }

  const options = pollData.options.map((option) =>
    typeof option === 'string' ? option.trim() : '',
  )

  if (options.some((option) => !option)) {
    throw new Error('Poll options cannot be empty.')
  }

  if (
    new Set(options.map((option) => option.toLowerCase())).size !==
    options.length
  ) {
    throw new Error('Poll options must be unique.')
  }

  if (pollData.endsAt) {
    const endDate = new Date(pollData.endsAt)

    if (Number.isNaN(endDate.getTime())) {
      throw new Error('Please provide a valid poll closing date.')
    }

    if (endDate.getTime() <= Date.now()) {
      throw new Error('The poll closing date must be in the future.')
    }
  }
}

function isPollExpired(poll) {
  return Boolean(
    poll.endsAt && new Date(poll.endsAt).getTime() <= Date.now(),
  )
}

export function PollsSuggestionsProvider({ children }) {
  const [polls, setPolls] = useLocalStorage('polls', initialPolls)
  const [suggestions, setSuggestions] = useLocalStorage(
    'suggestions',
    initialSuggestions,
  )

  const createPoll = useCallback(async (pollData, createdBy = null) => {
    validatePoll(pollData)

    const now = new Date().toISOString()

    const poll = {
      id: createId('poll'),
      title: pollData.title.trim(),
      description: pollData.description.trim(),
      options: pollData.options.map((label) => ({
        id: createId('option'),
        label: label.trim(),
        votes: 0,
      })),
      votesByUser: {},
      status: 'active',
      endsAt: pollData.endsAt || null,
      createdBy,
      createdAt: now,
      updatedAt: now,
    }

    setPolls((current) => [poll, ...current])
    return poll
  }, [setPolls])

  const voteInPoll = useCallback(async (pollId, optionId, userId) => {
    if (userId === null || userId === undefined || !String(userId).trim()) {
      throw new Error('You must be logged in to vote.')
    }

    const voterId = String(userId).trim()
    const poll = polls.find((item) => item.id === pollId)

    if (!poll) {
      throw new Error('Poll not found.')
    }

    if (poll.status !== 'active' || isPollExpired(poll)) {
      throw new Error('This poll is closed.')
    }

    if (poll.votesByUser?.[voterId]) {
      throw new Error('You have already voted in this poll.')
    }

    if (!poll.options.some((option) => option.id === optionId)) {
      throw new Error('Please select a valid poll option.')
    }

    const now = new Date().toISOString()

    setPolls((current) =>
      current.map((item) => {
        if (item.id !== pollId) return item
        if (item.votesByUser?.[voterId]) return item
        if (item.status !== 'active' || isPollExpired(item)) return item
        if (!item.options.some((option) => option.id === optionId)) return item

        return {
          ...item,
          options: item.options.map((option) =>
            option.id === optionId
              ? { ...option, votes: (Number(option.votes) || 0) + 1 }
              : option,
          ),
          votesByUser: {
            ...(item.votesByUser || {}),
            [voterId]: optionId,
          },
          updatedAt: now,
        }
      }),
    )
  }, [polls, setPolls])

  const closePoll = useCallback(async (pollId) => {
    const poll = polls.find((item) => item.id === pollId)

    if (!poll) {
      throw new Error('Poll not found.')
    }

    if (poll.status !== 'active') {
      throw new Error('This poll is already closed.')
    }

    setPolls((current) =>
      current.map((item) =>
        item.id === pollId
          ? {
              ...item,
              status: 'closed',
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    )
  }, [polls, setPolls])

  const createSuggestion = useCallback(async (
    suggestionData,
    submittedBy = null,
    source = 'committee',
  ) => {
    requireText(suggestionData.title, 'Please enter a suggestion title.')
    requireText(suggestionData.description, 'Please describe the suggestion.')

    if (!['student', 'committee'].includes(source)) {
      throw new Error('Invalid suggestion source.')
    }

    const now = new Date().toISOString()

    const suggestion = {
      id: createId('suggestion'),
      source,
      title: suggestionData.title.trim(),
      description: suggestionData.description.trim(),
      pollId: source === 'committee' ? suggestionData.pollId || null : null,
      status: 'pending',
      submittedBy,
      reviewNote: '',
      createdAt: now,
      updatedAt: now,
      reviewedAt: null,
    }

    setSuggestions((current) => [suggestion, ...current])
    return suggestion
  }, [setSuggestions])

  const reviewSuggestion = useCallback(async (
    suggestionId,
    decision,
    note = '',
  ) => {
    if (
      !SUGGESTION_STATUSES.includes(decision) ||
      decision === 'pending'
    ) {
      throw new Error('Invalid suggestion decision.')
    }

    const suggestion = suggestions.find(
      (item) => item.id === suggestionId,
    )

    if (!suggestion) {
      throw new Error('Suggestion not found.')
    }

    if (
      suggestion.status === 'approved' ||
      suggestion.status === 'rejected'
    ) {
      throw new Error('This suggestion has already received a final decision.')
    }

    if (decision === 'changes_requested' && !note.trim()) {
      throw new Error('Please explain what changes are required.')
    }

    const now = new Date().toISOString()

    setSuggestions((current) =>
      current.map((item) =>
        item.id === suggestionId
          ? {
              ...item,
              status: decision,
              reviewNote: note.trim(),
              reviewedAt: now,
              updatedAt: now,
            }
          : item,
      ),
    )
  }, [suggestions, setSuggestions])

  const resubmitSuggestion = useCallback(async (
    suggestionId,
    updates,
  ) => {
    const existing = suggestions.find(
      (item) => item.id === suggestionId,
    )

    if (!existing) {
      throw new Error('Suggestion not found.')
    }

    if (existing.status !== 'changes_requested') {
      throw new Error(
        'Only suggestions returned for changes can be resubmitted.',
      )
    }

    requireText(updates.title, 'Please enter a suggestion title.')
    requireText(updates.description, 'Please describe the suggestion.')

    setSuggestions((current) =>
      current.map((item) =>
        item.id === suggestionId
          ? {
              ...item,
              title: updates.title.trim(),
              description: updates.description.trim(),
              status: 'pending',
              reviewNote: '',
              reviewedAt: null,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    )
  }, [suggestions, setSuggestions])

  const value = {
    polls,
    suggestions,
    createPoll,
    voteInPoll,
    closePoll,
    createSuggestion,
    reviewSuggestion,
    resubmitSuggestion,
  }

  return (
    <PollsSuggestionsContext.Provider value={value}>
      {children}
    </PollsSuggestionsContext.Provider>
  )
}

export function usePollsSuggestions() {
  const context = useContext(PollsSuggestionsContext)

  if (!context) {
    throw new Error(
      'usePollsSuggestions must be used within a PollsSuggestionsProvider.',
    )
  }

  return context
}

export default PollsSuggestionsContext
