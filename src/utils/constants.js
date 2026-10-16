import { ROLES } from './permissions'

export const ROLE_HOME = {
  [ROLES.STUDENT]: '/student',
  [ROLES.ADMIN]: '/admin',
  [ROLES.COMMITTEE]: '/committee',
}

export const ROLE_LABEL = {
  [ROLES.STUDENT]: 'Student',
  [ROLES.ADMIN]: 'Admin / Warden',
  [ROLES.COMMITTEE]: 'Mess Committee',
}

// Demo identities (ids refer to data/students.js). Jai (id 1) is on the mess committee.
export const DEMO_STUDENT_ID = 1
export const DEMO_ADMIN_NAME = 'Dr. R. K. Sharma'
