import { BedDouble, Utensils, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentAnnouncements from "../../components/dashboard/RecentAnnouncements";
import RecentComplaints from "../../components/dashboard/RecentComplaints";

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Temporary demo student
  // Later this will come from StudentsContext
  const student = {
    name: "Jai Prakash Dubey",
    hostel: "Boys Hostel B",
    room: "B-204",
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {student.hostel} • Room {student.room}
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Good Morning, {student.name.split(" ")[0]} 👋
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Here's what's happening in your hostel today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <StatCard
          icon={BedDouble}
          title="My Room"
          value={student.room}
          subtitle="3 / 3 occupants"
          onClick={() => navigate("/student/rooms")}
        />

        <StatCard
          icon={Wrench}
          title="Active Complaints"
          value="2"
          subtitle="1 in progress"
          onClick={() => navigate("/student/complaints")}
        />

        <StatCard
          icon={Utensils}
          title="Today's Dinner"
          value="8:00 PM"
          subtitle="View today's menu"
          onClick={() => navigate("/student/mess")}
        />

      </div>

      {/* Quick Actions */}
      <QuickActions navigate={navigate} />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <RecentComplaints
          onViewAll={() => navigate("/student/complaints")}
        />

        <RecentAnnouncements
          onViewAll={() => navigate("/student/announcements")}
        />

      </div>

    </div>
  );
};

export default StudentDashboard;