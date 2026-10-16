import { Route } from 'react-router-dom'
import RoleGuard from './RoleGuard'
import StudentLayout from '../layouts/StudentLayout'
import Dashboard from '../pages/student/Dashboard'
import MyRoom from '../pages/student/MyRoom'
import Complaints from '../pages/student/Complaints'
import NewComplaint from '../pages/student/NewComplaint'
import ComplaintDetail from '../pages/student/ComplaintDetail'
import Mess from '../pages/student/Mess'
import Polls from '../pages/student/Polls'
import Suggestions from '../pages/student/Suggestions'
import Announcements from '../pages/shared/Announcements'
import Rules from '../pages/shared/Rules'
import Search from '../pages/shared/Search'

// Committee members are students too, so they may use these routes as well.
export const studentRoutes = (
  <Route element={<RoleGuard allow={['student', 'committee']}><StudentLayout /></RoleGuard>}>
    <Route path="/student" element={<Dashboard />} />
    <Route path="/student/room" element={<MyRoom />} />
    <Route path="/student/complaints" element={<Complaints />} />
    <Route path="/student/complaints/new" element={<NewComplaint />} />
    <Route path="/student/complaints/:id" element={<ComplaintDetail />} />
    <Route path="/student/mess" element={<Mess />} />
    <Route path="/student/polls" element={<Polls />} />
    <Route path="/student/suggestions" element={<Suggestions />} />
    <Route path="/student/announcements" element={<Announcements />} />
    <Route path="/student/rules" element={<Rules />} />
    <Route path="/student/search" element={<Search />} />
  </Route>
)
