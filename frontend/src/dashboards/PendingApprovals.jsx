import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

export default function PendingApprovals() {
  // const [data, setData] = useState({
  //   events: [],
  //   subevents: [],
  // });
  const [data, setData] =
  useState({
    proposals: [],
    pendingSubevents: [],
  });

  const [reason, setReason] =
    useState({});
    const [
      standaloneReviews,
      setStandaloneReviews,
    ] = useState({});

  const load = async () => {
    const { data } =
      await api.get(
        "/events/hod/pending"
      );
      console.log("HOD DATA", data);
      console.log(
        "PENDING SUBEVENTS",
        data.pendingSubevents
      );
    // setData({
    //   events:
    //     data.events || [],
    //   subevents:
    //     data.subevents ||
    //     [],
    // });
    setData({
      proposals:
        data.proposals || [],
    
      pendingSubevents:
        data.pendingSubevents ||
        [],
    });
  };

  useEffect(() => {
    load();
  }, []);

  //
  // NORMAL EVENT APPROVAL
  //

  const approveEvent =
    async (id) => {
      await api.post(
        `/events/hod/events/${id}/approve`
      );

      toast.success(
        "Event approved"
      );

      load();
    };

  const rejectEvent =
    async (id) => {
      await api.post(
        `/events/hod/events/${id}/reject`,
        {
          reason:
            reason[id] ||
            "Not specified",
        }
      );

      toast.success(
        "Event rejected"
      );

      load();
    };

  //
  // SUBEVENT APPROVAL
  //

  const approveSubevent =
    async (id) => {
      await api.post(
        `/events/hod/subevents/${id}/approve`
      );

      toast.success(
        "Subevent approved"
      );

      load();
    };

  const rejectSubevent =
    async (id) => {
      await api.post(
        `/events/hod/subevents/${id}/reject`,
        {
          reason:
            reason[id] ||
            "Not specified",
        }
      );

      toast.success(
        "Subevent rejected"
      );

      load();
    };
    const reviewStandaloneSubevent =
  async (subevent) => {
    const review =
      standaloneReviews[
        subevent._id
      ];

  

      if (review.action === "approved") {
        await api.post(
          `/events/hod/subevents/${subevent._id}/approve`
        );
      }
      else if (
        review.action === "revision_requested"
      ) {
        await api.post(
          `/events/hod/subevents/${subevent._id}/reject`,
          {
            reason: review.reason,
            action: "revision_requested",
          }
        );
      }
      else if (
        review.action === "rejected"
      ) {
        await api.post(
          `/events/hod/subevents/${subevent._id}/reject`,
          {
            reason: review.reason,
            action: "rejected",
          }
        );
      }
  };
    const reviewProposal =
  async (
    eventId,
    subevents
  ) => {
    try {
      const payload = {
        overallFeedback:
          reason[
            `event-${eventId}`
          ] || "",

        subevents:
          subevents.map(
            (s) => ({
              subeventId:
                s._id,

                action:
                reason[
                  `decision-${s._id}`
                ] ||
                "revision_requested",

              reason:
                reason[
                  s._id
                ] || "",
            })
          ),
      };
      for (const s of subevents) {
        const action =
          reason[`decision-${s._id}`];
      
        if (
          (action === "rejected" ||
            action ===
              "revision_requested") &&
          !reason[s._id]
        ) {
          toast.error(
            `Please enter a reason for ${s.name}`
          );
          return;
        }
      }
      await api.put(
        `/events/hod/events/${eventId}/review-proposal`,
        payload
      );

      toast.success(
        "Proposal reviewed"
      );

      load();
    } catch (err) {
      toast.error(
        err?.response?.data
          ?.message ||
          "Failed"
      );
    }
  };

  //
  // NEW: CANCEL APPROVAL
  //

  const approveCancel =
    async (id) => {
      try {
        await api.patch(
          `/events/hod/events/${id}/approve-cancel`
        );

        toast.success(
          "Event cancelled"
        );

        load();
      } catch (err) {
        toast.error(
          err?.response?.data
            ?.message ||
            "Failed"
        );
      }
    };

  //
  // NEW: RESCHEDULE APPROVAL
  //

  const approveReschedule =
    async (id) => {
      try {
        await api.patch(
          `/events/hod/events/${id}/approve-reschedule`
        );

        toast.success(
          "Event rescheduled"
        );

        load();
      } catch (err) {
        toast.error(
          err?.response?.data
            ?.message ||
            "Failed"
        );
      }
    };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Pending Approvals
        </h3>

        <button
          onClick={load}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
        >
          Refresh
        </button>
      </div>

      {/* MAIN EVENTS */}

     {/* EVENT PROPOSALS */}

<div className="space-y-3">
  <p className="font-semibold text-slate-900 dark:text-white">
    Event Proposals
  </p>

  {(
  data.proposals || []
).map(    (proposal) => (
      <div
        key={proposal.event._id}
        className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
      >
        {/* EVENT DETAILS

        <div className="mb-4">
          <p className="text-lg font-bold">
            {proposal.event.name}
          </p>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            {proposal.event.description}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Created by:{" "}
            {
              proposal.event
                .createdBy?.name
            }{" "}
            (
            {
              proposal.event
                .createdBy?.email
            }
            )
          </p>
        </div> */}
{/* EVENT DETAILS */}
{proposal.event.posterUrl ? (
  <img
  src={`http://localhost:8000${proposal.event.posterUrl}`}
    alt={proposal.event.name}
    className="mb-4 h-64 w-full rounded-lg object-cover"
  />
) : (
  <div className="mb-4 flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-slate-600">
    No Event Poster Uploaded
  </div>
)}
<div className="mb-4 rounded-lg bg-slate-800 p-4">
  <h3 className="text-lg font-bold">
    Proposal Package Summary
  </h3>

  <p>
    Total Subevents:
    {" "}
    {proposal.subevents?.length || 0}
  </p>

  <p>
    Expected Participants:
    {" "}
    {proposal.subevents?.reduce(
      (sum, s) =>
        sum +
        (s.maxParticipants || 0),
      0
    )}
  </p>

  <p>
    Coordinator:
    {" "}
    {proposal.event.createdBy?.name}
  </p>
</div>
<div className="mb-6 rounded-lg border border-slate-700 p-4">
  <h2 className="text-2xl font-bold">
    {proposal.event.name}
  </h2>

  <p className="mt-2 text-slate-300">
    {proposal.event.description}
  </p>

  <div className="mt-4 grid gap-2 md:grid-cols-2 text-sm text-slate-300">
  <p>
  <strong>Total Capacity:</strong>{" "}
  {proposal.subevents?.reduce(
    (sum, s) =>
      sum + (s.maxParticipants || 0),
    0
  )}
</p>

<p>
  <strong>Total Prize Pool:</strong>{" "}
  ₹
  {proposal.subevents?.reduce(
    (sum, s) =>
      sum +
      Number(s.prizePool || 0),
    0
  )}
</p>
<p className="mt-2 text-sm text-slate-400">
  Phone: {
    proposal.event.createdBy?.phone
  }
</p>
    <p>
      <strong>
        Event Type:
      </strong>{" "}
      {
        proposal.event
          .eventType
      }
    </p>

    <p>
      <strong>
        Date:
      </strong>{" "}
      {new Date(
        proposal.event.date
      ).toLocaleDateString()}
    </p>

    <p>
      <strong>
        Budget:
      </strong>{" "}
      ₹
      {
        proposal.event
          .budgetEstimate
      }
    </p>

    <p>
      <strong>
        Number of Subevents:
      </strong>{" "}
      {
        proposal.event
          .numberOfSubevents
      }
    </p>
  </div>

  <div className="mt-4">
    <p className="font-semibold">
      Notes for HOD
    </p>

    <p className="text-sm text-slate-400">
      {
        proposal.event
          .miscNotesForHod
      }
    </p>
  </div>

  <div className="mt-4 text-sm text-slate-400">
    Coordinator:
    {" "}
    {
      proposal.event
        .createdBy?.name
    }
    {" "}
    (
    {
      proposal.event
        .createdBy?.email
    }
    )
  </div>
  <div className="mt-4 rounded-lg bg-blue-950/30 p-3">
  <p className="font-semibold">
    Approval Checklist
  </p>

  <ul className="mt-2 list-disc pl-5 text-sm">
    <li>
      Event poster uploaded:
      {" "}
      {proposal.event.posterUrl
        ? "✅"
        : "❌"}
    </li>

    <li>
      All subevents have venues:
      {" "}
      {proposal.subevents?.every(
        (s) => s.venue
      )
        ? "✅"
        : "❌"}
    </li>

    <li>
      All subevents have managers:
      {" "}
      {proposal.subevents?.every(
        (s) => s.eventManager
      )
        ? "✅"
        : "❌"}
    </li>
  </ul>
</div>
</div>
        {/* SUBEVENTS */}

        <div className="space-y-4">
        {(
  proposal.subevents || []
).map(
            (s) => (
              <div
                key={s._id}
                className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
              >
                {/* <p className="font-semibold">
                  {s.name}
                </p>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {
                    s.description
                  }
                </p>

                <div className="mt-2 text-sm text-slate-500">
                  Venue:{" "}
                  {s.venue?.name ||
                    "N/A"}
                </div> */}
    
 {s.posterUrl ? (
  <img
  src={`http://localhost:8000${s.posterUrl}`}
    alt={s.name}
    className="mb-3 h-48 w-full rounded-lg object-cover"
  />
) : (
  <div className="mb-3 flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-slate-600">
    No Subevent Poster Uploaded
  </div>
)}
                <div className="flex items-center justify-between">
  <h4 className="text-lg font-bold">
    {s.name}
  </h4>

  <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs">
    Pending Review
  </span>
</div>

<p className="mt-1 text-sm text-slate-300">
  {s.description}
</p>

<div className="mt-4 grid gap-2 md:grid-cols-2 text-sm">
  <p>
    <strong>
      Type:
    </strong>{" "}
    {s.type}
  </p>

  <p>
    <strong>
      Venue:
    </strong>{" "}
    {s.venue?.name ||
      "Not selected"}
  </p>

  <p>
    <strong>
      Start Time:
    </strong>{" "}
    {s.startAt
      ? new Date(
          s.startAt
        ).toLocaleString()
      : "N/A"}
  </p>

  <p>
    <strong>
      End Time:
    </strong>{" "}
    {s.endAt
      ? new Date(
          s.endAt
        ).toLocaleString()
      : "N/A"}
  </p>

  <p>
    <strong>
      Eligibility:
    </strong>{" "}
    {Array.isArray(s.eligibility)
  ? s.eligibility.join(", ")
  : s.eligibility || "N/A"}
  </p>

  <p>
    <strong>
      Max Participants:
    </strong>{" "}
    {
      s.maxParticipants
    }
  </p>

  <p>
    <strong>
      Entry Fee:
    </strong>{" "}
    ₹{s.entryFee}
  </p>

  <p>
    <strong>
      Event Manager:
    </strong>{" "}
    {
      s.eventManager
    }
  </p>

  <p>
    <strong>
      Manager Phone:
    </strong>{" "}
    {
      s.managerPhone
    }
  </p>

  <p>
    <strong>
      Prize Pool:
    </strong>{" "}
    {s.prizePool ||
      "N/A"}
  </p>
  <div className="rounded-lg border border-slate-700 p-3">
  <p className="font-semibold">
    Attendance & Certificate
  </p>

  <p>
    Sessions:
    {" "}
    {s.totalSessions || 1}
  </p>

  <p>
    Rule:
    {" "}
    {s.certificateSettings?.mode ===
    "attendance_percentage"
      ? `Minimum ${s.certificateSettings?.minimumPercentage}% attendance required`
      : "At least one attendance required"}
  </p>
</div>
</div>

                {/* APPROVE / REVISION */}

                <div className="mt-4 flex gap-5">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`decision-${s._id}`}
                      checked={
                        reason[
                          `decision-${s._id}`
                        ] ===
                        "approved"
                      }
                      onChange={() =>
                        setReason(
                          (
                            r
                          ) => ({
                            ...r,
                            [
                              `decision-${s._id}`
                            ]:
                              "approved",
                          })
                        )
                      }
                    />

                    Approve
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`decision-${s._id}`}
                      checked={
                        reason[
                          `decision-${s._id}`
                        ] ===
                        "revision_requested"
                      }
                      onChange={() =>
                        setReason(
                          (
                            r
                          ) => ({
                            ...r,
                            [
                              `decision-${s._id}`
                            ]:
                              "revision_requested",
                          })
                        )
                      }
                    />

                    Request
                    Revision
                  </label>
                </div>
                <label className="flex items-center gap-2">
  <input
    type="radio"
    name={`decision-${s._id}`}
    checked={
      reason[`decision-${s._id}`] ===
      "rejected"
    }
    onChange={() =>
      setReason((r) => ({
        ...r,
        [`decision-${s._id}`]:
          "rejected",
      }))
    }
  />

  Reject
</label>
                {(
  reason[`decision-${s._id}`] ===
    "revision_requested" ||
  reason[`decision-${s._id}`] ===
    "rejected"
) && (
                  <textarea
                    placeholder="Reason for revision"
                    value={
                      reason[
                        s._id
                      ] || ""
                    }
                    onChange={(
                      e
                    ) =>
                      setReason(
                        (
                          r
                        ) => ({
                          ...r,
                          [s._id]:
                            e.target
                              .value,
                        })
                      )
                    }
                    className="mt-3 w-full rounded-md border border-slate-200 p-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                  />
                )}
              </div>
             
            )
          )}
        </div>

        {/* OVERALL FEEDBACK */}

        <textarea
          placeholder="Overall feedback to coordinator"
          value={
            reason[
              `event-${proposal.event._id}`
            ] || ""
          }
          onChange={(
            e
          ) =>
            setReason(
              (r) => ({
                ...r,
                [
                  `event-${proposal.event._id}`
                ]:
                  e.target
                    .value,
              })
            )
          }
          className="mt-4 w-full rounded-md border border-slate-200 p-3 text-sm dark:border-slate-800 dark:bg-slate-950"
        />

        <button
          onClick={() =>
            reviewProposal(
              proposal.event
                ._id,
              proposal.subevents
            )
          }
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          Submit Review
        </button>
      </div>
    )
  )}

  {!data.proposals
    .length && (
    <p className="text-sm text-slate-600 dark:text-slate-300">
      No pending
      proposals.
    </p>
  )}
</div>
      {/* SUBEVENTS */}

      <div className="space-y-3">
        <p className="font-semibold text-slate-900 dark:text-white">
          Subevents
        </p>

        {(
  data.pendingSubevents ||
  []
).map(          (s) => (
            <div
              key={s._id}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
            >
   {s.posterUrl ? (
  <img
  src={`http://localhost:8000${s.posterUrl}`}
    alt={s.name}
    className="mb-3 h-48 w-full rounded-lg object-cover"
  />
) : (
  <div className="mb-3 flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-slate-600">
    No Subevent Poster Uploaded
  </div>
)}
                <div className="flex items-center justify-between">
  <h4 className="text-lg font-bold">
    {s.name}
  </h4>

  <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs">
    Pending Review
  </span>
</div>

<p className="mt-1 text-sm text-slate-300">
  {s.description}
</p>

<div className="mt-4 grid gap-2 md:grid-cols-2 text-sm">
  <p>
    <strong>
      Type:
    </strong>{" "}
    {s.type}
  </p>

  <p>
    <strong>
      Venue:
    </strong>{" "}
    {s.venue?.name ||
      "Not selected"}
  </p>

  <p>
    <strong>
      Start Time:
    </strong>{" "}
    {s.startAt
      ? new Date(
          s.startAt
        ).toLocaleString()
      : "N/A"}
  </p>

  <p>
    <strong>
      End Time:
    </strong>{" "}
    {s.endAt
      ? new Date(
          s.endAt
        ).toLocaleString()
      : "N/A"}
  </p>

  <p>
    <strong>
      Eligibility:
    </strong>{" "}
    {Array.isArray(s.eligibility)
  ? s.eligibility.join(", ")
  : s.eligibility || "N/A"}
  </p>

  <p>
    <strong>
      Max Participants:
    </strong>{" "}
    {
      s.maxParticipants
    }
  </p>

  <p>
    <strong>
      Entry Fee:
    </strong>{" "}
    ₹{s.entryFee}
  </p>

  <p>
    <strong>
      Event Manager:
    </strong>{" "}
    {
      s.eventManager
    }
  </p>

  <p>
    <strong>
      Manager Phone:
    </strong>{" "}
    {
      s.managerPhone
    }
  </p>

  <p>
    <strong>
      Prize Pool:
    </strong>{" "}
    {s.prizePool ||
      "N/A"}
  </p>
  <div className="rounded-lg border border-slate-700 p-3">
  <p className="font-semibold">
    Attendance & Certificate
  </p>

  <p>
    Sessions:
    {" "}
    {s.totalSessions || 1}
  </p>

  <p>
    Rule:
    {" "}
    {s.certificateSettings?.mode ===
    "attendance_percentage"
      ? `Minimum ${s.certificateSettings?.minimumPercentage}% attendance required`
      : "At least one attendance required"}
  </p>
</div>
<div className="mt-4 flex gap-5">
  <label className="flex items-center gap-2">
    <input
      type="radio"
      name={`standalone-${s._id}`}
      onChange={() =>
        setStandaloneReviews((prev) => ({
          ...prev,
          [s._id]: {
            ...(prev[s._id] || {}),
            action: "approved",
          },
        }))
      }
    />
    Approve
  </label>

  <label className="flex items-center gap-2">
    <input
      type="radio"
      name={`standalone-${s._id}`}
      onChange={() =>
        setStandaloneReviews((prev) => ({
          ...prev,
          [s._id]: {
            ...(prev[s._id] || {}),
            action: "revision_requested",
          },
        }))
      }
    />
    Request Revision
  </label>

  <label className="flex items-center gap-2">
    <input
      type="radio"
      name={`standalone-${s._id}`}
      onChange={() =>
        setStandaloneReviews((prev) => ({
          ...prev,
          [s._id]: {
            ...(prev[s._id] || {}),
            action: "rejected",
          },
        }))
      }
    />
    Reject
  </label>
</div>

<textarea
  rows={3}
  placeholder="Revision / rejection reason"
  className="mt-3 w-full rounded-md border border-slate-200 p-2 text-sm dark:border-slate-800 dark:bg-slate-950"
  value={
    standaloneReviews?.[s._id]?.reason || ""
  }
  onChange={(e) =>
    setStandaloneReviews((prev) => ({
      ...prev,
      [s._id]: {
        ...(prev[s._id] || {}),
        reason: e.target.value,
      },
    }))
  }
/>

<button
  onClick={() =>
    reviewStandaloneSubevent(s)
  }
  className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-white"
>
  Submit Review
</button>
</div>

            </div>
            
          )
        )}
      </div>
    </div>
  );
}
