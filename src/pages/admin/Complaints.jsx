
import { useMemo, useState } from 'react';
import { Search, ClipboardList, Clock3, CheckCircle2, Users } from 'lucide-react';
import { Badge, Button, Card, EmptyState, Input, Select, StatCard } from '../../components/common';
import PageHeader from '../../components/layout/PageHeader';
import { students } from '../../data/students';
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } from '../../data/complaints';
import { useComplaints } from '../../context/ComplaintsContext';
import { useToast } from '../../context/ToastContext';

const statusLabels = {
  submitted: 'Submitted',
  assigned: 'Assigned',
  in_progress: 'In progress',
  resolved: 'Resolved',
};

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function Complaints() {
  const {
    complaints,
    updateStatus,
    assignComplaint,
    respondToComplaint,
  } = useComplaints();
  const toast = useToast();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [assignee, setAssignee] = useState('');
  const [response, setResponse] = useState('');
  const [busy, setBusy] = useState(false);

  const studentById = useMemo(
    () => new Map(students.map((student) => [String(student.id), student])),
    [],
  );

  const filteredComplaints = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const student = studentById.get(String(complaint.studentId));

      const matchesSearch =
        !searchTerm ||
        `${complaint.id} ${complaint.title} ${complaint.description} ${complaint.category} ${student?.name || ''} ${student?.regNo || ''}`
          .toLowerCase()
          .includes(searchTerm);

      const matchesStatus =
        statusFilter === 'all' || complaint.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'all' || complaint.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [complaints, query, statusFilter, categoryFilter, studentById]);

  const selectedComplaint = complaints.find(
    (complaint) => String(complaint.id) === String(selectedId),
  );

  const counts = {
    total: complaints.length,
    submitted: complaints.filter((item) => item.status === 'submitted').length,
    active: complaints.filter((item) => item.status === 'assigned' || item.status === 'in_progress').length,
    resolved: complaints.filter((item) => item.status === 'resolved').length,
  };

  const handleAssign = () => {
    if (!selectedComplaint) return;

    setBusy(true);
    try {
      assignComplaint(selectedComplaint.id, assignee, 'Admin');
      toast.success('Complaint assignment updated.');
      setAssignee('');
    } catch (error) {
      toast.error(error.message || 'Could not assign complaint.');
    } finally {
      setBusy(false);
    }
  };

  const handleStatus = (nextStatus) => {
    if (!selectedComplaint) return;

    setBusy(true);
    try {
      updateStatus(selectedComplaint.id, nextStatus, 'Admin');
      toast.success('Complaint status updated.');
    } catch (error) {
      toast.error(error.message || 'Could not update status.');
    } finally {
      setBusy(false);
    }
  };

  const handleResponse = () => {
    if (!selectedComplaint) return;

    setBusy(true);
    try {
      respondToComplaint(selectedComplaint.id, response, 'Admin');
      toast.success('Response saved for the student.');
      setResponse('');
    } catch (error) {
      toast.error(error.message || 'Could not save response.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Complaint Management"
        subtitle="Review student complaints, assign maintenance teams, and keep students updated."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total complaints" value={counts.total} icon={ClipboardList} />
        <StatCard label="Awaiting assignment" value={counts.submitted} icon={Clock3} tone="warning" />
        <StatCard label="Being handled" value={counts.active} icon={Users} tone="info" />
        <StatCard label="Resolved" value={counts.resolved} icon={CheckCircle2} tone="success" />
      </div>

      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input
            label="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Complaint, student or registration number"
            icon={Search}
          />
          <Select
            label="Status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            options={[
              { value: 'all', label: 'All statuses' },
              ...COMPLAINT_STATUSES.map((value) => ({
                value,
                label: statusLabels[value],
              })),
            ]}
          />
          <Select
            label="Category"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            options={[
              { value: 'all', label: 'All categories' },
              ...COMPLAINT_CATEGORIES,
            ]}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
        <div className="space-y-3">
          {filteredComplaints.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No complaints found"
              message="Try changing the search term or filters."
            />
          ) : (
            filteredComplaints.map((complaint) => {
              const student = studentById.get(String(complaint.studentId));
              const selected = String(selectedId) === String(complaint.id);

              return (
                <button
                  key={complaint.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(complaint.id);
                    setAssignee(complaint.assignedTo || '');
                    setResponse('');
                  }}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selected
                      ? 'border-brand-500 bg-brand-50/50 shadow-card'
                      : 'border-surface-border bg-surface hover:border-brand-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-ink-muted">
                      {complaint.id}
                    </span>
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
                  </div>

                  <h2 className="mt-3 font-semibold text-ink">{complaint.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
                    {complaint.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
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
                      {complaint.priority}
                    </Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-ink-muted">
                    <span>{student?.name || `Student ${complaint.studentId}`}</span>
                    <span>{formatDate(complaint.createdAt)}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <Card>
          {!selectedComplaint ? (
            <EmptyState
              icon={ClipboardList}
              title="Select a complaint"
              message="Choose a complaint from the list to view details and manage it."
            />
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-ink-muted">
                  {selectedComplaint.id}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-ink">
                  {selectedComplaint.title}
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink-soft">
                  {selectedComplaint.description}
                </p>
              </div>

              <div className="rounded-xl bg-surface-alt p-3 text-sm">
                {(() => {
                  const student = studentById.get(String(selectedComplaint.studentId));
                  return (
                    <>
                      <p className="font-medium text-ink">
                        {student?.name || `Student ${selectedComplaint.studentId}`}
                      </p>
                      <p className="mt-1 text-ink-muted">
                        Registration: {student?.regNo || 'Not available'}
                      </p>
                      <p className="text-ink-muted">
                        Room: {student?.roomId || 'Not available'}
                      </p>
                      <p className="text-ink-muted">
                        Location: {selectedComplaint.location || 'Not provided'}
                      </p>
                    </>
                  );
                })()}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-ink">
                  Assign to
                </label>
                <div className="flex gap-2">
                  <input
                    value={assignee}
                    onChange={(event) => setAssignee(event.target.value)}
                    placeholder="e.g. Plumbing Team"
                    className="min-w-0 flex-1 rounded-xl border border-surface-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-500"
                  />
                  <Button onClick={handleAssign} loading={busy} size="sm">
                    Assign
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-ink">
                  Update status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COMPLAINT_STATUSES.map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selectedComplaint.status === status ? 'primary' : 'secondary'}
                      disabled={busy || selectedComplaint.status === 'resolved'}
                      onClick={() => handleStatus(status)}
                    >
                      {statusLabels[status]}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-ink">
                  Response to student
                </label>
                <textarea
                  value={response}
                  onChange={(event) => setResponse(event.target.value)}
                  rows={3}
                  placeholder="Write an update or explain the action taken..."
                  className="w-full rounded-xl border border-surface-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-500"
                />
                <Button
                  onClick={handleResponse}
                  loading={busy}
                  fullWidth
                  variant="secondary"
                >
                  Save response
                </Button>
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-ink">Recent activity</h3>
                <div className="space-y-3">
                  {[...(selectedComplaint.timeline || [])]
                    .reverse()
                    .map((event, index) => (
                      <div key={`${event.at}-${index}`} className="border-l-2 border-surface-border pl-3">
                        <p className="text-sm font-medium text-ink">
                          {event.status.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-ink-muted">
                          {formatDate(event.at)} · {event.by}
                        </p>
                        {event.note && (
                          <p className="mt-1 text-sm text-ink-soft">{event.note}</p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
