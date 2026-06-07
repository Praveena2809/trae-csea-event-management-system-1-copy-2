import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { api } from "../services/api";
import AnnouncementBanner from "../components/AnnouncementBanner";
function EventMiniCard({ subevent }) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
      <div className="h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{subevent.name}</p>
        <p className="truncate text-xs text-slate-600 dark:text-slate-300">{subevent.description}</p>
        <div className="mt-2">
          <Link
            to="/login"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState({ events: [] });
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await api.get("/events/public");
      setData(res.data);
    })();
  }, []);

  const subevents = useMemo(() => data.events.flatMap((e) => e.subevents || []), [data.events]);
  const now = new Date();

  const live = subevents.filter((s) => new Date(s.startAt) <= now && new Date(s.endAt) >= now);
  const upcoming = subevents
    .filter((s) => new Date(s.startAt) > now)
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
    .slice(0, 6);

  const calendarEvents = subevents.map((s) => ({
    id: s._id,
    title: s.name,
    start: s.startAt,
    end: s.endAt,
    extendedProps: {
      venue: s.venue?.name || "TBA",
      description: s.description,
    },
  }));

  return (
    <div className="space-y-10">
      <AnnouncementBanner />
      {/* Hero */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="grid gap-6 p-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Anna University Affiliated College</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
              Department of Computer Science and Engineering
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Welcome to the CSE Event Management System. Discover live & upcoming events, register quickly, pay
              securely, and get certificates instantly.
            </p>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              About Us: We organize workshops, competitions, and flagship department events to build skills and
              community.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                to="/events"
                className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Browse Events
              </Link>
              <Link
                to="/login"
                className="rounded-md border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Participant Login
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="relative rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-8 text-left text-white shadow-lg dark:border-slate-800">
              <p className="text-sm font-semibold">Quick Stats</p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/15 p-4">
                  <p className="text-2xl font-bold">{data.events.length}</p>
                  <p className="text-xs opacity-90">Main Events</p>
                </div>
                <div className="rounded-xl bg-white/15 p-4">
                  <p className="text-2xl font-bold">{live.length}</p>
                  <p className="text-xs opacity-90">Live</p>
                </div>
                <div className="rounded-xl bg-white/15 p-4">
                  <p className="text-2xl font-bold">{upcoming.length}</p>
                  <p className="text-xs opacity-90">Upcoming</p>
                </div>
              </div>
              <p className="mt-6 text-sm opacity-90">Hover the calendar events to preview venue, timing & details.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar + Live/Upcoming */}
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <p className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Event Calendar</p>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            events={calendarEvents}
            eventMouseEnter={(info) => {
              const rect = info.el.getBoundingClientRect();
              const start = new Date(info.event.start).toLocaleString("en-IN");
              const end = new Date(info.event.end).toLocaleString("en-IN");
              setTooltip({
                x: rect.left + rect.width / 2,
                y: rect.top,
                title: info.event.title,
                venue: info.event.extendedProps.venue,
                time: `${start} - ${end}`,
                description: info.event.extendedProps.description,
              });
            }}
            eventMouseLeave={() => setTooltip(null)}
          />

          {tooltip && (
            <div
              className="pointer-events-none fixed z-50 w-72 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-lg dark:border-slate-800 dark:bg-slate-950"
              style={{ left: tooltip.x, top: tooltip.y - 10 }}
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{tooltip.title}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Venue: {tooltip.venue}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">{tooltip.time}</p>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{tooltip.description}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Live Events</p>
            <div className="mt-3 space-y-3">
              {live.length ? live.slice(0, 4).map((s) => <EventMiniCard key={s._id} subevent={s} />) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">No live events right now.</p>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Events</p>
            <div className="mt-3 space-y-3">
              {upcoming.length ? upcoming.map((s) => <EventMiniCard key={s._id} subevent={s} />) : (
                <p className="text-sm text-slate-600 dark:text-slate-300">No upcoming events yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Flagship */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">Flagship Events</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Highlights of our department calendar.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {["Hackathon", "Tech Symposium", "Workshop Week", "Project Expo"].map((t) => (
            <div
              key={t}
              className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
            >
              <div className="h-24 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
              <p className="mt-3 font-semibold text-slate-900 dark:text-white">{t}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                A flagship department experience with learning, competition and fun.
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* <div className="mt-20 text-center mb-20">
  <h2 className="text-4xl font-bold mb-4 text-white">
    🏆 Top Participants
  </h2>

  <p className="text-gray-400 mb-6">
    Compete in events and earn participation points
  </p>

  <a
    href="/leaderboard"
    className="inline-block bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-2xl text-lg font-semibold transition"
  >
    View Leaderboard
  </a>
</div> */}
{/* Leaderboard CTA */}
<section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">

  <div className="mx-auto max-w-3xl">

    <div className="mb-4 text-6xl">
      🏆
    </div>

    <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
      Top Participants
    </h2>

    <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
      Participate in events, attend sessions,
      win competitions and climb the leaderboard.
    </p>

    <div className="mt-8">
      <Link
        to="/leaderboard"
        className="inline-flex items-center rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-10 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-105"
      >
        View Leaderboard →
      </Link>
    </div>

  </div>
</section>
    </div>
  );
}

