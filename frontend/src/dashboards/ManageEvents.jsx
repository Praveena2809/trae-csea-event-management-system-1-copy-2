
import {
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
// import { api } from "../../services/api";
import { api } from "../services/api";

export default function ManageEvents() {
  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchEvents =
    async () => {
      try {
        const { data } =
          await api.get(
            "/events/public"
          );

        setEvents(
          data.events || []
        );
      } catch {
        toast.error(
          "Failed to load events"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchEvents();
  }, []);

  const deleteEvent =
    async (id) => {
      const ok =
        window.confirm(
          "Delete this event?"
        );

      if (!ok) return;

      try {
        await api.delete(
          `/events/${id}`
        );

        toast.success(
          "Event deleted"
        );

        fetchEvents();
      } catch (err) {
        toast.error(
          err?.response
            ?.data
            ?.message ||
            "Delete failed"
        );
      }
    };

  if (loading) {
    return (
      <p>
        Loading events...
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Manage Events
        </h1>

        <p className="text-slate-600 dark:text-slate-300">
          Edit or delete
          events
        </p>
      </div>

      {!events.length ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No events found
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map(
            (event) => (
              <div
                key={
                  event._id
                }
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {
                        event.name
                      }
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {
                        event.description
                      }
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Status:{" "}
                      {
                        event.status
                      }
                    </p>
                  </div>

                  {/* <div className="flex gap-3">
                    <button
                      onClick={() =>
                        window.location.href =
                          `/dashboard/admin/edit-event/${event._id}`
                      }
                      className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteEvent(
                          event._id
                        )
                      }
                      className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div> */ }
                 <div className="flex justify-end">
  <button
    onClick={() =>
      deleteEvent(event._id)
    }
    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
  >
    Delete Event
  </button>
</div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

