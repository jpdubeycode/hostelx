import {
  LayoutDashboard, DoorOpen, Wrench, UtensilsCrossed, Vote, Lightbulb, Megaphone,
  BookOpen, Search, Users, ClipboardCheck, Gavel, GraduationCap,
} from 'lucide-react'

// Single source of truth for navigation. Sidebar, BottomNav and the temp shell just map over these.
// `primary: true` items show in the mobile bottom nav (keep to 4–5).
export const navConfig = {
  student: [
    { to: '/student', label: 'Home', icon: LayoutDashboard, end: true, primary: true },
    { to: '/student/room', label: 'My Room', icon: DoorOpen, primary: true },
    { to: '/student/complaints', label: 'Complaints', icon: Wrench, primary: true },
    { to: '/student/mess', label: 'Mess', icon: UtensilsCrossed, primary: true },
    { to: '/student/polls', label: 'Polls', icon: Vote },
    { to: '/student/suggestions', label: 'Suggestions', icon: Lightbulb },
    { to: '/student/announcements', label: 'Announcements', icon: Megaphone },
    { to: '/student/rules', label: 'Rules', icon: BookOpen },
    { to: '/student/search', label: 'Search', icon: Search },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true, primary: true },
    { to: '/admin/students', label: 'Students', icon: Users, primary: true },
    { to: '/admin/rooms', label: 'Rooms', icon: DoorOpen, primary: true },
    { to: '/admin/complaints', label: 'Complaints', icon: Wrench, primary: true },
    { to: '/admin/mess', label: 'Mess', icon: UtensilsCrossed },
    { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { to: '/admin/rules', label: 'Rules', icon: BookOpen },
    { to: '/admin/search', label: 'Search', icon: Search },
  ],
  committee: [
    { to: '/committee', label: 'Dashboard', icon: LayoutDashboard, end: true, primary: true },
    { to: '/committee/polls', label: 'Polls', icon: Vote, primary: true },
    { to: '/committee/suggestions', label: 'Suggestions', icon: ClipboardCheck, primary: true },
    { to: '/committee/decisions', label: 'Decisions', icon: Gavel, primary: true },
    { to: '/committee/mess', label: 'Mess', icon: UtensilsCrossed },
    // Committee members are students too:
    { to: '/student', label: 'Student view', icon: GraduationCap },
  ],
}

// Where the topbar's search box and bell should go for each role.
export const searchPathFor = (role) => (role === 'admin' ? '/admin/search' : '/student/search')
export const announcementsPathFor = (role) => (role === 'admin' ? '/admin/announcements' : '/student/announcements')
