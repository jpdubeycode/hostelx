import {
  ArrowRight,
  BedDouble,
  Building2,
  GraduationCap,
  MapPin,
  Users,
  User,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { useRooms } from '../../context/RoomsContext'
import { useStudents } from '../../context/StudentsContext'

export default function MyRoom() {
  const navigate = useNavigate()

  const { user } = useAuth()
  const { students } = useStudents()
  const { getRoomById } = useRooms()

  const student = students.find(
    (item) => item.id === user?.studentId,
  )

  if (!student) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <User
          size={40}
          className="mx-auto text-slate-300"
        />

        <h1 className="mt-4 text-xl font-semibold text-slate-900">
          Student information not found
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          We could not find your student record.
        </p>
      </div>
    )
  }

  const room = getRoomById(student.roomId)

  const roommates = students.filter(
    (item) =>
      item.roomId === student.roomId &&
      item.id !== student.id,
  )

  if (!room) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Room
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Your current room and roommates
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Building2
            size={40}
            className="mx-auto text-slate-300"
          />

          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Room not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your room allocation could not be found.
          </p>
        </div>
      </div>
    )
  }

  const occupied = room.occupied
  const capacity = room.capacity
  const available = Math.max(capacity - occupied, 0)

  const occupancyPercentage =
    capacity > 0
      ? Math.round((occupied / capacity) * 100)
      : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          My Room
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Your current room allocation and roommates
        </p>
      </div>

      {/* Room Overview */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Room Identity */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Building2 size={30} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Current Room
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                {room.id}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {room.hostel}
              </p>
            </div>
          </div>

          {/* Occupancy */}
          <div className="min-w-[220px]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">
                Occupancy
              </span>

              <span className="text-sm font-semibold text-slate-900">
                {occupied}/{capacity}
              </span>
            </div>

            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${Math.min(
                    occupancyPercentage,
                    100,
                  )}%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs text-slate-500">
              {available > 0
                ? `${available} bed${available > 1 ? 's' : ''} available`
                : 'Room is full'}
            </p>
          </div>
        </div>

        {/* Room Details */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={Building2}
            label="Hostel"
            value={room.hostel}
          />

          <InfoCard
            icon={MapPin}
            label="Block"
            value={room.block}
          />

          <InfoCard
            icon={MapPin}
            label="Floor"
            value={`Floor ${room.floor}`}
          />

          <InfoCard
            icon={BedDouble}
            label="Room"
            value={room.id}
          />
        </div>
      </section>

      {/* My Information */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            My Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your basic academic information
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <User size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900">
                {student.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {student.regNo}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <GraduationCap
                size={18}
                className="text-slate-400"
              />

              <span>
                {student.branch} • Year {student.year} •
                Semester {student.semester}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Roommates */}
      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Roommates
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Students currently staying in your room
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600">
            <Users size={15} />
            {roommates.length + 1} occupants
          </div>
        </div>

        <div className="space-y-3">
          {/* Current Student */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {student.name?.charAt(0)}
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-slate-900">
                  {student.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {student.regNo}
                </p>
              </div>

              <span className="ml-auto rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                You
              </span>
            </div>
          </div>

          {/* Other Roommates */}
          {roommates.length > 0 ? (
            roommates.map((roommate) => (
              <button
                key={roommate.id}
                onClick={() =>
                  navigate(
                    `/student/search/${roommate.id}`,
                  )
                }
                className="
                  flex w-full items-center gap-4
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  p-4
                  text-left
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:border-blue-200
                  hover:shadow-md
                "
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                  {roommate.name?.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">
                    {roommate.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {roommate.branch} • {roommate.regNo}
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="shrink-0 text-slate-400"
                />
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <Users
                size={34}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-3 font-semibold text-slate-900">
                No roommates
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                You are currently the only student assigned
                to this room.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function InfoCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}