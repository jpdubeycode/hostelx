import { createContext, useCallback, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { students } from '../data/students'
import { ROLES } from '../utils/permissions'
import { DEMO_ADMIN_NAME, DEMO_STUDENT_ID, ROLE_HOME } from '../utils/constants'

const AuthContext = createContext(null)

/** Mock auth only: picking a role "logs you in". Persisted so refresh keeps you signed in. */
export function AuthProvider({ children }) {
  const [session, setSession] = useLocalStorage('session', null)

  const login = useCallback((role) => {
    if (role === ROLES.ADMIN) {
      setSession({ role, name: DEMO_ADMIN_NAME, studentId: null })
    } else {
      const me = students.find((s) => s.id === DEMO_STUDENT_ID)
      setSession({ role, name: me.name, studentId: me.id })
    }
  }, [setSession])

  const logout = useCallback(() => setSession(null), [setSession])

  const value = useMemo(() => ({
    user: session,
    role: session?.role ?? null,
    isAuthenticated: !!session,
    homePath: session ? ROLE_HOME[session.role] : '/login',
    login,
    logout,
  }), [session, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
