import { Navigate, useNavigate } from 'react-router-dom'
import { GraduationCap, ShieldCheck, Vote, RotateCcw, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { resetDemoData } from '../../hooks/useLocalStorage'
import { ROLE_HOME } from '../../utils/constants'
import Logo from '../../components/layout/Logo'

const ROLE_OPTIONS = [
  { role: 'student', title: 'Student', desc: 'Room, complaints, mess menu, polls and notices', icon: GraduationCap },
  { role: 'admin', title: 'Admin / Warden', desc: 'Students, rooms, complaints and hostel stats', icon: ShieldCheck },
  { role: 'committee', title: 'Mess Committee', desc: 'Polls, suggestions and mess decisions', icon: Vote },
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
    <div className="sidebar-bg relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 animate-float rounded-full bg-brand-500/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-96 w-96 animate-float rounded-full bg-aurora/30 blur-3xl [animation-delay:-4s]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center text-white">
          <Logo tone="dark" className="scale-125" />
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">Your hostel, <span className="bg-gradient-to-r from-brand-300 to-aurora bg-clip-text text-transparent">simplified.</span></h1>
          <p className="mt-2 text-sm text-white/60">Rooms, complaints, mess polls and notices in one place.</p>
        </div>

        <div className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
          <p className="mb-3 px-1 text-xs font-bold uppercase tracking-widest text-white/50">Continue as</p>
          <div className="space-y-2.5">
            {ROLE_OPTIONS.map(({ role, title, desc, icon: Icon }) => (
              <button key={role} onClick={() => choose(role)}
                className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-3.5 text-left text-white transition-all duration-200 hover:border-white/30 hover:bg-white/20">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow"><Icon className="h-6 w-6" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{title}</span>
                  <span className="block text-sm text-white/60">{desc}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 text-white/60">
          <p className="text-xs">Demo mode: no password needed.</p>
          <button onClick={resetDemoData} className="flex items-center gap-1.5 text-xs hover:text-white">
            <RotateCcw className="h-3 w-3" /> Reset demo data
          </button>
        </div>
      </div>
    </div>
  )
}
