
import { useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  Bell,
  Pin,
  Plus,
  Search,
  Pencil,
  Trash2,
  EyeOff,
  Send,
  FileText,
  Megaphone,
  X,
} from 'lucide-react'

import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Select,
  StatusBadge,
} from '../../components/common'
import PageHeader from '../../components/layout/PageHeader'
import { useToast } from '../../context/ToastContext'
import { useAnnouncements } from '../../context/AnnouncementsContext'

const emptyForm = {
  title: '',
  body: '',
  category: 'General',
  priority: 'normal',
}

const priorityOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'important', label: 'Important' },
  { value: 'emergency', label: 'Emergency' },
]

const categoryOptions = [
  { value: 'General', label: 'General' },
  { value: 'Academic', label: 'Academic' },
  { value: 'Hostel', label: 'Hostel' },
  { value: 'Mess', label: 'Mess' },
  { value: 'Event', label: 'Event' },
  { value: 'Safety', label: 'Safety' },
]

function getSelectValue(value) {
  if (typeof value === 'string') return value

  if (value && typeof value.target?.value === 'string') {
    return value.target.value
  }

  return ''
}

function formatDate(date) {
  if (!date) return 'Date unavailable'

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return 'Date unavailable'
  }

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function Announcements() {
  const toast = useToast()

  const {
    announcements = [],
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    publishAnnouncement,
    unpublishAnnouncement,
    togglePin,
  } = useAnnouncements()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const formRef = useRef(null)

  const publishedCount = announcements.filter(
    (item) => item.status === 'published',
  ).length

  const draftCount = announcements.filter(
    (item) => item.status === 'draft',
  ).length

  const emergencyCount = announcements.filter(
    (item) =>
      item.status === 'published' && item.priority === 'emergency',
  ).length

  const filteredAnnouncements = useMemo(() => {
    const query = search.trim().toLowerCase()

    return [...announcements]
      .filter((item) => {
        const matchesSearch =
          !query ||
          item.title?.toLowerCase().includes(query) ||
          item.body?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)

        const matchesStatus =
          statusFilter === 'all' || item.status === statusFilter

        const matchesPriority =
          priorityFilter === 'all' || item.priority === priorityFilter

        return matchesSearch && matchesStatus && matchesPriority
      })
      .sort((a, b) => {
        if (Boolean(a.pinned) !== Boolean(b.pinned)) {
          return Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))
        }

        return (
          new Date(b.updatedAt || b.createdAt || 0) -
          new Date(a.updatedAt || a.createdAt || 0)
        )
      })
  }, [announcements, search, statusFilter, priorityFilter])

  function openCreateForm() {
    setEditingId(null)
    setForm({ ...emptyForm })
    setFormError('')
    setIsFormOpen(true)
  }

  function openEditForm(announcement) {
    setEditingId(announcement.id)

    setForm({
      title: announcement.title || '',
      body: announcement.body || '',
      category: announcement.category || 'General',
      priority: announcement.priority || 'normal',
    })

    setFormError('')
    setIsFormOpen(true)
  }

  function closeForm() {
    if (saving) return

    setIsFormOpen(false)
    setEditingId(null)
    setForm({ ...emptyForm })
    setFormError('')
  }

  async function handleSave(event, shouldPublish = false) {
    event.preventDefault()

    if (saving) return

    setFormError('')

    const title = form.title.trim()
    const body = form.body.trim()

    if (!title || !body) {
      setFormError('Please enter both a title and announcement message.')
      return
    }

    if (title.length > 120) {
      setFormError('The title must be 120 characters or fewer.')
      return
    }

    setSaving(true)

    try {
      const payload = {
        title,
        body,
        category: getSelectValue(form.category) || 'General',
        priority: getSelectValue(form.priority) || 'normal',
      }

      if (editingId !== null) {
        // Existing announcement: update it first.
        await updateAnnouncement(editingId, payload)

        // Publish the existing ID only after updating it.
        if (shouldPublish) {
          await publishAnnouncement(editingId)
        }
      } else {
        // New announcement: create it with the intended status.
        // Do not create a draft and immediately search for it again.
        await createAnnouncement({
          ...payload,
          status: shouldPublish ? 'published' : 'draft',
          pinned: false,
        })
      }

      toast.success(
        shouldPublish
          ? 'Announcement published successfully.'
          : editingId !== null
            ? 'Announcement updated successfully.'
            : 'Draft saved successfully.',
      )

      setIsFormOpen(false)
      setEditingId(null)
      setForm({ ...emptyForm })
      setFormError('')
    } catch (error) {
      setFormError(
        error?.message || 'Unable to save the announcement. Please try again.',
      )

      toast.error(error?.message || 'Could not save the announcement.')
    } finally {
      setSaving(false)
    }
  }

  function handlePublishSubmit() {
    if (saving) return

    const formElement = formRef.current

    if (!formElement?.reportValidity()) return

    // Explicitly submit with the publish intent.
    handleSave({ preventDefault() {} }, true)
  }

  async function handlePublish(announcement) {
    try {
      await publishAnnouncement(announcement.id)
      toast.success('Announcement published successfully.')
    } catch (error) {
      toast.error(error?.message || 'Could not publish the announcement.')
    }
  }

  async function handleUnpublish(announcement) {
    try {
      await unpublishAnnouncement(announcement.id)
      toast.success('Announcement moved back to drafts.')
    } catch (error) {
      toast.error(error?.message || 'Could not unpublish the announcement.')
    }
  }

  async function handleTogglePin(announcement) {
    try {
      await togglePin(announcement.id)

      toast.success(
        announcement.pinned
          ? 'Announcement unpinned.'
          : 'Announcement pinned to the top.',
      )
    } catch (error) {
      toast.error(error?.message || 'Could not update the pinned status.')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return

    try {
      await deleteAnnouncement(deleteTarget.id)
      toast.success('Announcement permanently deleted.')
      setDeleteTarget(null)
    } catch (error) {
      toast.error(error?.message || 'Could not delete the announcement.')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Announcements"
        subtitle="Create notices and keep hostel students informed."
        action={
          <Button icon={Plus} onClick={openCreateForm}>
            New announcement
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ink-muted">Published</p>
              <p className="mt-2 text-2xl font-semibold text-ink">
                {publishedCount}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Megaphone size={21} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ink-muted">Drafts</p>
              <p className="mt-2 text-2xl font-semibold text-ink">
                {draftCount}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <FileText size={21} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ink-muted">Active emergencies</p>
              <p className="mt-2 text-2xl font-semibold text-ink">
                {emergencyCount}
              </p>
            </div>
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <AlertTriangle size={21} />
            </div>
          </div>
        </Card>
      </div>

      <Card padded={false}>
        <div className="space-y-4 border-b border-surface-border p-4 sm:p-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search announcements..."
              aria-label="Search announcements"
              className="w-full rounded-xl border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label="Publication status"
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(getSelectValue(value) || 'all')
              }
              options={[
                { value: 'all', label: 'All statuses' },
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Drafts' },
              ]}
            />

            <Select
              label="Priority"
              value={priorityFilter}
              onChange={(value) =>
                setPriorityFilter(getSelectValue(value) || 'all')
              }
              options={[
                { value: 'all', label: 'All priorities' },
                ...priorityOptions,
              ]}
            />
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {filteredAnnouncements.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No announcements found"
              message={
                announcements.length === 0
                  ? 'Create your first announcement to get started.'
                  : 'Try changing your search or filters.'
              }
              action={
                announcements.length === 0 ? (
                  <Button icon={Plus} onClick={openCreateForm}>
                    Create announcement
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <article
                  key={announcement.id}
                  className="rounded-2xl border border-surface-border bg-white p-4 transition hover:border-brand-200 sm:p-5"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={announcement.priority || 'normal'} />

                      <Badge tone="neutral">
                        {announcement.category || 'General'}
                      </Badge>

                      <Badge
                        tone={
                          announcement.status === 'published'
                            ? 'success'
                            : 'warning'
                        }
                      >
                        {announcement.status === 'published'
                          ? 'Published'
                          : 'Draft'}
                      </Badge>

                      {announcement.pinned && (
                        <Badge tone="brand" icon={Pin}>
                          Pinned
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h3 className="break-words text-base font-semibold text-ink sm:text-lg">
                        {announcement.title}
                      </h3>

                      <p className="mt-1 text-xs text-ink-muted">
                        Created {formatDate(announcement.createdAt)}
                        {announcement.updatedAt &&
                          announcement.updatedAt !== announcement.createdAt &&
                          ` · Edited ${formatDate(announcement.updatedAt)}`}
                      </p>

                      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-ink-soft">
                        {announcement.body}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-surface-border pt-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Pencil}
                        onClick={() => openEditForm(announcement)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Pin}
                        onClick={() => handleTogglePin(announcement)}
                      >
                        {announcement.pinned ? 'Unpin' : 'Pin'}
                      </Button>

                      {announcement.status === 'published' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={EyeOff}
                          onClick={() => handleUnpublish(announcement)}
                        >
                          Unpublish
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Send}
                          onClick={() => handlePublish(announcement)}
                        >
                          Publish
                        </Button>
                      )}

                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => setDeleteTarget(announcement)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </Card>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm()
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="announcement-form-title"
            className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-lift sm:max-w-2xl sm:rounded-2xl sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="announcement-form-title"
                  className="text-xl font-semibold text-ink"
                >
                  {editingId !== null
                    ? 'Edit announcement'
                    : 'New announcement'}
                </h2>

                <p className="mt-1 text-sm text-ink-muted">
                  Save a draft or publish it to the student feed.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close form"
                className="rounded-lg p-2 text-ink-muted hover:bg-surface-alt hover:text-ink disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form
              ref={formRef}
              className="space-y-4"
              onSubmit={(event) => handleSave(event, false)}
            >
              <Input
                label="Announcement title"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="e.g. Hostel maintenance notice"
                hint="Maximum 120 characters."
              />

              <Select
                label="Category"
                value={form.category}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    category: getSelectValue(value) || 'General',
                  }))
                }
                options={categoryOptions}
              />

              <Select
                label="Priority"
                value={form.priority}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    priority: getSelectValue(value) || 'normal',
                  }))
                }
                options={priorityOptions}
              />

              <Input
                label="Announcement message"
                multiline
                value={form.body}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    body: event.target.value,
                  }))
                }
                placeholder="Write the full announcement..."
              />

              {formError && (
                <p role="alert" className="text-sm text-red-600">
                  {formError}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-surface-border pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="secondary"
                  loading={saving}
                  disabled={saving}
                >
                  Save draft
                </Button>

                <Button
                  type="button"
                  icon={Send}
                  loading={saving}
                  disabled={saving}
                  onClick={handlePublishSubmit}
                >
                  Save &amp; publish
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-announcement-title"
            className="w-full rounded-t-2xl bg-white p-5 shadow-lift sm:max-w-md sm:rounded-2xl sm:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <Trash2 size={22} />
              </div>

              <div className="flex-1">
                <h2
                  id="delete-announcement-title"
                  className="font-semibold text-ink"
                >
                  Delete announcement?
                </h2>

                <p className="mt-2 break-words text-sm leading-6 text-ink-muted">
                  “{deleteTarget.title}” will be permanently removed from the
                  demo data. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>

              <Button
                variant="danger"
                icon={Trash2}
                onClick={handleDelete}
              >
                Delete permanently
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
