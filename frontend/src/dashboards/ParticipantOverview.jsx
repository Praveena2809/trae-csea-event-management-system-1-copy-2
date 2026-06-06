import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import { api } from "../services/api";

import AnnouncementBanner from "../components/AnnouncementBanner";

export default function ParticipantOverview() {
  const [regs, setRegs] =
    useState([]);

  useEffect(() => {
    (async () => {
      const { data } =
        await api.get(
          "/registrations/me"
        );

      setRegs(
        data.registrations ||
          []
      );
    })();
  }, []);

  const stats =
    useMemo(() => {
      const total =
        regs.length;

      const paid =
        regs.filter(
          (r) =>
            r.status ===
            "paid"
        ).length;

      const attended =
        regs.filter(
          (r) =>
            r.status ===
            "attended"
        ).length;

      return {
        total,
        paid,
        attended,
      };
    }, [regs]);

  return (
    <div className="space-y-6">
      {/* Announcements */}
      <AnnouncementBanner />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          [
            "Registered",
            stats.total,
          ],
          [
            "Paid",
            stats.paid,
          ],
          [
            "Attended",
            stats.attended,
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

      {/* Next Step */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <p className="font-semibold text-slate-900 dark:text-white">
          Next Step
        </p>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Browse
          subevents
          and
          register.
          After
          registration
          you
          will
          get
          a
          QR
          code;
          after
          attendance
          you
          can
          download
          the
          certificate.
        </p>

        <div className="mt-4">
          <Link
            to="/events"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Browse
            Events
          </Link>
        </div>
      </div>
    </div>
  );
}