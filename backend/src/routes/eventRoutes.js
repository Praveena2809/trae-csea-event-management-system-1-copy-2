
// import express from "express";
// import {
//   approveEvent,
//   approveSubevent,
//   createMainEvent,
//   createSubevent,
//   deleteEvent,
//   getEventById,
//   listMyEvents,
//   listPendingApprovals,
//   listPublicEvents,
//   rejectEvent,
//   rejectSubevent,
//   toggleRegistrationStatus,
//   updateMainEvent,
//   updateWinners,
// } from "../controllers/eventController.js";

// import {
//   protect,
//   requireRole,
// } from "../middleware/authMiddleware.js";

// import { upload } from "../utils/upload.js";

// const router =
//   express.Router();

// // Public
// router.get(
//   "/public",
//   listPublicEvents
// );

// // Coordinator
// router.get(
//   "/me/list",
//   protect,
//   requireRole(
//     "coordinator"
//   ),
//   listMyEvents
// );

// router.post(
//   "/",
//   protect,
//   requireRole(
//     "coordinator"
//   ),
//   upload.single(
//     "poster"
//   ),
//   createMainEvent
// );

// router.put(
//   "/:id",
//   protect,
//   requireRole(
//     "coordinator"
//   ),
//   upload.single(
//     "poster"
//   ),
//   updateMainEvent
// );

// router.post(
//   "/:eventId/subevents",
//   protect,
//   requireRole(
//     "coordinator"
//   ),
//   upload.single(
//     "poster"
//   ),
//   createSubevent
// );

// // Winner / Runner
// router.patch(
//   "/subevents/:id/winners",
//   protect,
//   requireRole(
//     "coordinator"
//   ),
//   updateWinners
// );

// // NEW: open/close registrations
// router.patch(
//   "/subevents/:id/toggle-registration",
//   protect,
//   requireRole(
//     "coordinator"
//   ),
//   toggleRegistrationStatus
// );

// // HOD approvals
// router.get(
//   "/hod/pending",
//   protect,
//   requireRole("hod"),
//   listPendingApprovals
// );

// router.post(
//   "/hod/events/:id/approve",
//   protect,
//   requireRole("hod"),
//   approveEvent
// );

// router.post(
//   "/hod/events/:id/reject",
//   protect,
//   requireRole("hod"),
//   rejectEvent
// );

// router.post(
//   "/hod/subevents/:id/approve",
//   protect,
//   requireRole("hod"),
//   approveSubevent
// );

// router.post(
//   "/hod/subevents/:id/reject",
//   protect,
//   requireRole("hod"),
//   rejectSubevent
// );

// // NEW: Admin delete event
// router.delete(
//   "/:id",
//   protect,
//   requireRole("admin"),
//   deleteEvent
// );

// // Event details
// router.get(
//   "/:id",
//   getEventById
// );

// export default router;

import express from "express";

import {
  approveEvent,
  approveSubevent,
  getEventForEdit,
resubmitEventProposal,
  createMainEvent,
  createSubevent,
  deleteEvent,
  getEventById,
  listMyEvents,
  listPendingApprovals,
  listPublicEvents,
  rejectEvent,
  rejectSubevent,
  toggleRegistrationStatus,
  updateMainEvent,
  updateWinners,
  exportParticipants,
  reviewEventProposal,
  updateSubevent,

  // attendance
  openAttendance,
  closeAttendance,

  // NEW: cancellation & reschedule
  requestCancellation,
  approveCancellation,
  requestReschedule,
  approveReschedule,
} from "../controllers/eventController.js";

import {
  protect,
  requireRole,
} from "../middleware/authMiddleware.js";

import { upload } from "../utils/upload.js";

const router =
  express.Router();

//
// PUBLIC
//

router.get(
  "/public",
  listPublicEvents
);

router.get(
  "/:id",
  getEventById
);

//
// COORDINATOR
//

router.get(
  "/me/list",
  protect,
  requireRole(
    "coordinator"
  ),
  listMyEvents
);
router.get(
  "/:id/edit",
  protect,
  requireRole("coordinator"),
  getEventForEdit
);

router.put(
  "/:id/resubmit",
  protect,
  requireRole("coordinator"),
  upload.any(),
  resubmitEventProposal
);
router.post(
  "/",
  protect,
  requireRole("coordinator"),
  upload.any(),
  createMainEvent
);
router.put(
  "/:id",
  protect,
  requireRole("coordinator"),
  upload.any(),
  updateMainEvent
);

router.post(
  "/:eventId/subevents",
  protect,
  requireRole(
    "coordinator"
  ),
  upload.single(
    "poster"
  ),
  createSubevent
);
router.put(
  "/subevents/:id",
  protect,
  requireRole(
    "coordinator"
  ),
  updateSubevent
);

//
// EXPORT PARTICIPANTS
//

router.get(
  "/export-participants/:subeventId",
  protect,
  requireRole(
    "coordinator"
  ),
  exportParticipants
);

//
// WINNER / RUNNER
//

router.patch(
  "/subevents/:id/winners",
  protect,
  requireRole(
    "coordinator"
  ),
  updateWinners
);

//
// REGISTRATION TOGGLE
//

router.patch(
  "/subevents/:id/toggle-registration",
  protect,
  requireRole(
    "coordinator"
  ),
  toggleRegistrationStatus
);

//
// ATTENDANCE
//

router.patch(
  "/:id/open-attendance",
  protect,
  requireRole(
    "coordinator"
  ),
  openAttendance
);

router.patch(
  "/:id/close-attendance",
  protect,
  requireRole(
    "coordinator"
  ),
  closeAttendance
);

//
// NEW: EVENT CANCELLATION
//

// coordinator requests cancellation
router.patch(
  "/:id/request-cancel",
  protect,
  requireRole(
    "coordinator"
  ),
  requestCancellation
);

// hod/admin approves cancellation
router.patch(
  "/hod/events/:id/approve-cancel",
  protect,
  requireRole(
    "hod",
    "admin"
  ),
  approveCancellation
);

//
// NEW: EVENT RESCHEDULE
//

// coordinator requests reschedule
router.patch(
  "/:id/request-reschedule",
  protect,
  requireRole(
    "coordinator"
  ),
  requestReschedule
);

// hod/admin approves reschedule
router.patch(
  "/hod/events/:id/approve-reschedule",
  protect,
  requireRole(
    "hod",
    "admin"
  ),
  approveReschedule
);

//
// HOD APPROVALS
//

router.get(
  "/hod/pending",
  protect,
  requireRole(
    "hod"
  ),
  listPendingApprovals
);
// NEW: review full event proposal
router.put(
  "/hod/events/:id/review-proposal",
  protect,
  requireRole(
    "hod"
  ),
  reviewEventProposal
);
router.post(
  "/hod/events/:id/approve",
  protect,
  requireRole(
    "hod"
  ),
  approveEvent
);

router.post(
  "/hod/events/:id/reject",
  protect,
  requireRole(
    "hod"
  ),
  rejectEvent
);

router.post(
  "/hod/subevents/:id/approve",
  protect,
  requireRole(
    "hod"
  ),
  approveSubevent
);

router.post(
  "/hod/subevents/:id/reject",
  protect,
  requireRole(
    "hod"
  ),
  rejectSubevent
);

//
// ADMIN
//

router.delete(
  "/:id",
  protect,
  requireRole(
    "admin"
  ),
  deleteEvent
);

export default router;