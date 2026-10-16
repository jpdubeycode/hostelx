
import { createContext, useContext, useCallback } from 'react'
import { announcements as initialAnnouncements } from '../data/annoucements'
import useLocalStorage from '../hooks/useLocalStorage'

const AnnouncementsContext = createContext(null)

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `ann-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function AnnouncementsProvider({ children }) {
  const [announcements, setAnnouncements] = useLocalStorage(
    'announcements',
    initialAnnouncements,
  )

  const createAnnouncement = useCallback(
    async (announcementData) => {
      const now = new Date().toISOString()
      const status =
        announcementData.status === 'published' ? 'published' : 'draft'

      const newAnnouncement = {
        id: createId(),
        title: announcementData.title.trim(),
        body: announcementData.body.trim(),
        category: announcementData.category || 'General',
        priority: announcementData.priority || 'normal',
        createdAt: now,
        updatedAt: now,
        publishedAt: status === 'published' ? now : undefined,
        pinned: false,
        status,
      }

      setAnnouncements((current) => [newAnnouncement, ...current])

      return newAnnouncement
    },
    [setAnnouncements],
  )

  const updateAnnouncement = useCallback(
    async (id, updates) => {
      const existing = announcements.find(
        (announcement) => announcement.id === id,
      )

      if (!existing) {
        throw new Error('Announcement not found.')
      }

      const updatedAnnouncement = {
        ...existing,
        title: updates.title.trim(),
        body: updates.body.trim(),
        category: updates.category || existing.category,
        priority: updates.priority || existing.priority,
        updatedAt: new Date().toISOString(),
      }

      setAnnouncements((current) =>
        current.map((announcement) =>
          announcement.id === id ? updatedAnnouncement : announcement,
        ),
      )

      return updatedAnnouncement
    },
    [announcements, setAnnouncements],
  )

  const publishAnnouncement = useCallback(
    async (id) => {
      const existing = announcements.find(
        (announcement) => announcement.id === id,
      )

      if (!existing) {
        throw new Error('Announcement not found.')
      }

      const now = new Date().toISOString()

      setAnnouncements((current) =>
        current.map((announcement) =>
          announcement.id === id
            ? {
                ...announcement,
                status: 'published',
                publishedAt: announcement.publishedAt || now,
                updatedAt: now,
              }
            : announcement,
        ),
      )
    },
    [announcements, setAnnouncements],
  )

  const unpublishAnnouncement = useCallback(
    async (id) => {
      const exists = announcements.some(
        (announcement) => announcement.id === id,
      )

      if (!exists) {
        throw new Error('Announcement not found.')
      }

      setAnnouncements((current) =>
        current.map((announcement) =>
          announcement.id === id
            ? {
                ...announcement,
                status: 'draft',
                updatedAt: new Date().toISOString(),
              }
            : announcement,
        ),
      )
    },
    [announcements, setAnnouncements],
  )

  const togglePin = useCallback(
    async (id) => {
      const exists = announcements.some(
        (announcement) => announcement.id === id,
      )

      if (!exists) {
        throw new Error('Announcement not found.')
      }

      setAnnouncements((current) =>
        current.map((announcement) =>
          announcement.id === id
            ? { ...announcement, pinned: !announcement.pinned }
            : announcement,
        ),
      )
    },
    [announcements, setAnnouncements],
  )

  const deleteAnnouncement = useCallback(
    async (id) => {
      const exists = announcements.some(
        (announcement) => announcement.id === id,
      )

      if (!exists) {
        throw new Error('Announcement not found.')
      }

      setAnnouncements((current) =>
        current.filter((announcement) => announcement.id !== id),
      )
    },
    [announcements, setAnnouncements],
  )

  const value = {
    announcements,
    createAnnouncement,
    updateAnnouncement,
    publishAnnouncement,
    unpublishAnnouncement,
    togglePin,
    deleteAnnouncement,
  }

  return (
    <AnnouncementsContext.Provider value={value}>
      {children}
    </AnnouncementsContext.Provider>
  )
}

export function useAnnouncements() {
  const context = useContext(AnnouncementsContext)

  if (!context) {
    throw new Error(
      'useAnnouncements must be used within an AnnouncementsProvider.',
    )
  }

  return context
}

export default AnnouncementsContext
