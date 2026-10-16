import {
  GraduationCap,
  MapPin,
  Search,
  User,
  Users,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useStudents } from '../../context/StudentsContext'

export default function Students() {
  const navigate = useNavigate()
  const { students } = useStudents()

  const [query, setQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('all')
  const [hostelFilter, setHostelFilter] = useState('all')

  /* -----------------------------
     Filter Options
  ----------------------------- */

  const branches = useMemo(() => {
    return [...new Set(students.map((student) => student.branch))]
      .filter(Boolean)
      .sort()
  }, [students])

  const hostels = useMemo(() => {
    return [...new Set(students.map((student) => student.hostel))]
      .filter(Boolean)
      .sort()
  }, [students])

  /* -----------------------------
     Filter Students
  ----------------------------- */

  const filteredStudents = useMemo(() => {
    const search = query.trim().toLowerCase()

    return students.filter((student) => {
      const matchesSearch =
        !search ||
        student.name?.toLowerCase().includes(search) ||
        student.regNo?.toLowerCase().includes(search) ||
        student.branch?.toLowerCase().includes(search) ||
        student.hostel?.toLowerCase().includes(search) ||
        student.roomId?.toLowerCase().includes(search)

      const matchesBranch =
        branchFilter === 'all' ||
        student.branch === branchFilter

      const matchesHostel =
        hostelFilter === 'all' ||
        student.hostel === hostelFilter

      return matchesSearch && matchesBranch && matchesHostel
    })
  }, [students, query, branchFilter, hostelFilter])

  const committeeCount = students.filter(
    (student) => student.isCommittee,
  ).length

  const clearFilters = () => {
    setQuery('')
    setBranchFilter('all')
    setHostelFilter('all')
  }

  const hasFilters =
    query.trim() ||
    branchFilter !== 'all' ||
    hostelFilter !== 'all'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Students
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Browse and manage all students
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          icon={Users}
          label="Total Students"
          value={students.length}
        />

        <SummaryCard
          icon={GraduationCap}
          label="Filtered Students"
          value={filteredStudents.length}
        />

        <SummaryCard
          icon={User}
          label="Mess Committee"
          value={committeeCount}
        />
      </div>

      {/* Search & Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_220px_220px]">
          {/* Search */}
          <div className="relative">
            <Search
              size={19}
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
                pl-11
                pr-4
                text-sm
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-blue-400
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="
              rounded-xl
              border border-slate-200
              bg-white
              px-4
              py-3.5
              text-sm
              text-slate-700
              outline-none
              focus:border-blue-400
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="all">All Branches</option>

            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>

          {/* Hostel Filter */}
          <select
            value={hostelFilter}
            onChange={(e) => setHostelFilter(e.target.value)}
            className="
              rounded-xl
              border border-slate-200
              bg-white
              px-4
              py-3.5
              text-sm
              text-slate-700
              outline-none
              focus:border-blue-400
              focus:ring-2
              focus:ring-blue-100
            "
          >
            <option value="all">All Hostels</option>

            {hostels.map((hostel) => (
              <option key={hostel} value={hostel}>
                {hostel}
              </option>
            ))}
          </select>
        </div>

        {/* Result Info */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-700">
              {filteredStudents.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-700">
              {students.length}
            </span>{' '}
            students
          </p>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
            >
              <X size={16} />
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Student List */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onView={() =>
                navigate(`/admin/students/${student.id}`)
              }
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Users size={26} />
          </div>

          <h2 className="mt-4 font-semibold text-slate-900">
            No students found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or filters.
          </p>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* --------------------------------
   Summary Card
-------------------------------- */

function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={21} />
        </div>
      </div>
    </div>
  )
}

/* --------------------------------
   Student Card
-------------------------------- */

function StudentCard({ student, onView }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      {/* Student Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <User size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-slate-900">
            {student.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {student.regNo}
          </p>
        </div>
      </div>

      {/* Academic */}
      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <GraduationCap
            size={17}
            className="shrink-0 text-slate-400"
          />

          <span>
            {student.branch} • Year {student.year} • Semester{' '}
            {student.semester}
          </span>
        </div>

        {/* Hostel */}
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <MapPin
            size={17}
            className="shrink-0 text-slate-400"
          />

          <span>
            {student.hostel} • Room {student.roomId}
          </span>
        </div>
      </div>

      {/* Committee Badge */}
      {student.isCommittee && (
        <div className="mt-4">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            Mess Committee
          </span>
        </div>
      )}

      {/* View Button */}
      <button
        onClick={onView}
        className="
          mt-5
          w-full
          rounded-xl
          bg-blue-600
          px-4
          py-2.5
          text-sm
          font-medium
          text-white
          transition
          hover:bg-blue-700
        "
      >
        View Profile
      </button>
    </div>
  )
}