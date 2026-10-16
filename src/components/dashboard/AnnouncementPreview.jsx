import { Bell, ChevronRight } from "lucide-react";

const AnnouncementPreview = ({ announcements = [], onViewAll }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Latest Announcements
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Stay updated with hostel notices
          </p>
        </div>

        <Bell size={20} />
      </div>

      <div className="mt-5 space-y-3">
        {announcements.slice(0, 3).map((announcement) => (
          <div
            key={announcement.id}
            className="rounded-xl border border-slate-100 p-4 dark:border-slate-800"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">
                  {announcement.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {announcement.date}
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                {announcement.category}
              </span>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-500">
            No announcements available.
          </div>
        )}
      </div>

      <button
        onClick={onViewAll}
        className="mt-4 flex items-center gap-1 text-sm font-medium"
      >
        View all
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default AnnouncementPreview;