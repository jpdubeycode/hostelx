import { Route } from 'react-router-dom'
import RoleGuard from './RoleGuard'
import AdminLayout from '../layouts/AdminLayout'
import Dashboard from '../pages/admin/Dashboard'
import Students from '../pages/admin/Students'
import StudentDetail from '../pages/admin/StudentDetail'
import Rooms from '../pages/admin/Rooms'
import Complaints from '../pages/admin/Complaints'
import Mess from '../pages/admin/Mess'
import Announcements from '../pages/admin/Announcements'
import Rules from '../pages/admin/Rules'
import Search from '../pages/shared/Search'

export const adminRoutes = (
  <Route element={<RoleGuard allow={['admin']}><AdminLayout /></RoleGuard>}>
    <Route path="/admin" element={<Dashboard />} />
    <Route path="/admin/students" element={<Students />} />
    <Route path="/admin/students/:id" element={<StudentDetail />} />
    <Route path="/admin/rooms" element={<Rooms />} />
    <Route path="/admin/complaints" element={<Complaints />} />
    <Route path="/admin/mess" element={<Mess />} />
    <Route path="/admin/announcements" element={<Announcements />} />
    <Route path="/admin/rules" element={<Rules />} />
    <Route path="/admin/search" element={<Search />} />
  </Route>
)
