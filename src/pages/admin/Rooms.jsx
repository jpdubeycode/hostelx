import {
  BedDouble,
  Building2,
  CheckCircle2,
  Search,
  Users,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { useRooms } from '../../context/RoomsContext'

export default function Rooms() {
  const {
    roomsWithOccupancy,
    roomStats,
  } = useRooms()

  const [query, setQuery] = useState('')
  const [hostelFilter, setHostelFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  /* -----------------------------
     Hostel Options
  ----------------------------- */

  const hostels = useMemo(() => {
    return [...new Set(
      roomsWithOccupancy.map((room) => room.hostel),
    )]
      .filter(Boolean)
      .sort()
  }, [roomsWithOccupancy])

  /* -----------------------------
     Filter Rooms
  ----------------------------- */

  const filteredRooms = useMemo(() => {
    const search = query.trim().toLowerCase()

    return roomsWithOccupancy.filter((room) => {
      const matchesSearch =
        !search ||
        room.id?.toLowerCase().includes(search) ||
        room.hostel?.toLowerCase().includes(search) ||
        room.block?.toLowerCase().includes(search) ||
        String(room.floor).includes(search)

      const status =
        room.occupied >= room.capacity
          ? 'Full'
          : room.occupied > 0
            ? 'Partially Occupied'
            : 'Available'

      const matchesHostel =
        hostelFilter === 'all' ||
        room.hostel === hostelFilter

      const matchesStatus =
        statusFilter === 'all' ||
        status === statusFilter

      return (
        matchesSearch &&
        matchesHostel &&
        matchesStatus
      )
    })
  }, [
    roomsWithOccupancy,
    query,
    hostelFilter,
    statusFilter,
  ])

  const clearFilters = () => {
    setQuery('')
    setHostelFilter('all')
    setStatusFilter('all')
  }

  const hasFilters =
    query.trim() ||
    hostelFilter !== 'all' ||
    statusFilter !== 'all'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Rooms
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Monitor room occupancy and student allocation
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Building2}
          label="Total Rooms"
          value={roomStats.totalRooms}
          description="Available hostel rooms"
        />

        <StatCard
          icon={BedDouble}
          label="Total Capacity"
          value={roomStats.totalCapacity}
          description="Total beds"
        />

        <StatCard
          icon={Users}
          label="Occupied Beds"
          value={roomStats.occupiedBeds}
          description="Currently occupied"
        />

        <StatCard
          icon={CheckCircle2}
          label="Available Beds"
          value={roomStats.availableBeds}
          description={`${roomStats.fullRooms} rooms are full`}
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
              placeholder="Search room, hostel, block..."
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

          {/* Hostel */}
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

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="Partially Occupied">
              Partially Occupied
            </option>
            <option value="Full">Full</option>
          </select>
        </div>

        {/* Result Count */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-700">
              {filteredRooms.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-700">
              {roomsWithOccupancy.length}
            </span>{' '}
            rooms
          </p>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <X size={16} />
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Rooms */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Building2 size={26} />
          </div>

          <h2 className="mt-4 font-semibold text-slate-900">
            No rooms found
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
   Statistics Card
-------------------------------- */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
    </div>
  )
}

/* --------------------------------
   Room Card
-------------------------------- */

function RoomCard({ room }) {
  const status =
    room.occupied >= room.capacity
      ? 'Full'
      : room.occupied > 0
        ? 'Partially Occupied'
        : 'Available'

  const percentage =
    room.capacity > 0
      ? Math.round(
          (room.occupied / room.capacity) * 100,
        )
      : 0

  const statusClasses = {
    Full: 'bg-red-50 text-red-600',
    'Partially Occupied':
      'bg-amber-50 text-amber-600',
    Available:
      'bg-green-50 text-green-600',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Building2 size={21} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Room {room.id}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {room.hostel}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusClasses[status]
          }`}
        >
          {status}
        </span>
      </div>

      {/* Location */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <InfoItem
          label="Block"
          value={room.block}
        />

        <InfoItem
          label="Floor"
          value={room.floor}
        />
      </div>

      {/* Occupancy */}
      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Occupancy
            </p>

            <p className="mt-1 text-lg font-bold text-slate-900">
              {room.occupied}/{room.capacity}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-slate-700">
              {percentage}%
            </p>

            <p className="text-xs text-slate-500">
              occupied
            </p>
          </div>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${Math.min(percentage, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Available Beds */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <BedDouble size={17} />
          Available beds
        </div>

        <span className="font-semibold text-slate-900">
          {room.capacity - room.occupied}
        </span>
      </div>

      {/* Occupants */}
      {room.occupants?.length > 0 && (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-xs font-medium text-slate-500">
            Current occupants
          </p>

          <div className="mt-2 space-y-2">
            {room.occupants.slice(0, 3).map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-xs font-medium text-blue-600">
                  {student.name?.charAt(0)}
                </div>

                <span className="truncate">
                  {student.name}
                </span>
              </div>
            ))}

            {room.occupants.length > 3 && (
              <p className="text-xs text-slate-400">
                +{room.occupants.length - 3} more
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* --------------------------------
   Info Item
-------------------------------- */

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  )
}