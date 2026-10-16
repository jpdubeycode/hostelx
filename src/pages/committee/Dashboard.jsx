import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Lightbulb,
  UtensilsCrossed,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Committee Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage mess polls, suggestions and committee decisions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BarChart3}
          title="Active Polls"
          value="3"
          subtitle="Currently running"
          onClick={() => navigate('/committee/polls')}
        />

        <StatCard
          icon={Lightbulb}
          title="Suggestions"
          value="5"
          subtitle="Pending review"
          onClick={() => navigate('/committee/suggestions')}
        />

        <StatCard
          icon={CheckCircle2}
          title="Decisions"
          value="8"
          subtitle="Committee decisions"
          onClick={() => navigate('/committee/decisions')}
        />

        <StatCard
          icon={UtensilsCrossed}
          title="Mess"
          value="Active"
          subtitle="Manage mess"
          onClick={() => navigate('/committee/mess')}
        />
      </div>

      {/* Workflow */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Committee Workflow
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Turn student suggestions into committee decisions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <WorkflowCard
            step="01"
            icon={Lightbulb}
            title="Suggestion"
            description="Students submit ideas and issues related to the mess."
            onClick={() => navigate('/committee/suggestions')}
          />

          <WorkflowCard
            step="02"
            icon={BarChart3}
            title="Student Poll"
            description="Committee creates a poll and collects student opinions."
            onClick={() => navigate('/committee/polls')}
          />

          <WorkflowCard
            step="03"
            icon={CheckCircle2}
            title="Decision"
            description="Committee reviews the result and records the final decision."
            onClick={() => navigate('/committee/decisions')}
          />
        </div>
      </section>

      {/* Current Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Polls */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Active Polls
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Polls currently open for students
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BarChart3 size={20} />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ActivityItem
              title="Weekend Special Menu"
              subtitle="Ends tomorrow"
              status="Active"
            />

            <ActivityItem
              title="Mess Timing Feedback"
              subtitle="Ends in 2 days"
              status="Active"
            />

            <ActivityItem
              title="Breakfast Menu Preference"
              subtitle="Ends in 3 days"
              status="Active"
            />
          </div>

          <button
            onClick={() => navigate('/committee/polls')}
            className="
              mt-5 flex w-full items-center justify-between
              rounded-xl bg-slate-50 px-4 py-3
              text-sm font-medium text-slate-700
              transition hover:bg-blue-50 hover:text-blue-600
            "
          >
            <span>View all polls</span>
            <ChevronRight size={18} />
          </button>
        </section>

        {/* Pending Suggestions */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Pending Suggestions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Suggestions waiting for committee review
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Lightbulb size={20} />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ActivityItem
              title="Add more fruit options"
              subtitle="Submitted by student"
              status="Pending"
            />

            <ActivityItem
              title="Improve dinner variety"
              subtitle="Submitted by student"
              status="Pending"
            />

            <ActivityItem
              title="Change Sunday breakfast"
              subtitle="Submitted by student"
              status="Pending"
            />
          </div>

          <button
            onClick={() => navigate('/committee/suggestions')}
            className="
              mt-5 flex w-full items-center justify-between
              rounded-xl bg-slate-50 px-4 py-3
              text-sm font-medium text-slate-700
              transition hover:bg-blue-50 hover:text-blue-600
            "
          >
            <span>Review suggestions</span>
            <ChevronRight size={18} />
          </button>
        </section>
      </div>

      {/* Recent Decisions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Decisions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest decisions made by the mess committee
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <ClipboardList size={20} />
          </div>
        </div>

        <div className="mt-5 divide-y divide-slate-100">
          <DecisionItem
            title="Added milk to breakfast"
            date="2 days ago"
          />

          <DecisionItem
            title="Approved Sunday special dinner"
            date="5 days ago"
          />

          <DecisionItem
            title="Changed dinner timing to 8:00 PM"
            date="1 week ago"
          />
        </div>

        <button
          onClick={() => navigate('/committee/decisions')}
          className="
            mt-5 flex w-full items-center justify-between
            rounded-xl bg-slate-50 px-4 py-3
            text-sm font-medium text-slate-700
            transition hover:bg-blue-50 hover:text-blue-600
          "
        >
          <span>View all decisions</span>
          <ChevronRight size={18} />
        </button>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Frequently used committee actions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            icon={BarChart3}
            title="Create Poll"
            description="Ask students for their opinion"
            onClick={() => navigate('/committee/polls')}
          />

          <QuickAction
            icon={Lightbulb}
            title="Review Suggestions"
            description="Check student suggestions"
            onClick={() => navigate('/committee/suggestions')}
          />

          <QuickAction
            icon={CheckCircle2}
            title="View Decisions"
            description="Review committee decisions"
            onClick={() => navigate('/committee/decisions')}
          />

          <QuickAction
            icon={UtensilsCrossed}
            title="Manage Mess"
            description="Manage mess information"
            onClick={() => navigate('/committee/mess')}
          />
        </div>
      </section>
    </div>
  )
}

/* ---------------- Stat Card ---------------- */

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="
        rounded-2xl border border-slate-200
        bg-white p-5 text-left shadow-sm
        transition hover:-translate-y-0.5
        hover:border-blue-200 hover:shadow-md
      "
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={21} />
        </div>

        <ChevronRight
          size={18}
          className="text-slate-300"
        />
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {subtitle}
      </p>
    </button>
  )
}

/* ---------------- Workflow Card ---------------- */

function WorkflowCard({
  step,
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="
        rounded-2xl border border-slate-200
        bg-white p-5 text-left shadow-sm
        transition hover:-translate-y-0.5
        hover:border-blue-200 hover:shadow-md
      "
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={21} />
        </div>

        <span className="text-xs font-semibold text-slate-300">
          {step}
        </span>
      </div>

      <h3 className="mt-5 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600">
        Open
        <ChevronRight size={16} />
      </div>
    </button>
  )
}

/* ---------------- Activity Item ---------------- */

function ActivityItem({
  title,
  subtitle,
  status,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      </div>

      <span
        className={`
          shrink-0 rounded-full px-3 py-1 text-xs font-medium
          ${
            status === 'Active'
              ? 'bg-green-50 text-green-600'
              : 'bg-amber-50 text-amber-600'
          }
        `}
      >
        {status}
      </span>
    </div>
  )
}

/* ---------------- Decision Item ---------------- */

function DecisionItem({ title, date }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircle2 size={17} />
        </div>

        <p className="text-sm font-medium text-slate-800">
          {title}
        </p>
      </div>

      <span className="shrink-0 text-xs text-slate-400">
        {date}
      </span>
    </div>
  )
}

/* ---------------- Quick Action ---------------- */

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-4
        rounded-2xl border border-slate-200
        bg-white p-5 text-left shadow-sm
        transition hover:-translate-y-0.5
        hover:border-blue-200 hover:shadow-md
      "
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={21} />
      </div>

      <div className="min-w-0">
        <p className="font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </button>
  )
}