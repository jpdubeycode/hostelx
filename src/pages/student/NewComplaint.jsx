
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { Button, Card, Input, Select } from '../../components/common';
import PageHeader from '../../components/layout/PageHeader';
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES } from '../../data/complaints';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintsContext';
import { useToast } from '../../context/ToastContext';

export default function NewComplaint() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addComplaint } = useComplaints();
  const toast = useToast();

  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    priority: 'medium',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = 'Enter a complaint title.';
    if (!form.category) nextErrors.category = 'Choose a category.';
    if (!form.description.trim()) {
      nextErrors.description = 'Describe the issue.';
    } else if (form.description.trim().length < 10) {
      nextErrors.description = 'Please provide at least 10 characters.';
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);

    try {
      const studentId = user?.studentId ?? user?.id ?? user?._id;

      const complaint = addComplaint(
        {
          ...form,
          title: form.title.trim(),
          description: form.description.trim(),
        },
        studentId,
      );

      toast.success('Complaint submitted successfully.');
      navigate(`/student/complaints/${complaint.id}`);
    } catch (error) {
      toast.error(error.message || 'Unable to submit your complaint.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Raise a Complaint"
        subtitle="Describe the issue clearly so the hostel team can address it."
        action={
          <Button
            as={Link}
            to="/student/complaints"
            variant="secondary"
            icon={ArrowLeft}
          >
            My complaints
          </Button>
        }
      />

      <Card className="mx-auto max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Complaint title"
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            error={errors.title}
            placeholder="e.g. Water leakage in bathroom"
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Category"
              value={form.category}
              onChange={(event) => updateField('category', event.target.value)}
              options={COMPLAINT_CATEGORIES}
              placeholder="Select a category"
              error={errors.category}
              required
            />

            <Select
              label="Priority"
              value={form.priority}
              onChange={(event) => updateField('priority', event.target.value)}
              options={COMPLAINT_PRIORITIES.map((value) => ({
                value,
                label: value.charAt(0).toUpperCase() + value.slice(1),
              }))}
              required
            />
          </div>

          <Input
            label="Location"
            value={form.location}
            onChange={(event) => updateField('location', event.target.value)}
            placeholder="e.g. Block B, Room 204"
            hint="Mention the room or common area, if relevant."
          />

          <Input
            label="Description"
            multiline
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            error={errors.description}
            placeholder="Explain what happened, where it happened, and when you noticed it..."
            required
          />

          <div className="rounded-xl border border-surface-border bg-surface-alt p-4 text-sm text-ink-soft">
            Your complaint will be visible to hostel administration. You can
            track its status and read the admin response from My Complaints.
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              as={Link}
              to="/student/complaints"
              variant="secondary"
            >
              Cancel
            </Button>
            <Button type="submit" icon={Send} loading={saving}>
              Submit complaint
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
