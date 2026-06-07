// 
import {
    useEffect,
    useState,
  } from "react";
  
  import toast from "react-hot-toast";
  import { api } from "../services/api";
  
  export default function HodAnnouncements() {
    const [title, setTitle] =
      useState("");
  
    const [message, setMessage] =
      useState("");
  
    const [
      announcements,
      setAnnouncements,
    ] = useState([]);
  
    const [loading, setLoading] =
      useState(false);
  
    useEffect(() => {
      loadAnnouncements();
    }, []);
  
    const loadAnnouncements =
      async () => {
        try {
          const res =
            await api.get(
              "/announcements"
            );
  
          setAnnouncements(
            res.data || []
          );
        } catch (err) {
          console.error(err);
        }
      };
  
    const submit =
      async (e) => {
        e.preventDefault();
  
        try {
          setLoading(true);
  
          await api.post(
            "/announcements",
            {
              title,
              message,
            }
          );
  
          toast.success(
            "Announcement posted"
          );
  
          setTitle("");
          setMessage("");
  
          loadAnnouncements();
  
        } catch (err) {
          toast.error(
            err?.response?.data
              ?.message ||
              "Failed"
          );
        } finally {
          setLoading(false);
        }
      };
  
    const deleteAnnouncement =
      async (id) => {
        try {
          await api.delete(
            `/announcements/${id}`
          );
  
          toast.success(
            "Announcement deleted"
          );
  
          loadAnnouncements();
  
        } catch (err) {
          toast.error(
            err?.response
              ?.data
              ?.message ||
              "Delete failed"
          );
        }
      };
  
    return (
      <div className="min-h-screen bg-slate-950 p-6 text-white">
  
        <div className="mx-auto max-w-6xl grid gap-6 lg:grid-cols-2">
  
          {/* Left - Form */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
  
            <h1 className="mb-2 text-3xl font-bold">
              Create Announcement
            </h1>
  
            <p className="mb-6 text-slate-400">
              Send announcements
              to all users
            </p>
  
            <form
              onSubmit={submit}
              className="space-y-5"
            >
  
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Title
                </label>
  
                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
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
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  placeholder="Write announcement..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none"
                  required
                />
              </div>
  
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-700"
              >
                {loading
                  ? "Posting..."
                  : "Post Announcement"}
              </button>
  
            </form>
          </div>
  
          {/* Right - Posted Announcements */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
  
            <h2 className="mb-5 text-2xl font-bold">
              Posted Announcements
            </h2>
  
            <div className="space-y-4">
  
              {announcements.length ===
              0 ? (
                <p className="text-slate-400">
                  No announcements yet
                </p>
              ) : (
                announcements.map(
                  (a) => (
                    <div
                      key={a._id}
                      className="rounded-xl border border-slate-800 bg-slate-800 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
  
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            📢 {a.title}
                          </h3>
  
                          <p className="mt-2 text-slate-300">
                            {a.message}
                          </p>
  
                          <p className="mt-3 text-sm text-slate-500">
                            Posted by{" "}
                            {a.createdBy
                              ?.name ||
                              "HOD"}
                          </p>
                        </div>
  
                        <button
                          onClick={() =>
                            deleteAnnouncement(
                              a._id
                            )
                          }
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                          🗑 Delete
                        </button>
  
                      </div>
                    </div>
                  )
                )
              )}
  
            </div>
          </div>
  
        </div>
      </div>
    );
  }