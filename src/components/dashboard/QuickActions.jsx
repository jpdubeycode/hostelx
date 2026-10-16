import {
  Wrench,
  BedDouble,
  Utensils,
  Bell,
  BookOpen,
} from "lucide-react";

const actions = [
  {
    title: "Raise Complaint",
    description: "Report a hostel issue",
    icon: Wrench,
    path: "/student/complaints",
  },
  {
    title: "My Room",
    description: "View room & roommates",
    icon: BedDouble,
    path: "/student/room",
  },
  {
    title: "Mess Menu",
    description: "Check today's menu",
    icon: Utensils,
    path: "/student/mess",
  },
  {
    title: "Announcements",
    description: "View latest notices",
    icon: Bell,
    path: "/student/announcements",
  },
  {
    title: "Hostel Rules",
    description: "View rules & regulations",
    icon: BookOpen,
    path: "/student/rules",
  },
];

const QuickActions = ({ navigate }) => {
  return (
    <section>
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Access commonly used hostel services
        </p>
      </div>

      {/* Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="
                group flex items-center gap-4
                rounded-2xl
                border border-slate-200
                bg-white
                p-4
                text-left
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-blue-200
                hover:bg-blue-50/30
                hover:shadow-md
              "
            >
              {/* Icon */}
              <div
                className="
                  flex h-11 w-11 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  transition-colors
                  duration-200
                  group-hover:bg-blue-100
                "
              >
                <Icon size={20} strokeWidth={2} />
              </div>

              {/* Content */}
              <div className="min-w-0">
                <h3 className="font-medium text-slate-900">
                  {action.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;