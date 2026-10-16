// Role-based visibility. Use these instead of checking role strings in components.
export const ROLES = { STUDENT: 'student', ADMIN: 'admin', COMMITTEE: 'committee' }

export const canViewSensitive = (role) => role === ROLES.ADMIN

const PUBLIC_FIELDS = ['id', 'name', 'branch', 'year', 'semester', 'hostel', 'block', 'floor', 'roomId', 'isCommittee']

/** Returns the student object with sensitive fields removed unless the role may see them. */
export function visibleStudent(student, role) {
  if (!student || canViewSensitive(role)) return student
  return Object.fromEntries(PUBLIC_FIELDS.map((k) => [k, student[k]]))
}
