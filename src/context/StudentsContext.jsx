import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react'

import useLocalStorage from '../hooks/useLocalStorage'
import { students as initialStudents } from '../data/students'
import { rooms } from '../data/rooms'

const StudentsContext = createContext(null)

export function StudentsProvider({ children }) {
  const [students, setStudents] = useLocalStorage(
    'students',
    initialStudents,
  )

  const getStudentById = useCallback(
    (studentId) => {
      return students.find((student) => student.id === studentId) ?? null
    },
    [students],
  )

  const addStudent = useCallback(
    (student) => {
      if (!student?.id) {
        throw new Error('Student id is required.')
      }

      const exists = students.some(
        (existingStudent) => existingStudent.id === student.id,
      )

      if (exists) {
        throw new Error('A student with this id already exists.')
      }

      setStudents((current) => [...current, student])
    },
    [students, setStudents],
  )

  const updateStudent = useCallback(
    (studentId, updates) => {
      const exists = students.some(
        (student) => student.id === studentId,
      )

      if (!exists) {
        throw new Error('Student not found.')
      }

      setStudents((current) =>
        current.map((student) =>
          student.id === studentId
            ? {
                ...student,
                ...updates,
              }
            : student,
        ),
      )
    },
    [students, setStudents],
  )

  const moveStudent = useCallback(
    (studentId, roomId) => {
      const student = students.find(
        (item) => item.id === studentId,
      )

      if (!student) {
        throw new Error('Student not found.')
      }

      const targetRoom = rooms.find(
        (room) => room.id === roomId,
      )

      if (!targetRoom) {
        throw new Error('Target room not found.')
      }

      const occupiedCount = students.filter(
        (item) =>
          item.roomId === roomId &&
          item.id !== studentId,
      ).length

      if (occupiedCount >= targetRoom.capacity) {
        throw new Error('The selected room is already full.')
      }

      const updatedStudent = {
        ...student,
        roomId: targetRoom.id,
        hostel: targetRoom.hostel,
        block: targetRoom.block,
        floor: targetRoom.floor,
      }

      setStudents((current) =>
        current.map((item) =>
          item.id === studentId ? updatedStudent : item,
        ),
      )

      return updatedStudent
    },
    [students, setStudents],
  )

  const removeStudent = useCallback(
    (studentId) => {
      const exists = students.some(
        (student) => student.id === studentId,
      )

      if (!exists) {
        throw new Error('Student not found.')
      }

      setStudents((current) =>
        current.filter((student) => student.id !== studentId),
      )
    },
    [students, setStudents],
  )

  const resetStudents = useCallback(() => {
    setStudents(initialStudents)
  }, [setStudents])

  const committeeMembers = useMemo(
    () => students.filter((student) => student.isCommittee),
    [students],
  )

  const value = useMemo(
    () => ({
      students,
      committeeMembers,
      studentCount: students.length,
      getStudentById,
      addStudent,
      updateStudent,
      moveStudent,
      removeStudent,
      resetStudents,
    }),
    [
      students,
      committeeMembers,
      getStudentById,
      addStudent,
      updateStudent,
      moveStudent,
      removeStudent,
      resetStudents,
    ],
  )

  return (
    <StudentsContext.Provider value={value}>
      {children}
    </StudentsContext.Provider>
  )
}

export function useStudents() {
  const context = useContext(StudentsContext)

  if (!context) {
    throw new Error(
      'useStudents must be used inside <StudentsProvider>',
    )
  }

  return context
}