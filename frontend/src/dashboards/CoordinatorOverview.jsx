import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { api } from "../services/api";

import AnnouncementBanner from "../components/AnnouncementBanner";

export default function CoordinatorOverview() {
  const [events, setEvents] =
    useState([]);

  useEffect(() => {
    (async () => {
      const { data } =
        await api.get(
          "/events/me/list"
        );

      setEvents(
        data.events || []
      );
    })();
  }, []);

  const stats =
    useMemo(() => {
      const total =
        events.length;

      const pending =
        events.filter(
          (e) =>
            e.status ===
            "pending"
        ).length;

      const approved =
        events.filter(
          (e) =>
            e.status ===
            "approved"
        ).length;

      const rejected =
        events.filter(
          (e) =>
            e.status ===
            "rejected"
        ).length;

      return {
        total,
        pending,
        approved,
        rejected,
      };
    }, [events]);

  return (
    <div className="space-y-6">
      {/* Announcements */}
      <AnnouncementBanner />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          [
            "Total",
            stats.total,
          ],
          [
            "Pending",
            stats.pending,
          ],
          [
            "Approved",
            stats.approved,
          ],
          [
            "Rejected",
            stats.rejected,
          ],
        ].map(
          ([
            label,
            value,
          ]) => (
            <div
              key={
                label
              }
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {label}
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {value}
              </p>
            </div>
          )
        )}
      </div>

      {/* Info Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <p className="font-semibold text-slate-900 dark:text-white">
          Coordinator Guide
        </p>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Create main
          events and
          subevents.
          Pending
          items will
          appear in
          the HOD
          dashboard
          for approval.
        </p>
      </div>
    </div>
  );
}