// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import { api } from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import { loadRazorpay } from "../services/razorpay";

// export default function Events() {
//   const [events, setEvents] = useState([]);
//   const [q, setQ] = useState("");
//   const { user } = useAuth();

//   useEffect(() => {
//     (async () => {
//       const { data } = await api.get("/events/public");
//       setEvents(data.events || []);
//     })();
//   }, []);

//   const filtered = events.filter((e) => e.name.toLowerCase().includes(q.toLowerCase()));

//   const register = async (subeventId) => {
//     try {
//       const { data } = await api.post(`/registrations/${subeventId}/register`);
//       toast.success("Registered. QR generated.");

//       if (!data.razorpay) return;

//       const ok = await loadRazorpay();
//       if (!ok) throw new Error("Failed to load Razorpay");

//       const options = {
//         key: data.razorpay.keyId,
//         amount: data.razorpay.amount,
//         currency: data.razorpay.currency,
//         order_id: data.razorpay.orderId,
//         name: "CSE Events",
//         description: "Event registration fee",
//         handler: async (response) => {
//           try {
//             await api.post("/registrations/razorpay/verify", response);
//             toast.success("Payment successful");
//           } catch (e) {
//             toast.error(e?.response?.data?.message || "Payment verification failed");
//           }
//         },
//       };

//       // eslint-disable-next-line no-undef
//       const rz = new Razorpay(options);
//       rz.open();
//     } catch (err) {
//       toast.error(err?.response?.data?.message || err.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Events</h2>
//           <p className="text-slate-600 dark:text-slate-300">Browse approved events & subevents.</p>
//         </div>
//         <input
//           value={q}
//           onChange={(e) => setQ(e.target.value)}
//           placeholder="Search events..."
//           className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 md:w-80"
//         />
//       </div>

//       <div className="grid gap-5">
//         {filtered.map((e) => (
//           <div key={e._id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
//             <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//               <div>
//                 <p className="text-xl font-semibold text-slate-900 dark:text-white">{e.name}</p>
//                 <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{e.description}</p>
//                 <p className="mt-2 text-xs text-slate-500">
//                   Date: {new Date(e.date).toLocaleDateString("en-IN")}
//                 </p>
//               </div>
//               <div className="h-20 w-full rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 md:w-48" />
//             </div>

//             <div className="mt-4 grid gap-3 md:grid-cols-2">
//               {(e.subevents || []).map((s) => (
//                 <div
//                   key={s._id}
//                   className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div className="min-w-0">
//                       <p className="truncate font-semibold text-slate-900 dark:text-white">{s.name}</p>
//                       <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{s.description}</p>
//                       <p className="mt-2 text-xs text-slate-500">
//                         Venue: {s.venue?.name || "TBA"} • {new Date(s.startAt).toLocaleString("en-IN")}
//                       </p>
//                       <p className="text-xs text-slate-500">
//                         Eligibility: {s.eligibility || "Open"} • Fee: ₹{s.entryFee || 0}
//                       </p>
//                     </div>
//                     <span className="rounded-full bg-indigo-600/10 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
//                       {s.type}
//                     </span>
//                   </div>
//                   <div className="mt-3">
//                     {!user ? (
//                       <Link
//                         to="/login"
//                         className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
//                       >
//                         Register
//                       </Link>
//                     ) : user.role === "participant" ? (
//                       <button
//                         type="button"
//                         onClick={() => register(s._id)}
//                         className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
//                       >
//                         Register Now
//                       </button>
//                     ) : (
//                       <span className="text-xs text-slate-500">Login as participant to register</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}

//         {!filtered.length && (
//           <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600 dark:border-slate-700 dark:text-slate-300">
//             No events found.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import { api } from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import { loadRazorpay } from "../services/razorpay";

// export default function Events() {
//   const [events, setEvents] = useState([]);
//   const [q, setQ] = useState("");
//   const { user } = useAuth();

//   useEffect(() => {
//     (async () => {
//       const { data } = await api.get("/events/public");
//       setEvents(data.events || []);
//     })();
//   }, []);

//   const filtered = events.filter((e) =>
//     e.name.toLowerCase().includes(q.toLowerCase())
//   );

//   const register = async (subeventId) => {
//     try {
//       const { data } = await api.post(
//         `/registrations/${subeventId}/register`
//       );

//       toast.success("Registered. QR generated.");

//       if (!data.razorpay) return;

//       const ok = await loadRazorpay();
//       if (!ok) throw new Error("Failed to load Razorpay");

//       const options = {
//         key: data.razorpay.keyId,
//         amount: data.razorpay.amount,
//         currency: data.razorpay.currency,
//         order_id: data.razorpay.orderId,
//         name: "CSE Events",
//         description: "Event registration fee",
//         handler: async (response) => {
//           try {
//             await api.post(
//               "/registrations/razorpay/verify",
//               response
//             );
//             toast.success("Payment successful");
//           } catch (e) {
//             toast.error(
//               e?.response?.data?.message ||
//                 "Payment verification failed"
//             );
//           }
//         },
//       };

//       // eslint-disable-next-line no-undef
//       const rz = new Razorpay(options);
//       rz.open();
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err.message ||
//           "Registration failed"
//       );
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
//             Events
//           </h2>
//           <p className="text-slate-600 dark:text-slate-300">
//             Browse approved events & subevents.
//           </p>
//         </div>

//         <input
//           value={q}
//           onChange={(e) => setQ(e.target.value)}
//           placeholder="Search events..."
//           className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 md:w-80"
//         />
//       </div>

//       <div className="grid gap-5">
//         {filtered.map((e) => (
//           <div
//             key={e._id}
//             className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
//           >
//             {/* Event Header */}
//             <div className="flex flex-col gap-4 md:flex-row">
//               {/* Event Poster */}
//               <div className="md:w-64 shrink-0">
//                 {e.posterUrl ? (
//                   <img
//                   src={
//                     e.posterUrl?.startsWith("http")
//                       ? e.posterUrl
//                       : `http://localhost:8000${e.posterUrl}`
//                   }
//                   alt={e.name}
//                   className="h-48 w-full rounded-xl object-cover border border-slate-200 dark:border-slate-800"
//                 />
//                 ) : (
//                   <div className="flex h-48 w-full items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-sm font-medium">
//                     No Poster
//                   </div>
//                 )}
//               </div>

//               {/* Event Details */}
//               <div className="flex-1">
//                 <p className="text-2xl font-bold text-slate-900 dark:text-white">
//                   {e.name}
//                 </p>

//                 <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
//                   {e.description}
//                 </p>

//                 <p className="mt-3 text-sm text-slate-500">
//                   📅{" "}
//                   {new Date(e.date).toLocaleDateString("en-IN")}
//                 </p>
//               </div>
//             </div>

//             {/* Subevents */}
//             <div className="mt-6 grid gap-4 md:grid-cols-2">
//               {(e.subevents || []).map((s) => (
//                 <div
//                   key={s._id}
//                   className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
//                 >
//                   {/* Subevent Poster */}
//                   {s.posterUrl ? (
//                    <img
//                    src={
//                      s.posterUrl?.startsWith("http")
//                        ? s.posterUrl
//                        : `http://localhost:8000${s.posterUrl}`
//                    }
//                    alt={s.name}
//                    className="h-full w-full object-cover"
//                   />
//                   ) : (
//                     <div className="flex h-40 items-center justify-center bg-slate-200 dark:bg-slate-800 text-sm text-slate-500">
//                       No Poster
//                     </div>
//                   )}

//                   <div className="p-4">
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="min-w-0">
//                         <p className="truncate text-lg font-semibold text-slate-900 dark:text-white">
//                           {s.name}
//                         </p>

//                         <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
//                           {s.description}
//                         </p>

//                         <p className="mt-2 text-xs text-slate-500">
//                           📍 {s.venue?.name || "TBA"}
//                         </p>

//                         <p className="text-xs text-slate-500">
//                           🕒{" "}
//                           {new Date(
//                             s.startAt
//                           ).toLocaleString("en-IN")}
//                         </p>

//                         <p className="text-xs text-slate-500">
//                           Eligibility:{" "}
//                           {s.eligibility || "Open"}
//                         </p>

//                         <p className="text-xs text-slate-500">
//                           Fee: ₹{s.entryFee || 0}
//                         </p>
//                       </div>

//                       <span className="rounded-full bg-indigo-600/10 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
//                         {s.type}
//                       </span>
//                     </div>

//                     <div className="mt-4">
//                       {!user ? (
//                         <Link
//                           to="/login"
//                           className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
//                         >
//                           Login to Register
//                         </Link>
//                       ) : user.role === "participant" ? (
//                         <button
//                           type="button"
//                           onClick={() => register(s._id)}
//                           className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
//                         >
//                           Register Now
//                         </button>
//                       ) : (
//                         <span className="text-sm text-slate-500">
//                           Login as participant to register
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}

//         {!filtered.length && (
//           <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600 dark:border-slate-700 dark:text-slate-300">
//             No events found.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
//----------latest
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import { api } from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import { loadRazorpay } from "../services/razorpay";

// export default function Events() {
//   const [events, setEvents] =
//     useState([]);
//   const [q, setQ] =
//     useState("");

//   const { user } =
//     useAuth();

//   useEffect(() => {
//     (async () => {
//       const { data } =
//         await api.get(
//           "/events/public"
//         );

//       setEvents(
//         data.events || []
//       );
//     })();
//   }, []);

//   const filtered =
//     events.filter((e) =>
//       e.name
//         .toLowerCase()
//         .includes(
//           q.toLowerCase()
//         )
//     );

//   const register =
//     async (
//       subeventId
//     ) => {
//       try {
//         const { data } =
//           await api.post(
//             `/registrations/${subeventId}/register`
//           );

//         toast.success(
//           "Registered successfully"
//         );

//         if (
//           !data.razorpay
//         )
//           return;

//         const ok =
//           await loadRazorpay();

//         if (!ok)
//           throw new Error(
//             "Failed to load Razorpay"
//           );

//         const options =
//           {
//             key: data
//               .razorpay
//               .keyId,
//             amount:
//               data
//                 .razorpay
//                 .amount,
//             currency:
//               data
//                 .razorpay
//                 .currency,
//             order_id:
//               data
//                 .razorpay
//                 .orderId,
//             name:
//               "CSE Events",
//             description:
//               "Event Registration Fee",

//             handler:
//               async (
//                 response
//               ) => {
//                 try {
//                   await api.post(
//                     "/registrations/razorpay/verify",
//                     response
//                   );

//                   toast.success(
//                     "Payment successful"
//                   );
//                 } catch (
//                   err
//                 ) {
//                   toast.error(
//                     err
//                       ?.response
//                       ?.data
//                       ?.message ||
//                       "Payment verification failed"
//                   );
//                 }
//               },
//           };

//         // eslint-disable-next-line no-undef
//         const rz =
//           new Razorpay(
//             options
//           );

//         rz.open();
//       } catch (err) {
//         toast.error(
//           err
//             ?.response
//             ?.data
//             ?.message ||
//             err.message ||
//             "Registration failed"
//         );
//       }
//     };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
//             Events
//           </h2>

//           <p className="text-slate-600 dark:text-slate-300">
//             Browse approved
//             events &
//             subevents.
//           </p>
//         </div>

//         <input
//           value={q}
//           onChange={(e) =>
//             setQ(
//               e.target.value
//             )
//           }
//           placeholder="Search events..."
//           className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 md:w-80"
//         />
//       </div>

//       <div className="grid gap-5">
//         {filtered.map(
//           (e) => (
//             <div
//               key={e._id}
//               className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
//             >
//               {/* Event */}
//               <div className="flex flex-col gap-4 md:flex-row">
//                 <div className="shrink-0 md:w-64">
//                   {e.posterUrl ? (
//                     <img
//                       src={
//                         e.posterUrl?.startsWith(
//                           "http"
//                         )
//                           ? e.posterUrl
//                           : `http://localhost:8000${e.posterUrl}`
//                       }
//                       alt={
//                         e.name
//                       }
//                       className="h-48 w-full rounded-xl border border-slate-200 object-cover dark:border-slate-800"
//                     />
//                   ) : (
//                     <div className="flex h-48 w-full items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-medium text-white">
//                       No
//                       Poster
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex-1">
//                   <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
//                     {e.name}
//                   </h3>

//                   <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
//                     {
//                       e.description
//                     }
//                   </p>

//                   <p className="mt-3 text-sm text-slate-500">
//                     📅{" "}
//                     {new Date(
//                       e.date
//                     ).toLocaleDateString(
//                       "en-IN"
//                     )}
//                   </p>
//                 </div>
//               </div>

//               {/* Subevents */}
//               <div className="mt-6 grid gap-4 md:grid-cols-2">
//                 {(
//                   e.subevents ||
//                   []
//                 ).map((s) => {
//                   const hasEnded =
//                     new Date(
//                       s.endAt
//                     ) <
//                     new Date();

//                   return (
//                     <div
//                       key={
//                         s._id
//                       }
//                       className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
//                     >
//                       {/* FIXED IMAGE */}
//                       {s.posterUrl ? (
//                         <img
//                           src={
//                             s.posterUrl?.startsWith(
//                               "http"
//                             )
//                               ? s.posterUrl
//                               : `http://localhost:8000${s.posterUrl}`
//                           }
//                           alt={
//                             s.name
//                           }
//                           className="h-48 w-full rounded-t-xl object-cover"
//                         />
//                       ) : (
//                         <div className="flex h-48 items-center justify-center rounded-t-xl bg-slate-200 text-sm text-slate-500 dark:bg-slate-800">
//                           No
//                           Poster
//                         </div>
//                       )}

//                       <div className="p-4">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
//                               {
//                                 s.name
//                               }
//                             </h4>

//                             <p className="text-sm text-slate-600 dark:text-slate-300">
//                               {
//                                 s.description
//                               }
//                             </p>

//                             <p className="mt-2 text-xs text-slate-500">
//                               📍{" "}
//                               {s
//                                 .venue
//                                 ?.name ||
//                                 "TBA"}
//                             </p>

//                             <p className="text-xs text-slate-500">
//                               🕒{" "}
//                               {new Date(
//                                 s.startAt
//                               ).toLocaleString(
//                                 "en-IN"
//                               )}
//                             </p>

//                             <p className="text-xs text-slate-500">
//                               Fee:
//                               ₹
//                               {s.entryFee ||
//                                 0}
//                             </p>
//                           </div>

//                           <span className="rounded-full bg-indigo-600/10 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
//                             {
//                               s.type
//                             }
//                           </span>
//                         </div>

//                         <div className="mt-4">
//                           {!user ? (
//                             <Link
//                               to="/login"
//                               className="inline-flex rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
//                             >
//                               Login
//                               to
//                               Register
//                             </Link>
//                           ) : hasEnded ? (
//                             <button
//                               disabled
//                               className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white opacity-80"
//                             >
//                               Registration
//                               Closed
//                             </button>
//                           ) : s.registrationsClosed ? (
//                             <button
//                               disabled
//                               className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white opacity-80"
//                             >
//                               Closed
//                               by
//                               Coordinator
//                             </button>
//                           ) : user.role ===
//                             "participant" ? (
//                             <button
//                               onClick={() =>
//                                 register(
//                                   s._id
//                                 )
//                               }
//                               className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
//                             >
//                               Register
//                               Now
//                             </button>
//                           ) : (
//                             <span className="text-sm text-slate-500">
//                               Login
//                               as
//                               participant
//                               to
//                               register
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )
//         )}

//         {!filtered.length && (
//           <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600 dark:border-slate-700 dark:text-slate-300">
//             No events
//             found.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { loadRazorpay } from "../services/razorpay";

export default function Events() {
  const [events, setEvents] =
    useState([]);

  const [q, setQ] =
    useState("");

  const { user } =
    useAuth();

  useEffect(() => {
    (async () => {
      try {
        const { data } =
          await api.get(
            "/events/public"
          );

        setEvents(
          data.events || []
        );
      } catch {
        toast.error(
          "Failed to load events"
        );
      }
    })();
  }, []);

  const filtered =
    events.filter((e) =>
      e.name
        .toLowerCase()
        .includes(
          q.toLowerCase()
        )
    );

  const register =
    async (
      subeventId
    ) => {
      try {
        const { data } =
          await api.post(
            `/registrations/${subeventId}/register`
          );

        toast.success(
          "Registered successfully"
        );

        if (
          !data.razorpay
        )
          return;

        const ok =
          await loadRazorpay();

        if (!ok) {
          throw new Error(
            "Failed to load Razorpay"
          );
        }

        const options =
          {
            key: data
              .razorpay
              .keyId,
            amount:
              data
                .razorpay
                .amount,
            currency:
              data
                .razorpay
                .currency,
            order_id:
              data
                .razorpay
                .orderId,
            name:
              "CSE Events",
            description:
              "Event Registration Fee",

            handler:
              async (
                response
              ) => {
                try {
                  await api.post(
                    "/registrations/razorpay/verify",
                    response
                  );

                  toast.success(
                    "Payment successful"
                  );
                } catch (
                  err
                ) {
                  toast.error(
                    err
                      ?.response
                      ?.data
                      ?.message ||
                      "Payment verification failed"
                  );
                }
              },
          };

        // eslint-disable-next-line no-undef
        const rz =
          new Razorpay(
            options
          );

        rz.open();
      } catch (err) {
        toast.error(
          err
            ?.response
            ?.data
            ?.message ||
            err.message ||
            "Registration failed"
        );
      }
    };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Events
          </h2>

          <p className="text-slate-600 dark:text-slate-300">
            Browse approved
            events &
            subevents
          </p>
        </div>

        <input
          value={q}
          onChange={(e) =>
            setQ(
              e.target.value
            )
          }
          placeholder="Search events..."
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 md:w-80"
        />
      </div>

      <div className="grid gap-5">
        {filtered.map(
          (e) => (
            <div
              key={e._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
            >
              {/* EVENT */}
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="shrink-0 md:w-64">
                  {e.posterUrl ? (
                    <img
                      src={`http://localhost:8000${e.posterUrl}`}
                      alt={
                        e.name
                      }
                      className="h-48 w-full rounded-xl border border-slate-200 object-cover dark:border-slate-800"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-medium text-white">
                      No
                      Poster
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {e.name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {
                      e.description
                    }
                  </p>

                  <p className="mt-3 text-sm text-slate-500">
                    📅{" "}
                    {new Date(
                      e.date
                    ).toLocaleDateString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>

              {/* SUBEVENTS */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {(
                  e.subevents ||
                  []
                ).map((s) => {
                  const today =
                  new Date();
                
                const endDate =
                  new Date(
                    s.endAt
                  );
                
                // compare only date,
                // ignore timezone hour bug
                const hasEnded =
                  today.toDateString() !==
                    endDate.toDateString() &&
                  today > endDate;

                  return (
                    <div
                      key={
                        s._id
                      }
                      className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                    >
                      {s.posterUrl ? (
                        <img
                          src={`http://localhost:8000${s.posterUrl}`}
                          alt={
                            s.name
                          }
                          className="h-48 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-48 items-center justify-center bg-slate-200 text-sm text-slate-500 dark:bg-slate-800">
                          No
                          Poster
                        </div>
                      )}

                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {
                                s.name
                              }
                            </h4>

                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {
                                s.description
                              }
                            </p>

                            <p className="mt-2 text-xs text-slate-500">
                              📍{" "}
                              {s
                                .venue
                                ?.name ||
                                "TBA"}
                            </p>

                            <p className="text-xs text-slate-500">
                              🕒{" "}
                              {new Date(
                                s.startAt
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                            <p className="text-xs text-slate-500">
                              Fee:
                              ₹
                              {s.entryFee ||
                                0}
                            </p>
                          </div>

                          <span className="rounded-full bg-indigo-600/10 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                            {
                              s.type
                            }
                          </span>
                        </div>
                        <div className="mt-4">
  {!user ? (
    <Link
      to="/login"
      className="inline-flex rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
    >
      Login to Register
    </Link>
  ) : s.status ===
    "cancelled" ? (
    <button
      disabled
      className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white opacity-80"
    >
      Event Cancelled
    </button>
  ) : s.status !==
    "approved" ? (
    <button
      disabled
      className="rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white opacity-80"
    >
      Awaiting Approval
    </button>
  ) : hasEnded ? (
    <button
      disabled
      className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white opacity-80"
    >
      Registration Closed
    </button>
  ) : s.registrationsClosed ? (
    <button
      disabled
      className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white opacity-80"
    >
      Closed by Coordinator
    </button>
  ) :  (
    <button
      onClick={() =>
        register(
          s._id
        )
      }
      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
    >
      Register Now
    </button>
  ) }
</div>
                        {/* <div className="mt-4">
                          {!user ? (
                            <Link
                              to="/login"
                              className="inline-flex rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                              Login
                              to
                              Register
                            </Link>
                          ) : hasEnded ? (
                            <button
                              disabled
                              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white opacity-80"
                            >
                              Registration
                              Closed
                            </button>
                          ) : s.registrationsClosed ? (
                            <button
                              disabled
                              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white opacity-80"
                            >
                              Closed
                              by
                              Coordinator
                            </button>
                          // ) : user.role ===
                          //   "participant" ? (
                          //   <button
                          //     onClick={() =>
                          //       register(
                          //         s._id
                          //       )
                          //     }
                          //     className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                          //   >
                          //     Register
                          //     Now
                          //   </button>
                          // ) : (
                          //   <span className="text-sm text-slate-500">
                          //     Login
                          //     as
                          //     participant
                          //     to
                          //     register
                          //   </span>
                          // )}
                      //   ) : e.status ===
                      //   "cancelled" ? (
                      //   <button
                      //     disabled
                      //     className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white opacity-80"
                      //   >
                      //     Event Cancelled
                      //   </button>
                      // ) : e.status !==
                      //   "approved" ? (
                      //   <button
                      //     disabled
                      //     className="rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white opacity-80"
                      //   >
                      //     Event Unavailable
                      //   </button>
                      // ) : user.role ===
                      //   "participant" ? (
                      //   <button
                      //     onClick={() =>
                      //       register(
                      //         s._id
                      //       )
                      //     }
                      //     className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                      //   >
                      //     Register Now
                      //   </button>
                      // ) : (
                      //   <span className="text-sm text-slate-500">
                      //     Login as participant
                      //     to register
                      //   </span>
                      // )}
                    ) : s.status ===
                    "cancelled" ? (
                      <button
                        disabled
                        className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white opacity-80"
                      >
                        Event Cancelled
                      </button>
                    ) : s.status !==
                    "approved" ? (
                      <button
                        disabled
                        className="rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white opacity-80"
                      >
                        Awaiting Approval
                      </button>
                    ) : user.role ===
                    "participant" ? (
                      <button
                        onClick={() =>
                          register(
                            s._id
                          )
                        }
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                      >
                        Register Now
                      </button>
                    ) : (
                      <span className="text-sm text-slate-500">
                        Login as participant
                        to register
                      </span>
                    )}
                        </div> */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

