import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [creatingFor, setCreatingFor] = useState(null);
  const [subForm, setSubForm] = useState({
    type: "workshop",
    name: "",
    description: "",
    venue: "",
    startAt: "",
    endAt: "",
    eligibility: "",
    maxParticipants: "",
    entryFee: "",
    eventManager: "",
    managerPhone: "",
    prizePool: "",
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
  useEffect(() => {
    load();
  }, []);

  const checkAvailability = async () => {
    if (!subForm.venue || !subForm.startAt || !subForm.endAt) return;
    try {
      const { data } = await api.get(
        `/venues/availability?venueId=${subForm.venue}&startAt=${encodeURIComponent(subForm.startAt)}&endAt=${encodeURIComponent(
          subForm.endAt
        )}`
      );
      setAvailability(data);
    } catch (err) {
      setAvailability({ error: err?.response?.data?.message || "Failed" });
    }
  };
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
      Object.entries(subForm).forEach(([k, v]) => fd.append(k, v));
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
        eligibility: "",
        maxParticipants: "",
        entryFee: "",
        eventManager: "",
        managerPhone: "",
        prizePool: "",
      });
      setAvailability(null);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
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
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
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
          <div className="mt-2">
  <span
    className={`rounded px-2 py-1 text-xs text-white ${
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

        {/* <button
          onClick={() =>
            setCreatingFor(e._id)
          }
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Add Subevent
        </button> */}
        <div className="flex flex-wrap gap-2">
  <button
    onClick={() =>
      setCreatingFor(
        e._id
      )
    }
    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
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
    className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
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
    className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
  >
    Close Attendance
  </button>
</div>
      </div>

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

              <p className="text-sm text-slate-500">
                {sub.type} •{" "}
                {sub.status}
              </p>

              {canDeclareResults(
                sub
              ) && (
                <div className="mt-4 space-y-3">
                  {!registrationsMap[
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
                  )}

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

      {creatingFor && (
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
                onClick={checkAvailability}
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
              <label className="text-sm font-medium">Eligibility</label>
              <input
                value={subForm.eligibility}
                onChange={(e) => setSubForm((f) => ({ ...f, eligibility: e.target.value }))}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
              />
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

            <button
              className="md:col-span-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Create Subevent
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

