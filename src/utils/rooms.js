// Room helpers. Occupancy is always derived from students, never stored twice.
export const getOccupants = (room, students) => students.filter((s) => s.roomId === room.id)

export function roomStatus(occupied, capacity) {
  if (occupied === 0) return 'empty'
  if (occupied >= capacity) return 'full'
  return 'partial'
}

/** Rooms enriched with occupants, occupied count and status. */
export const withOccupancy = (rooms, students) =>
  rooms.map((room) => {
    const occupants = getOccupants(room, students)
    return { ...room, occupants, occupied: occupants.length, status: roomStatus(occupants.length, room.capacity) }
  })
