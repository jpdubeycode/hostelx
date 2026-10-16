
import { useMemo, useState } from 'react'
import {
  CalendarDays,
  Clock3,
  Plus,
  Pencil,
  Send,
  X,
  UtensilsCrossed,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
} from 'lucide-react'
import { useMess } from '../../context/MessContext'
import { useToast } from '../../context/ToastContext'
import PageHeader from '../../components/layout/PageHeader'

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const MEALS = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
]

const EMPTY_MEALS = {
  breakfast: { items: [''], timings: '7:30 AM - 9:00 AM' },
  lunch: { items: [''], timings: '12:30 PM - 2:00 PM' },
  dinner: { items: [''], timings: '7:30 PM - 9:00 PM' },
}

const STATUS_STYLES = {
  draft: 'bg-slate-100 text-slate-700',
  pending: 'bg-amber-100 text-amber-800',
  rejected: 'bg-rose-100 text-rose-700',
  published: 'bg-emerald-100 text-emerald-700',
  approved: 'bg-emerald-100 text-emerald-700',
}

const STATUS_LABELS = {
  draft: 'Draft',
  pending: 'Pending approval',
  rejected: 'Changes requested',
  published: 'Published',
  approved: 'Approved',
}

function formatDate(date) {
  if (!date) return '—'

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) return '—'

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] || STATUS_STYLES.draft
      }`}
    >
      {STATUS_LABELS[status] || 'Draft'}
    </span>
  )
}

function MenuEditor({ menu, onClose, onSave, saving }) {
  const [day, setDay] = useState(menu?.day || '')
  const [meals, setMeals] = useState(() => {
    if (!menu?.meals) return structuredClone(EMPTY_MEALS)

    return Object.fromEntries(
      MEALS.map(({ key }) => [
        key,
        {
          items: menu.meals[key]?.items?.length
            ? [...menu.meals[key].items]
            : [''],
          timings: menu.meals[key]?.timings || '',
        },
      ]),
    )
  })

  const [error, setError] = useState('')

  function updateMeal(mealKey, field, value) {
    setMeals((current) => ({
      ...current,
      [mealKey]: {
        ...current[mealKey],
        [field]: value,
      },
    }))
  }

  function updateItem(mealKey, index, value) {
    setMeals((current) => ({
      ...current,
      [mealKey]: {
        ...current[mealKey],
        items: current[mealKey].items.map((item, itemIndex) =>
          itemIndex === index ? value : item,
        ),
      },
    }))
  }

  function addItem(mealKey) {
    setMeals((current) => ({
      ...current,
      [mealKey]: {
        ...current[mealKey],
        items: [...current[mealKey].items, ''],
      },
    }))
  }

  function removeItem(mealKey, index) {
    setMeals((current) => ({
      ...current,
      [mealKey]: {
        ...current[mealKey],
        items: current[mealKey].items.filter(
          (_, itemIndex) => itemIndex !== index,
        ),
      },
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const cleanedMeals = Object.fromEntries(
      MEALS.map(({ key }) => [
        key,
        {
          items: meals[key].items.map((item) => item.trim()).filter(Boolean),
          timings: meals[key].timings.trim(),
        },
      ]),
    )

    for (const { key, label } of MEALS) {
      if (!cleanedMeals[key].items.length) {
        setError(`Add at least one food item for ${label.toLowerCase()}.`)
        return
      }
    }

    if (!day) {
      setError('Please select a day.')
      return
    }

    try {
      await onSave({ day, meals: cleanedMeals })
    } catch (err) {
      setError(err.message || 'Unable to save this menu.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-border bg-white px-5 py-4 sm:px-7">
          <div>
            <h2 className="text-lg font-bold text-ink">
              {menu ? 'Edit menu' : 'Create menu'}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Add meals, food items, and serving timings.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu editor"
            className="rounded-xl p-2 text-ink-muted transition hover:bg-surface-alt hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink">
              Menu day
            </label>
            <select
              value={day}
              onChange={(event) => setDay(event.target.value)}
              disabled={Boolean(menu)}
              required
              className="w-full rounded-xl border border-surface-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-surface-alt"
            >
              <option value="">Select a day</option>
              {DAYS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {menu && (
              <p className="mt-1 text-xs text-ink-muted">
                The day cannot be changed while editing a menu.
              </p>
            )}
          </div>

          {MEALS.map(({ key, label }) => (
            <section
              key={key}
              className="rounded-2xl border border-surface-border p-4 sm:p-5"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <UtensilsCrossed size={19} />
                </div>
                <div>
                  <h3 className="font-bold text-ink">{label}</h3>
                  <p className="text-xs text-ink-muted">
                    Food items and serving time
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-sm font-medium text-ink">
                Food items
              </label>

              <div className="space-y-2">
                {meals[key].items.map((item, index) => (
                  <div key={`${key}-${index}`} className="flex gap-2">
                    <input
                      value={item}
                      onChange={(event) =>
                        updateItem(key, index, event.target.value)
                      }
                      placeholder={`Food item ${index + 1}`}
                      className="min-w-0 flex-1 rounded-xl border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                    />
                    {meals[key].items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(key, index)}
                        aria-label={`Remove ${label} item ${index + 1}`}
                        className="rounded-xl px-3 text-rose-600 transition hover:bg-rose-50"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addItem(key)}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                <Plus size={16} />
                Add food item
              </button>

              <label className="mb-2 mt-5 block text-sm font-medium text-ink">
                Serving timings
              </label>
              <input
                value={meals[key].timings}
                onChange={(event) =>
                  updateMeal(key, 'timings', event.target.value)
                }
                placeholder="e.g. 7:30 AM - 9:00 AM"
                className="w-full rounded-xl border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </section>
          ))}

          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-surface-border pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-surface-border px-5 py-3 text-sm font-semibold text-ink transition hover:bg-surface-alt"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <LoaderCircle size={17} className="animate-spin" />}
              {menu ? 'Save changes' : 'Create draft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Mess() {
  const {
    messMenu = [],
    createMenu,
    updateMenu,
    submitForApproval,
  } = useMess()

  const toast = useToast()
  const [editorMenu, setEditorMenu] = useState(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')

  const counts = useMemo(() => {
    return messMenu.reduce(
      (result, menu) => {
        result.total += 1
        if (menu.status === 'draft') result.draft += 1
        if (menu.status === 'pending') result.pending += 1
        if (menu.status === 'rejected') result.rejected += 1
        if (menu.status === 'published') result.published += 1
        return result
      },
      { total: 0, draft: 0, pending: 0, rejected: 0, published: 0 },
    )
  }, [messMenu])

  const sortedMenus = useMemo(() => {
    return [...messMenu].sort(
      (a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day),
    )
  }, [messMenu])

  const visibleMenus = useMemo(() => {
    if (filter === 'all') return sortedMenus
    return sortedMenus.filter((menu) => menu.status === filter)
  }, [sortedMenus, filter])

  async function handleSave(menuData) {
    setSaving(true)

    try {
      if (editorMenu) {
        await updateMenu(editorMenu.id, menuData)
        toast.success('Menu draft updated successfully.')
      } else {
        await createMenu({ ...menuData, status: 'draft' })
        toast.success('Menu draft created successfully.')
      }

      setEditorMenu(null)
      setCreating(false)
    } catch (error) {
      throw error
    } finally {
      setSaving(false)
    }
  }

  async function handleSubmit(menu) {
    try {
      await submitForApproval(menu.id)
      toast.success(`${menu.day} menu submitted for Admin approval.`)
    } catch (error) {
      toast.error(error.message || 'Could not submit this menu.')
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Mess Menu Management"
        subtitle="Prepare the weekly menu and submit it to Admin for approval."
      />

      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-white/80">
            <CalendarDays size={17} />
            Weekly menu operations
          </div>
          <h2 className="mt-2 text-xl font-bold sm:text-2xl">
            Keep every meal organised.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">
            Create menu drafts, review requested changes, and send updates to
            Admin before students see them.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditorMenu(null)
            setCreating(true)
          }}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-brand-800 transition hover:bg-brand-50"
        >
          <Plus size={18} />
          Create menu
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: 'Total menus',
            value: counts.total,
            tone: 'text-ink',
            icon: CalendarDays,
          },
          {
            label: 'Drafts',
            value: counts.draft,
            tone: 'text-slate-700',
            icon: Pencil,
          },
          {
            label: 'Awaiting approval',
            value: counts.pending,
            tone: 'text-amber-700',
            icon: Clock3,
          },
          {
            label: 'Published',
            value: counts.published,
            tone: 'text-emerald-700',
            icon: CheckCircle2,
          },
        ].map(({ label, value, tone, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-surface-border bg-white p-4 shadow-card sm:p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-ink-muted sm:text-sm">
                {label}
              </span>
              <Icon size={18} className={tone} />
            </div>
            <p className={`mt-3 text-2xl font-bold ${tone}`}>{value}</p>
          </div>
        ))}
      </div>

      {counts.rejected > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <AlertCircle size={20} className="mt-0.5 shrink-0 text-rose-600" />
          <div>
            <p className="font-semibold text-rose-800">
              {counts.rejected} menu{counts.rejected > 1 ? 's need' : ' needs'}{' '}
              changes
            </p>
            <p className="mt-1 text-sm text-rose-700">
              Check the Admin review note, edit the menu, and resubmit it for
              approval.
            </p>
          </div>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card">
        <div className="flex flex-col gap-4 border-b border-surface-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-ink">Weekly menus</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Manage each day’s breakfast, lunch, and dinner.
            </p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter menus by status"
            className="rounded-xl border border-surface-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500"
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending approval</option>
            <option value="rejected">Changes requested</option>
            <option value="published">Published</option>
          </select>
        </div>

        {visibleMenus.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-ink-muted">
              <CalendarDays size={25} />
            </div>
            <h3 className="mt-4 font-bold text-ink">No menus found</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
              There are no menus in this status. Create a menu draft or choose
              another filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {visibleMenus.map((menu) => {
              const canEdit = ['draft', 'rejected'].includes(menu.status)
              const canSubmit = ['draft', 'rejected'].includes(menu.status)

              return (
                <article key={menu.id} className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-ink">
                          {menu.day}
                        </h3>
                        <StatusPill status={menu.status} />
                      </div>
                      <p className="mt-1 text-xs text-ink-muted">
                        Last updated {formatDate(menu.updatedAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => {
                            setCreating(false)
                            setEditorMenu(menu)
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-surface-border px-3 py-2 text-sm font-semibold text-ink transition hover:bg-surface-alt"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>
                      )}

                      {canSubmit && (
                        <button
                          type="button"
                          onClick={() => handleSubmit(menu)}
                          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
                        >
                          <Send size={15} />
                          Submit for approval
                        </button>
                      )}
                    </div>
                  </div>

                  {menu.status === 'rejected' && menu.reviewNote && (
                    <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-rose-700">
                        Admin review note
                      </p>
                      <p className="mt-1 text-sm leading-6 text-rose-800">
                        {menu.reviewNote}
                      </p>
                    </div>
                  )}

                  {menu.status === 'pending' && (
                    <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                      This menu is awaiting Admin review. Editing is disabled
                      until it is reviewed.
                    </p>
                  )}

                  <div className="mt-5 grid gap-3 lg:grid-cols-3">
                    {MEALS.map(({ key, label }) => {
                      const meal = menu.meals?.[key] || {
                        items: [],
                        timings: '',
                      }

                      return (
                        <div
                          key={key}
                          className="rounded-xl bg-surface-alt p-4"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-ink">{label}</h4>
                            <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                              <Clock3 size={13} />
                              {meal.timings || 'Timing not set'}
                            </span>
                          </div>

                          <ul className="mt-3 space-y-2">
                            {(meal.items || []).map((item, index) => (
                              <li
                                key={`${key}-${index}`}
                                className="flex items-start gap-2 text-sm text-ink-soft"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                                <span>{item}</span>
                              </li>
                            ))}
                            {!meal.items?.length && (
                              <li className="text-sm text-ink-muted">
                                No items added.
                              </li>
                            )}
                          </ul>
                        </div>
                      )
                    })}
                  </div>

                  {menu.status === 'published' && (
                    <p className="mt-4 text-xs text-emerald-700">
                      <CheckCircle2
                        size={14}
                        className="mr-1 inline-block"
                      />
                      Students can view this published menu. Ask Admin to
                      unpublish it before making changes.
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>

      {(creating || editorMenu) && (
        <MenuEditor
          key={editorMenu?.id || 'new-menu'}
          menu={editorMenu}
          saving={saving}
          onClose={() => {
            if (!saving) {
              setCreating(false)
              setEditorMenu(null)
            }
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
