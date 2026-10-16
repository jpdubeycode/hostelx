import { Search as SearchIcon, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useStudents } from '../../context/StudentsContext'

export default function Search() {
  const { students } = useStudents()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const filteredStudents = useMemo(() => {
    const search = query.trim().toLowerCase()

    if (!search) {
      return students
    }

    return students.filter((student) => {
      return (
        student.name.toLowerCase().includes(search) ||
        student.regNo.toLowerCase().includes(search) ||
        student.branch.toLowerCase().includes(search) ||
        student.hostel.toLowerCase().includes(search) ||
        student.roomId.toLowerCase().includes(search)
      )
    })
  }, [students, query])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Search Students
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Search and view complete student information.
        </p>
      </div>

      {/* Search Box */}
      <div className="relative max-w-2xl">
        <SearchIcon
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, registration number, branch, hostel or room..."
          className="
            w-full
            rounded-xl
            border border-slate-200
            bg-white
            py-3.5
            pl-12
            pr-4
            text-sm
            text-slate-900
            outline-none
            shadow-sm
            transition
            placeholder:text-slate-400
            focus:border-blue-400
            focus:ring-2
            focus:ring-blue-100
          "
        />
      </div>

      {/* Result Count */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Users size={17} />

        <span>
          {filteredStudents.length}{' '}
          {filteredStudents.length === 1 ? 'student' : 'students'} found
        </span>
      </div>

      {/* Students */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredStudents.map((student) => (
            <button
              key={student.id}
              onClick={() => navigate(`/admin/students/${student.id}`)}
              className="
                w-full
                rounded-2xl
                border border-slate-200
                bg-white
                p-5
                text-left
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:border-blue-200
                hover:shadow-md
              "
            >
              {/* Student Header */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Users size={22} />
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

              {/* Academic Information */}
              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-700">
                    Branch:
                  </span>{' '}
                  {student.branch}
                </p>

                <p>
                  <span className="font-medium text-slate-700">
                    Year:
                  </span>{' '}
                  {student.year}
                </p>

                <p>
                  <span className="font-medium text-slate-700">
                    Semester:
                  </span>{' '}
                  {student.semester}
                </p>

                <p>
                  <span className="font-medium text-slate-700">
                    Hostel:
                  </span>{' '}
                  {student.hostel}
                </p>

                <p>
                  <span className="font-medium text-slate-700">
                    Room:
                  </span>{' '}
                  {student.roomId}
                </p>
              </div>

              {/* Committee Badge */}
              {student.isCommittee && (
                <div className="mt-4">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    Mess Committee
                  </span>
                </div>
              )}

              {/* View Details */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <span className="text-sm font-medium text-blue-600">
                  View full details →
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Users
            size={40}
            className="mx-auto text-slate-300"
          />

          <h2 className="mt-4 font-semibold text-slate-900">
            No students found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Try searching with a different name, branch, hostel or room.
          </p>
        </div>
      )}
    </div>
  )
}