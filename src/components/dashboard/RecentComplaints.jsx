export default function RecentComplaints({ onViewAll }) {
  const complaints = [
    {
      id: 1,
      title: "Fan not working",
      category: "Electrical",
      status: "In Progress",
      date: "Today",
    },
    {
      id: 2,
      title: "Bathroom tap leakage",
      category: "Plumbing",
      status: "Pending",
      date: "Yesterday",
    },
    {
      id: 3,
      title: "Room light replacement",
      category: "Electrical",
      status: "Resolved",
      date: "2 days ago",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-50 text-green-600";

      case "In Progress":
        return "bg-blue-50 text-blue-600";

      case "Pending":
        return "bg-amber-50 text-amber-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Complaints
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track your latest complaints
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

      {/* Complaints */}
      <div className="mt-5 space-y-3">
        {complaints.map((complaint) => (
          <div
            key={complaint.id}
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
              <div className="min-w-0">
                <h3 className="font-medium text-slate-900">
                  {complaint.title}
                </h3>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {complaint.category}
                  </span>

                  <span className="text-slate-300">•</span>

                  <span className="text-xs text-slate-500">
                    {complaint.date}
                  </span>
                </div>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                  complaint.status
                )}`}
              >
                {complaint.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {complaints.length === 0 && (
        <div className="mt-5 rounded-xl bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-500">
            No recent complaints.
          </p>
        </div>
      )}
    </div>
  );
}