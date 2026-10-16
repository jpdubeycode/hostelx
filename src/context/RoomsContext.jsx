import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react'

import useLocalStorage from '../hooks/useLocalStorage'
import { rooms as initialRooms } from '../data/rooms'
import { withOccupancy } from '../utils/rooms'
import { useStudents } from './StudentsContext'

const RoomsContext = createContext(null)

export function RoomsProvider({ children }) {
  const [rooms, setRooms] = useLocalStorage(
    'rooms',
    initialRooms,
  )

  const { students, moveStudent } = useStudents()

  const roomsWithOccupancy = useMemo(
    () => withOccupancy(rooms, students),
    [rooms, students],
  )

  const getRoomById = useCallback(
    (roomId) => {
      return (
        roomsWithOccupancy.find((room) => room.id === roomId) ??
        null
      )
    },
    [roomsWithOccupancy],
  )

  const getAvailableRooms = useCallback(() => {
    return roomsWithOccupancy.filter(
      (room) => room.occupied < room.capacity,
    )
  }, [roomsWithOccupancy])

  const getRoomOccupants = useCallback(
    (roomId) => {
      const room = getRoomById(roomId)
      return room?.occupants ?? []
    },
    [getRoomById],
  )

  const allocateStudent = useCallback(
    (studentId, roomId) => {
      return moveStudent(studentId, roomId)
    },
    [moveStudent],
  )

  const updateRoom = useCallback(
    (roomId, updates) => {
      const exists = rooms.some(
        (room) => room.id === roomId,
      )

      if (!exists) {
        throw new Error('Room not found.')
      }

      setRooms((current) =>
        current.map((room) =>
          room.id === roomId
            ? {
                ...room,
                ...updates,
              }
            : room,
        ),
      )
    },
    [rooms, setRooms],
  )

  const addRoom = useCallback(
    (room) => {
      if (!room?.id) {
        throw new Error('Room id is required.')
      }

      const exists = rooms.some(
        (existingRoom) => existingRoom.id === room.id,
      )

      if (exists) {
        throw new Error('A room with this id already exists.')
      }

      setRooms((current) => [...current, room])
    },
    [rooms, setRooms],
  )

  const removeRoom = useCallback(
    (roomId) => {
      const room = getRoomById(roomId)

      if (!room) {
        throw new Error('Room not found.')
      }

      if (room.occupied > 0) {
        throw new Error(
          'Cannot remove a room that has students assigned to it.',
        )
      }

      setRooms((current) =>
        current.filter((item) => item.id !== roomId),
      )
    },
    [getRoomById, setRooms],
  )

  const resetRooms = useCallback(() => {
    setRooms(initialRooms)
  }, [setRooms])

  const roomStats = useMemo(() => {
    const totalRooms = roomsWithOccupancy.length

    const occupiedRooms = roomsWithOccupancy.filter(
      (room) => room.occupied > 0,
    ).length

    const fullRooms = roomsWithOccupancy.filter(
      (room) => room.occupied >= room.capacity,
    ).length

    const partialRooms = roomsWithOccupancy.filter(
      (room) =>
        room.occupied > 0 &&
        room.occupied < room.capacity,
    ).length

    const emptyRooms = roomsWithOccupancy.filter(
      (room) => room.occupied === 0,
    ).length

    const totalCapacity = roomsWithOccupancy.reduce(
      (total, room) => total + room.capacity,
      0,
    )

    const occupiedBeds = roomsWithOccupancy.reduce(
      (total, room) => total + room.occupied,
      0,
    )

    return {
      totalRooms,
      occupiedRooms,
      fullRooms,
      partialRooms,
      emptyRooms,
      totalCapacity,
      occupiedBeds,
      availableBeds: totalCapacity - occupiedBeds,
    }
  }, [roomsWithOccupancy])

  const value = useMemo(
    () => ({
      rooms,
      roomsWithOccupancy,
      roomStats,
      getRoomById,
      getAvailableRooms,
      getRoomOccupants,
      allocateStudent,
      updateRoom,
      addRoom,
      removeRoom,
      resetRooms,
    }),
    [
      rooms,
      roomsWithOccupancy,
      roomStats,
      getRoomById,
      getAvailableRooms,
      getRoomOccupants,
      allocateStudent,
      updateRoom,
      addRoom,
      removeRoom,
      resetRooms,
    ],
  )

  return (
    <RoomsContext.Provider value={value}>
      {children}
    </RoomsContext.Provider>
  )
}

export function useRooms() {
  const context = useContext(RoomsContext)

  if (!context) {
    throw new Error(
      'useRooms must be used inside <RoomsProvider>',
    )
  }

  return context
}