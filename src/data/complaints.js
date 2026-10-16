
export const COMPLAINT_CATEGORIES = [
  'Electrical',
  'Plumbing',
  'Cleaning',
  'Furniture',
  'Internet',
  'Room',
  'Mess',
  'Other',
];

export const COMPLAINT_STATUSES = [
  'submitted',
  'assigned',
  'in_progress',
  'resolved',
];

export const COMPLAINT_PRIORITIES = ['low', 'medium', 'high'];

export const initialComplaints = [
  {
    id: 'CMP-1001',
    studentId: 2,
    category: 'Plumbing',
    title: 'Water leakage in bathroom',
    description:
      'There is continuous water leakage under the bathroom sink. The floor remains wet and slippery.',
    priority: 'high',
    status: 'submitted',
    assignedTo: '',
    location: 'Boys Hostel B, Room B-204',
    adminResponse: '',
    createdAt: '2026-10-15T09:30:00.000Z',
    updatedAt: '2026-10-15T09:30:00.000Z',
    timeline: [
      {
        status: 'submitted',
        at: '2026-10-15T09:30:00.000Z',
        by: 'Student',
        note: 'Complaint submitted.',
      },
    ],
  },
  {
    id: 'CMP-1002',
    studentId: 3,
    category: 'Electrical',
    title: 'Study room light not working',
    description:
      'The light in the shared study area has stopped working.',
    priority: 'medium',
    status: 'assigned',
    assignedTo: 'Maintenance Team',
    location: 'Boys Hostel B, Study Room',
    adminResponse: 'The maintenance team has been assigned.',
    createdAt: '2026-10-13T11:00:00.000Z',
    updatedAt: '2026-10-14T08:00:00.000Z',
    timeline: [
      {
        status: 'submitted',
        at: '2026-10-13T11:00:00.000Z',
        by: 'Student',
        note: 'Complaint submitted.',
      },
      {
        status: 'assigned',
        at: '2026-10-14T08:00:00.000Z',
        by: 'Admin',
        note: 'Assigned to Maintenance Team.',
      },
    ],
  },
];
