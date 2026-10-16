import { Navigate, useNavigate } from 'react-router-dom'
import { GraduationCap, ShieldCheck, Vote, RotateCcw } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { resetDemoData } from '../../hooks/useLocalStorage'
import { ROLE_HOME } from '../../utils/constants'
import { cn } from '../../utils/cn'

const ROLE_OPTIONS = [
  { role: 'student', title: 'Student', desc: 'Room, complaints, mess menu, polls and notices', icon: GraduationCap, tint: 'bg-brand-50 text-brand-600' },
  { role: 'admin', title: 'Admin / Warden', desc: 'Students, rooms, complaints and hostel stats', icon: ShieldCheck, tint: 'bg-emerald-50 text-emerald-600' },
  { role: 'committee', title: 'Mess Committee', desc: 'Polls, suggestions and mess decisions', icon: Vote, tint: 'bg-amber-50 text-amber-600' },
]

export default function Login() {
  const { isAuthenticated, homePath, login } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) return <Navigate to={homePath} replace />

  const choose = (role) => {
    login(role)
    navigate(ROLE_HOME[role], { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-sky-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-extrabold text-white shadow-glow">X</div>
          <h1 className="text-3xl font-extrabold tracking-tight">Hostel<span className="text-brand-600">X</span></h1>
          <p className="mt-1 text-sm text-ink-soft">Smart Hostel Management System</p>
        </div>

        <p className="mb-3 text-sm font-medium text-ink-soft">Continue as</p>
        <div className="space-y-3">
          {ROLE_OPTIONS.map(({ role, title, desc, icon: Icon, tint }) => (
            <button key={role} onClick={() => choose(role)}
              className="flex w-full items-center gap-4 rounded-2xl border border-surface-border bg-white p-4 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift">
              <span className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl', tint)}><Icon className="h-6 w-6" /></span>
              <span className="min-w-0">
                <span className="block font-semibold">{title}</span>
                <span className="block text-sm text-ink-soft">{desc}</span>
              </span>
            </button>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted">Demo mode: no password needed.</p>
        <button onClick={resetDemoData} className="mx-auto mt-2 flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink">
          <RotateCcw className="h-3 w-3" /> Reset demo data
        </button>
      </div>
    </div>
  )
}
