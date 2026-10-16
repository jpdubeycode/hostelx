import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Wrap a layout/page: <RoleGuard allow={['admin']}>…</RoleGuard>
 * - not logged in  → /login
 * - wrong role     → that user's own home
 */
export default function RoleGuard({ allow, children }) {
  const { role, homePath } = useAuth()
  const location = useLocation()

  if (!role) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!allow.includes(role)) return <Navigate to={homePath} replace />
  return children
}
