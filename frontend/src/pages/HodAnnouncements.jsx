import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

export default function HodAnnouncements() {
  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

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

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6">
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
    </div>
  );
}