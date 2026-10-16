import { CheckCircle2, Clock3, Wrench } from "lucide-react";

const ComplaintSummary = ({ complaints }) => {
  const inProgress = complaints.filter(
    (item) => item.status === "In Progress"
  ).length;

  const pending = complaints.filter(
    (item) => item.status === "Pending"
  ).length;

  const resolved = complaints.filter(
    (item) => item.status === "Resolved"
  ).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Complaints
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            Complaint Status
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <StatusRow
          icon={Clock3}
          label="Pending"
          value={pending}
        />

        <StatusRow
          icon={Wrench}
          label="In Progress"
          value={inProgress}
        />

        <StatusRow
          icon={CheckCircle2}
          label="Resolved"
          value={resolved}
        />
      </div>
    </div>
  );
};

const StatusRow = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <Icon size={18} />

        <span className="text-sm text-slate-700 dark:text-slate-200">
          {label}
        </span>
      </div>

      <span className="font-semibold text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
};

export default ComplaintSummary;