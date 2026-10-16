import { useNavigate } from "react-router-dom";
import {
  BedDouble,
  Wrench,
  Utensils,
} from "lucide-react";

import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RoomOverview from "../../components/dashboard/RoomOverview";
import ComplaintSummary from "../../components/dashboard/ComplaintSummary";
import AnnouncementPreview from "../../components/dashboard/AnnouncementPreview";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const student = {
    name: "Jai Prakash Dubey",
    room: "B-204",
    hostel: "Boys Hostel B",
  };

  const room = {
    number: "B-204",
    occupied: 3,
    capacity: 3,
    roommates: [
      {
        id: 1,
        name: "Jai Prakash Dubey",
        isYou: true,
      },
      {
        id: 2,
        name: "Rahul Kumar",
      },
      {
        id: 3,
        name: "Aman Singh",
      },
    ],
  };

  const complaints = [
    {
      id: 1,
      title: "Fan not working",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Bathroom tap issue",
      status: "Pending",
    },
    {
      id: 3,
      title: "Light replacement",
      status: "Resolved",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "Water supply maintenance",
      category: "Maintenance",
      date: "Today",
    },
    {
      id: 2,
      title: "Mess committee poll is live",
      category: "Mess",
      date: "2 hours ago",
    },
    {
      id: 3,
      title: "Hostel inspection on Monday",
      category: "Hostel",
      date: "Yesterday",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {student.hostel} • Room {student.room}
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Good Morning, {student.name.split(" ")[0]} 👋
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Here's what's happening in your hostel today.
        </p>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={BedDouble}
          title="My Room"
          value={student.room}
          subtitle="3 of 3 occupants"
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
          subtitle="Check today's menu"
          onClick={() => navigate("/student/mess")}
        />
      </section>

      {/* Quick Actions */}
      <QuickActions navigate={navigate} />

      {/* Room + Complaints */}
      <section className="grid gap-6 lg:grid-cols-2">
        <RoomOverview room={room} />

        <ComplaintSummary complaints={complaints} />
      </section>

      {/* Announcements */}
      <AnnouncementPreview
        announcements={announcements}
        onViewAll={() => navigate("/student/announcements")}
      />
    </div>
  );
};

export default StudentDashboard;