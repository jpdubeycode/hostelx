
import { createContext, useContext, useCallback } from 'react'
import { messMenu as initialMessMenu } from '../data/messMenu'
import useLocalStorage from '../hooks/useLocalStorage'

const MessContext = createContext(null)

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `menu-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const mealTypes = ['breakfast', 'lunch', 'dinner']

function validateMenu(menuData) {
  if (!menuData.day?.trim()) {
    throw new Error('Please select a day.')
  }

  if (!menuData.meals || typeof menuData.meals !== 'object') {
    throw new Error('Meal information is required.')
  }

  for (const mealType of mealTypes) {
    const meal = menuData.meals[mealType]

    if (!meal || !Array.isArray(meal.items)) {
      throw new Error(`Please provide items for ${mealType}.`)
    }

    if (meal.items.some((item) => typeof item !== 'string')) {
      throw new Error(`Invalid food item in ${mealType}.`)
    }

    if (!meal.items.some((item) => item.trim())) {
      throw new Error(`Please add at least one item for ${mealType}.`)
    }
  }
}

function normalizeMenu(menu) {
  // Keep existing published menus visible while migrating older data.
  if (menu.status === 'published') {
    return menu
  }

  if (['draft', 'pending', 'approved', 'rejected'].includes(menu.status)) {
    return menu
  }

  return { ...menu, status: 'draft' }
}

export function MessProvider({ children }) {
  const [storedMenus, setMessMenu] = useLocalStorage(
    'messMenu',
    initialMessMenu,
  )

  const messMenu = storedMenus.map(normalizeMenu)

  const createMenu = useCallback(
    async (menuData) => {
      validateMenu(menuData)

      const day = menuData.day.trim()
      const exists = storedMenus.some((menu) => menu.day === day)

      if (exists) {
        throw new Error(
          `A menu for ${day} already exists. Edit the existing menu instead.`,
        )
      }

      const now = new Date().toISOString()

      const newMenu = {
        id: createId(),
        day,
        meals: Object.fromEntries(
          mealTypes.map((mealType) => [
            mealType,
            {
              items: menuData.meals[mealType].items
                .map((item) => item.trim())
                .filter(Boolean),
              timings: menuData.meals[mealType].timings?.trim() || '',
            },
          ]),
        ),
        status: menuData.status === 'pending' ? 'pending' : 'draft',
        createdAt: now,
        updatedAt: now,
        submittedAt: menuData.status === 'pending' ? now : null,
        reviewedAt: null,
        reviewNote: '',
      }

      setMessMenu((current) => [newMenu, ...current])
      return newMenu
    },
    [storedMenus, setMessMenu],
  )

  const updateMenu = useCallback(
    async (id, updates) => {
      const existing = storedMenus.find((menu) => menu.id === id)

      if (!existing) {
        throw new Error('Menu not found.')
      }

      if (['pending', 'approved'].includes(existing.status)) {
        throw new Error(
          'This menu cannot be edited in its current status. Return it to draft first.',
        )
      }

      const updatedData = {
        ...existing,
        ...updates,
        meals: updates.meals
          ? { ...existing.meals, ...updates.meals }
          : existing.meals,
      }

      validateMenu(updatedData)

      const day = updatedData.day.trim()
      const duplicateDay = storedMenus.some(
        (menu) => menu.id !== id && menu.day === day,
      )

      if (duplicateDay) {
        throw new Error(`A menu for ${day} already exists.`)
      }

      const updatedMenu = {
        ...updatedData,
        day,
        meals: Object.fromEntries(
          mealTypes.map((mealType) => [
            mealType,
            {
              items: updatedData.meals[mealType].items
                .map((item) => item.trim())
                .filter(Boolean),
              timings: updatedData.meals[mealType].timings?.trim() || '',
            },
          ]),
        ),
        updatedAt: new Date().toISOString(),
      }

      setMessMenu((current) =>
        current.map((menu) => (menu.id === id ? updatedMenu : menu)),
      )

      return updatedMenu
    },
    [storedMenus, setMessMenu],
  )

  const submitForApproval = useCallback(
    async (id) => {
      const existing = storedMenus.find((menu) => menu.id === id)

      if (!existing) {
        throw new Error('Menu not found.')
      }

      if (!['draft', 'rejected'].includes(existing.status)) {
        throw new Error('Only drafts or returned menus can be submitted.')
      }

      validateMenu(existing)

      const now = new Date().toISOString()

      setMessMenu((current) =>
        current.map((menu) =>
          menu.id === id
            ? {
                ...menu,
                status: 'pending',
                submittedAt: now,
                reviewedAt: null,
                reviewNote: '',
                updatedAt: now,
              }
            : menu,
        ),
      )
    },
    [storedMenus, setMessMenu],
  )

  const approveMenu = useCallback(
    async (id) => {
      const existing = storedMenus.find((menu) => menu.id === id)

      if (!existing) {
        throw new Error('Menu not found.')
      }

      if (existing.status !== 'pending') {
        throw new Error('Only pending menus can be approved.')
      }

      const now = new Date().toISOString()

      setMessMenu((current) =>
        current.map((menu) =>
          menu.id === id
            ? {
                ...menu,
                status: 'published',
                reviewedAt: now,
                publishedAt: now,
                reviewNote: '',
                updatedAt: now,
              }
            : menu,
        ),
      )
    },
    [storedMenus, setMessMenu],
  )

  const requestChanges = useCallback(
    async (id, note) => {
      const existing = storedMenus.find((menu) => menu.id === id)

      if (!existing) {
        throw new Error('Menu not found.')
      }

      if (existing.status !== 'pending') {
        throw new Error('Only pending menus can be returned for changes.')
      }

      const reviewNote = note?.trim()

      if (!reviewNote) {
        throw new Error('Please provide a reason for requesting changes.')
      }

      const now = new Date().toISOString()

      setMessMenu((current) =>
        current.map((menu) =>
          menu.id === id
            ? {
                ...menu,
                status: 'rejected',
                reviewedAt: now,
                reviewNote,
                updatedAt: now,
              }
            : menu,
        ),
      )
    },
    [storedMenus, setMessMenu],
  )

  const unpublishMenu = useCallback(
    async (id) => {
      const existing = storedMenus.find((menu) => menu.id === id)

      if (!existing) {
        throw new Error('Menu not found.')
      }

      if (existing.status !== 'published') {
        throw new Error('Only published menus can be unpublished.')
      }

      setMessMenu((current) =>
        current.map((menu) =>
          menu.id === id
            ? {
                ...menu,
                status: 'draft',
                updatedAt: new Date().toISOString(),
              }
            : menu,
        ),
      )
    },
    [storedMenus, setMessMenu],
  )

  const deleteMenu = useCallback(
    async (id) => {
      const existing = storedMenus.find((menu) => menu.id === id)

      if (!existing) {
        throw new Error('Menu not found.')
      }

      if (existing.status === 'pending') {
        throw new Error(
          'A pending menu cannot be deleted. Withdraw or review it first.',
        )
      }

      setMessMenu((current) => current.filter((menu) => menu.id !== id))
    },
    [storedMenus, setMessMenu],
  )

  const value = {
    messMenu,
    createMenu,
    updateMenu,
    submitForApproval,
    approveMenu,
    requestChanges,
    unpublishMenu,
    deleteMenu,
  }

  return (
    <MessContext.Provider value={value}>
      {children}
    </MessContext.Provider>
  )
}

export function useMess() {
  const context = useContext(MessContext)

  if (!context) {
    throw new Error('useMess must be used within a MessProvider.')
  }

  return context
}

export default MessContext
