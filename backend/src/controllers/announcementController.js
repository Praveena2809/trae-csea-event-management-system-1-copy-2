import asyncHandler
from "express-async-handler";

import {
  Announcement,
} from "../models/Announcement.js";

import {
  Registration,
} from "../models/Registration.js";

export const createAnnouncement =
  asyncHandler(
    async (
      req,
      res
    ) => {
      const {
        title,
        message,
        subeventId,
      } = req.body;

      // HOD → everyone
      if (
        req.user.role ===
        "hod"
      ) {
        const announcement =
          await Announcement.create(
            {
              title,
              message,
              type:
                "general",
              createdBy:
                req.user
                  ._id,
            }
          );

        return res
          .status(201)
          .json(
            announcement
          );
      }

      // Coordinator → event only
      if (
        req.user.role ===
        "coordinator"
      ) {
        if (
          !subeventId
        ) {
          res.status(400);

          throw new Error(
            "Subevent required"
          );
        }

        const announcement =
          await Announcement.create(
            {
              title,
              message,
              type:
                "event",
              subevent:
                subeventId,
              createdBy:
                req.user
                  ._id,
            }
          );

        return res
          .status(201)
          .json(
            announcement
          );
      }

      res.status(403);

      throw new Error(
        "Not authorized"
      );
    }
  );

export const getAnnouncements =
  asyncHandler(
    async (
      req,
      res
    ) => {

      // PARTICIPANT
      if (
        req.user.role ===
        "participant"
      ) {
        const registrations =
          await Registration.find(
            {
              participant:
                req.user
                  ._id,
            }
          );

        const subeventIds =
          registrations.map(
            (r) =>
              r.subevent
          );

        const announcements =
          await Announcement.find(
            {
              $or: [
                {
                  type:
                    "general",
                },
                {
                  subevent:
                    {
                      $in:
                        subeventIds,
                    },
                },
              ],
            }
          )
            .populate(
              "createdBy",
              "name email"
            )
            .sort({
              createdAt:
                -1,
            });

        return res.json(
          announcements
        );
      }

      // COORDINATOR
      if (
        req.user.role ===
        "coordinator"
      ) {
        // ONLY coordinator's own announcements
        const announcements =
          await Announcement.find(
            {
              createdBy:
                req.user
                  ._id,
            }
          )
            .populate(
              "createdBy",
              "name email"
            )
            .sort({
              createdAt:
                -1,
            });

        return res.json(
          announcements
        );
      }

      // HOD / ADMIN
      const announcements =
        await Announcement.find()
          .populate(
            "createdBy",
            "name email role"
          )
          .sort({
            createdAt:
              -1,
          });

      res.json(
        announcements
      );
    }
  );

export const deleteAnnouncement =
  asyncHandler(
    async (
      req,
      res
    ) => {
      const announcement =
        await Announcement.findById(
          req.params.id
        );

      if (
        !announcement
      ) {
        res.status(404);

        throw new Error(
          "Announcement not found"
        );
      }

      // creator OR hod/admin
      if (
        announcement.createdBy.toString() !==
          req.user._id.toString() &&
        req.user.role !==
          "hod" &&
        req.user.role !==
          "admin"
      ) {
        res.status(403);

        throw new Error(
          "Not authorized"
        );
      }

      await announcement.deleteOne();

      res.json({
        message:
          "Announcement deleted",
      });
    }
  );