import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

export default function CoordinatorFeedbacks() {
  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState({
      feedbacks: [],
      averageRating: 0,
      total: 0,
    });

  useEffect(() => {
    load();
  }, []);

  const load =
    async () => {
      try {
        const res =
          await api.get(
            `/registrations/feedbacks/${id}`
          );

        console.log(
          "FEEDBACK RESPONSE:",
          res.data
        );

        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading feedbacks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">
        Event Feedbacks
      </h1>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h3 className="text-slate-400">
            Average Rating
          </h3>

          <p className="mt-2 text-3xl font-bold">
            ⭐
            {
              data.averageRating
            }
            /5
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h3 className="text-slate-400">
            Total Feedbacks
          </h3>

          <p className="mt-2 text-3xl font-bold">
            {data.total}
          </p>
        </div>
      </div>

      {/* Feedback Cards */}
      <div className="space-y-4">
        {data.feedbacks
          ?.length ===
        0 ? (
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-5 text-slate-400">
            No feedbacks yet
          </div>
        ) : (
          data.feedbacks?.map(
            (f) => (
              <div
                key={f._id}
                className="rounded-xl border border-slate-700 bg-slate-900 p-5"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {
                        f
                          .participant
                          ?.name
                      }
                    </h3>

                    <p className="text-sm text-slate-400">
                      {
                        f
                          .participant
                          ?.email
                      }
                    </p>
                  </div>

                  <div className="text-2xl font-bold">
                    ⭐
                    {f.rating}
                  </div>
                </div>

                {/* COMMENT */}
                <div className="mt-4 rounded-lg bg-slate-800 p-4">
                  <p className="text-xs uppercase text-slate-400">
                    Feedback
                  </p>

                  <p className="mt-2 text-slate-200">
                    {f.comment ||
                      "No comment"}
                  </p>
                </div>

                {/* LIKED MOST */}
                <div className="mt-3 rounded-lg bg-slate-800 p-4">
                  <p className="text-xs uppercase text-slate-400">
                    What they liked
                  </p>

                  <p className="mt-2 text-slate-200">
                    {f.likedMost ||
                      "No response"}
                  </p>
                </div>

                {/* SUGGESTIONS */}
                <div className="mt-3 rounded-lg bg-slate-800 p-4">
                  <p className="text-xs uppercase text-slate-400">
                    Suggestions
                  </p>

                  <p className="mt-2 text-slate-200">
                    {f.suggestions ||
                      "No suggestions"}
                  </p>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}