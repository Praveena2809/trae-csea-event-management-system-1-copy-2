import { asyncHandler } from "../utils/asyncHandler.js";
import { Event } from "../models/Event.js";
import { Subevent } from "../models/Subevent.js";
import { uploadToCloudinaryIfConfigured } from "../utils/upload.js";
import { Registration }
  from "../models/Registration.js";
  import { Parser }
  from "json2csv";
  import { Attendance } from "../models/Attendance.js";
import { User }
  from "../models/User.js";
  import { sendEmail } from "../utils/email.js";

import {
  eventApprovalTemplate,
  eventRejectionTemplate,
} from "../templates/emailTemplates.js";

const isOverlapping = (aStart, aEnd, bStart, bEnd) => {
  return aStart < bEnd && bStart < aEnd;
};


// Public: approved events + approved subevents (used on Home page)
export const listPublicEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ status: "approved" }).sort({ date: 1 }).lean();
  const eventIds = events.map((e) => e._id);
  const subevents = await Subevent.find({ event: { $in: eventIds }, status: "approved" })
    .populate("venue", "name location")
    .sort({ startAt: 1 })
    .lean();

  const grouped = {};
  for (const s of subevents) {
    grouped[s.event] = grouped[s.event] || [];
    grouped[s.event].push(s);
  }

  res.json({
    events: events.map((e) => ({ ...e, subevents: grouped[e._id] || [] })),
  });
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).lean();
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  const subevents = await Subevent.find({ event: event._id })
    .populate("venue", "name location")
    .sort({ startAt: 1 })
    .lean();
  res.json({ event: { ...event, subevents } });
});

// Coordinator
// export const createMainEvent = asyncHandler(async (req, res) => {
//   const { name, description, date, budgetEstimate, numberOfSubevents, miscNotesForHod } = req.body;
//   if (!name || !description || !date) {
//     res.status(400);
//     throw new Error("name, description and date are required");
//   }

//   let posterUrl;
//   if (req.file?.path) {
//     const uploaded = await uploadToCloudinaryIfConfigured(req.file.path, "cse-events/posters");
//     posterUrl = uploaded.url || `/uploads/${req.file.filename}`;
//   }

//   const event = await Event.create({
//     name,
//     description,
//     date: new Date(date),
//     budgetEstimate: Number(budgetEstimate || 0),
//     numberOfSubevents: Number(numberOfSubevents || 0),
//     miscNotesForHod,
//     posterUrl,
//     createdBy: req.user._id,
//   });

//   res.status(201).json({ event });
// });
export const createMainEvent =
  asyncHandler(async (req, res) => {
    const {
      name,
      description,
      date,
      budgetEstimate,
      numberOfSubevents,
      miscNotesForHod,

      // NEW
      subevents = "[]",
    } = req.body;

    if (
      !name ||
      !description ||
      !date
    ) {
      res.status(400);
      throw new Error(
        "name, description and date are required"
      );
    }

    let posterUrl;

    if (req.file?.path) {
      const uploaded =
        await uploadToCloudinaryIfConfigured(
          req.file.path,
          "cse-events/posters"
        );

      posterUrl =
        uploaded.url ||
        `/uploads/${req.file.filename}`;
    }

    // create event
    const event =
      await Event.create({
        name,
        description,
        date: new Date(date),
        budgetEstimate:
          Number(
            budgetEstimate || 0
          ),
        numberOfSubevents:
          Number(
            numberOfSubevents ||
              0
          ),
        miscNotesForHod,
        posterUrl,
        createdBy:
          req.user._id,

        status: "pending_review",
      });

    // create initial subevents
    const parsedSubevents =
  JSON.parse(
    subevents || "[]"
  );
    // if (
    //   Array.isArray(
    //     parsedSubevents
    //   ) &&
    //   subevents.length > 0
    // ) {
    //   for (const sub of subevents) {
      if (
        Array.isArray(
          parsedSubevents
        ) &&
        parsedSubevents.length > 0
      ) {
        for (const sub of parsedSubevents) {
          await Subevent.create({
            event: event._id,
          
            type: sub.type,
            name: sub.name,
            description: sub.description,
          
            venue: sub.venue || null,
          
            startAt: sub.startAt,
            endAt: sub.endAt,
          
            eligibility: sub.eligibility,
          
            maxParticipants: Number(
              sub.maxParticipants || 0
            ),
          
            entryFee: Number(
              sub.entryFee || 0
            ),
          
            eventManager: sub.eventManager,
            managerPhone: sub.managerPhone,
            prizePool: sub.prizePool,
          
            totalSessions:
              Number(sub.totalSessions || 1),
          
            certificateSettings:
              sub.certificateSettings || {
                mode: "attendance_once",
                minimumPercentage: 80,
              },
          
            createdBy: req.user._id,
          
            status: "pending_review",
          
            registrationsClosed: false,
          });
      }
    }

    res.status(201).json({
      event,
      message:
        "Event proposal submitted successfully",
    });
  });
export const updateMainEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  if (String(event.createdBy) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only edit your own events");
  }
  if (!["pending_review", "rejected"].includes(event.status)) {
    res.status(400);
    throw new Error("Approved events cannot be edited (create a new version instead)");
  }

  const fields = ["name", "description", "date", "budgetEstimate", "numberOfSubevents", "miscNotesForHod"];
  for (const f of fields) {
    if (req.body[f] !== undefined) event[f] = req.body[f];
  }

  if (req.file?.path) {
    const uploaded = await uploadToCloudinaryIfConfigured(req.file.path, "cse-events/posters");
    event.posterUrl = uploaded.url || `/uploads/${req.file.filename}`;
  }

  // resubmission clears rejection reason
  if (event.status === "rejected") {
    event.status = "pending_review";
    event.rejectionReason = undefined;
  }

  await event.save();
  res.json({ event });
});

// export const listMyEvents = asyncHandler(async (req, res) => {
//   const events = await Event.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
//   res.json({ events });
// });
export const listMyEvents =
  asyncHandler(async (req, res) => {
    const events =
      await Event.find({
        createdBy:
          req.user._id,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    const eventIds =
      events.map(
        (e) => e._id
      );

    const subevents =
      await Subevent.find({
        event: {
          $in: eventIds,
        },
      })
        .sort({
          startAt: 1,
        })
        .lean();

    const grouped = {};

    for (const s of subevents) {
      grouped[s.event] =
        grouped[s.event] ||
        [];

      grouped[s.event].push(
        s
      );
    }

    res.json({
      events: events.map(
        (e) => ({
          ...e,
          subevents:
            grouped[
              e._id
            ] || [],
        })
      ),
    });
  });

export const createSubevent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error("Main event not found");
  }
  if (String(event.createdBy) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only add subevents to your own event");
  }

  const {
    type,
    name,
    description,
    venue,
    startAt,
    endAt,
    eligibility,
    maxParticipants,
    entryFee,
    eventManager,
    managerPhone,
    prizePool,
  } = req.body;

  if (!type || !name || !description || !startAt || !endAt) {
    res.status(400);
    throw new Error("type, name, description, startAt, endAt are required");
  }

  const start = new Date(startAt);
  const end = new Date(endAt);
  if (start >= end) {
    res.status(400);
    throw new Error("endAt must be after startAt");
  }

  // Venue conflict logic (simple overlap check).
  if (venue) {
    const existing = await Subevent.find({ venue, status: { $ne: "rejected" } }).select("startAt endAt");
    const conflict = existing.some((s) => isOverlapping(start, end, s.startAt, s.endAt));
    if (conflict) {
      res.status(409);
      throw new Error("Venue conflict: selected venue/time already booked");
    }
  }

  let posterUrl;
  if (req.file?.path) {
    const uploaded = await uploadToCloudinaryIfConfigured(req.file.path, "cse-events/subevent-posters");
    posterUrl = uploaded.url || `/uploads/${req.file.filename}`;
  }

  const subevent = await Subevent.create({
    event: eventId,
    type,
    name,
    description,
    venue: venue || undefined,
    startAt: start,
    endAt: end,
    eligibility,
    maxParticipants: Number(maxParticipants || 0),
    entryFee: Number(entryFee || 0),
    eventManager,
    managerPhone,
    prizePool,
    posterUrl,
    createdBy: req.user._id,
    registrationsClosed:
  false,
  });

  res.status(201).json({ subevent });
});
export const updateSubevent =
  asyncHandler(async (req, res) => {
    const subevent =
      await Subevent.findById(
        req.params.id
      );

    if (!subevent) {
      res.status(404);
      throw new Error(
        "Subevent not found"
      );
    }

    // only creator can edit
    if (
      subevent.createdBy.toString() !==
      req.user._id.toString()
    ) {
      res.status(403);
      throw new Error(
        "Not authorized"
      );
    }

    subevent.name =
      req.body.name ??
      subevent.name;

    subevent.description =
      req.body.description ??
      subevent.description;

    subevent.type =
      req.body.type ??
      subevent.type;

    subevent.venue =
      req.body.venue ??
      subevent.venue;

    // subevent.startAt =
    //   req.body.startAt ??
    //   subevent.startAt;
    subevent.startAt =
    req.body.startAt
      ? new Date(
          req.body.startAt
        )
      : subevent.startAt;
    // subevent.endAt =
    //   req.body.endAt ??
    //   subevent.endAt;
    subevent.endAt =
  req.body.endAt
    ? new Date(
        req.body.endAt
      )
    : subevent.endAt;

    subevent.eligibility =
      req.body.eligibility ??
      subevent.eligibility;

    subevent.maxParticipants =
      req.body.maxParticipants ??
      subevent.maxParticipants;

    subevent.entryFee =
      req.body.entryFee ??
      subevent.entryFee;

    subevent.eventManager =
      req.body.eventManager ??
      subevent.eventManager;

    subevent.managerPhone =
      req.body.managerPhone ??
      subevent.managerPhone;

    subevent.prizePool =
      req.body.prizePool ??
      subevent.prizePool;

    // reset for HOD review
    subevent.status =
      "pending_review";

    subevent.rejectionReason =
      "";

    await subevent.save();

    res.json({
      message:
        "Subevent resubmitted successfully",
      subevent,
    });
  });
// HOD approvals
// export const listPendingApprovals =
//   asyncHandler(async (req, res) => {

//     const events =
//       await Event.find({
//         status: {
//           $in: [
//             "pending",
//             "cancel_requested",
//             "reschedule_requested",
//           ],
//         },
//       })
//         .populate(
//           "createdBy",
//           "name email"
//         )
//         .sort({
//           createdAt: -1,
//         });

//     const subevents =
//       await Subevent.find({
//         status: "pending",
//       })
//         .populate(
//           "event",
//           "name"
//         )
//         .populate(
//           "createdBy",
//           "name email"
//         )
//         .sort({
//           createdAt: -1,
//         });

//     res.json({
//       events,
//       subevents,
//     });
//   });
export const listPendingApprovals =
  asyncHandler(async (req, res) => {

    // pending event proposals
    const events =
      await Event.find({
        status: {
          $in: [
            "pending_review",
            "revision_requested",
            "cancel_requested",
          ],
        },
      })
        .populate(
          "createdBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    const proposalPackages =
      [];

    for (const event of events) {

      // get related subevents
      const subevents =
        await Subevent.find({
          event:
            event._id,

          status: {
            $in: [
              "pending_review",
              "revision_requested",
            ],
          },
        })
          .populate(
            "venue",
            "name"
          )
          .populate(
            "createdBy",
            "name email"
          )
          .sort({
            createdAt: 1,
          });

      proposalPackages.push({
        event,
        subevents,
      });
    }

    // separately fetch
    // later-added subevents
    const pendingSubevents =
      await Subevent.find({
        status:
          "pending_review",
      })
        .populate(
          "event",
          "name status"
        )
        .populate(
          "createdBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.json({
      proposals:
        proposalPackages,

      pendingSubevents,
    });
  });
export const approveEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  event.status = "approved";
  event.rejectionReason = undefined;
  event.approvedBy = req.user._id;
  event.approvedAt = new Date();
  await event.save();
  try {
    const coordinator =
      await User.findById(
        event.createdBy
      );
  
    if (coordinator?.email) {
      await sendEmail({
        to: coordinator.email,
  
        subject:
          "Event Proposal Approved - CSEA Event System",
  
        html:
          eventApprovalTemplate({
            coordinatorName:
              coordinator.name,
  
            eventName:
              event.name,
  
            eventType:
              "Main Event",
  
            date:
              new Date(
                event.date
              ).toLocaleDateString(),
  
            venue:
              "See subevent details",
          }),
      });
    }
  } catch (error) {
    console.log(
      "Event approval email failed:",
      error.message
    );
  }
  res.json({ event });
});
// export const reviewEventProposal =
//   asyncHandler(async (req, res) => {
//     const {
//       overallFeedback,
//       subevents,
//     } = req.body;

//     const event =
//       await Event.findById(
//         req.params.id
//       );

//     if (!event) {
//       res.status(404);
//       throw new Error(
//         "Event not found"
//       );
//     }

//     if (
//       !Array.isArray(
//         subevents
//       )
//     ) {
//       res.status(400);
//       throw new Error(
//         "Subevent review data required"
//       );
//     }

//     let approvedCount = 0;
//     let revisionCount = 0;

//     // review each subevent
//     for (const item of subevents) {
//       const subevent =
//         await Subevent.findById(
//           item.subeventId
//         );

//       if (!subevent)
//         continue;

//       if (
//         item.action ===
//         "approved"
//       ) {
//         subevent.status =
//           "approved";

//         subevent.revisionReason =
//           "";

//         subevent.reviewedBy =
//           req.user._id;

//         subevent.reviewedAt =
//           new Date();

//         subevent.approvedBy =
//           req.user._id;

//         subevent.approvedAt =
//           new Date();

//         approvedCount++;
//       }

//       else if (
//         item.action ===
//         "revision_requested"
//       ) {
//         subevent.status =
//           "revision_requested";

//         subevent.revisionReason =
//           item.reason ||
//           "Revision requested";

//         subevent.reviewedBy =
//           req.user._id;

//         subevent.reviewedAt =
//           new Date();

//         revisionCount++;
//       }

//       await subevent.save();
//     }

//     // event status logic
//     if (
//       approvedCount > 0 &&
//       revisionCount > 0
//     ) {
//       event.status =
//         "revision_requested";
//     }

//     else if (
//       approvedCount > 0
//     ) {
//       event.status =
//         "approved";
//     }

//     else {
//       event.status =
//         "revision_requested";
//     }

//     event.hodFeedback =
//       overallFeedback ||
//       "";

  //   event.reviewedBy =
  //     req.user._id;

  //   event.reviewedAt =
  //     new Date();

  //   await event.save();

  //   res.json({
  //     message:
  //       "Proposal reviewed successfully",
  //     event,
  //   });
  // });
  export const reviewEventProposal =
  asyncHandler(async (req, res) => {
    const {
      overallFeedback,
      subevents,
    } = req.body;

    const event =
      await Event.findById(
        req.params.id
      );

    if (!event) {
      res.status(404);
      throw new Error(
        "Event not found"
      );
    }

    if (
      !Array.isArray(
        subevents
      )
    ) {
      res.status(400);
      throw new Error(
        "Subevent review data required"
      );
    }

    let approvedCount = 0;
    let revisionCount = 0;

    // review each subevent
    for (const item of subevents) {
      const subevent =
        await Subevent.findById(
          item.subeventId
        );

      if (!subevent)
        continue;

      // APPROVE
      if (
        item.action ===
        "approved"
      ) {
        subevent.status =
          "approved";

        // clear previous rejection
        subevent.rejectionReason =
          "";
          subevent.hodFeedback = "";
        subevent.reviewedBy =
          req.user._id;

        subevent.reviewedAt =
          new Date();

        subevent.approvedBy =
          req.user._id;

        subevent.approvedAt =
          new Date();

        approvedCount++;
      }

      // REQUEST REVISION
      // else if (
      //   item.action ===
      //   "revision_requested"
      // ) {
      //   subevent.status =
      //     "revision_requested";

      //   // IMPORTANT:
      //   // save reason correctly
      //   subevent.rejectionReason =
      //     item.reason ||
      //     "Revision requested";

      //   subevent.reviewedBy =
      //     req.user._id;

      //   subevent.reviewedAt =
      //     new Date();

      //   revisionCount++;
      // }
      else if (
        item.action ===
        "revision_requested"
      ) {
        subevent.status =
          "revision_requested";
      
        // save revision message
        subevent.rejectionReason =
          item.reason ||
          "Revision requested";
      
        // ADD THIS
        subevent.hodFeedback =
          item.reason ||
          "Revision requested";
      
        subevent.reviewedBy =
          req.user._id;
      
        subevent.reviewedAt =
          new Date();
      
        revisionCount++;
      }

      await subevent.save();
    }

    // EVENT STATUS LOGIC

    // some approved + some rejected
    if (
      approvedCount > 0 &&
      revisionCount > 0
    ) {
      event.status =
        "revision_requested";
    }

    // all approved
    else if (
      approvedCount > 0 &&
      revisionCount === 0
    ) {
      event.status =
        "approved";
    }

    // all revision requested
    else {
      event.status =
        "revision_requested";
    }

    // save overall HOD feedback
    event.hodFeedback =
      overallFeedback ||
      "";

    event.reviewedBy =
      req.user._id;

    event.reviewedAt =
      new Date();

    await event.save();

    res.json({
      message:
        "Proposal reviewed successfully",
      event,
    });
  });
export const rejectEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  const { reason } = req.body;
  if (!reason) {
    res.status(400);
    throw new Error("Rejection reason is required");
  }
  // event.status = "rejected";
  // event.rejectionReason = reason;
  // event.approvedBy = req.user._id;
  // event.approvedAt = new Date();
  // await event.save();
  // res.json({ event });
  event.status =
  "rejected";

event.rejectionReason =
  reason;

event.approvedBy =
  req.user._id;

event.approvedAt =
  new Date();

await event.save();

try {
  const coordinator =
    await User.findById(
      event.createdBy
    );

  if (
    coordinator?.email
  ) {
    await sendEmail({
      to:
        coordinator.email,

      subject:
        "Event Proposal Rejected - CSEA Event System",

      html:
        eventRejectionTemplate({
          coordinatorName:
            coordinator.name,

          eventName:
            event.name,

          reason,
        }),
    });
  }
} catch (error) {
  console.log(
    "Event rejection email failed:",
    error.message
  );
}

res.json({
  event,
});
});

export const requestCancellation =
  asyncHandler(async (req, res) => {
    const { reason } = req.body;

    if (!reason?.trim()) {
      res.status(400);
      throw new Error(
        "Cancellation reason is required"
      );
    }

    const event =
      await Event.findById(
        req.params.id
      );

    if (!event) {
      res.status(404);
      throw new Error(
        "Event not found"
      );
    }

    // only creator coordinator
    if (
      String(event.createdBy) !==
      String(req.user._id)
    ) {
      res.status(403);
      throw new Error(
        "Unauthorized"
      );
    }

    // only approved events
    if (
      event.status !==
      "approved"
    ) {
      res.status(400);
      throw new Error(
        "Only approved events can be cancelled"
      );
    }

    event.status =
      "cancel_requested";

    event.cancelReason =
      reason;

    await event.save();

    res.json({
      message:
        "Cancellation request sent to HOD",
      event,
    });
  });
  // export const approveCancellation =
  // asyncHandler(async (req, res) => {
  //   const event =
  //     await Event.findById(
  //       req.params.id
  //     );

  //   if (!event) {
  //     res.status(404);
  //     throw new Error(
  //       "Event not found"
  //     );
  //   }

  //   if (
  //     event.status !==
  //     "cancel_requested"
  //   ) {
  //     res.status(400);
  //     throw new Error(
  //       "No cancellation request found"
  //     );
  //   }

  //   event.status =
  //     "cancelled";

  //   event.approvedBy =
  //     req.user._id;

  //   event.approvedAt =
  //     new Date();

  //   await event.save();

  //   res.json({
  //     message:
  //       "Event cancelled successfully",
  //     event,
  //   });
  // });
  export const approveCancellation =
  asyncHandler(async (req, res) => {
    const event =
      await Event.findById(
        req.params.id
      );

    if (!event) {
      res.status(404);
      throw new Error(
        "Event not found"
      );
    }

    if (
      event.status !==
      "cancel_requested"
    ) {
      res.status(400);
      throw new Error(
        "No cancellation request found"
      );
    }

    // get all approved subevents
    const subevents =
      await Subevent.find({
        event: event._id,
        status: "approved",
      }).populate(
        "venue",
        "name location"
      );

    // send emails BEFORE save response
    for (const subevent of subevents) {
      const registrations =
        await Registration.find({
          subevent:
            subevent._id,
        }).populate(
          "participant",
          "name email"
        );

      for (const reg of registrations) {
        const participant =
          reg.participant;

        if (
          !participant?.email
        )
          continue;

        const formattedDate =
          subevent.startAt
            ? new Date(
                subevent.startAt
              ).toLocaleDateString(
                "en-IN",
                {
                  weekday:
                    "long",
                  day: "numeric",
                  month:
                    "long",
                  year:
                    "numeric",
                }
              )
            : "TBA";

        const formattedTime =
          subevent.startAt
            ? new Date(
                subevent.startAt
              ).toLocaleTimeString(
                "en-IN",
                {
                  hour:
                    "2-digit",
                  minute:
                    "2-digit",
                }
              )
            : "TBA";

        await sendEmail({
          to:
            participant.email,

          subject: `❌ Event Cancelled - ${subevent.name}`,

          html: `
          <div style="
            font-family:Arial,sans-serif;
            background:#f4f6f9;
            padding:30px;
          ">

            <div style="
              max-width:650px;
              margin:auto;
              background:white;
              border-radius:16px;
              overflow:hidden;
              box-shadow:0 4px 15px rgba(0,0,0,0.1);
            ">

              <div style="
                background:#dc2626;
                color:white;
                padding:25px;
                text-align:center;
              ">
                <h1>
                  Event Cancelled
                </h1>

                <p>
                  CSEA Event Management
                </p>
              </div>

              <div style="
                padding:30px;
              ">

                <p>
                  Hello
                  <b>
                    ${
                      participant.name
                    }
                  </b>,
                </p>

                <p>
                  We regret to inform
                  you that the
                  following event
                  has been cancelled.
                </p>

                <div style="
                  background:#f8fafc;
                  border:1px solid #e5e7eb;
                  border-radius:12px;
                  padding:20px;
                ">

                  <h2>
                    ${
                      subevent.name
                    }
                  </h2>

                  <p>
                    <b>
                      📌 Main Event:
                    </b>
                    ${
                      event.name
                    }
                  </p>

                  <p>
                    <b>
                      📅 Date:
                    </b>
                    ${
                      formattedDate
                    }
                  </p>

                  <p>
                    <b>
                      ⏰ Time:
                    </b>
                    ${
                      formattedTime
                    }
                  </p>

                  <p>
                    <b>
                      📍 Venue:
                    </b>
                    ${
                      subevent
                        .venue
                        ?.name ||
                      "TBA"
                    }
                  </p>

                  <p>
                    <b>
                      ❗ Cancellation Reason:
                    </b>
                    ${
                      event.cancelReason ||
                      "Not specified"
                    }
                  </p>
                </div>

                <br>

                <div style="
                  background:#eff6ff;
                  border-left:4px solid #2563eb;
                  padding:15px;
                  border-radius:8px;
                ">

                  <h3>
                    👨‍💼 Event Manager Details
                  </h3>

                  <p>
                    <b>
                      Name:
                    </b>
                    ${
                      subevent.eventManager ||
                      "Event Manager"
                    }
                  </p>

                  <p>
                    <b>
                      Phone:
                    </b>
                    ${
                      subevent.managerPhone ||
                      "N/A"
                    }
                  </p>

                </div>

                <br>

                <p>
                  We sincerely
                  apologize for
                  the inconvenience.
                </p>

                <p>
                  Please stay tuned
                  for future updates
                  or rescheduled
                  opportunities.
                </p>

                <p>
                  Regards,
                  <br>
                  <b>
                    CSEA Event Team
                  </b>
                </p>

              </div>
            </div>
          </div>
          `,
        });
      }
    }

    // approve cancellation
    event.status =
      "cancelled";

    event.approvedBy =
      req.user._id;

    event.approvedAt =
      new Date();

    await event.save();

    res.json({
      message:
        "Event cancelled successfully and emails sent",
      event,
    });
  });
  export const requestReschedule =
  asyncHandler(async (req, res) => {
    const {
      newDate,
      newVenue,
      newTime,
      reason,
    } = req.body;

    if (
      !newDate ||
      !reason
    ) {
      res.status(400);
      throw new Error(
        "New date and reason are required"
      );
    }

    const event =
      await Event.findById(
        req.params.id
      );

    if (!event) {
      res.status(404);
      throw new Error(
        "Event not found"
      );
    }

    // only creator coordinator
    if (
      String(event.createdBy) !==
      String(req.user._id)
    ) {
      res.status(403);
      throw new Error(
        "Unauthorized"
      );
    }

    // only approved events
    if (
      event.status !==
      "approved"
    ) {
      res.status(400);
      throw new Error(
        "Only approved events can be rescheduled"
      );
    }

    event.status =
      "reschedule_requested";

    event.rescheduleRequest = {
      requested: true,

      oldDate:
        event.date,

      newDate:
        new Date(
          newDate
        ),

      oldVenue:
        event.venue,

      newVenue:
        newVenue || "",

      oldTime:
        event.time,

      newTime:
        newTime || "",

      reason,

      requestedAt:
        new Date(),
    };

    await event.save();

    res.json({
      message:
        "Reschedule request sent to HOD",
      event,
    });
  });
  export const approveReschedule =
  asyncHandler(async (req, res) => {
    const event =
      await Event.findById(
        req.params.id
      );

    if (!event) {
      res.status(404);
      throw new Error(
        "Event not found"
      );
    }

    if (
      event.status !==
      "reschedule_requested"
    ) {
      res.status(400);
      throw new Error(
        "No reschedule request found"
      );
    }

    // update actual event
    event.date =
      event
        .rescheduleRequest
        .newDate;

    event.venue =
      event
        .rescheduleRequest
        .newVenue;

    event.time =
      event
        .rescheduleRequest
        .newTime;

    // reset request
    event.status =
      "approved";

    event.rescheduleRequest = {
      requested: false,
      oldDate: null,
      newDate: null,
      oldVenue: "",
      newVenue: "",
      oldTime: "",
      newTime: "",
      reason: "",
      requestedAt: null,
    };

    event.approvedBy =
      req.user._id;

    event.approvedAt =
      new Date();

    await event.save();

    res.json({
      message:
        "Event rescheduled successfully",
      event,
    });
  });
export const approveSubevent = asyncHandler(async (req, res) => {
  const subevent = await Subevent.findById(req.params.id);
  if (!subevent) {
    res.status(404);
    throw new Error("Subevent not found");
  }
  subevent.status = "approved";
  subevent.rejectionReason = undefined;
  subevent.approvedBy = req.user._id;
  subevent.approvedAt = new Date();
  await subevent.save();
  res.json({ subevent });
});

export const rejectSubevent = asyncHandler(async (req, res) => {
  const subevent = await Subevent.findById(req.params.id);
  if (!subevent) {
    res.status(404);
    throw new Error("Subevent not found");
  }
  const { reason } = req.body;
  if (!reason) {
    res.status(400);
    throw new Error("Rejection reason is required");
  }
  subevent.status = "rejected";
  subevent.rejectionReason = reason;
  subevent.approvedBy = req.user._id;
  subevent.approvedAt = new Date();
  await subevent.save();
  res.json({ subevent });
});

// Coordinator: update winner/runner registrations for competitive events
// export const updateWinners = asyncHandler(async (req, res) => {
//   const { id } = req.params; // subevent id
//   const { winnerRegistrationId, runnerRegistrationId } = req.body;

//   const subevent = await Subevent.findById(id).populate("event");
//   if (!subevent) {
//     res.status(404);
//     throw new Error("Subevent not found");
//   }

//   // Ensure coordinator owns the parent event
//   if (String(subevent.createdBy) !== String(req.user._id)) {
//     res.status(403);
//     throw new Error("You can update winners only for your subevents");
//   }

//   if (subevent.type !== "competitive") {
//     res.status(400);
//     throw new Error("Winners can be set only for competitive subevents");
//   }

//   subevent.winnerRegistration = winnerRegistrationId || undefined;
//   subevent.runnerRegistration = runnerRegistrationId || undefined;
//   await subevent.save();

//   res.json({ subevent });
// });
// export const updateWinners = asyncHandler(async (req, res) => {
//   const { id } = req.params; // subevent id

//   const {
//     winnerRegistrationId,
//     runnerRegistrationId,
//   } = req.body;

//   const subevent = await Subevent.findById(
//     id
//   ).populate("event");

//   if (!subevent) {
//     res.status(404);
//     throw new Error("Subevent not found");
//   }

//   // coordinator ownership check
//   if (
//     String(subevent.createdBy) !==
//     String(req.user._id)
//   ) {
//     res.status(403);
//     throw new Error(
//       "You can update winners only for your subevents"
//     );
//   }

//   // only for competitive events
//   if (subevent.type !== "competitive") {
//     res.status(400);
//     throw new Error(
//       "Winner/Runner only applies to competitive events"
//     );
//   }

//   subevent.winnerRegistration =
//     winnerRegistrationId || null;

//   subevent.runnerRegistration =
//     runnerRegistrationId || null;

//   await subevent.save();
//   if (winnerRegistration) {
//     const winnerReg =
//       await Registration.findById(
//         winnerRegistration
//       );
  
//     if (winnerReg) {
//       await User.findByIdAndUpdate(
//         winnerReg.participant,
//         {
//           $inc: { points: 20 },
//         }
//       );
//     }
//   }
//   res.json({
//     message:
//       "Winner and runner updated successfully",
//     subevent,
//   });
// });
export const updateWinners =
  async (req, res) => {
    try {
      const {
        winnerRegistrationId,
        runnerRegistrationId,
      } = req.body;
      const subeventId =
      req.params.id;

        const subevent =
        await Subevent.findById(
          subeventId
        );

      if (!subevent) {
        return res
          .status(404)
          .json({
            message:
              "Subevent not found",
          });
      }

      // Winner
      if (
        winnerRegistrationId
      ) {
        const winnerRegistration =
          await Registration.findById(
            winnerRegistrationId
          );

        if (
          winnerRegistration
        ) {
          winnerRegistration.isWinner =
            true;

          await winnerRegistration.save();

          await User.findByIdAndUpdate(
            winnerRegistration.participant,
            {
              $inc: {
                points: 20,
              },
            }
          );
        }
      }

      // Runner
      if (
        runnerRegistrationId
      ) {
        const runnerRegistration =
          await Registration.findById(
            runnerRegistrationId
          );

        if (
          runnerRegistration
        ) {
          runnerRegistration.isRunner =
            true;

          await runnerRegistration.save();

          await User.findByIdAndUpdate(
            runnerRegistration.participant,
            {
              $inc: {
                points: 10,
              },
            }
          );
        }
      }
      subevent.winnerRegistration =
      winnerRegistrationId || null;
    
    subevent.runnerRegistration =
      runnerRegistrationId || null;
    
    await subevent.save();
      return res.json({
        message:
          "Winners updated successfully",
      });
    } catch (err) {
      console.error(err);

      return res
        .status(500)
        .json({
          message:
            err.message,
        });
    }
  };
// Coordinator: open/close registrations
export const toggleRegistrationStatus =
  asyncHandler(
    async (req, res) => {
      const {
        id,
      } = req.params;

      const subevent =
        await Subevent.findById(
          id
        );

      if (!subevent) {
        res.status(404);
        throw new Error(
          "Subevent not found"
        );
      }

      // only coordinator who created it
      if (
        String(
          subevent.createdBy
        ) !==
        String(
          req.user._id
        )
      ) {
        res.status(403);
        throw new Error(
          "Unauthorized"
        );
      }

      subevent.registrationsClosed =
        !subevent.registrationsClosed;

      await subevent.save();

      res.json({
        message:
          subevent.registrationsClosed
            ? "Registrations closed"
            : "Registrations opened",
        subevent,
      });
    }
  );
// Coordinator: Open attendance
export const openAttendance =
  asyncHandler(
    async (req, res) => {
      const event =
        await Event.findById(
          req.params.id
        );

      if (!event) {
        res.status(404);
        throw new Error(
          "Event not found"
        );
      }

      // only event creator coordinator
      if (
        String(
          event.createdBy
        ) !==
        String(
          req.user._id
        )
      ) {
        res.status(403);
        throw new Error(
          "Unauthorized"
        );
      }

      // already open
      if (
        event.attendanceEnabled
      ) {
        res.status(400);
        throw new Error(
          "Attendance already open"
        );
      }

      const now =
        new Date();

      event.attendanceEnabled =
        true;

      event.attendanceOpenedBy =
        req.user._id;

      event.attendanceOpenedAt =
        now;

      // attendance starts now
      event.attendanceStart =
        now;

      // auto-expire after 4 hours
      event.attendanceEnd =
        new Date(
          now.getTime() +
            4 *
              60 *
              60 *
              1000
        );

      await event.save();

      res.json({
        message:
          "Attendance opened successfully",
        event,
      });
    }
  );

// Coordinator: Close attendance
export const closeAttendance =
  asyncHandler(
    async (req, res) => {
      const event =
        await Event.findById(
          req.params.id
        );

      if (!event) {
        res.status(404);
        throw new Error(
          "Event not found"
        );
      }

      // only event creator coordinator
      if (
        String(
          event.createdBy
        ) !==
        String(
          req.user._id
        )
      ) {
        res.status(403);
        throw new Error(
          "Unauthorized"
        );
      }

      // already closed
      if (
        !event.attendanceEnabled
      ) {
        res.status(400);
        throw new Error(
          "Attendance already closed"
        );
      }

      event.attendanceEnabled =
        false;

      event.attendanceEnd =
        new Date();

      await event.save();

      res.json({
        message:
          "Attendance closed successfully",
        event,
      });
    }
  );
// Admin: delete event
export const deleteEvent =
  asyncHandler(
    async (req, res) => {
      const event =
        await Event.findById(
          req.params.id
        );

      if (!event) {
        res.status(404);
        throw new Error(
          "Event not found"
        );
      }

      // delete subevents too
      await Subevent.deleteMany(
        {
          event:
            event._id,
        }
      );

      await event.deleteOne();

      res.json({
        message:
          "Event deleted successfully",
      });
    }
  );
  export const exportParticipants =
  async (req, res) => {
    try {
      const {
        subeventId,
      } = req.params;

      const {
        type = "all",
      } = req.query;

      const registrations =
        await Registration.find({
          subevent:
            subeventId,
        }).populate(
          "participant",
          "name email registerNumber department year"
        );
        const subevent =
        await Subevent.findById(subeventId);
      
      const totalSessions =
        subevent?.totalSessions || 1;
      
      const minimumPercentage =
        subevent?.certificateSettings
          ?.minimumPercentage || 80;
      let filtered =
        registrations;

      // Attended only
      if (
        type ===
        "attended"
      ) {
        filtered =
          registrations.filter(
            (r) =>
              r.status ===
              "attended"
          );
      }

      // Winners only
      if (
        type ===
        "winners"
      ) {
        const subevent =
          await Subevent.findById(
            subeventId
          );

        filtered =
          registrations.filter(
            (r) =>
              r._id.toString() ===
                subevent
                  ?.winnerRegistration
                  ?.toString() ||
              r._id.toString() ===
                subevent
                  ?.runnerRegistration
                  ?.toString()
          );
      }
      const participants = await Promise.all(
        filtered.map(async (r) => {
      
          const attendanceRecords =
            await Attendance.find({
              registration: r._id,
            });
      
          const row = {
            Name:
              r.participant?.name || "",
      
            Email:
              r.participant?.email || "",
      
            RegisterNumber:
              r.participant?.registerNumber || "",
      
            Department:
              r.participant?.department || "",
      
            Year:
              r.participant?.year || "",
          };
      
          let attendedCount = 0;
      
          for (
            let session = 1;
            session <= totalSessions;
            session++
          ) {
            const attended =
              attendanceRecords.some(
                (a) =>
                  a.sessionNumber === session
              );
      
            row[`S${session}`] =
              attended ? "✓" : "✗";
      
            if (attended)
              attendedCount++;
          }
      
          const percentage =
            Math.round(
              (attendedCount /
                totalSessions) *
                100
            );
      
          row["Attendance %"] =
            `${percentage}%`;
      
          row["Certificate Eligible"] =
            percentage >=
            minimumPercentage
              ? "Yes"
              : "No";
      
          return row;
        })
      );

      const parser =
        new Parser();

      const csv =
        parser.parse(
          participants
        );

      res.header(
        "Content-Type",
        "text/csv"
      );

      res.attachment(
        `${type}-participants.csv`
      );

      return res.send(csv);

    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  };