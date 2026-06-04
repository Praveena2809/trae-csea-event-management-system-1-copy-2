// import mongoose from "mongoose";

// const subeventSchema = new mongoose.Schema(
//   {
//     event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true, index: true },
//     type: { type: String, enum: ["competitive", "workshop"], required: true },
//     name: { type: String, required: true, trim: true },
//     posterUrl: { type: String },
//     description: { type: String, required: true },

//     venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" },
//     startAt: { type: Date, required: true, index: true },
//     endAt: { type: Date, required: true },

//     eligibility: { type: String },
//     maxParticipants: { type: Number, default: 0 },
//     entryFee: { type: Number, default: 0 },

//     eventManager: { type: String },
//     managerPhone: { type: String },
//     prizePool: { type: String },

//     winnerRegistration: { type: mongoose.Schema.Types.ObjectId, ref: "Registration" },
//     runnerRegistration: { type: mongoose.Schema.Types.ObjectId, ref: "Registration" },

//     status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//     rejectionReason: { type: String },
//     approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     approvedAt: { type: Date },

//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   },
//   { timestamps: true }
// );

// subeventSchema.virtual("isLive").get(function isLive() {
//   const now = new Date();
//   return this.status === "approved" && now >= this.startAt && now <= this.endAt;
// });

// export const Subevent = mongoose.model("Subevent", subeventSchema);
import mongoose from "mongoose";

const subeventSchema =
  new mongoose.Schema(
    {
      event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
        index: true,
      },

      type: {
        type: String,
        enum: [
          "competitive",
          "workshop",
        ],
        required: true,
      },

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

      venue: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Venue",
      },

      startAt: {
        type: Date,
        required: true,
        index: true,
      },

      endAt: {
        type: Date,
        required: true,
      },

      eligibility: {
        type: String,
      },

      maxParticipants: {
        type: Number,
        default: 0,
      },

      entryFee: {
        type: Number,
        default: 0,
      },

      eventManager: {
        type: String,
      },

      managerPhone: {
        type: String,
      },

      prizePool: {
        type: String,
      },

      // NEW: coordinator can close registrations
      registrationsClosed: {
        type: Boolean,
        default: false,
      },

      // Winner / Runner
      winnerRegistration: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Registration",
      },

      runnerRegistration: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Registration",
      },

      status: {
        type: String,
        enum: [
          "pending",
          "approved",
          "rejected",
        ],
        default: "pending",
      },

      rejectionReason: {
        type: String,
      },

      approvedBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
      },

      approvedAt: {
        type: Date,
      },

      createdBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

subeventSchema.virtual(
  "isLive"
).get(function isLive() {
  const now = new Date();

  return (
    this.status ===
      "approved" &&
    now >= this.startAt &&
    now <= this.endAt
  );
});

export const Subevent =
  mongoose.model(
    "Subevent",
    subeventSchema
  );