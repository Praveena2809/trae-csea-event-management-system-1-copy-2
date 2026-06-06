import express from "express";

import {
  createAnnouncement,
  getAnnouncements,
} from "../controllers/announcementController.js";

import {
  protect,
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

export default router;