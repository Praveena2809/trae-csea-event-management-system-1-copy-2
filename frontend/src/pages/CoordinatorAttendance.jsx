import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function CoordinatorAttendance() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const { data } = await api.get("/events/me/list");
      setEvents(data.events || []);
    } catch (err) {
      toast.error("Failed to load events");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        Attendance Management
      </h2>

      {events.map((event) => (
  <div
    key={event._id}
    className="rounded-xl border p-4"
  >
    <h3 className="text-lg font-semibold">
      {event.name}
    </h3>

    <div className="mt-4 space-y-4">

      {event.subevents
        ?.filter(
          (sub) =>
            sub.status === "approved"
        )
        .map((sub) => (
          <div
            key={sub._id}
            className="rounded-lg border p-3"
          >
            <p className="font-medium">
              {sub.name}
            </p>

            {/* <p className="text-sm text-gray-500">
              Sessions:
              {sub.totalSessions || 1}
            </p> */}
            <div className="mt-3 flex flex-wrap gap-2">

{Array.from(
  {
    length:
      sub.totalSessions || 1,
  },
  (_, i) => i + 1
).map((session) => (
  <button
    key={session}
    onClick={() =>
        navigate(
            "/dashboard/coordinator/qr-attendance",
            {
              state: {
                subeventId: sub._id,
                sessionNumber: session,
              },
            }
          )
    }
    className="rounded-md bg-indigo-600 px-3 py-2 text-white"
  >
    Session {session}
  </button>
))}

</div>

          </div>
      ))}
    </div>
  </div>
))}
    </div>
  );
}