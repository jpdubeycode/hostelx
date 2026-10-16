
import { createContext, useContext, useCallback } from 'react'
import { rules as initialRules } from '../data/rules'
import useLocalStorage from '../hooks/useLocalStorage'

const RulesContext = createContext(null)

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `rule-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function RulesProvider({ children }) {
  const [rules, setRules] = useLocalStorage('rules', initialRules)

  const createRule = useCallback(
    async (ruleData) => {
      const title = ruleData.title?.trim()
      const description = ruleData.description?.trim()

      if (!title || !description) {
        throw new Error('Title and description are required.')
      }

      const now = new Date().toISOString()
      const status =
        ruleData.status === 'published' ? 'published' : 'draft'

      const newRule = {
        id: createId(),
        title,
        description,
        category: ruleData.category || 'General',
        severity: ruleData.severity || 'normal',
        status,
        createdAt: now,
        updatedAt: now,
        publishedAt: status === 'published' ? now : undefined,
      }

      setRules((current) => [newRule, ...current])

      return newRule
    },
    [setRules],
  )

  const updateRule = useCallback(
    async (id, updates) => {
      const existing = rules.find((rule) => rule.id === id)

      if (!existing) {
        throw new Error('Rule not found.')
      }

      const title = updates.title?.trim()
      const description = updates.description?.trim()

      if (!title || !description) {
        throw new Error('Title and description are required.')
      }

      const updatedRule = {
        ...existing,
        title,
        description,
        category: updates.category || existing.category,
        severity: updates.severity || existing.severity,
        updatedAt: new Date().toISOString(),
      }

      setRules((current) =>
        current.map((rule) =>
          rule.id === id ? updatedRule : rule,
        ),
      )

      return updatedRule
    },
    [rules, setRules],
  )

  const publishRule = useCallback(
    async (id) => {
      const existing = rules.find((rule) => rule.id === id)

      if (!existing) {
        throw new Error('Rule not found.')
      }

      const now = new Date().toISOString()

      setRules((current) =>
        current.map((rule) =>
          rule.id === id
            ? {
                ...rule,
                status: 'published',
                publishedAt: rule.publishedAt || now,
                updatedAt: now,
              }
            : rule,
        ),
      )
    },
    [rules, setRules],
  )

  const unpublishRule = useCallback(
    async (id) => {
      const exists = rules.some((rule) => rule.id === id)

      if (!exists) {
        throw new Error('Rule not found.')
      }

      setRules((current) =>
        current.map((rule) =>
          rule.id === id
            ? {
                ...rule,
                status: 'draft',
                updatedAt: new Date().toISOString(),
              }
            : rule,
        ),
      )
    },
    [rules, setRules],
  )

  const deleteRule = useCallback(
    async (id) => {
      const exists = rules.some((rule) => rule.id === id)

      if (!exists) {
        throw new Error('Rule not found.')
      }

      setRules((current) =>
        current.filter((rule) => rule.id !== id),
      )
    },
    [rules, setRules],
  )

  const value = {
    rules,
    createRule,
    updateRule,
    publishRule,
    unpublishRule,
    deleteRule,
  }

  return (
    <RulesContext.Provider value={value}>
      {children}
    </RulesContext.Provider>
  )
}

export function useRules() {
  const context = useContext(RulesContext)

  if (!context) {
    throw new Error(
      'useRules must be used within a RulesProvider.',
    )
  }

  return context
}

export default RulesContext
