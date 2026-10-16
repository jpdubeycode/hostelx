import { Search as SearchIcon, Users } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useStudents } from '../../context/StudentsContext'
import StudentCard from '../../components/students/StudentCard'

export default function Search() {
  const { students } = useStudents()
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
          Find students by name, registration number, branch, hostel or room.
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
          placeholder="Search students..."
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

      {/* Result count */}
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
            <StudentCard
              key={student.id}
              student={student}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Users
            size={40}
            className="mx-auto text-slate-300"
          />

          <h2 className="mt-4 font-semibold text-slate-900">
            No students found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Try searching with a different name, branch or room.
          </p>
        </div>
      )}
    </div>
  )
}