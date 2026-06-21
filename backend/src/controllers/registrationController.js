// import crypto from "crypto";
// import QRCode from "qrcode";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { Subevent } from "../models/Subevent.js";
// import { Registration } from "../models/Registration.js";
// import { Payment } from "../models/Payment.js";
// import { Attendance } from "../models/Attendance.js";
// import { Feedback } from "../models/Feedback.js";
// import { Certificate } from "../models/Certificate.js";
// import { razorpay } from "../config/razorpay.js";
// import { generateCertificatePdfBuffer } from "../utils/certificatePdf.js";

// const buildApiUrl = (path = "/") => {
//   const base = process.env.API_URL || `http://localhost:${process.env.PORT || 5000}`;
//   return `${base}${path}`;
// };

// export const registerForSubevent = asyncHandler(async (req, res) => {
//   const { subeventId } = req.params;
//   const subevent = await Subevent.findById(subeventId).populate("event", "name");
//   if (!subevent) {
//     res.status(404);
//     throw new Error("Subevent not found");
//   }
//   if (subevent.status !== "approved") {
//     res.status(400);
//     throw new Error("Registrations are allowed only for approved subevents");
//   }

//   const count = await Registration.countDocuments({ subevent: subeventId, status: { $ne: "cancelled" } });
//   if (subevent.maxParticipants && count >= subevent.maxParticipants) {
//     res.status(400);
//     throw new Error("Registrations closed: maximum participants reached");
//   }

//   const qrToken = crypto.randomBytes(16).toString("hex");
//   const qrText = JSON.stringify({ qrToken });
//   const qrPngDataUrl = await QRCode.toDataURL(qrText, { width: 240, margin: 1 });

//   const registration = await Registration.create({
//     participant: req.user._id,
//     subevent: subeventId,
//     qrToken,
//     qrPngDataUrl,
//     status: subevent.entryFee > 0 ? "payment_pending" : "registered",
//   });

//   // If paid event, create Razorpay order
//   let order;
//   if (subevent.entryFee > 0) {
//     const amount = Math.round(Number(subevent.entryFee) * 100); // paise
//     const instance = razorpay();
//     order = await instance.orders.create({
//       amount,
//       currency: "INR",
//       receipt: `reg_${registration._id}`,
//       notes: { subeventId: String(subeventId), participantId: String(req.user._id) },
//     });

//     const payment = await Payment.create({
//       registration: registration._id,
//       participant: req.user._id,
//       amount: Number(subevent.entryFee),
//       currency: "INR",
//       status: "created",
//       razorpayOrderId: order.id,
//     });
//     registration.payment = payment._id;
//     await registration.save();
//   }

//   res.status(201).json({
//     registration,
//     razorpay: order
//       ? { keyId: process.env.RAZORPAY_KEY_ID, orderId: order.id, amount: order.amount, currency: order.currency }
//       : null,
//   });
// });

// export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
//   if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//     res.status(400);
//     throw new Error("Missing razorpay fields");
//   }

//   const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
//   if (!payment) {
//     res.status(404);
//     throw new Error("Payment record not found");
//   }

//   const secret = process.env.RAZORPAY_KEY_SECRET;
//   const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//   const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");

//   if (expected !== razorpay_signature) {
//     payment.status = "failed";
//     await payment.save();
//     res.status(400);
//     throw new Error("Payment verification failed");
//   }

//   payment.status = "paid";
//   payment.razorpayPaymentId = razorpay_payment_id;
//   payment.razorpaySignature = razorpay_signature;
//   await payment.save();

//   const registration = await Registration.findById(payment.registration);
//   if (registration) {
//     registration.status = "paid";
//     await registration.save();
//   }

//   res.json({ message: "Payment verified", registrationId: registration?._id });
// });

// export const myRegistrations = asyncHandler(async (req, res) => {
//   const regs = await Registration.find({ participant: req.user._id })
//     .populate({ path: "subevent", populate: [{ path: "event", select: "name date" }, { path: "venue" }] })
//     .sort({ createdAt: -1 });
//   res.json({ registrations: regs });
// });

// // Coordinator: QR scan -> mark attendance
// export const markAttendanceByQr = asyncHandler(async (req, res) => {
//   const { qrToken } = req.body;
//   if (!qrToken) {
//     res.status(400);
//     throw new Error("qrToken is required");
//   }

//   const registration = await Registration.findOne({ qrToken }).populate("subevent");
//   if (!registration) {
//     res.status(404);
//     throw new Error("Invalid QR");
//   }

//   if (registration.status === "attended") {
//     return res.json({ message: "Already marked", registration });
//   }

//   // For paid events, ensure payment done
//   if (registration.status === "payment_pending") {
//     res.status(400);
//     throw new Error("Payment pending");
//   }

//   registration.status = "attended";
//   registration.attendedAt = new Date();
//   registration.checkedInBy = req.user._id;
//   await registration.save();

//   await Attendance.findOneAndUpdate(
//     { registration: registration._id },
//     { registration: registration._id, markedBy: req.user._id, markedAt: new Date() },
//     { upsert: true, new: true }
//   );

//   res.json({ message: "Attendance marked", registration });
// });

// export const submitFeedback = asyncHandler(async (req, res) => {
//   const { registrationId } = req.params;
//   const { rating, comment } = req.body;
//   const reg = await Registration.findById(registrationId);
//   if (!reg) {
//     res.status(404);
//     throw new Error("Registration not found");
//   }
//   if (String(reg.participant) !== String(req.user._id)) {
//     res.status(403);
//     throw new Error("You can only submit feedback for your registrations");
//   }

//   const feedback = await Feedback.findOneAndUpdate(
//     { registration: registrationId },
//     { rating, comment },
//     { upsert: true, new: true }
//   );
//   res.json({ feedback });
// });

// export const downloadCertificate = asyncHandler(async (req, res) => {
//   const { registrationId } = req.params;
//   const reg = await Registration.findById(registrationId)
//     .populate("participant", "name")
//     .populate({
//       path: "subevent",
//       populate: [{ path: "event", select: "name date" }],
//     });
//   if (!reg) {
//     res.status(404);
//     throw new Error("Registration not found");
//   }
//   if (String(reg.participant?._id || reg.participant) !== String(req.user._id)) {
//     res.status(403);
//     throw new Error("You can only download your own certificate");
//   }

//   const sub = reg.subevent;
//   const isWorkshop = sub.type === "workshop";
//   const isCompetitive = sub.type === "competitive";

//   let certificateType = "attendee";
//   let position;

//   if (isWorkshop) {
//     if (reg.status !== "attended") {
//       res.status(400);
//       throw new Error("Workshop certificate is available only for attendees");
//     }
//   // } else if (isCompetitive) {
//   // Must have attended
//   if (reg.status !== "attended") {
//     res.status(400);
//     throw new Error(
//       "Certificate available only for attendees"
//     );
//   }

//   const isWinner =
//     String(sub.winnerRegistration || "") ===
//     String(reg._id);

//   const isRunner =
//     String(sub.runnerRegistration || "") ===
//     String(reg._id);

//   // Winner certificate
//   if (isWinner) {
//     certificateType = "winner";
//     position = "1st";
//   }

//   // Runner certificate
//   else if (isRunner) {
//     certificateType = "runner";
//     position = "2nd";
//   }

//   // Everyone else gets attendee certificate
//   else {
//     certificateType = "attendee";
//     position = undefined;
//   }
// }

//   let cert = await Certificate.findOne({ registration: reg._id });
//   if (!cert) {
//     cert = await Certificate.create({
//       registration: reg._id,
//       certificateType,
//       position,
//       verificationToken: crypto.randomBytes(16).toString("hex"),
//     });
//   }

//   const verificationUrl = buildApiUrl(`/api/registrations/certificates/verify/${cert.verificationToken}`);
//   const dateText = new Date(sub.event.date).toLocaleDateString("en-IN");

//   const pdfBuffer = await generateCertificatePdfBuffer({
//     participantName: reg.participant.name,
//     eventName: sub.event.name,
//     subeventName: sub.name,
//     certificateType,
//     position,
//     dateText,
//     verificationUrl,
//   });

//   res.setHeader("Content-Type", "application/pdf");
//   res.setHeader("Content-Disposition", `attachment; filename="certificate-${reg._id}.pdf"`);
//   res.end(pdfBuffer);
// });

// export const verifyCertificate = asyncHandler(async (req, res) => {
//   const { token } = req.params;
//   const cert = await Certificate.findOne({ verificationToken: token }).populate({
//     path: "registration",
//     populate: [
//       { path: "participant", select: "name email" },
//       { path: "subevent", populate: [{ path: "event", select: "name date" }] },
//     ],
//   });
//   if (!cert) {
//     res.status(404);
//     throw new Error("Invalid certificate");
//   }

//   res.json({
//     valid: true,
//     certificateType: cert.certificateType,
//     position: cert.position,
//     issuedAt: cert.issuedAt,
//     participant: cert.registration.participant,
//     event: cert.registration.subevent.event,
//     subevent: { name: cert.registration.subevent.name, type: cert.registration.subevent.type },
//   });
// });

import crypto from "crypto";
import QRCode from "qrcode";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subevent } from "../models/Subevent.js";
import { Registration } from "../models/Registration.js";
import { Payment } from "../models/Payment.js";
import { Attendance } from "../models/Attendance.js";
import { Feedback } from "../models/Feedback.js";
import { Certificate } from "../models/Certificate.js";
import { razorpay } from "../config/razorpay.js";
import { generateCertificatePdfBuffer } from "../utils/certificatePdf.js";
import { Event } from "../models/Event.js";
import { User } from "../models/User.js";
import { sendEmail } from "../utils/email.js";
import { Venue } from "../models/Venue.js";
const buildApiUrl = (path = "/") => {
  const base =
    process.env.API_URL ||
    `http://localhost:${process.env.PORT || 5000}`;

  return `${base}${path}`;
};


export const registerForSubevent =
  asyncHandler(async (req, res) => {
    const { subeventId } =
      req.params;

    // const subevent =
    //   await Subevent.findById(
    //     subeventId
    //   ).populate(
    //     "event",
    //     "name"
    //   );
    const subevent =
    await Subevent.findById(
      subeventId
    )
      .populate(
        "event",
        "name date"
      )
     
    if (!subevent) {
      res.status(404);
      throw new Error(
        "Subevent not found"
      );
    }

    // NEW: block registrations if coordinator closed it
    if (
      subevent
        .registrationsClosed
    ) {
      res.status(400);
      throw new Error(
        "Registrations closed by coordinator"
      );
    }

    // NEW: block registrations after event ends
    const now =
      new Date();

    if (
      new Date(
        subevent.endAt
      ) < now
    ) {
      res.status(400);
      throw new Error(
        "Event ended. Registrations closed."
      );
    }

    if (
      subevent.status !==
      "approved"
    ) {
      res.status(400);
      throw new Error(
        "Registrations are allowed only for approved subevents"
      );
    }
//
// NEW: block cancelled / unapproved events
//
const event =
  await Event.findById(
    subevent.event
  );

if (
  !event ||
  event.status !==
    "approved"
) {
  res.status(400);

  throw new Error(
    "Registrations unavailable for this event"
  );
}
    // prevent duplicate registration
    const existing =
      await Registration.findOne(
        {
          participant:
            req.user._id,
          subevent:
            subeventId,
          status: {
            $ne:
              "cancelled",
          },
        }
      );

    if (existing) {
      res.status(400);
      throw new Error(
        "Already registered for this event"
      );
    }

    const count =
      await Registration.countDocuments(
        {
          subevent:
            subeventId,
          status: {
            $ne:
              "cancelled",
          },
        }
      );

    if (
      subevent.maxParticipants &&
      count >=
        subevent.maxParticipants
    ) {
      res.status(400);
      throw new Error(
        "Registrations closed: maximum participants reached"
      );
    }

    const qrToken =
      crypto
        .randomBytes(16)
        .toString("hex");

    const qrText =
      JSON.stringify({
        qrToken,
      });

    const qrPngDataUrl =
      await QRCode.toDataURL(
        qrText,
        {
          width: 240,
          margin: 1,
        }
      );

    const registration =
      await Registration.create({
        participant:
          req.user._id,
        subevent:
          subeventId,
        qrToken,
        qrPngDataUrl,
        status:
          subevent.entryFee >
          0
            ? "payment_pending"
            : "registered",
      });
      // Send registration confirmation email
try {
  const participant =
    await User.findById(
      req.user._id
    );

  const eventDate =
    subevent.event?.date
      ? new Date(
          subevent.event.date
        ).toLocaleDateString(
          "en-IN",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )
      : "TBA";

  const eventTime =
    subevent.startAt
      ? new Date(
          subevent.startAt
        ).toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute:
              "2-digit",
          }
        )
      : "TBA";

  const venueName =
    subevent.venue
      ?.name || "TBA";

  const qrBase64 =
    qrPngDataUrl.replace(
      /^data:image\/png;base64,/,
      ""
    );
    console.log("SUBEVENT DATA:");
    console.log(subevent);
    await sendEmail({
      to: participant.email,
    
      subject: `🎉 Registration Confirmed - ${subevent.name}`,
    
      html: `
      <div style="
        font-family: Arial, sans-serif;
        background:#f4f6f9;
        padding:30px;
      ">
    
        <div style="
          max-width:650px;
          margin:auto;
          background:white;
          border-radius:16px;
          overflow:hidden;
          box-shadow:0 4px 15px rgba(0,0,0,0.1);
        ">
    
          <div style="
            background:#1e3a8a;
            color:white;
            padding:25px;
            text-align:center;
          ">
            <h1>
              🎉 Registration Successful
            </h1>
    
            <p>
              CSEA Event Management
            </p>
          </div>
    
          <div style="padding:30px;">
    
            <p>
              Hello
              <b>${participant.name}</b>,
            </p>
    
            <p>
              You have successfully
              registered for the event.
            </p>
    
            <div style="
              background:#f8fafc;
              border:1px solid #e5e7eb;
              border-radius:12px;
              padding:20px;
            ">
    
              <h2>
                ${subevent.name}
              </h2>
    
              <p>
                <b>📌 Main Event:</b>
                ${
                  subevent.event
                    ?.name
                }
              </p>
    
              <p>
                <b>📅 Date:</b>
                ${eventDate}
              </p>
    
              <p>
                <b>⏰ Time:</b>
                ${eventTime}
              </p>
    
              <p>
                <b>📍 Venue:</b>
                ${
                  subevent
                    .venue?.name ||
                  "TBA"
                }
              </p>
    
              <p>
                <b>🏢 Venue Details:</b>
                ${
                  subevent
                    .venue
                    ?.location ||
                  "Campus Venue"
                }
              </p>
    
              <p>
                <b>💰 Entry Fee:</b>
                ₹${
                  subevent.entryFee ||
                  0
                }
              </p>
    
              <p>
                <b>🆔 Registration ID:</b>
                ${
                  registration._id
                }
              </p>
            </div>
    
            <br>
    
            <div style="
              background:#eff6ff;
              border-left:4px solid #2563eb;
              padding:15px;
              border-radius:8px;
            ">
    
  <h3>
  👨‍💼 Event Manager Details
</h3>

<p>
  <b>Name:</b>
  ${
    subevent.eventManager ||
    "Event Manager"
  }
</p>

<p>
  <b>Phone:</b>
  ${
    subevent.managerPhone ||
    "N/A"
  }
</p>

            </div>
    
            <br>
    
            <h3>
              📲 Attendance QR
            </h3>
    
            <p>
              Please show this QR
              during attendance.
            </p>
    
            <div style="
              text-align:center;
            ">
              <img
                src="cid:eventqr"
                width="220"
              />
            </div>
    
            <br>
    
            <div style="
              background:#fff7ed;
              border:1px solid #fdba74;
              padding:18px;
              border-radius:10px;
            ">
    
              <h3>
                ⚠ Important Instructions
              </h3>
    
              <ul>
                <li>
                  Arrive
                  <b>
                    15 minutes early
                  </b>
                </li>
    
                <li>
                  Bring your
                  <b>
                    college ID card
                  </b>
                </li>
    
                <li>
                  Keep your QR ready
                  for attendance
                </li>
    
                <li>
                  Any reschedule or
                  cancellation will
                  be informed by email
                </li>
              </ul>
            </div>
    
            <br>
    
            <p>
              Regards,<br>
              <b>
                CSEA Event
                Management Team
              </b>
            </p>
    
          </div>
        </div>
      </div>
      `,
    
      attachments: [
        {
          filename:
            "event-qr.png",
          content:
            qrBase64,
          encoding:
            "base64",
          cid: "eventqr",
        },
      ],
    });

  console.log(
    "✅ Registration email sent"
  );
} catch (error) {
  console.log(
    "Registration email failed:",
    error.message
  );
}
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $inc: { points: 2 },
        }
      );
    let order;

    if (
      subevent.entryFee >
      0
    ) {
      const amount =
        Math.round(
          Number(
            subevent.entryFee
          ) * 100
        );

      const instance =
        razorpay();

      order =
        await instance.orders.create(
          {
            amount,
            currency:
              "INR",
            receipt: `reg_${registration._id}`,
            notes: {
              subeventId:
                String(
                  subeventId
                ),
              participantId:
                String(
                  req.user
                    ._id
                ),
            },
          }
        );

      const payment =
        await Payment.create(
          {
            registration:
              registration._id,
            participant:
              req.user
                ._id,
            amount:
              Number(
                subevent.entryFee
              ),
            currency:
              "INR",
            status:
              "created",
            razorpayOrderId:
              order.id,
          }
        );

      registration.payment =
        payment._id;

      await registration.save();
    }

    res.status(201).json(
      {
        registration,
        razorpay:
          order
            ? {
                keyId:
                  process
                    .env
                    .RAZORPAY_KEY_ID,
                orderId:
                  order.id,
                amount:
                  order.amount,
                currency:
                  order.currency,
              }
            : null,
      }
    );
  });


// export const registerForSubevent =
//   asyncHandler(async (req, res) => {
//     const { subeventId } = req.params;

//     const subevent =
//       await Subevent.findById(
//         subeventId
//       ).populate("event", "name");

//     if (!subevent) {
//       res.status(404);
//       throw new Error(
//         "Subevent not found"
//       );
      
//     }
    

//     if (
//       subevent.status !==
//       "approved"
//     ) {
//       res.status(400);
//       throw new Error(
//         "Registrations are allowed only for approved subevents"
//       );
//     }

//     const count =
//       await Registration.countDocuments(
//         {
//           subevent: subeventId,
//           status: {
//             $ne: "cancelled",
//           },
//         }
//       );

//     if (
//       subevent.maxParticipants &&
//       count >=
//         subevent.maxParticipants
//     ) {
//       res.status(400);
//       throw new Error(
//         "Registrations closed: maximum participants reached"
//       );
//     }

//     const qrToken =
//       crypto
//         .randomBytes(16)
//         .toString("hex");

//     const qrText =
//       JSON.stringify({
//         qrToken,
//       });

//     const qrPngDataUrl =
//       await QRCode.toDataURL(
//         qrText,
//         {
//           width: 240,
//           margin: 1,
//         }
//       );

//     const registration =
//       await Registration.create({
//         participant:
//           req.user._id,
//         subevent:
//           subeventId,
//         qrToken,
//         qrPngDataUrl,
//         status:
//           subevent.entryFee > 0
//             ? "payment_pending"
//             : "registered",
//       });

//     let order;

//     if (
//       subevent.entryFee > 0
//     ) {
//       const amount =
//         Math.round(
//           Number(
//             subevent.entryFee
//           ) * 100
//         );

//       const instance =
//         razorpay();

//       order =
//         await instance.orders.create(
//           {
//             amount,
//             currency: "INR",
//             receipt: `reg_${registration._id}`,
//             notes: {
//               subeventId:
//                 String(
//                   subeventId
//                 ),
//               participantId:
//                 String(
//                   req.user._id
//                 ),
//             },
//           }
//         );

//       const payment =
//         await Payment.create({
//           registration:
//             registration._id,
//           participant:
//             req.user._id,
//           amount:
//             Number(
//               subevent.entryFee
//             ),
//           currency: "INR",
//           status: "created",
//           razorpayOrderId:
//             order.id,
//         });

//       registration.payment =
//         payment._id;

//       await registration.save();
//     }

//     res.status(201).json({
//       registration,
//       razorpay: order
//         ? {
  //           keyId:
  //             process.env
  //               .RAZORPAY_KEY_ID,
  //           orderId:
  //             order.id,
  //           amount:
  //             order.amount,
  //           currency:
  //             order.currency,
  //         }
  //       : null,
  //   });
  // });

export const verifyRazorpayPayment =
  asyncHandler(
    async (req, res) => {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      const payment =
        await Payment.findOne({
          razorpayOrderId:
            razorpay_order_id,
        });

      if (!payment) {
        res.status(404);
        throw new Error(
          "Payment record not found"
        );
      }

      payment.status = "paid";
      payment.razorpayPaymentId =
        razorpay_payment_id;
      payment.razorpaySignature =
        razorpay_signature;

      await payment.save();

      const registration =
        await Registration.findById(
          payment.registration
        );

      if (registration) {
        registration.status =
          "paid";
        await registration.save();
      }

      res.json({
        message:
          "Payment verified",
      });
    }
  );
  export const myRegistrations =
  asyncHandler(
    async (req, res) => {
      const regs =
        await Registration.find(
          {
            participant:
              req.user._id,
          }
        )
          .populate({
            path:
              "subevent",
            populate: [
              {
                path:
                  "event",
                select:
                  "name date",
              },
              {
                path:
                  "venue",
              },
            ],
          })
          .sort({
            createdAt: -1,
          })
          .lean();

      for (const reg of regs) {
        const feedback =
          await Feedback.findOne(
            {
              registration:
                reg._id,
            }
          );

        reg.feedback =
          feedback || null;
      }

      res.json({
        registrations:
          regs,
      });
    }
  );
// export const myRegistrations =
//   asyncHandler(async (req, res) => {
//     const regs =
//       await Registration.find({
//         participant:
//           req.user._id,
//       })
//         .populate({
//           path: "subevent",
//           populate: [
//             {
//               path: "event",
//               select:
//                 "name date",
//             },
//             {
//               path: "venue",
//             },
//           ],
//         })
//         .sort({
//           createdAt: -1,
//         });

  //   res.json({
  //     registrations: regs,
  //   });
  // });

/* NEW: Coordinator gets registrations
for a subevent to choose winner/runner */
export const getSubeventRegistrations =
  asyncHandler(async (req, res) => {
    const {
      subeventId,
    } = req.params;

    const registrations =
      await Registration.find({
        subevent:
          subeventId,
        status: {
          $in: [
            "registered",
            "paid",
            "attended",
          ],
        },
      }).populate(
        "participant",
        "name email registerNumber"
      );

    res.json({
      registrations,
    });
  });

// export const markAttendanceByQr =
//   asyncHandler(async (req, res) => {
//     const { qrToken } =
//       req.body;

//     const registration =
//       await Registration.findOne(
//         { qrToken }
//       ).populate(
//         "subevent"
//       );

//     if (!registration) {
//       res.status(404);
//       throw new Error(
//         "Invalid QR"
//       );
//     }

//     registration.status =
//       "attended";

//     registration.attendedAt =
//       new Date();

//     registration.checkedInBy =
//       req.user._id;

//     await registration.save();
// // Get parent event
// const event =
//   await Event.findById(
//     registration.event
//   );

// const now =
//   new Date();

// // Attendance manually closed
// if (
//   !event?.attendanceEnabled
// ) {
//   res.status(400);

//   throw new Error(
//     "Attendance is closed by coordinator"
//   );
// }

// // Attendance expired
// if (
//   event.attendanceEnd &&
//   now >
//     new Date(
//       event.attendanceEnd
//     )
// ) {
//   res.status(400);

//   throw new Error(
//     "Attendance window closed"
//   );
// }

//     await Attendance.findOneAndUpdate(
//       {
//         registration:
//           registration._id,
//       },
//       {
//         registration:
//           registration._id,
//         markedBy:
//           req.user._id,
//         markedAt:
//           new Date(),
//       },
//       {
//         upsert: true,
//         new: true,
//       }
//     );

  //   res.json({
  //     message:
  //       "Attendance marked",
  //     registration,
  //   });
  // });
  export const markAttendanceByQr =
  asyncHandler(async (req, res) => {
    const {
      qrToken,
      sessionNumber,
    } = req.body;
    if (
      !sessionNumber ||
      Number(sessionNumber) < 1
    ) {
      res.status(400);
    
      throw new Error(
        "Valid session number is required"
      );
    }
    // const registration =
    //   await Registration.findOne(
    //     { qrToken }
    //   ).populate(
    //     "subevent"
    //   );
    const registration =
  await Registration.findOne(
    { qrToken }
  ).populate({
    path: "subevent",
    populate: {
      path: "event",
    },
  });

    if (!registration) {
      res.status(404);
      throw new Error(
        "Invalid QR"
      );
    }
    if (
      Number(sessionNumber) >
      registration.subevent.totalSessions
    ) {
      res.status(400);
    
      throw new Error(
        "Invalid session number"
      );
    }
    // if (
    //   registration.status ===
    //   "attended"
    // ) {
    //   return res.status(400).json({
    //     message:
    //       "Attendance already marked",
    //   });
    // }
    // Get parent event
    // const event =
    //   await Event.findById(
    //     registration.event
    //   );
    const event =
  registration.subevent
    .event;

    const now =
      new Date();

    // Attendance closed
    if (
      !event?.attendanceEnabled
    ) {
      res.status(400);

      throw new Error(
        "Attendance is closed by coordinator"
      );
    }

    // Attendance expired
    // if (
    //   event.attendanceEnd &&
    //   now >
    //     new Date(
    //       event.attendanceEnd
    //     )
    // ) {
    //   res.status(400);

    //   throw new Error(
    //     "Attendance window closed"
    //   );
    // }

    // Mark registration attended
    // registration.status =
    //   "attended";

    // registration.attendedAt =
    //   new Date();

    // registration.checkedInBy =
    //   req.user._id;

    // await registration.save();
    // await User.findByIdAndUpdate(
    //   registration.participant,
    //   {
    //     $inc: { points: 5 },
    //   }
    // );
    // Save attendance record
    // await Attendance.findOneAndUpdate(
    //   {
    //     registration:
    //       registration._id,
    //   },
    //   {
    //     registration:
    //       registration._id,
    //     markedBy:
    //       req.user._id,
    //     markedAt:
    //       new Date(),
    //   },
    //   {
    //     upsert: true,
    //     new: true,
    //   }
    // );
    const existingAttendance =
  await Attendance.findOne({
    registration:
      registration._id,

    sessionNumber,
  });

if (existingAttendance) {
  return res.status(400).json({
    message:
      `Attendance already marked for Session ${sessionNumber}`,
  });
}
    const attendance =
    await Attendance.findOneAndUpdate(
  {
    registration:
      registration._id,
  
    sessionNumber,
  },
  {
    registration:
      registration._id,
  
    sessionNumber,
  
    markedBy:
      req.user._id,
  
    markedAt:
      new Date(),
  },
  {
    upsert: true,
    new: true,
  }
  );
  await User.findByIdAndUpdate(
    registration.participant,
    {
      $inc: { points: 5 },
    }
  );
  if (
  registration.status === "payment_pending"
) {
  res.status(400);

  throw new Error(
    "Payment pending"
  );
}
  registration.status = "attended";

if (!registration.attendedAt) {
  registration.attendedAt = new Date();
}

await registration.save();
  res.json({
    message:
      `Attendance marked for Session ${sessionNumber}`,
  
    attendance,
  });
  });
// export const submitFeedback =
//   asyncHandler(async (req, res) => {
//     const {
//       registrationId,
//     } = req.params;

//     const {
//       rating,
//       comment,
//     } = req.body;

//     const feedback =
//       await Feedback.findOneAndUpdate(
//         {
//           registration:
//             registrationId,
//         },
//         {
//           rating,
//           comment,
//         },
//         {
//           upsert: true,
//           new: true,
//         }
//       );

  //   res.json({
  //     feedback,
  //   });
  // });
  // export const submitFeedback =
  // asyncHandler(async (req, res) => {
  //   const { registrationId } =
  //     req.params;

  //   const {
  //     rating,
  //     organizationRating,
  //     contentRating,
  //     venueRating,
  //     likedMost,
  //     suggestions,
  //     comment,
  //   } = req.body;
  //   const cleanComment =
  //   comment?.trim();
  //   const registration =
  //     await Registration.findById(
  //       registrationId
  //     ).populate("subevent");

  //   if (!registration) {
  //     res.status(404);
  //     throw new Error(
  //       "Registration not found"
  //     );
  //   }

  //   // only own registration
  //   if (
  //     String(
  //       registration.participant
  //     ) !==
  //     String(req.user._id)
  //   ) {
  //     res.status(403);
  //     throw new Error(
  //       "Unauthorized"
  //     );
  //   }

  //   // must attend event
  //   if (
  //     registration.status !==
  //     "attended"
  //   ) {
  //     res.status(400);
  //     throw new Error(
  //       "You can only give feedback after attending"
  //     );
  //   }

  //   // already submitted
  //   const existing =
  //     await Feedback.findOne({
  //       registration:
  //         registrationId,
  //     });

  //   if (existing) {
  //     res.status(400);
  //     throw new Error(
  //       "Feedback already submitted"
  //     );
  //   }
    // if (!rating) {
    //   res.status(400);
    //   throw new Error(
    //     "Rating required"
    //   );
    // }
    // const feedback =
    //   await Feedback.create({
    //     registration:
    //       registrationId,

    //     participant:
    //       req.user._id,

    //     subevent:
    //       registration.subevent
    //         ._id,

    //     rating,
    //     organizationRating,
  //       contentRating,
  //       venueRating,
  //       likedMost,
  //       suggestions,
  //       comment: cleanComment,
  //     });

  //   res.json({
  //     message:
  //       "Feedback submitted",
  //     feedback,
  //   });
  // });
  
export const submitFeedback =
  asyncHandler(
    async (req, res) => {
      const {
        registrationId,
      } = req.params;

      const {
        rating,
        comment,
        likedMost,
        suggestions,
      } = req.body;

      const registration =
        await Registration.findById(
          registrationId
        );

      if (
        !registration
      ) {
        res.status(404);
        throw new Error(
          "Registration not found"
        );
      }

      if (
        registration.participant.toString() !==
        req.user._id.toString()
      ) {
        res.status(403);
        throw new Error(
          "Not authorized"
        );
      }

      if (
        registration.status !==
        "attended"
      ) {
        res.status(400);
        throw new Error(
          "You can only give feedback after attending"
        );
      }

      // prevent duplicate feedback
      const existing =
        await Feedback.findOne(
          {
            registration:
              registrationId,
          }
        );

      if (
        existing
      ) {
        res.status(400);
        throw new Error(
          "Feedback already submitted"
        );
      }

      const feedback =
        await Feedback.create(
          {
            participant:
              req.user
                ._id,

            registration:
              registrationId,

            subevent:
              registration.subevent,

            rating,

            comment:
              comment ||
              "",

            likedMost:
              likedMost ||
              "",

            suggestions:
              suggestions ||
              "",
          }
        );

      registration.feedback =
        feedback._id;

      await registration.save();

      res.status(201).json({
        message:
          "Feedback submitted successfully",
        feedback,
      });
    }
  );


export const downloadCertificate =
  asyncHandler(async (req, res) => {
    const {
      registrationId,
    } = req.params;

    const reg =
      await Registration.findById(
        registrationId
      )
        .populate(
          "participant",
          "name"
        )
        .populate({
          path:
            "subevent",
          populate: [
            {
              path:
                "event",
              select:
                "name date",
            },
          ],
        });

    const sub =
      reg.subevent;

    const isWorkshop =
      sub.type ===
      "workshop";

    const isCompetitive =
      sub.type ===
      "competitive";

    let certificateType =
      "attendee";

    let position;
// Multi-session attendance check

const attendanceCount =
  await Attendance.countDocuments({
    registration: reg._id,
  });

const totalSessions =
  sub.totalSessions || 1;

const certificateMode =
  sub.certificateSettings?.mode ||
  "attendance_once";

const minimumPercentage =
  sub.certificateSettings
    ?.minimumPercentage || 80;
    // if (isWorkshop) {
    //   if (
    //     reg.status !==
    //     "attended"
    //   ) {
    //     throw new Error(
    //       "Workshop certificate only for attendees"
    //     );
    //   }
    // }
    
   // Certificate eligibility validation

if (
  certificateMode ===
  "attendance_once"
) {

  if (
    attendanceCount < 1
  ) {
    throw new Error(
      "Attend at least one session to download certificate"
    );
  }

}

else if (
  certificateMode ===
  "attendance_percentage"
) {

  const percentage =
    (
      attendanceCount /
      totalSessions
    ) * 100;

  if (
    percentage <
    minimumPercentage
  ) {
    throw new Error(
      `Certificate requires ${minimumPercentage}% attendance. Current attendance: ${percentage.toFixed(
        0
      )}%`
    );
  }
// Decide certificate type AFTER eligibility is confirmed

if (sub.type === "competitive") {

  const isWinner =
    String(sub.winnerRegistration || "") ===
    String(reg._id);

  const isRunner =
    String(sub.runnerRegistration || "") ===
    String(reg._id);

  if (isWinner) {
    certificateType = "winner";
    position = "1st";
  } else if (isRunner) {
    certificateType = "runner";
    position = "2nd";
  } else {
    certificateType = "attendee";
    position = undefined;
  }

} else {

  certificateType = "attendee";
  position = undefined;

}
}
    // else if (
    //   isCompetitive
    // ) {
    //   if (
    //     reg.status !==
    //     "attended"
    //   ) {
    //     throw new Error(
    //       "Certificate available only for attendees"
    //     );
    //   }

    //   const isWinner =
    //     String(
    //       sub.winnerRegistration ||
    //         ""
    //     ) ===
    //     String(reg._id);

    //   const isRunner =
    //     String(
    //       sub.runnerRegistration ||
    //         ""
    //     ) ===
    //     String(reg._id);

    //   if (isWinner) {
    //     certificateType =
    //       "winner";
    //     position = "1st";
    //   } else if (
    //     isRunner
    //   ) {
    //     certificateType =
    //       "runner";
    //     position = "2nd";
    //   } else {
    //     certificateType =
    //       "attendee";
    //   }
    // }
    console.log("REG ID:", String(reg._id));
console.log(
  "WINNER ID:",
  String(sub.winnerRegistration || "")
);

console.log(
  "RUNNER ID:",
  String(sub.runnerRegistration || "")
);

console.log(
  "IS WINNER:",
  String(sub.winnerRegistration || "") ===
    String(reg._id)
);
    let cert = await Certificate.findOne({
      registration: reg._id,
    });
    
    if (!cert) {
      cert = await Certificate.create({
        registration: reg._id,
        certificateType,
        position,
        verificationToken:
          crypto.randomBytes(16).toString("hex"),
      });
    } else {
      cert.certificateType = certificateType;
      cert.position = position;
      await cert.save();
    }
    // let cert =
    //   await Certificate.findOne(
    //     {
    //       registration:
    //         reg._id,
    //     }
    //   );

    // if (!cert) {
    //   cert =
    //     await Certificate.create(
    //       {
    //         registration:
    //           reg._id,
    //         certificateType,
    //         position,
    //         verificationToken:
    //           crypto
    //             .randomBytes(
    //               16
    //             )
    //             .toString(
    //               "hex"
    //             ),
    //       }
    //     );
    // }

    const verificationUrl =
      buildApiUrl(
        `/api/registrations/certificates/verify/${cert.verificationToken}`
      );

    const dateText =
      new Date(
        sub.event.date
      ).toLocaleDateString(
        "en-IN"
      );

    const pdfBuffer =
      await generateCertificatePdfBuffer(
        {
          participantName:
            reg.participant
              .name,
          eventName:
            sub.event.name,
          subeventName:
            sub.name,
          certificateType,
          position,
          dateText,
          verificationUrl,
        }
      );

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="certificate-${reg._id}.pdf"`
    );

    res.end(pdfBuffer);
  });

export const verifyCertificate =
  asyncHandler(async (req, res) => {
    const { token } =
      req.params;

    const cert =
      await Certificate.findOne(
        {
          verificationToken:
            token,
        }
      );

    res.json({
      valid: !!cert,
      certificate:
        cert,
    });
  });
  // export const getEventFeedbacks =
  // asyncHandler(
  //   async (req, res) => {
  //     const { subeventId } =
  //       req.params;

  //     const subevent =
  //       await Subevent.findById(
  //         subeventId
  //       );

  //     if (!subevent) {
  //       res.status(404);
  //       throw new Error(
  //         "Event not found"
  //       );
  //     }

  //     // coordinator only
  //     const isCoordinator =
  //       String(
  //         subevent.coordinator
  //       ) ===
  //       String(req.user._id);

  //     const isHod =
  //       req.user.role ===
  //       "hod";

  //     if (
  //       !isCoordinator &&
  //       !isHod
  //     ) {
  //       res.status(403);
  //       throw new Error(
  //         "Unauthorized"
  //       );
  //     }

  //     const feedbacks =
  //       await Feedback.find({
  //         subevent:
  //           subeventId,
  //       })
  //         .populate(
  //           "participant",
  //           "name email"
  //         )
  //         .sort({
  //           createdAt: -1,
  //         });

  //     const average =
  //       feedbacks.length
  //         ? (
  //             feedbacks.reduce(
  //               (a, b) =>
  //                 a +
  //                 b.rating,
  //               0
  //             ) /
  //             feedbacks.length
  //           ).toFixed(1)
  //         : 0;

  //     res.json({
  //       averageRating:
  //         average,
  //       total:
  //         feedbacks.length,
  //       feedbacks,
  //     });
  //   }
  // );
  // export const getEventFeedbacks =
  // asyncHandler(
  //   async (req, res) => {
  //     const { subeventId } =
  //       req.params;

  //     const feedbacks =
  //       await Feedback.find({
  //         subevent:
  //           subeventId,
  //       })
  //         .populate(
  //           "participant",
  //           "name email"
  //         )
  //         .sort({
  //           createdAt: -1,
  //         });

  //     const average =
  //       feedbacks.length
  //         ? (
  //             feedbacks.reduce(
  //               (sum, f) =>
  //                 sum +
  //                 f.rating,
  //               0
  //             ) /
  //             feedbacks.length
  //           ).toFixed(1)
  //         : 0;

  //     res.json({
  //       averageRating:
  //         average,
  //       total:
  //         feedbacks.length,
  //       feedbacks,
  //     });
  //   }
  // );
  export const getEventFeedbacks =
  asyncHandler(
    async (req, res) => {
      const { subeventId } =
        req.params;

      const feedbacks =
        await Feedback.find({
          subevent:
            subeventId,
        })
          .populate(
            "participant",
            "name email"
          )
          .lean();

      const averageRating =
        feedbacks.length
          ? (
              feedbacks.reduce(
                (
                  sum,
                  f
                ) =>
                  sum +
                  (f.rating ||
                    0),
                0
              ) /
              feedbacks.length
            ).toFixed(1)
          : 0;

      res.json({
        averageRating,
        total:
          feedbacks.length,
        feedbacks,
      });
    }
  );