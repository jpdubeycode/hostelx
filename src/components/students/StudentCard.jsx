import { User, MapPin, GraduationCap } from 'lucide-react'

export default function StudentCard({ student }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <User size={22} />
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900">
            {student.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {student.regNo}
          </p>
        </div>
      </div>

      {/* Student details */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <GraduationCap size={17} className="text-slate-400" />
          <span>
            {student.branch} • Year {student.year} • Semester {student.semester}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-600">
          <MapPin size={17} className="text-slate-400" />
          <span>
            {student.hostel} • Room {student.roomId}
          </span>
        </div>
      </div>

      {/* Committee badge */}
      {student.isCommittee && (
        <div className="mt-4">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            Mess Committee
          </span>
        </div>
      )}
    </div>
  )
}