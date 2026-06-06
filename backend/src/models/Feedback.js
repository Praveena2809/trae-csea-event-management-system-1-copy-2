import mongoose from "mongoose";

const feedbackSchema =
  new mongoose.Schema(
    {
      registration: {
        type:
          mongoose.Schema
            .Types
            .ObjectId,
        ref:
          "Registration",
        required: true,
        unique: true,
      },

      participant: {
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
        required: true,
      },

      // Overall Rating
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },

      // Optional detailed ratings
      organizationRating:
        {
          type: Number,
          min: 1,
          max: 5,
          default: null,
        },

      contentRating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },

      venueRating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },

      // Text feedback
      likedMost: {
        type: String,
        trim: true,
        default: "",
      },

      suggestions: {
        type: String,
        trim: true,
        default: "",
      },

      comment: {
        type: String,
        trim: true,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

export const Feedback =
  mongoose.model(
    "Feedback",
    feedbackSchema
  );