export default function RecentAnnouncements({ onViewAll }) {
  const announcements = [
    {
      id: 1,
      title: "Mess committee poll is live",
      date: "Today",
      category: "Mess",
    },
    {
      id: 2,
      title: "Hostel maintenance notice",
      date: "Yesterday",
      category: "Maintenance",
    },
    {
      id: 3,
      title: "Hostel inspection scheduled",
      date: "2 days ago",
      category: "Hostel",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Announcements
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest hostel updates
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="
            text-sm
            font-medium
            text-blue-600
            transition-colors
            hover:text-blue-700
          "
        >
          View all
        </button>
      </div>

      {/* Announcements */}
      <div className="mt-5 space-y-3">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="
              rounded-xl
              border border-slate-100
              bg-slate-50
              p-4
              transition
              hover:border-blue-100
              hover:bg-blue-50/40
            "
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-medium text-slate-900">
                  {announcement.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {announcement.date}
                </p>
              </div>

              <span
                className="
                  shrink-0
                  rounded-full
                  bg-blue-50
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-blue-600
                "
              >
                {announcement.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}