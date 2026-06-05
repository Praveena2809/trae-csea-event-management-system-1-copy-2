
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

  // NEW
  openAttendance,
  closeAttendance,
} from "../controllers/eventController.js";

import {
  protect,
  requireRole,
} from "../middleware/authMiddleware.js";

import { upload } from "../utils/upload.js";

const router =
  express.Router();

// Public
router.get(
  "/public",
  listPublicEvents
);

// Coordinator
router.get(
  "/me/list",
  protect,
  requireRole(
    "coordinator"
  ),
  listMyEvents
);

router.post(
  "/",
  protect,
  requireRole(
    "coordinator"
  ),
  upload.single(
    "poster"
  ),
  createMainEvent
);

router.put(
  "/:id",
  protect,
  requireRole(
    "coordinator"
  ),
  upload.single(
    "poster"
  ),
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

// Winner / Runner
router.patch(
  "/subevents/:id/winners",
  protect,
  requireRole(
    "coordinator"
  ),
  updateWinners
);

// Registration toggle
router.patch(
  "/subevents/:id/toggle-registration",
  protect,
  requireRole(
    "coordinator"
  ),
  toggleRegistrationStatus
);

//
// NEW: ATTENDANCE CONTROLS
//

// Open attendance
router.patch(
  "/:id/open-attendance",
  protect,
  requireRole(
    "coordinator"
  ),
  openAttendance
);

// Close attendance
router.patch(
  "/:id/close-attendance",
  protect,
  requireRole(
    "coordinator"
  ),
  closeAttendance
);

// HOD approvals
router.get(
  "/hod/pending",
  protect,
  requireRole("hod"),
  listPendingApprovals
);

router.post(
  "/hod/events/:id/approve",
  protect,
  requireRole("hod"),
  approveEvent
);

router.post(
  "/hod/events/:id/reject",
  protect,
  requireRole("hod"),
  rejectEvent
);

router.post(
  "/hod/subevents/:id/approve",
  protect,
  requireRole("hod"),
  approveSubevent
);

router.post(
  "/hod/subevents/:id/reject",
  protect,
  requireRole("hod"),
  rejectSubevent
);

// Admin delete event
router.delete(
  "/:id",
  protect,
  requireRole("admin"),
  deleteEvent
);

// Event details
router.get(
  "/:id",
  getEventById
);

export default router;