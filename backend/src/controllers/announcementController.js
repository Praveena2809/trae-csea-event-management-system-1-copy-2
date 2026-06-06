import asyncHandler
from "express-async-handler";

import {
  Announcement,
} from "../models/Announcement.js";

import {
  Registration,
} from "../models/Registration.js";

// export const createAnnouncement =
//   asyncHandler(
//     async (
//       req,
//       res
//     ) => {
//       const {
//         title,
//         message,
//         subeventId,
//       } = req.body;

//       // HOD
//       if (
//         req.user.role ===
//         "hod"
//       ) {
//         const announcement =
//           await Announcement.create(
//             {
//               title,
//               message,
//               type:
//                 "general",
//               createdBy:
//                 req.user
//                   ._id,
//             }
//           );

//         return res
//           .status(201)
//           .json(
//             announcement
//           );
//       }

//       // Coordinator
//       if (
//         req.user.role ===
//         "coordinator"
//       ) {
//         const announcement =
//           await Announcement.create(
//             {
//               title,
//               message,
//               type:
//                 "event",
//               subevent:
//                 subeventId,
//               createdBy:
//                 req.user
//                   ._id,
//             }
//           );

//         return res
//           .status(201)
//           .json(
//             announcement
//           );
//       }

//       res
//         .status(403);
//       throw new Error(
//         "Not allowed"
//       );
//     }
//   );
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

      // Coordinator → specific event
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

      res
        .status(403);

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
      // Participant
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
              "name"
            )
            .sort({
              createdAt:
                -1,
            });

        return res.json(
          announcements
        );
      }

      // Coordinator
      if (
        req.user.role ===
        "coordinator"
      ) {
        const announcements =
          await Announcement.find(
            {
              $or: [
                {
                  type:
                    "general",
                },
                {
                  createdBy:
                    req.user
                      ._id,
                },
              ],
            }
          )
            .populate(
              "createdBy",
              "name"
            )
            .sort({
              createdAt:
                -1,
            });

        return res.json(
          announcements
        );
      }

      // HOD
      const announcements =
        await Announcement.find()
          .populate(
            "createdBy",
            "name"
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