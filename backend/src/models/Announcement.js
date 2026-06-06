import mongoose from "mongoose";

const announcementSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },

      type: {
        type: String,
        enum: [
          "general",
          "event",
        ],
        required: true,
      },

      createdBy: {
        type:
          mongoose.Schema
            .Types
            .ObjectId,
        ref: "User",
        required: true,
      },

      subevent: {
        type:
          mongoose.Schema
            .Types
            .ObjectId,
        ref:
          "Subevent",
      },
    },
    {
      timestamps: true,
    }
  );

export const Announcement =
  mongoose.model(
    "Announcement",
    announcementSchema
  );