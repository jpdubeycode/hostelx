import {
  ArrowLeft,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
  Wallet,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import { useStudents } from '../../context/StudentsContext'

export default function StudentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getStudentById, students } = useStudents()

  const student = getStudentById(Number(id))

  if (!student) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/admin/search')}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          Back to Search
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            Student Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The student you are looking for does not exist.
          </p>
        </div>
      </div>
    )
  }

  const roommates = students.filter(
    (item) =>
      item.roomId === student.roomId &&
      item.hostel === student.hostel &&
      item.id !== student.id,
  )

  const guardian = student.guardian

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/search')}
        className="flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
      >
        <ArrowLeft size={18} />
        Back to Search
      </button>

      {/* Student Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <User size={30} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {student.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {student.regNo}
            </p>

            {student.isCommittee && (
              <span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                Mess Committee Member
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Academic Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Student academic details
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            icon={GraduationCap}
            label="Branch"
            value={student.branch}
          />

          <InfoCard
            icon={GraduationCap}
            label="Year"
            value={`Year ${student.year}`}
          />

          <InfoCard
            icon={GraduationCap}
            label="Semester"
            value={`Semester ${student.semester}`}
          />
        </div>
      </section>

      {/* Hostel Information */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Hostel Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Current hostel and room details
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={MapPin}
            label="Hostel"
            value={student.hostel}
          />

          <InfoCard
            icon={MapPin}
            label="Block"
            value={student.block}
          />

          <InfoCard
            icon={MapPin}
            label="Floor"
            value={`Floor ${student.floor}`}
          />

          <InfoCard
            icon={MapPin}
            label="Room"
            value={student.roomId}
          />
        </div>
      </section>

      {/* Contact Information */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Contact Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Private student contact details
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={Phone}
            label="Phone"
            value={student.phone || 'Not available'}
          />

          <InfoCard
            icon={Mail}
            label="Email"
            value={student.email || 'Not available'}
          />

          <InfoCard
            icon={User}
            label="Guardian"
            value={
              guardian
                ? `${guardian.name || 'Unknown'}${
                    guardian.relation
                      ? ` (${guardian.relation})`
                      : ''
                  }`
                : 'Not available'
            }
          />

          <InfoCard
            icon={Phone}
            label="Guardian Phone"
            value={guardian?.phone || 'Not available'}
          />
        </div>
      </section>

      {/* Fee Information */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Fee Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Student fee status
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            icon={Wallet}
            label="Fees"
            value={formatValue(student.fees)}
          />

          <InfoCard
            icon={User}
            label="Joined On"
            value={formatValue(student.joinedOn)}
          />

          <InfoCard
            icon={Users}
            label="Committee Status"
            value={
              student.isCommittee
                ? 'Committee Member'
                : 'Student'
            }
          />
        </div>
      </section>

      {/* Roommates */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Roommates
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Students currently staying in the same room
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {roommates.length === 0 ? (
            <p className="text-sm text-slate-500">
              No roommates found.
            </p>
          ) : (
            <div className="space-y-3">
              {roommates.map((roommate) => (
                <button
                  key={roommate.id}
                  onClick={() =>
                    navigate(`/admin/students/${roommate.id}`)
                  }
                  className="
                    flex w-full items-center gap-3
                    rounded-xl
                    border border-slate-100
                    bg-slate-50
                    p-3
                    text-left
                    transition
                    hover:border-blue-100
                    hover:bg-blue-50/40
                  "
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Users size={18} />
                  </div>

                  <div>
                    <p className="font-medium text-slate-900">
                      {roommate.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {roommate.branch} • {roommate.regNo}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-1 break-words font-semibold text-slate-900">
            {formatValue(value)}
          </p>
        </div>
      </div>
    </div>
  )
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return 'Not available'
  }

  if (typeof value === 'object') {
    return Object.values(value)
      .filter(
        (item) =>
          item !== null &&
          item !== undefined &&
          item !== '',
      )
      .join(' • ')
  }

  return String(value)
}