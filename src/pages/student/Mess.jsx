
import { useMemo, useState } from 'react'
import {
  CalendarDays,
  Clock3,
  UtensilsCrossed,
  Sun,
  Sunrise,
  Moon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  CalendarCheck,
} from 'lucide-react'
import { useMess } from '../../context/MessContext'
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
  {
    key: 'breakfast',
    label: 'Breakfast',
    description: 'Start your day right',
    icon: Sunrise,
    accent: 'bg-amber-50 text-amber-700',
  },
  {
    key: 'lunch',
    label: 'Lunch',
    description: 'Your midday meal',
    icon: Sun,
    accent: 'bg-orange-50 text-orange-700',
  },
  {
    key: 'dinner',
    label: 'Dinner',
    description: 'End your day well',
    icon: Moon,
    accent: 'bg-indigo-50 text-indigo-700',
  },
]

function getToday() {
  const dayIndex = (new Date().getDay() + 6) % 7
  return DAYS[dayIndex]
}

function formatDate(date) {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Mess() {
  const { messMenu = [] } = useMess()
  const [selectedDay, setSelectedDay] = useState(getToday)

  // Only menus approved and published by Admin are visible to students.
  const publishedMenus = useMemo(
    () => messMenu.filter((menu) => menu.status === 'published'),
    [messMenu],
  )

  const menuByDay = useMemo(
    () => new Map(publishedMenus.map((menu) => [menu.day, menu])),
    [publishedMenus],
  )

  const selectedMenu = menuByDay.get(selectedDay)

  const today = getToday()
  const todayIndex = DAYS.indexOf(today)
  const selectedIndex = DAYS.indexOf(selectedDay)

  function selectPreviousDay() {
    setSelectedDay(DAYS[(selectedIndex + 6) % 7])
  }

  function selectNextDay() {
    setSelectedDay(DAYS[(selectedIndex + 1) % 7])
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Mess Menu"
        subtitle="Check this week's meals and serving timings."
      />

      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-5 text-white shadow-card sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white/90">
              <CalendarCheck size={15} />
              Weekly meal planner
            </div>

            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
              Good food, better days.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">
              Plan your meals ahead and check what's being served in the mess
              throughout the week.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 sm:min-w-48">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <CalendarDays size={22} />
            </div>
            <div>
              <p className="text-xs text-white/70">Today's date</p>
              <p className="mt-1 font-semibold">{formatDate(new Date())}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-ink">Choose a day</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Select a day to see its published menu.
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <button
              type="button"
              onClick={selectPreviousDay}
              aria-label="Previous day"
              className="rounded-xl border border-surface-border p-2.5 text-ink transition hover:bg-surface-alt"
            >
              <ChevronLeft size={19} />
            </button>

            <button
              type="button"
              onClick={() => setSelectedDay(today)}
              className="rounded-xl border border-surface-border px-3 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-alt"
            >
              Today
            </button>

            <button
              type="button"
              onClick={selectNextDay}
              aria-label="Next day"
              className="rounded-xl border border-surface-border p-2.5 text-ink transition hover:bg-surface-alt"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {DAYS.map((day, index) => {
            const isSelected = day === selectedDay
            const isToday = day === today
            const hasPublishedMenu = menuByDay.has(day)

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`relative flex min-h-20 flex-col items-center justify-center rounded-xl border px-2 py-3 text-center transition ${
                  isSelected
                    ? 'border-brand-600 bg-brand-600 text-white shadow-sm'
                    : 'border-surface-border bg-white text-ink hover:border-brand-300 hover:bg-brand-50'
                }`}
              >
                <span className="text-xs font-medium">
                  {day.slice(0, 3)}
                </span>

                {isToday && (
                  <span
                    className={`mt-1 text-[10px] font-semibold ${
                      isSelected ? 'text-white/80' : 'text-brand-700'
                    }`}
                  >
                    Today
                  </span>
                )}

                <span
                  className={`mt-1.5 h-1.5 w-1.5 rounded-full ${
                    hasPublishedMenu
                      ? isSelected
                        ? 'bg-white'
                        : 'bg-emerald-500'
                      : isSelected
                        ? 'bg-white/40'
                        : 'bg-slate-200'
                  }`}
                  aria-label={
                    hasPublishedMenu ? 'Menu available' : 'No published menu'
                  }
                />
                <span className="sr-only">
                  {hasPublishedMenu ? 'Menu available' : 'No published menu'}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-700">
              {selectedDay === today ? "TODAY'S MENU" : 'SELECTED DAY'}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-ink">
              {selectedDay}
            </h2>
          </div>

          {selectedMenu && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={14} />
              Published by Admin
            </span>
          )}
        </div>

        {!selectedMenu ? (
          <div className="rounded-2xl border border-dashed border-surface-border bg-white px-5 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-ink-muted">
              <UtensilsCrossed size={26} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-ink">
              Menu not published yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-muted">
              The menu for {selectedDay} isn't available yet. The Mess
              Committee may still be preparing it or waiting for Admin
              approval. Please check again later.
            </p>

            {publishedMenus.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const firstAvailableDay = DAYS.find((day) =>
                    menuByDay.has(day),
                  )
                  if (firstAvailableDay) setSelectedDay(firstAvailableDay)
                }}
                className="mt-5 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                View an available menu
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {MEALS.map(({ key, label, description, icon: Icon, accent }) => {
              const meal = selectedMenu.meals?.[key] || {
                items: [],
                timings: '',
              }

              return (
                <article
                  key={key}
                  className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card transition hover:shadow-lift"
                >
                  <div className="border-b border-surface-border p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}
                        >
                          <Icon size={22} />
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-ink">
                          {label}
                        </h3>
                        <p className="mt-1 text-sm text-ink-muted">
                          {description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-surface-alt p-3">
                      <Clock3
                        size={16}
                        className="mt-0.5 shrink-0 text-ink-muted"
                      />
                      <div>
                        <p className="text-xs text-ink-muted">
                          Serving time
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-ink">
                          {meal.timings || 'Timing not announced'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Today's food
                    </p>

                    {meal.items?.length > 0 ? (
                      <ul className="mt-4 space-y-3">
                        {meal.items.map((item, index) => (
                          <li
                            key={`${key}-${index}`}
                            className="flex items-start gap-3 text-sm text-ink-soft"
                          >
                            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                              <CheckCircle2 size={13} />
                            </span>
                            <span className="leading-6">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-ink-muted">
                        Food items haven't been added yet.
                      </p>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <div className="flex items-start gap-3 rounded-2xl border border-surface-border bg-surface-alt p-4">
        <CalendarDays size={19} className="mt-0.5 shrink-0 text-brand-700" />
        <div>
          <p className="text-sm font-semibold text-ink">
            Menu information
          </p>
          <p className="mt-1 text-sm leading-6 text-ink-muted">
            Menus are displayed after Admin approval. Serving timings and food
            items may be updated by the hostel administration.
          </p>
        </div>
      </div>
    </div>
  )
}
