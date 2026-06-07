// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const roles = ["participant", "coordinator", "hod", "admin"];

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true, index: true },
//     password: { type: String, required: true, minlength: 6, select: false },
//     role: { type: String, enum: roles, default: "participant" },
//     phone: { type: String },

//     // Participant fields (optional for other roles)
//     registerNumber: { type: String },
//     year: { type: String },
//     department: { type: String, default: "CSE" },
//     collegeName: { type: String }, // external participants

//     // Coordinator profile (optional)
//     cgpa: { type: Number },

//     isEmailVerified: { type: Boolean, default: false },
//     emailVerificationToken: { type: String },
//     emailVerificationExpires: { type: Date },

//     resetPasswordToken: { type: String },
//     resetPasswordExpires: { type: Date },
//   },
//   { timestamps: true }
// );

// userSchema.pre("save", async function preSave(next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password);
// };

// export const User = mongoose.model("User", userSchema);

// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const roles = ["participant", "coordinator", "hod", "admin"];

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       index: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//       select: false,
//     },

//     role: {
//       type: String,
//       enum: roles,
//       default: "participant",
//     },

//     phone: {
//       type: String,
//     },

//     // Participant fields
//     registerNumber: {
//       type: String,
//     },

//     year: {
//       type: String,
//     },

//     department: {
//       type: String,
//       default: "CSE",
//     },

//     collegeName: {
//       type: String,
//     },

//     // Coordinator profile
//     cgpa: {
//       type: Number,
//     },

//     isEmailVerified: {
//       type: Boolean,
//       default: false,
//     },

//     emailVerificationToken: {
//       type: String,
//     },

//     emailVerificationExpires: {
//       type: Date,
//     },

//     resetPasswordToken: {
//       type: String,
//     },

//     resetPasswordExpires: {
//       type: Date,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Hash password before saving
// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Compare passwords
// userSchema.methods.matchPassword =
//   async function matchPassword(enteredPassword) {
//     return bcrypt.compare(
//       enteredPassword,
//       this.password
//     );
//   };

// export const User = mongoose.model(
//   "User",
//   userSchema
// );
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const roles = ["participant", "coordinator", "hod", "admin"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: roles,
      default: "participant",
    },

    phone: {
      type: String,
    },

    // Participant fields
    registerNumber: {
      type: String,
    },

    year: {
      type: String,
    },

    department: {
      type: String,
      default: "CSE",
    },

    collegeName: {
      type: String,
    },

    // Leaderboard / Participation Points
    points: {
      type: Number,
      default: 0,
    },

    // Coordinator profile
    cgpa: {
      type: Number,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
    },

    emailVerificationExpires: {
      type: Date,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare passwords
userSchema.methods.matchPassword =
  async function matchPassword(enteredPassword) {
    return bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

export const User = mongoose.model(
  "User",
  userSchema
);