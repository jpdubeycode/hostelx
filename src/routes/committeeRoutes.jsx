import { Route } from 'react-router-dom'
import RoleGuard from './RoleGuard'
import CommitteeLayout from '../layouts/CommitteeLayout'
import Dashboard from '../pages/committee/Dashboard'
import Polls from '../pages/committee/Polls'
import Suggestions from '../pages/committee/Suggestions'
import Decisions from '../pages/committee/Decisions'
import Mess from '../pages/committee/Mess'

export const committeeRoutes = (
  <Route element={<RoleGuard allow={['committee']}><CommitteeLayout /></RoleGuard>}>
    <Route path="/committee" element={<Dashboard />} />
    <Route path="/committee/polls" element={<Polls />} />
    <Route path="/committee/suggestions" element={<Suggestions />} />
    <Route path="/committee/decisions" element={<Decisions />} />
    <Route path="/committee/mess" element={<Mess />} />
  </Route>
)
