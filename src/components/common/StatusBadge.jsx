import Badge from './Badge'

// One place that maps every domain status/priority to a label + colour.
const MAP = {
  // complaints
  submitted: ['neutral', 'Submitted'],
  assigned: ['info', 'Assigned'],
  in_progress: ['warning', 'In Progress'],
  resolved: ['success', 'Resolved'],
  // priority
  low: ['neutral', 'Low'],
  medium: ['warning', 'Medium'],
  high: ['danger', 'High'],
  // announcements
  emergency: ['danger', 'Emergency'],
  important: ['warning', 'Important'],
  normal: ['neutral', 'Normal'],
  // polls & decisions
  active: ['success', 'Active'],
  closed: ['neutral', 'Closed'],
  published: ['brand', 'Published'],
  // suggestions
  pending: ['warning', 'Pending'],
  approved: ['info', 'Approved'],
  rejected: ['danger', 'Rejected'],
  polled: ['brand', 'Poll Live'],
  decided: ['success', 'Decided'],
  // rooms
  full: ['danger', 'Full'],
  available: ['success', 'Available'],
  partial: ['warning', 'Partially filled'],
  empty: ['neutral', 'Empty'],
}

export default function StatusBadge({ status, className }) {
  const [tone, label] = MAP[status] ?? ['neutral', status]
  return <Badge tone={tone} dot className={className}>{label}</Badge>
}
