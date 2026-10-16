import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../pages/auth/Login'
import NotFound from '../pages/shared/NotFound'
import DesignPreview from '../pages/shared/DesignPreview'
import { studentRoutes } from './studentRoutes'
import { adminRoutes } from './adminRoutes'
import { committeeRoutes } from './committeeRoutes'

function RootRedirect() {
  const { homePath } = useAuth()
  return <Navigate to={homePath} replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/design" element={<DesignPreview />} />
      {studentRoutes}
      {adminRoutes}
      {committeeRoutes}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
