import { BedDouble, Users } from "lucide-react";

const RoomOverview = ({ room }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            My Room
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {room.number}
          </h2>
        </div>

        <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
          <BedDouble size={22} />
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            Occupancy
          </span>

          <span className="font-medium text-slate-900 dark:text-white">
            {room.occupied}/{room.capacity}
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full"
            style={{
              width: `${(room.occupied / room.capacity) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium">
          <Users size={16} />
          Roommates
        </div>

        <div className="space-y-2">
          {roommatesToShow(room.roommates).map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800"
            >
              <span className="text-sm text-slate-700 dark:text-slate-200">
                {student.name}
              </span>

              {student.isYou && (
                <span className="text-xs font-medium">
                  You
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const roommatesToShow = (roommates) => roommates || [];

export default RoomOverview;