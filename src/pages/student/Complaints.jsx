
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  ClipboardList,
  Plus,
  Search,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Select,
  StatCard,
} from '../../components/common';
import PageHeader from '../../components/layout/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintsContext';

const statusLabels = {
  submitted: 'Submitted',
  assigned: 'Assigned',
  in_progress: 'In progress',
  resolved: 'Resolved',
};

export default function Complaints() {
  const { user } = useAuth();
  const { complaints } = useComplaints();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const studentId = user?.studentId ?? user?.id ?? user?._id;

  const myComplaints = useMemo(
    () =>
      complaints.filter(
        (complaint) =>
          String(complaint.studentId) === String(studentId),
      ),
    [complaints, studentId],
  );

  const filteredComplaints = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return myComplaints.filter((complaint) => {
      const matchesStatus =
        statusFilter === 'all' || complaint.status === statusFilter;

      const matchesQuery =
        !normalizedQuery ||
        `${complaint.id} ${complaint.title} ${complaint.category} ${complaint.description}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [myComplaints, query, statusFilter]);

  const counts = {
    total: myComplaints.length,
    active: myComplaints.filter((item) => item.status !== 'resolved').length,
    resolved: myComplaints.filter((item) => item.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Complaints"
        subtitle="Raise a concern, track its progress, and see updates from your hostel administration."
        action={
          <Button as={Link} to="/student/complaints/new" icon={Plus}>
            New complaint
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total complaints" value={counts.total} icon={ClipboardList} />
        <StatCard label="In progress" value={counts.active} icon={AlertCircle} tone="warning" />
        <StatCard label="Resolved" value={counts.resolved} icon={ClipboardList} tone="success" />
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          <Input
            label="Search complaints"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, ID or category"
            icon={Search}
          />
          <Select
            label="Status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'submitted', label: 'Submitted' },
              { value: 'assigned', label: 'Assigned' },
              { value: 'in_progress', label: 'In progress' },
              { value: 'resolved', label: 'Resolved' },
            ]}
          />
        </div>
      </Card>

      {filteredComplaints.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={myComplaints.length ? 'No matching complaints' : 'No complaints yet'}
          message={
            myComplaints.length
              ? 'Try changing your search or status filter.'
              : 'If something needs attention in your hostel, submit your first complaint here.'
          }
          action={
            <Button as={Link} to="/student/complaints/new" icon={Plus}>
              Raise a complaint
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id} hover>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-ink-muted">
                      {complaint.id}
                    </span>
                    <Badge tone="neutral">{complaint.category}</Badge>
                    <Badge
                      tone={
                        complaint.priority === 'high'
                          ? 'danger'
                          : complaint.priority === 'medium'
                            ? 'warning'
                            : 'neutral'
                      }
                    >
                      {complaint.priority} priority
                    </Badge>
                  </div>

                  <h2 className="font-semibold text-ink">{complaint.title}</h2>
                  <p className="line-clamp-2 text-sm text-ink-soft">
                    {complaint.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                    <span>
                      Filed {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                    {complaint.assignedTo && (
                      <span>Assigned to {complaint.assignedTo}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <Badge
                    tone={
                      complaint.status === 'resolved'
                        ? 'success'
                        : complaint.status === 'in_progress'
                          ? 'info'
                          : complaint.status === 'assigned'
                            ? 'warning'
                            : 'neutral'
                    }
                    dot
                  >
                    {statusLabels[complaint.status] || complaint.status}
                  </Badge>
                  <Button
                    as={Link}
                    to={`/student/complaints/${complaint.id}`}
                    variant="secondary"
                    size="sm"
                    icon={ArrowRight}
                  >
                    View details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
