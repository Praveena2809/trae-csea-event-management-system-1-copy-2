import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [
    editingSubevent,
    setEditingSubevent,
  ] = useState(null);
  const [
    editAvailability,
    setEditAvailability,
  ] = useState(null);
  const navigate =
  useNavigate();
  const [venues, setVenues] = useState([]);
  const [creatingFor, setCreatingFor] = useState(null);
  const [subForm, setSubForm] = useState({
    type: "workshop",
    name: "",
    description: "",
    venue: "",
    startAt: "",
    endAt: "",
    eligibility: ["1", "2", "3", "4"],
    maxParticipants: "",
    entryFee: "",
    eventManager: "",
    managerPhone: "",
    prizePool: "",
  
    totalSessions: 1,
  
    certificateSettings: {
      mode: "attendance_once",
      minimumPercentage: 80,
    },
  });
  const [subPoster, setSubPoster] = useState(null);
  const [availability, setAvailability] = useState(null);
  //added next 3 lines as new
  const [registrationsMap, setRegistrationsMap] = useState({});
  const [winnerSelections, setWinnerSelections] = useState({});
  const [runnerSelections, setRunnerSelections] = useState({});
  const load = async () => {
    const [{ data: e }, { data: v }] = await Promise.all([api.get("/events/me/list"), api.get("/venues")]);
    setEvents(e.events || []);
    setVenues(v.venues || []);
  };
  // const openEditSubevent =
  // (subevent) => {
  //   setEditingSubevent({
  //     ...subevent,
  //   });
  // };
  const openEditSubevent =
  (subevent) => {
    setEditingSubevent({
      ...subevent,

      venue:
        subevent.venue?._id ||
        subevent.venue,

      startAt:
        subevent.startAt
          ?.slice(0, 16),

      endAt:
        subevent.endAt
          ?.slice(0, 16),
    });
  };
  const openAttendance =
  async (eventId) => {
    try {
      const { data } =
        await api.patch(
          `/events/${eventId}/open-attendance`
        );

      toast.success(
        data.message
      );

      load(); // refresh events
    } catch (err) {
      toast.error(
        err?.response?.data
          ?.message ||
          "Failed to open attendance"
      );
    }
  };

const closeAttendance =
  async (eventId) => {
    try {
      const { data } =
        await api.patch(
          `/events/${eventId}/close-attendance`
        );

      toast.success(
        data.message
      );

      load(); // refresh events
    } catch (err) {
      toast.error(
        err?.response?.data
          ?.message ||
          "Failed to close attendance"
      );
    }
  };
  const requestCancel =
  async (eventId) => {
    const reason = prompt(
      "Reason for cancellation?"
    );

    if (!reason) return;

    try {
      const { data } =
        await api.patch(
          `/events/${eventId}/request-cancel`,
          { reason }
        );

      toast.success(
        data.message
      );

      load();
    } catch (err) {
      toast.error(
        err?.response?.data
          ?.message ||
          "Failed to request cancellation"
      );
    }
  };
  const requestReschedule =
  async (event) => {
    const newDate =
      prompt(
        "Enter new date (YYYY-MM-DD)"
      );

    if (!newDate) return;

    const newTime =
      prompt(
        "Enter new time"
      );

    const newVenue =
      prompt(
        "Enter new venue"
      );

    const reason =
      prompt(
        "Reason for rescheduling?"
      );

    if (!reason) return;

    try {
      const { data } =
        await api.patch(
          `/events/${event._id}/request-reschedule`,
          {
            newDate,
            newTime,
            newVenue,
            reason,
          }
        );

      toast.success(
        data.message
      );

      load();
    } catch (err) {
      toast.error(
        err?.response?.data
          ?.message ||
          "Failed to request reschedule"
      );
    }
  };
  useEffect(() => {
    load();
  }, []);

  const checkAvailability = async () => {
    if (!subForm.venue || !subForm.startAt || !subForm.endAt) {
      return;
    }
  
    try {
      const { data } = await api.get(
        `/venues/availability?venueId=${subForm.venue}&startAt=${encodeURIComponent(
          subForm.startAt
        )}&endAt=${encodeURIComponent(subForm.endAt)}`
      );
  
      setAvailability(data);
    } catch (err) {
      setAvailability({
        error:
          err?.response?.data?.message ||
          "Failed to check venue",
      });
    }
  };
  //     const checkEditAvailability =
  // async () => {
  //   if (
  //     !editingSubevent
  //       ?.venue ||
  //     !editingSubevent
  //       ?.startAt ||
  //     !editingSubevent
  //       ?.endAt
  //   )
  //     return;

  //   try {
  //     const {
  //       data,
  //     } =
  //       await api.get(
  //         `/venues/availability?venueId=${editingSubevent.venue}&startAt=${encodeURIComponent(
  //           editingSubevent.startAt
  //         )}&endAt=${encodeURIComponent(
  //           editingSubevent.endAt
  //         )}`
  //       );

  //     setEditAvailability(
  //       data
  //     );
  //   } catch (err) {
  //     setEditAvailability(
  //       {
  //         error:
  //           err
  //             ?.response
  //             ?.data
  //             ?.message ||
  //           "Failed",
  //       }
  //     );
  //   }
  // };
  //     setAvailability(data);
  //   } catch (err) {
  //     setAvailability({ error: err?.response?.data?.message || "Failed" });
  //   }
  // };
  // const checkEditAvailability =
  // async () => {
  //   if (
  //     !editingSubevent
  //       ?.venue ||
  //     !editingSubevent
  //       ?.startAt ||
  //     !editingSubevent
  //       ?.endAt
  //   ) {
  //     toast.error(
  //       "Select venue, start and end time first"
  //     );
  //     return;
  //   }

  //   try {
  //     const {
  //       data,
  //     } =
  //       await api.get(
  //         `/venues/availability?venueId=${editingSubevent.venue}&startAt=${encodeURIComponent(
  //           editingSubevent.startAt
  //         )}&endAt=${encodeURIComponent(
  //           editingSubevent.endAt
  //         )}`
  //       );

  //     setEditAvailability(
  //       data
  //     );

  //     if (
  //       data
  //         ?.conflicts
  //         ?.length
  //     ) {
  //       toast.error(
  //         "Venue conflict found"
  //       );
  //     } else {
  //       toast.success(
  //         "Venue available"
  //       );
  //     }
  //   } catch (err) {
  //     toast.error(
  //       err?.response
  //         ?.data
  //         ?.message ||
  //         "Failed to check venue"
  //     );
  //   }
  // };
  const loadRegistrations = async (
    subeventId
  ) => {
    try {
      const { data } =
        await api.get(
          `/registrations/subevent/${subeventId}`
        );
  
      setRegistrationsMap(
        (prev) => ({
          ...prev,
          [subeventId]:
            data.registrations ||
            [],
        })
      );
    } catch (err) {
      console.error(err);
    }
  };
  
  const saveResults = async (
    subeventId
  ) => {
    try {
      await api.patch(
        `/events/subevents/${subeventId}/winners`,
        {
          winnerRegistrationId:
            winnerSelections[
              subeventId
            ] || null,
  
          runnerRegistrationId:
            runnerSelections[
              subeventId
            ] || null,
        }
      );
  
      toast.success(
        "Results saved"
      );
    } catch (err) {
      toast.error(
        err?.response?.data
          ?.message ||
          "Failed to save results"
      );
    }
  };
  
  const canDeclareResults = (
    subevent
  ) => {
    return (
      subevent.type ===
        "competitive" &&
      subevent.status ===
        "approved" &&
      new Date() >
        new Date(
          subevent.endAt
        )
    );
  };
  const onCreateSubevent = async (e) => {
    e.preventDefault();
    if (!creatingFor) return;
    try {
      const fd = new FormData();
      Object.entries(subForm).forEach(([k, v]) => {
        if (typeof v === "object") {
          fd.append(k, JSON.stringify(v));
        } else {
          fd.append(k, v);
        }
      });
      if (subPoster) fd.append("poster", subPoster);
      await api.post(`/events/${creatingFor}/subevents`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Subevent created (pending HOD approval)");
      setCreatingFor(null);
      setSubPoster(null);
      setSubForm({
        type: "workshop",
        name: "",
        description: "",
        venue: "",
        startAt: "",
        endAt: "",
        eligibility: ["1", "2", "3", "4"],
        maxParticipants: "",
        entryFee: "",
        eventManager: "",
        managerPhone: "",
        prizePool: "",
        totalSessions: 1,

certificateSettings: {
  mode: "attendance_once",
  minimumPercentage: 80,
},
      });
      setAvailability(null);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    }
  };
  const resubmitSubevent =
  async () => {
    try {
      // await api.put(
      //   `/subevents/${editingSubevent._id}`,
      api.put(
        `/events/subevents/${editingSubevent._id}`,
        {
          ...editingSubevent,
          status:
            "pending_review",
        }
      );

      toast.success(
        "Subevent resubmitted to HOD"
      );

      setEditingSubevent(
        null
      );

      await load();
    } catch (err) {
      toast.error(
        err?.response?.data
          ?.message ||
          "Failed"
      );
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">My Events</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">Pending / approved / rejected events.</p>
        </div>
        <button
          onClick={load}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
        >
          Refresh
        </button>
      </div>

      {/* <div className="space-y-3">
        {events.map((e) => (
          <div key={e._id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{e.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{e.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Status: <span className="font-semibold">{e.status}</span>
                  {e.rejectionReason ? ` • Reason: ${e.rejectionReason}` : ""}
                </p>
              </div>
              <button
                onClick={() => setCreatingFor(e._id)}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Add Subevent
              </button>
            </div>
          </div>
        ))}

        {!events.length && <p className="text-sm text-slate-600 dark:text-slate-300">No events created yet.</p>}
      </div> */}
      <div className="space-y-3">
  {events.map((e) => (
    <div
      key={e._id}
      className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

{/* Left Side */}
<div>
  <p className="font-semibold text-slate-900 dark:text-white">
    {e.name}
  </p>

  <p className="text-sm text-slate-600 dark:text-slate-300">
    {e.description}
  </p>

  <p className="mt-2 text-xs text-slate-500">
    Status:
    <span className="ml-1 font-semibold">
      {e.status}
    </span>

    {e.rejectionReason
      ? ` • Reason: ${e.rejectionReason}`
      : ""}
  </p>
  {e.hodFeedback && (
  <div className="mt-3 rounded-md border border-yellow-500 bg-yellow-950/20 p-3">
    <p className="font-semibold text-yellow-400">
      HOD Feedback
    </p>

    <p className="text-sm text-slate-300">
      {
        e.hodFeedback
      }
    </p>
  </div>
)}

  <div className="mt-3">
  <span
    className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium text-white whitespace-nowrap ${
      e.attendanceEnabled
        ? "bg-green-600"
        : "bg-red-600"
    }`}
  >
    {e.attendanceEnabled
      ? "Attendance Open"
      : "Attendance Closed"}
  </span>
</div>
</div>

{/* Right Side Buttons */}
<div className="flex flex-wrap justify-start gap-3 md:justify-end">

  {e.status ===
    "approved" && (
    <>
      <button
        onClick={() =>
          setCreatingFor(
            e._id
          )
        }
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Add Subevent
      </button>

      <button
        onClick={() =>
          openAttendance(
            e._id
          )
        }
        disabled={
          e.attendanceEnabled
        }
        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
      >
        Open Attendance
      </button>

      <button
        onClick={() =>
          closeAttendance(
            e._id
          )
        }
        disabled={
          !e.attendanceEnabled
        }
        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
      >
        Close Attendance
      </button>

      <button
        onClick={() =>
          requestCancel(
            e._id
          )
        }
        className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
      >
        Request Cancel
      </button>

      <button
        onClick={() =>
          requestReschedule(
            e
          )
        }
        className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700"
      >
        Request Reschedule
      </button>
    </>
  )}

  {e.status ===
    "cancel_requested" && (
    <div className="rounded-md bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
      Cancellation Request Sent to HOD
    </div>
  )}

  {e.status ===
    "reschedule_requested" && (
    <div className="rounded-md bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-700">
      Reschedule Request Sent to HOD
    </div>
  )}

  {e.status ===
    "cancelled" && (
    <div className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
      Event Cancelled
    </div>
  )}
</div>

      </div>
      {creatingFor ===
  e._id && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-900 dark:text-white">Create Subevent</p>
            <button className="text-sm text-slate-600 hover:underline dark:text-slate-300" onClick={() => setCreatingFor(null)}>
              Close
            </button>
          </div>

          <form onSubmit={onCreateSubevent} className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Type</label>
              <select
                value={subForm.type}
                onChange={(e) => setSubForm((f) => ({ ...f, type: e.target.value }))}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <option value="workshop">Workshop</option>
                <option value="competitive">Competitive</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Venue</label>
              <select
                value={subForm.venue}
                onChange={(e) => setSubForm((f) => ({ ...f, venue: e.target.value }))}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <option value="">Select venue</option>
                {venues.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Subevent Name</label>
              <input
                value={subForm.name}
                onChange={(e) => setSubForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={subForm.description}
                onChange={(e) => setSubForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Start</label>
              <input
                type="datetime-local"
                value={subForm.startAt}
                onChange={(e) => setSubForm((f) => ({ ...f, startAt: e.target.value }))}
                onBlur={checkAvailability}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">End</label>
              <input
                type="datetime-local"
                value={subForm.endAt}
                onChange={(e) => setSubForm((f) => ({ ...f, endAt: e.target.value }))}
                onBlur={checkAvailability}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                required
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                // onClick={checkAvailability}
                onClick={() => {}}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
              >
                Check venue availability
              </button>
              {availability?.conflicts?.length ? (
                <p className="mt-2 text-sm text-red-600">
                  Conflict! This slot is already booked. Try another venue/time.
                </p>
              ) : availability && !availability.error ? (
                <p className="mt-2 text-sm text-emerald-600">No conflicts for selected venue.</p>
              ) : null}
              {availability?.suggestedAlternateVenues?.length ? (
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Suggested alternate venues: {availability.suggestedAlternateVenues.map((v) => v.name).join(", ")}
                </p>
              ) : null}
              {availability?.error ? <p className="mt-2 text-sm text-red-600">{availability.error}</p> : null}
            </div>

            <div>
            <div>
  <label className="text-sm font-medium">
    Eligibility
  </label>

  <div className="mt-2 space-y-2">
    {[
      "1",
      "2",
      "3",
      "4",
    ].map((year) => (
      <label
        key={year}
        className="flex items-center gap-2"
      >
        <input
          type="checkbox"
          checked={subForm.eligibility.includes(
            year
          )}
          onChange={(e) => {
            if (e.target.checked) {
              setSubForm((f) => ({
                ...f,
                eligibility: [
                  ...f.eligibility,
                  year,
                ],
              }));
            } else {
              setSubForm((f) => ({
                ...f,
                eligibility:
                  f.eligibility.filter(
                    (y) => y !== year
                  ),
              }));
            }
          }}
        />

        {year} Year
      </label>
    ))}
  </div>
</div>
            </div>
            <div>
              <label className="text-sm font-medium">Max participants</label>
              <input
                value={subForm.maxParticipants}
                onChange={(e) => setSubForm((f) => ({ ...f, maxParticipants: e.target.value }))}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Entry fee (₹)</label>
              <input
                value={subForm.entryFee}
                onChange={(e) => setSubForm((f) => ({ ...f, entryFee: e.target.value }))}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Poster</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSubPoster(e.target.files?.[0] || null)}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Event manager</label>
              <input
                value={subForm.eventManager}
                onChange={(e) => setSubForm((f) => ({ ...f, eventManager: e.target.value }))}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Manager phone</label>
              <input
                value={subForm.managerPhone}
                onChange={(e) => setSubForm((f) => ({ ...f, managerPhone: e.target.value }))}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Prize pool</label>
              <input
                value={subForm.prizePool}
                onChange={(e) => setSubForm((f) => ({ ...f, prizePool: e.target.value }))}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              />
            </div>
            <div>
  <label className="text-sm font-medium">
    Number of Sessions
  </label>

  <input
    type="number"
    min="1"
    value={subForm.totalSessions}
    onChange={(e) =>
      setSubForm((f) => ({
        ...f,
        totalSessions: e.target.value,
      }))
    }
    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
  />
</div>

<div>
  <label className="text-sm font-medium">
    Certificate Rule
  </label>

  <select
    value={subForm.certificateSettings.mode}
    onChange={(e) =>
      setSubForm((f) => ({
        ...f,
        certificateSettings: {
          ...f.certificateSettings,
          mode: e.target.value,
        },
      }))
    }
    className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
  >
    <option value="attendance_once">
      One Attendance Required
    </option>

    <option value="attendance_percentage">
      Minimum Attendance Percentage
    </option>
  </select>
</div>

{subForm.certificateSettings.mode ===
  "attendance_percentage" && (
  <div>
    <label className="text-sm font-medium">
      Minimum Attendance %
    </label>

    <input
      type="number"
      min="1"
      max="100"
      value={
        subForm.certificateSettings
          .minimumPercentage
      }
      onChange={(e) =>
        setSubForm((f) => ({
          ...f,
          certificateSettings: {
            ...f.certificateSettings,
            minimumPercentage:
              e.target.value,
          },
        }))
      }
      className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
    />
  </div>
)}
            <button
              className="md:col-span-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Create Subevent
            </button>
          </form>
        </div>
      )}
      {/* Subevents */}
      <div className="mt-4 space-y-3">
        {e.subevents?.map(
          (sub) => (
            <div
              key={sub._id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"
            >
              <p className="font-medium text-slate-900 dark:text-white">
                {sub.name}
              </p>

              {/* <p className="text-sm text-slate-500">
                {sub.type} •{" "}
                {sub.status}
              </p>
               */}
               <p className="text-sm text-slate-500">
  {sub.type} •{" "}

  <span
    className={`font-semibold ${
      sub.status ===
      "approved"
        ? "text-green-500"
        : sub.status ===
          "revision_requested"
        ? "text-red-500"
        : sub.status ===
          "pending_review"
        ? "text-yellow-500"
        : "text-slate-400"
    }`}
  >
    {sub.status}
  </span>
</p>
{/* <div className="mt-4 flex flex-wrap items-center gap-3">

  <button
    onClick={() =>
      navigate(
        `/coordinator/feedbacks/${sub._id}`
      )
    }
    className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
  >
    View Feedback
  </button>

  <button
    onClick={() =>
      loadParticipants(
        sub._id
      )
    }
    className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
  >
    Load Participants
  </button>

  <div className="relative">

    <select
      className="
        appearance-none
        rounded-xl
        border border-slate-700
        bg-slate-900
        px-5 py-3 pr-12
        text-sm font-semibold
        text-white
        transition
        hover:border-indigo-500
        hover:bg-slate-800
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
      "
      defaultValue=""
      onChange={async (e) => {
        const type =
          e.target.value;

        if (!type) return;

        try {
          const response =
            await api.get(
              `/events/export-participants/${sub._id}?type=${type}`,
              {
                responseType:
                  "blob",
              }
            );

          const url =
            window.URL.createObjectURL(
              new Blob([
                response.data,
              ])
            );

          const link =
            document.createElement(
              "a"
            );

          link.href = url;

          link.setAttribute(
            "download",
            `${type}-participants.csv`
          );

          document.body.appendChild(
            link
          );

          link.click();

          link.remove();

          toast.success(
            "Sheet exported"
          );
        } catch (err) {
          toast.error(
            "Export failed"
          );
        }

        e.target.value = "";
      }}
    >
      <option value="">
        📄 Export Sheet
      </option>

      <option value="all">
        👥 All Registered
      </option>

      <option value="attended">
        ✅ Attended Only
      </option> */}

      {/* <option value="winners">
        🏆 Winners Only
      </option>
    </select>

    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
      ▼
    </div>

  </div>

</div> */}
{sub.status ===
  "revision_requested" &&
//   sub.rejectionReason && (
//     <div className="mb-4 rounded-md border border-red-500 bg-red-950/20 p-3">
//       <p className="font-semibold text-red-400">
//         HOD Revision Reason
//       </p>

//       <p className="text-sm text-slate-300">
//         {
//           sub.rejectionReason
//         }
//       </p>
//     </div>
// )
<div className="space-y-2">
  <p className="font-semibold text-red-400">
    HOD Revision Message
  </p>

  <p className="text-sm text-slate-300">
  {sub.hodFeedback ||
 sub.rejectionReason ||
 "No feedback"}
  </p>

  {e.hodFeedback && (
    <div className="rounded-md border border-yellow-600 bg-yellow-950/20 p-3">
      <p className="font-semibold text-yellow-300">
        Event Feedback
      </p>

      <p className="text-sm text-slate-300">
        {e.hodFeedback}
      </p>
    </div>
  )}
</div>}
<div className="mt-4 flex flex-wrap items-center gap-3">

{/* View Feedback */}
<button
  onClick={() =>
    navigate(
      `/coordinator/feedbacks/${sub._id}`
    )
  }
  className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
>
  View Feedback
</button>
{sub.status ===
  "revision_requested" && (
  <button
    onClick={() =>
      openEditSubevent(
        sub
      )
    }
    className="rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-600"
  >
    Edit &
    Resubmit
  </button>
  
)}
      {editingSubevent?._id ===
  sub._id && (
    <div className="mt-4 grid gap-4 md:grid-cols-2">

  {/* HOD FEEDBACK */}
  <div className="md:col-span-2 rounded-md border border-red-500 bg-red-950/20 p-4">
    <p className="font-semibold text-red-400">
      HOD Revision Message
    </p>

    <p className="mt-1 text-sm text-slate-300">
    {editingSubevent.hodFeedback ||
 editingSubevent.rejectionReason ||
 "No feedback"}
    </p>
  </div>

  {/* TYPE */}
  <div>
    <label className="text-sm font-medium text-white">
      Type
    </label>

    <select
      value={editingSubevent.type}
      onChange={(e) =>
        setEditingSubevent((prev) => ({
          ...prev,
          type: e.target.value,
        }))
      }
      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
    >
      <option value="workshop">
        Workshop
      </option>

      <option value="competitive">
        Competitive
      </option>
    </select>
  </div>

  {/* VENUE */}
  <div>
    <label className="text-sm font-medium text-white">
      Venue
    </label>

    <select
      value={editingSubevent.venue}
      onChange={(e) =>
        setEditingSubevent((prev) => ({
          ...prev,
          venue: e.target.value,
        }))
      }
      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
    >
      <option value="">
        Select venue
      </option>

      {venues.map((v) => (
        <option
          key={v._id}
          value={v._id}
        >
          {v.name}
        </option>
      ))}
    </select>
  </div>

  {/* NAME */}
  <div className="md:col-span-2">
    <label className="text-sm font-medium text-white">
      Subevent Name
    </label>

    <input
      value={editingSubevent.name || ""}
      onChange={(e) =>
        setEditingSubevent((prev) => ({
          ...prev,
          name: e.target.value,
        }))
      }
      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
    />
  </div>

  {/* DESCRIPTION */}
  <div className="md:col-span-2">
    <label className="text-sm font-medium text-white">
      Description
    </label>

    <textarea
      rows={3}
      value={
        editingSubevent.description || ""
      }
      onChange={(e) =>
        setEditingSubevent((prev) => ({
          ...prev,
          description:
            e.target.value,
        }))
      }
      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
    />
  </div>

  {/* START */}
  <div>
    <label className="text-sm font-medium text-white">
      Start
    </label>

    <input
      type="datetime-local"
      value={
        editingSubevent.startAt || ""
      }
      onChange={(e) =>
        setEditingSubevent((prev) => ({
          ...prev,
          startAt:
            e.target.value,
        }))
      }
      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
    />
  </div>

  {/* END */}
  <div>
    <label className="text-sm font-medium text-white">
      End
    </label>

    <input
      type="datetime-local"
      value={
        editingSubevent.endAt || ""
      }
      onChange={(e) =>
        setEditingSubevent((prev) => ({
          ...prev,
          endAt:
            e.target.value,
        }))
      }
      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
    />
  </div>

  {/* CHECK VENUE */}
  <div className="md:col-span-2">
    <button
      type="button"
      onClick={() => {}}
      className="rounded-md border border-slate-500 px-4 py-2 text-white"
    >
      Check Venue Availability
    </button>
  </div>

  {/* ELIGIBILITY */}
  <div>
    <label className="text-sm font-medium text-white">
      Eligibility
    </label>

    <div>
  <label className="text-sm font-medium text-white">
    Eligibility
  </label>

  <div className="mt-2 space-y-2">
    {["1", "2", "3", "4"].map(
      (year) => (
        <label
          key={year}
          className="flex items-center gap-2 text-white"
        >
          <input
            type="checkbox"
            checked={
              editingSubevent.eligibility?.includes(
                year
              ) || false
            }
            onChange={(e) => {
              if (e.target.checked) {
                setEditingSubevent(
                  (prev) => ({
                    ...prev,
                    eligibility: [
                      ...(prev.eligibility ||
                        []),
                      year,
                    ],
                  })
                );
              } else {
                setEditingSubevent(
                  (prev) => ({
                    ...prev,
                    eligibility:
                      prev.eligibility.filter(
                        (y) =>
                          y !== year
                      ),
                  })
                );
              }
            }}
          />

          {year} Year
        </label>
      )
    )}
  </div>
</div>
  </div>

  {/* MAX PARTICIPANTS */}
  <div>
    <label className="text-sm font-medium text-white">
      Max Participants
    </label>

    <input
      value={
        editingSubevent.maxParticipants || ""
      }
      onChange={(e) =>
        setEditingSubevent((prev) => ({
          ...prev,
          maxParticipants:
            e.target.value,
        }))
      }
      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
    />
  </div>

  {/* ENTRY FEE */}
  <div>
    <label className="text-sm font-medium text-white">
      Entry Fee
    </label>

    <input
      value={
        editingSubevent.entryFee || ""
      }
      onChange={(e) =>
        setEditingSubevent((prev) => ({
          ...prev,
          entryFee:
            e.target.value,
        }))
      }
      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
    />
  </div>

  {/* EVENT MANAGER */}
  <div>
    <label className="text-sm font-medium text-white">
      Event Manager
    </label>

    <input
      value={
        editingSubevent.eventManager || ""
      }
      onChange={(e) =>
        setEditingSubevent((prev) => ({
          ...prev,
          eventManager:
            e.target.value,
        }))
      }
      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
    />
  </div>

  {/* PHONE */}
  <div>
    <label className="text-sm font-medium text-white">
      Manager Phone
    </label>

    <input
      value={
        editingSubevent.managerPhone || ""
      }
      onChange={(e) =>
        setEditingSubevent((prev) => ({
          ...prev,
          managerPhone:
            e.target.value,
        }))
      }
      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
    />
  </div>

  {/* PRIZE POOL */}
  {/* <div>
    <label className="text-sm font-medium text-white">
      Prize Pool
    </label>
    <div>

    <input
      value={
        editingSubevent.prizePool || ""
      }
      onChange={(e) =>
        setEditingSubevent((prev) => ({
          ...prev,
          prizePool:
            e.target.value,
        }))
      }
      className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
    />
  </div> */}
  {/* PRIZE POOL */}
<div>
  <label className="text-sm font-medium text-white">
    Prize Pool
  </label>

  <input
    value={editingSubevent.prizePool || ""}
    onChange={(e) =>
      setEditingSubevent((prev) => ({
        ...prev,
        prizePool: e.target.value,
      }))
    }
    className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
  />
</div>

  {/* RESUBMIT */}
  <div className="md:col-span-2">
    <button
      onClick={
        resubmitSubevent
      }
      className="rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
    >
      Resubmit to HOD
    </button>
  </div>
</div>
)}
 
{/* Load Participants */}
<button
  onClick={() =>
    loadRegistrations(
      sub._id
    )
  }
  className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
>
  Load Participants
</button>

{/* Export Sheet */}
<div className="relative">
  <select
    className="
      appearance-none
      rounded-xl
      border border-slate-700
      bg-slate-900
      px-5 py-3 pr-12
      text-sm font-semibold
      text-white
      transition
      hover:border-indigo-500
      hover:bg-slate-800
      focus:outline-none
      focus:ring-2
      focus:ring-indigo-500
    "
    defaultValue=""
    onChange={async (e) => {
      const type =
        e.target.value;

      if (!type) return;

      try {
        const response =
          await api.get(
            `/events/export-participants/${sub._id}?type=${type}`,
            {
              responseType:
                "blob",
            }
          );

        const url =
          window.URL.createObjectURL(
            new Blob([
              response.data,
            ])
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.setAttribute(
          "download",
          `${type}-participants.csv`
        );

        document.body.appendChild(
          link
        );

        link.click();
        link.remove();

        toast.success(
          "Sheet exported"
        );
      } catch (err) {
        toast.error(
          "Export failed"
        );
      }

      e.target.value = "";
    }}
  >
    <option value="">
      📄 Export Sheet
    </option>

    <option value="all">
      👥 All Registered
    </option>

    <option value="attended">
      ✅ Attended Only
    </option>

    <option value="winners">
      🏆 Winners Only
    </option>
  </select>

  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
    ▼
  </div>
</div>

</div>
              {canDeclareResults(
                sub
              ) && (
                <div className="mt-4 space-y-3">
                  {/* {!registrationsMap[
                    sub._id
                  ] && (
                    <button
                      onClick={() =>
                        loadRegistrations(
                          sub._id
                        )
                      }
                      className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
                    >
                      Load Participants
                    </button>
                    
                  )} */}

                  {registrationsMap[
                    sub._id
                  ] && (
                    <>
                      <div>
                        <label className="text-sm font-medium">
                          Winner
                        </label>

                        <select
                          value={
                            winnerSelections[
                              sub._id
                            ] || ""
                          }
                          onChange={(
                            e
                          ) =>
                            setWinnerSelections(
                              (
                                prev
                              ) => ({
                                ...prev,
                                [sub._id]:
                                  e
                                    .target
                                    .value,
                              })
                            )
                          }
                          className="mt-1 w-full rounded-md border px-3 py-2 text-black"
                        >
                          <option value="">
                            Select Winner
                          </option>

                          {registrationsMap[
                            sub._id
                          ]?.map(
                            (
                              r
                            ) => (
                              <option
                                key={
                                  r._id
                                }
                                value={
                                  r._id
                                }
                              >
                                {
                                  r
                                    .participant
                                    ?.name
                                }
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Runner
                        </label>

                        <select
                          value={
                            runnerSelections[
                              sub._id
                            ] || ""
                          }
                          onChange={(
                            e
                          ) =>
                            setRunnerSelections(
                              (
                                prev
                              ) => ({
                                ...prev,
                                [sub._id]:
                                  e
                                    .target
                                    .value,
                              })
                            )
                          }
                          className="mt-1 w-full rounded-md border px-3 py-2 text-black"
                        >
                          <option value="">
                            Select Runner
                          </option>

                          {registrationsMap[
                            sub._id
                          ]?.map(
                            (
                              r
                            ) => (
                              <option
                                key={
                                  r._id
                                }
                                value={
                                  r._id
                                }
                              >
                                {
                                  r
                                    .participant
                                    ?.name
                                }
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <button
                        onClick={() =>
                          saveResults(
                            sub._id
                          )
                        }
                        className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                      >
                        Save Results
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  ))}

  {!events.length && (
    <p className="text-sm text-slate-600 dark:text-slate-300">
      No events created yet.
    </p>
  )}
</div>

      

    </div>
  );
}

