import { useEffect, useState } from 'react'

/** useState that persists to localStorage. Keys are prefixed so "Reset demo" can clear everything. */
export const STORAGE_PREFIX = 'hostelx:'

export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value)) } catch { /* storage full/blocked */ }
  }, [key, value])
  return [value, setValue]
}

/** Wipe all HostelX data (used by the "Reset demo data" button). */
export const resetDemoData = () => {
  Object.keys(localStorage).filter((k) => k.startsWith(STORAGE_PREFIX)).forEach((k) => localStorage.removeItem(k))
  window.location.assign('/login')
}
