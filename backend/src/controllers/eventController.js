import { asyncHandler } from "../utils/asyncHandler.js";
import { Event } from "../models/Event.js";
import { Subevent } from "../models/Subevent.js";
import { uploadToCloudinaryIfConfigured } from "../utils/upload.js";
import { Registration }
  from "../models/Registration.js";
  import { Parser }
  from "json2csv";
 
import { User }
  from "../models/User.js";
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
export const createMainEvent = asyncHandler(async (req, res) => {
  const { name, description, date, budgetEstimate, numberOfSubevents, miscNotesForHod } = req.body;
  if (!name || !description || !date) {
    res.status(400);
    throw new Error("name, description and date are required");
  }

  let posterUrl;
  if (req.file?.path) {
    const uploaded = await uploadToCloudinaryIfConfigured(req.file.path, "cse-events/posters");
    posterUrl = uploaded.url || `/uploads/${req.file.filename}`;
  }

  const event = await Event.create({
    name,
    description,
    date: new Date(date),
    budgetEstimate: Number(budgetEstimate || 0),
    numberOfSubevents: Number(numberOfSubevents || 0),
    miscNotesForHod,
    posterUrl,
    createdBy: req.user._id,
  });

  res.status(201).json({ event });
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
  if (!["pending", "rejected"].includes(event.status)) {
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
    event.status = "pending";
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
  });

  res.status(201).json({ subevent });
});

// HOD approvals
export const listPendingApprovals = asyncHandler(async (req, res) => {
  const events = await Event.find({ status: "pending" }).populate("createdBy", "name email");
  const subevents = await Subevent.find({ status: "pending" })
    .populate("event", "name")
    .populate("createdBy", "name email");
  res.json({ events, subevents });
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
  res.json({ event });
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
  event.status = "rejected";
  event.rejectionReason = reason;
  event.approvedBy = req.user._id;
  event.approvedAt = new Date();
  await event.save();
  res.json({ event });
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
        req.params.subeventId;

      const subevent =
        await Event.findOne({
          "subevents._id":
            subeventId,
        });

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

      const participants =
        filtered.map(
          (r) => ({
            Name:
              r.participant
                ?.name || "",

            Email:
              r.participant
                ?.email || "",

            RegisterNumber:
              r.participant
                ?.registerNumber ||
              "",

            Department:
              r.participant
                ?.department ||
              "",

            Year:
              r.participant
                ?.year || "",

            Status:
              r.status,
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