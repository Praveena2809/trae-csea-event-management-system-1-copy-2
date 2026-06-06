
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  api,
} from "../services/api";

export default function HodFeedbacks() {
  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [feedbackEvents,
    setFeedbackEvents] =
    useState([]);

  useEffect(() => {
    load();
  }, []);

  const load =
    async () => {
      try {
        setLoading(true);

        const res =
          await api.get(
            "/events/public"
          );

        const events =
          res.data.events ||
          [];

        const feedbackSummary =
          [];

        for (const event of events) {
          const subevents =
            event.subevents ||
            [];

          for (const sub of subevents) {
            try {
              const fbRes =
                await api.get(
                  `/registrations/feedbacks/${sub._id}`
                );

              feedbackSummary.push({
                eventName:
                  event.name,

                subeventName:
                  sub.name,

                subeventId:
                  sub._id,

                averageRating:
                  fbRes.data
                    ?.averageRating ||
                  0,

                total:
                  fbRes.data
                    ?.total ||
                  0,
              });
            } catch {
              feedbackSummary.push({
                eventName:
                  event.name,

                subeventName:
                  sub.name,

                subeventId:
                  sub._id,

                averageRating: 0,
                total: 0,
              });
            }
          }
        }

        setFeedbackEvents(
          feedbackSummary
        );
      } catch (err) {
        console.error(err);

        toast.error(
          "Failed to load feedbacks"
        );
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Event Feedbacks
          </h1>

          <p className="mt-1 text-slate-400">
            View all feedbacks event-wise
          </p>
        </div>

        <button
          onClick={load}
          className="rounded-lg border border-slate-700 px-4 py-2 hover:bg-slate-800"
        >
          Refresh
        </button>
      </div>

      {feedbackEvents.length ===
      0 ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 text-slate-400">
          No feedbacks available
        </div>
      ) : (
        <div className="space-y-4">
          {feedbackEvents.map(
            (
              item,
              index
            ) => (
              <div
                key={index}
                className="rounded-xl border border-slate-700 bg-slate-900 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {
                        item.eventName
                      }
                    </h2>

                    <p className="text-slate-400">
                      {
                        item.subeventName
                      }
                    </p>
                  </div>

                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-sm text-slate-400">
                        Avg Rating
                      </p>

                      <p className="text-2xl font-bold">
                        ⭐
                        {
                          item.averageRating
                        }
                        /5
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">
                        Feedbacks
                      </p>

                      <p className="text-2xl font-bold">
                        {
                          item.total
                        }
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/coordinator/feedbacks/${item.subeventId}`
                        )
                      }
                      className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
                    >
                      View Feedback
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

