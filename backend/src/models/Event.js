// import mongoose from "mongoose";

// const eventSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     posterUrl: { type: String },
//     description: { type: String, required: true },
//     date: { type: Date, required: true },
//     budgetEstimate: { type: Number, default: 0 },
//     numberOfSubevents: { type: Number, default: 0 },
//     miscNotesForHod: { type: String },

//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // coordinator

//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//       index: true,
//     },
//     rejectionReason: { type: String },
//     approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // HOD
//     approvedAt: { type: Date },
//   },
//   { timestamps: true }
// );

// export const Event = mongoose.model("Event", eventSchema);

import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    posterUrl: {
      type: String,
    },

    description: {
      type: String,
      required: true,
    },

    // NEW: workshop or competitive
    eventType: {
      type: String,
      enum: ["competitive", "workshop"],
      default: "workshop",
    },

    // NEW: winner of event
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // NEW: runner of event
    runner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    date: {
      type: Date,
      required: true,
    },

    budgetEstimate: {
      type: Number,
      default: 0,
    },

    numberOfSubevents: {
      type: Number,
      default: 0,
    },

    miscNotesForHod: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // coordinator

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    rejectionReason: {
      type: String,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, // HOD

    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model(
  "Event",
  eventSchema
);