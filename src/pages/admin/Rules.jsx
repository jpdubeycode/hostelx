
import { useMemo, useRef, useState } from 'react'
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  EyeOff,
  Send,
  ShieldCheck,
  AlertTriangle,
  X,
  FileText,
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
import { useRules } from '../../context/RulesContext'

const emptyForm = {
  title: '',
  description: '',
  category: 'Hostel',
  severity: 'normal',
}

const categoryOptions = [
  { value: 'Hostel', label: 'Hostel' },
  { value: 'Mess', label: 'Mess' },
  { value: 'Conduct', label: 'Conduct' },
  { value: 'Cleanliness', label: 'Cleanliness' },
  { value: 'Safety', label: 'Safety' },
  { value: 'Visitors', label: 'Visitors' },
  { value: 'General', label: 'General' },
]

const severityOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'important', label: 'Important' },
  { value: 'critical', label: 'Critical' },
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

export default function Rules() {
  const toast = useToast()

  const {
    rules = [],
    createRule,
    updateRule,
    deleteRule,
    publishRule,
    unpublishRule,
  } = useRules()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const formRef = useRef(null)

  const publishedCount = rules.filter(
    (rule) => rule.status === 'published',
  ).length

  const draftCount = rules.filter(
    (rule) => rule.status === 'draft',
  ).length

  const criticalCount = rules.filter(
    (rule) =>
      rule.status === 'published' && rule.severity === 'critical',
  ).length

  const filteredRules = useMemo(() => {
    const query = search.trim().toLowerCase()

    return [...rules]
      .filter((rule) => {
        const matchesSearch =
          !query ||
          rule.title?.toLowerCase().includes(query) ||
          rule.description?.toLowerCase().includes(query) ||
          rule.category?.toLowerCase().includes(query)

        const matchesStatus =
          statusFilter === 'all' || rule.status === statusFilter

        const matchesCategory =
          categoryFilter === 'all' || rule.category === categoryFilter

        return matchesSearch && matchesStatus && matchesCategory
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt || 0) -
          new Date(a.updatedAt || a.createdAt || 0),
      )
  }, [rules, search, statusFilter, categoryFilter])

  function openCreateForm() {
    setEditingId(null)
    setForm({ ...emptyForm })
    setFormError('')
    setIsFormOpen(true)
  }

  function openEditForm(rule) {
    setEditingId(rule.id)
    setForm({
      title: rule.title || '',
      description: rule.description || '',
      category: rule.category || 'General',
      severity: rule.severity || 'normal',
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
    const description = form.description.trim()

    if (!title || !description) {
      setFormError('Please enter both a rule title and description.')
      return
    }

    if (title.length > 120) {
      setFormError('The title must be 120 characters or fewer.')
      return
    }

    if (description.length > 2000) {
      setFormError('The description must be 2000 characters or fewer.')
      return
    }

    setSaving(true)

    try {
      const payload = {
        title,
        description,
        category: getSelectValue(form.category) || 'General',
        severity: getSelectValue(form.severity) || 'normal',
      }

      if (editingId !== null) {
        await updateRule(editingId, payload)

        if (shouldPublish) {
          await publishRule(editingId)
        }
      } else {
        await createRule({
          ...payload,
          status: shouldPublish ? 'published' : 'draft',
        })
      }

      toast.success(
        shouldPublish
          ? 'Rule published successfully.'
          : editingId !== null
            ? 'Rule updated successfully.'
            : 'Draft saved successfully.',
      )

      setIsFormOpen(false)
      setEditingId(null)
      setForm({ ...emptyForm })
      setFormError('')
    } catch (error) {
      setFormError(error?.message || 'Unable to save the rule.')
      toast.error(error?.message || 'Could not save the rule.')
    } finally {
      setSaving(false)
    }
  }

  function handlePublishSubmit() {
    if (saving) return

    if (!formRef.current?.reportValidity()) return

    handleSave({ preventDefault() {} }, true)
  }

  async function handlePublish(rule) {
    try {
      await publishRule(rule.id)
      toast.success('Rule published successfully.')
    } catch (error) {
      toast.error(error?.message || 'Could not publish the rule.')
    }
  }

  async function handleUnpublish(rule) {
    try {
      await unpublishRule(rule.id)
      toast.success('Rule moved back to drafts.')
    } catch (error) {
      toast.error(error?.message || 'Could not unpublish the rule.')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return

    try {
      await deleteRule(deleteTarget.id)
      toast.success('Rule permanently deleted.')
      setDeleteTarget(null)
    } catch (error) {
      toast.error(error?.message || 'Could not delete the rule.')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Rules & Regulations"
        subtitle="Manage hostel, mess, conduct and safety rules."
        action={
          <Button icon={Plus} onClick={openCreateForm}>
            New rule
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-ink-muted">Published rules</p>
              <p className="mt-2 text-2xl font-semibold text-ink">
                {publishedCount}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <ShieldCheck size={21} />
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
              <p className="text-sm text-ink-muted">Critical rules</p>
              <p className="mt-2 text-2xl font-semibold text-ink">
                {criticalCount}
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
              placeholder="Search rules..."
              aria-label="Search rules"
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
              label="Category"
              value={categoryFilter}
              onChange={(value) =>
                setCategoryFilter(getSelectValue(value) || 'all')
              }
              options={[
                { value: 'all', label: 'All categories' },
                ...categoryOptions,
              ]}
            />
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {filteredRules.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No rules found"
              message={
                rules.length === 0
                  ? 'Create your first rule to get started.'
                  : 'Try changing your search or filters.'
              }
              action={
                rules.length === 0 ? (
                  <Button icon={Plus} onClick={openCreateForm}>
                    Create rule
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredRules.map((rule) => (
                <article
                  key={rule.id}
                  className="rounded-2xl border border-surface-border bg-white p-4 transition hover:border-brand-200 sm:p-5"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={rule.severity || 'normal'} />

                      <Badge tone="neutral">
                        {rule.category || 'General'}
                      </Badge>

                      <Badge
                        tone={
                          rule.status === 'published'
                            ? 'success'
                            : 'warning'
                        }
                      >
                        {rule.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="break-words text-base font-semibold text-ink sm:text-lg">
                        {rule.title}
                      </h3>

                      <p className="mt-1 text-xs text-ink-muted">
                        Created {formatDate(rule.createdAt)}
                        {rule.updatedAt &&
                          rule.updatedAt !== rule.createdAt &&
                          ` · Edited ${formatDate(rule.updatedAt)}`}
                      </p>

                      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-ink-soft">
                        {rule.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-surface-border pt-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Pencil}
                        onClick={() => openEditForm(rule)}
                      >
                        Edit
                      </Button>

                      {rule.status === 'published' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={EyeOff}
                          onClick={() => handleUnpublish(rule)}
                        >
                          Unpublish
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Send}
                          onClick={() => handlePublish(rule)}
                        >
                          Publish
                        </Button>
                      )}

                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => setDeleteTarget(rule)}
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
            aria-labelledby="rule-form-title"
            className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-lift sm:max-w-2xl sm:rounded-2xl sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="rule-form-title"
                  className="text-xl font-semibold text-ink"
                >
                  {editingId !== null ? 'Edit rule' : 'New rule'}
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Save a draft or publish the rule for students.
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
                label="Rule title"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="e.g. Hostel entry timings"
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
                label="Severity"
                value={form.severity}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    severity: getSelectValue(value) || 'normal',
                  }))
                }
                options={severityOptions}
              />

              <Input
                label="Rule description"
                multiline
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Write the full rule and any relevant instructions..."
                hint="Maximum 2000 characters."
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
            aria-labelledby="delete-rule-title"
            className="w-full rounded-t-2xl bg-white p-5 shadow-lift sm:max-w-md sm:rounded-2xl sm:p-6"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <Trash2 size={22} />
              </div>

              <div className="flex-1">
                <h2
                  id="delete-rule-title"
                  className="font-semibold text-ink"
                >
                  Delete rule?
                </h2>

                <p className="mt-2 break-words text-sm leading-6 text-ink-muted">
                  “{deleteTarget.title}” will be permanently removed from
                  the demo data. This action cannot be undone.
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
