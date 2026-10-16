
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Clock3 } from 'lucide-react';
import { Badge, Button, Card, EmptyState } from '../../components/common';
import PageHeader from '../../components/layout/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintsContext';

const steps = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'resolved', label: 'Resolved' },
];

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function ComplaintDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { complaints } = useComplaints();

  const studentId = user?.studentId ?? user?.id ?? user?._id;

  const complaint = complaints.find(
    (item) =>
      String(item.id) === String(id) &&
      String(item.studentId) === String(studentId),
  );

  if (!complaint) {
    return (
      <EmptyState
        title="Complaint not found"
        message="This complaint may not exist or may not belong to your account."
        action={
          <Button as={Link} to="/student/complaints" variant="secondary">
            Back to complaints
          </Button>
        }
      />
    );
  }

  const currentStep = steps.findIndex(
    (step) => step.key === complaint.status,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Complaint Details"
        subtitle={`${complaint.id} · Filed ${formatDate(complaint.createdAt)}`}
        action={
          <Button
            as={Link}
            to="/student/complaints"
            variant="secondary"
            icon={ArrowLeft}
          >
            Back
          </Button>
        }
      />

      <Card>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
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
            <Badge tone={complaint.status === 'resolved' ? 'success' : 'info'} dot>
              {complaint.status.replace('_', ' ')}
            </Badge>
          </div>

          <h2 className="text-xl font-semibold text-ink">{complaint.title}</h2>
          <p className="whitespace-pre-wrap text-sm leading-6 text-ink-soft">
            {complaint.description}
          </p>

          {complaint.location && (
            <p className="text-sm text-ink-muted">
              <span className="font-medium text-ink">Location:</span>{' '}
              {complaint.location}
            </p>
          )}

          {complaint.assignedTo && (
            <p className="text-sm text-ink-muted">
              <span className="font-medium text-ink">Assigned to:</span>{' '}
              {complaint.assignedTo}
            </p>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="mb-5 font-semibold text-ink">Complaint progress</h2>

        <div className="space-y-5">
          {steps.map((step, index) => {
            const completed = currentStep >= index;
            const events = (complaint.timeline || []).filter(
              (event) => event.status === step.key,
            );

            return (
              <div key={step.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  {completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-ink-muted" />
                  )}
                  {index < steps.length - 1 && (
                    <div className="mt-2 h-full min-h-6 w-px bg-surface-border" />
                  )}
                </div>

                <div className="flex-1 pb-2">
                  <p className={`font-medium ${completed ? 'text-ink' : 'text-ink-muted'}`}>
                    {step.label}
                  </p>

                  {events.map((event, eventIndex) => (
                    <div key={`${event.at}-${eventIndex}`} className="mt-2 space-y-1">
                      <p className="text-xs text-ink-muted">{formatDate(event.at)}</p>
                      {event.note && (
                        <p className="text-sm text-ink-soft">{event.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2">
          <Clock3 className="h-5 w-5 text-brand-600" />
          <h2 className="font-semibold text-ink">Admin response</h2>
        </div>
        {complaint.adminResponse ? (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink-soft">
            {complaint.adminResponse}
          </p>
        ) : (
          <p className="mt-3 text-sm text-ink-muted">
            No response has been added yet. Check back for updates.
          </p>
        )}
      </Card>
    </div>
  );
}
