import {
    useEffect,
    useState,
  } from "react";
  
  import toast from "react-hot-toast";
  
  import { api } from "../services/api";
  
  export default function CoordinatorAnnouncements() {
    const [events, setEvents] =
      useState([]);
  
    const [title, setTitle] =
      useState("");
  
    const [message,
      setMessage] =
      useState("");
  
    const [subeventId,
      setSubeventId] =
      useState("");
  
    const [loading,
      setLoading] =
      useState(false);
  
    useEffect(() => {
      loadEvents();
    }, []);
  
    const loadEvents =
      async () => {
        try {
          const res =
            await api.get(
              "/events/me/list"
            );
  
          const allSubevents =
            (
              res.data.events ||
              []
            ).flatMap(
              (event) =>
                (
                  event.subevents ||
                  []
                ).map(
                  (sub) => ({
                    ...sub,
                    eventName:
                      event.name,
                  })
                )
            );
  
          setEvents(
            allSubevents
          );
        } catch (err) {
          console.error(err);
  
          toast.error(
            "Failed to load events"
          );
        }
      };
  
    const submit =
      async (e) => {
        e.preventDefault();
  
        if (
          !subeventId
        ) {
          toast.error(
            "Please select an event"
          );
  
          return;
        }
  
        try {
          setLoading(true);
  
          await api.post(
            "/announcements",
            {
              title,
              message,
              subeventId,
            }
          );
  
          toast.success(
            "Announcement posted"
          );
  
          setTitle("");
          setMessage("");
          setSubeventId("");
        } catch (err) {
          toast.error(
            err?.response
              ?.data
              ?.message ||
              "Failed"
          );
        } finally {
          setLoading(false);
        }
      };
  
    return (
      <div className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="mb-2 text-3xl font-bold">
            Event Announcement
          </h1>
  
          <p className="mb-6 text-slate-400">
            Send announcement
            only to
            participants
            registered
            in your event
          </p>
  
          <form
            onSubmit={submit}
            className="space-y-5"
          >
            {/* Event dropdown */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Select Event
              </label>
  
              <select
                value={
                  subeventId
                }
                onChange={(
                  e
                ) =>
                  setSubeventId(
                    e.target
                      .value
                  )
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none"
                required
              >
                <option value="">
                  Select
                  event
                </option>
  
                {events.map(
                  (event) => (
                    <option
                      key={
                        event._id
                      }
                      value={
                        event._id
                      }
                    >
                      {
                        event.eventName
                      }
                      {" — "}
                      {
                        event.name
                      }
                    </option>
                  )
                )}
              </select>
            </div>
  
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Title
              </label>
  
              <input
                type="text"
                value={title}
                onChange={(
                  e
                ) =>
                  setTitle(
                    e.target
                      .value
                  )
                }
                placeholder="Announcement title"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none"
                required
              />
            </div>
  
            {/* Message */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Message
              </label>
  
              <textarea
                rows={6}
                value={
                  message
                }
                onChange={(
                  e
                ) =>
                  setMessage(
                    e.target
                      .value
                  )
                }
                placeholder="Write announcement..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none"
                required
              />
            </div>
  
            <button
              type="submit"
              disabled={
                loading
              }
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-700"
            >
              {loading
                ? "Posting..."
                : "Post Announcement"}
            </button>
          </form>
        </div>
      </div>
    );
  }