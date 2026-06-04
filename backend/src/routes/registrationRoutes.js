// import express from "express";
// import {
//   downloadCertificate,
//   markAttendanceByQr,
//   myRegistrations,
//   registerForSubevent,
//   submitFeedback,
//   verifyCertificate,
//   verifyRazorpayPayment,
// } from "../controllers/registrationController.js";
// import { protect, requireRole } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // Participant
// router.get("/me", protect, requireRole("participant"), myRegistrations);
// router.post("/:subeventId/register", protect, requireRole("participant"), registerForSubevent);
// router.post("/razorpay/verify", protect, requireRole("participant"), verifyRazorpayPayment);
// router.post("/feedback/:registrationId", protect, requireRole("participant"), submitFeedback);
// router.get("/certificate/:registrationId", protect, requireRole("participant"), downloadCertificate);

// // Coordinator - QR scan
// router.post("/attendance/scan", protect, requireRole("coordinator"), markAttendanceByQr);

// // Public certificate verification
// router.get("/certificates/verify/:token", verifyCertificate);

// export default router;
import express from "express";

import {
  downloadCertificate,
  getSubeventRegistrations,
  markAttendanceByQr,
  myRegistrations,
  registerForSubevent,
  submitFeedback,
  verifyCertificate,
  verifyRazorpayPayment,
} from "../controllers/registrationController.js";

import {
  protect,
  requireRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================
   PARTICIPANT ROUTES
=========================== */

// My registrations
router.get(
  "/me",
  protect,
  requireRole("participant"),
  myRegistrations
);

// Register for subevent
router.post(
  "/:subeventId/register",
  protect,
  requireRole("participant"),
  registerForSubevent
);

// Razorpay payment verify
router.post(
  "/razorpay/verify",
  protect,
  requireRole("participant"),
  verifyRazorpayPayment
);

// Submit feedback
router.post(
  "/feedback/:registrationId",
  protect,
  requireRole("participant"),
  submitFeedback
);

// Download certificate
router.get(
  "/certificate/:registrationId",
  protect,
  requireRole("participant"),
  downloadCertificate
);

/* ===========================
   COORDINATOR ROUTES
=========================== */

// QR attendance scan
router.post(
  "/attendance/scan",
  protect,
  requireRole("coordinator"),
  markAttendanceByQr
);

// Get participants of subevent
// Used for selecting winner/runner
router.get(
  "/subevent/:subeventId",
  protect,
  requireRole("coordinator"),
  getSubeventRegistrations
);

/* ===========================
   PUBLIC ROUTES
=========================== */

// Certificate verification
router.get(
  "/certificates/verify/:token",
  verifyCertificate
);

export default router;
