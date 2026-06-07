import express from "express";

import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

import {
    protect,
    requireRole,
  } from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.post(
  "/",
  protect,
  createAnnouncement
);

router.get(
  "/",
  protect,
  getAnnouncements
);
router.delete(
    "/:id",
    protect,
    requireRole(
      "coordinator",
      "hod",
      "admin"
    ),
    deleteAnnouncement
  );

export default router;