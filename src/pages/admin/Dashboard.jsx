import {
  BedDouble,
  Building2,
  ChevronRight,
  CircleAlert,
  CreditCard,
  Search,
  Users,
  UtensilsCrossed,
} from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useStudents } from '../../context/StudentsContext'
import { rooms } from '../../data/rooms'

export default function Dashboard() {
  const navigate = useNavigate()
  const { students, committeeMembers } = useStudents()

  /* -----------------------------
     Dashboard Statistics
  ----------------------------- */

  const totalStudents = students.length
  const totalRooms = rooms.length

  const totalCapacity = useMemo(() => {
    return rooms.reduce((total, room) => total + room.capacity, 0)
  }, [])

  const occupiedBeds = students.filter(
    (student) => student.roomId,
  ).length

  const vacantBeds = Math.max(totalCapacity - occupiedBeds, 0)

  const occupancyPercentage =
    totalCapacity > 0
      ? Math.round((occupiedBeds / totalCapacity) * 100)
      : 0

  const studentsWithPendingFees = students.filter(
    (student) =>
      student.fees?.hostel === 'Pending' ||
      student.fees?.mess === 'Pending',
  ).length

  /* -----------------------------
     Hostel Occupancy
  ----------------------------- */

  const hostelStats = useMemo(() => {
    const hostelMap = {}

    rooms.forEach((room) => {
      if (!hostelMap[room.hostel]) {
        hostelMap[room.hostel] = {
          hostel: room.hostel,
          rooms: 0,
          capacity: 0,
          occupied: 0,
        }
      }

      hostelMap[room.hostel].rooms += 1
      hostelMap[room.hostel].capacity += room.capacity
    })

    students.forEach((student) => {
      if (!student.hostel || !hostelMap[student.hostel]) {
        return
      }

      hostelMap[student.hostel].occupied += 1
    })

    return Object.values(hostelMap)
  }, [students])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Hostel overview and management statistics
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Students"
          value={totalStudents}
          description="Registered students"
          onClick={() => navigate('/admin/students')}
        />

        <StatCard
          icon={Building2}
          label="Total Rooms"
          value={totalRooms}
          description={`${totalCapacity} total beds`}
          onClick={() => navigate('/admin/rooms')}
        />

        <StatCard
          icon={BedDouble}
          label="Occupied Beds"
          value={`${occupiedBeds}/${totalCapacity}`}
          description={`${vacantBeds} beds available`}
        />

        <StatCard
          icon={CreditCard}
          label="Pending Fees"
          value={studentsWithPendingFees}
          description="Students with pending fees"
          onClick={() => navigate('/admin/students')}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Occupancy Overview */}
        <section className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Hostel Occupancy
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current room occupancy across hostels
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Building2 size={20} />
            </div>
          </div>

          {/* Overall Occupancy */}
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Overall Occupancy
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {occupancyPercentage}%
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">
                  {occupiedBeds} / {totalCapacity}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  beds occupied
                </p>
              </div>
            </div>

            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${Math.min(occupancyPercentage, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Hostel List */}
          <div className="mt-6 space-y-4">
            {hostelStats.map((hostel) => {
              const percentage =
                hostel.capacity > 0
                  ? Math.round(
                      (hostel.occupied / hostel.capacity) * 100,
                    )
                  : 0

              return (
                <div
                  key={hostel.hostel}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">
                        {hostel.hostel}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {hostel.rooms} rooms
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {hostel.occupied}/{hostel.capacity}
                      </p>

                      <p className="text-xs text-slate-500">
                        {percentage}% occupied
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Quick Overview */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Quick Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Important hostel information
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <OverviewItem
              icon={Users}
              label="Students"
              value={totalStudents}
              onClick={() => navigate('/admin/students')}
            />

            <OverviewItem
              icon={Building2}
              label="Rooms"
              value={totalRooms}
              onClick={() => navigate('/admin/rooms')}
            />

            <OverviewItem
              icon={BedDouble}
              label="Available Beds"
              value={vacantBeds}
              onClick={() => navigate('/admin/rooms')}
            />

            <OverviewItem
              icon={Users}
              label="Mess Committee"
              value={committeeMembers.length}
            />

            <OverviewItem
              icon={CreditCard}
              label="Pending Fees"
              value={studentsWithPendingFees}
              warning={studentsWithPendingFees > 0}
              onClick={() => navigate('/admin/students')}
            />
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Quickly access common admin tasks
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            icon={Users}
            title="Manage Students"
            description="View and manage student records"
            onClick={() => navigate('/admin/students')}
          />

          <QuickAction
            icon={Building2}
            title="Manage Rooms"
            description="View rooms and occupancy"
            onClick={() => navigate('/admin/rooms')}
          />

          <QuickAction
            icon={CircleAlert}
            title="Complaints"
            description="Review student complaints"
            onClick={() => navigate('/admin/complaints')}
          />

          <QuickAction
            icon={UtensilsCrossed}
            title="Mess Management"
            description="Manage hostel mess"
            onClick={() => navigate('/admin/mess')}
          />
        </div>
      </section>

      {/* Search Shortcut */}
      <button
        onClick={() => navigate('/admin/search')}
        className="
          flex w-full items-center justify-between
          rounded-2xl
          border border-blue-100
          bg-blue-50
          p-5
          text-left
          transition
          hover:border-blue-200
          hover:bg-blue-100/60
        "
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <Search size={20} />
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              Search Students
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Find students and view complete profiles
            </p>
          </div>
        </div>

        <ChevronRight
          size={20}
          className="text-blue-600"
        />
      </button>
    </div>
  )
}

/* --------------------------------
   Stat Card
-------------------------------- */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  onClick,
}) {
  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={`
        w-full rounded-2xl border border-slate-200
        bg-white p-5 text-left shadow-sm
        ${
          onClick
            ? 'transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md'
            : ''
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={21} />
        </div>
      </div>
    </Component>
  )
}

/* --------------------------------
   Overview Item
-------------------------------- */

function OverviewItem({
  icon: Icon,
  label,
  value,
  warning = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        flex w-full items-center justify-between
        rounded-xl border border-slate-100
        bg-slate-50 p-4 text-left
        ${
          onClick
            ? 'transition hover:border-blue-100 hover:bg-blue-50/40'
            : ''
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500">
          <Icon size={18} />
        </div>

        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>
      </div>

      <span
        className={`text-sm font-bold ${
          warning ? 'text-amber-600' : 'text-slate-900'
        }`}
      >
        {value}
      </span>
    </button>
  )
}

/* --------------------------------
   Quick Action
-------------------------------- */

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="
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
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={21} />
      </div>

      <h3 className="mt-4 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600">
        Open
        <ChevronRight size={16} />
      </div>
    </button>
  )
}