// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { api } from "../services/api";

// function downloadBlob(blob, filename) {
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   a.click();
//   window.URL.revokeObjectURL(url);
// }

// export default function MyRegistrations() {
//   const [items, setItems] = useState([]);
//   const [rating, setRating] =
//   useState(5);

// const [comment, setComment] =
//   useState("");

// const [
//   selectedRegistration,
//   setSelectedRegistration,
// ] = useState(null);
//   const load = async () => {
//     const { data } = await api.get("/registrations/me");
//     setItems(data.registrations || []);
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const downloadCertificate = async (registrationId) => {
//     try {
//       const res = await api.get(`/registrations/certificate/${registrationId}`, { responseType: "blob" });
//       downloadBlob(res.data, `certificate-${registrationId}.pdf`);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Certificate not available yet");
//     }
//   };
//   const submitFeedback =
//   async () => {
//     try {
//       await api.post(
//         `/registrations/feedback/${selectedRegistration}`,
//         {
//           rating,
//           comment,
//         }
//       );

//       toast.success(
//         "Feedback submitted"
//       );

//       setSelectedRegistration(
//         null
//       );

//       setComment("");
//       setRating(5);

//       load();
//     } catch (err) {
//       toast.error(
//         err?.response?.data
//           ?.message ||
//           "Failed"
//       );
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-end justify-between">
//         <div>
//           <h3 className="text-xl font-bold text-slate-900 dark:text-white">My Registered Events</h3>
//           <p className="text-sm text-slate-600 dark:text-slate-300">QR code is generated after registration.</p>
//         </div>
//         <button
//           onClick={load}
//           className="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
//         >
//           Refresh
//         </button>
//       </div>

//       <div className="space-y-3">
//         {items.map((r) => (
//           <div key={r._id} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
//             <div className="grid gap-4 md:grid-cols-[1fr_140px]">
//               <div>
//                 <p className="font-semibold text-slate-900 dark:text-white">{r.subevent?.name}</p>
//                 <p className="text-sm text-slate-600 dark:text-slate-300">{r.subevent?.event?.name}</p>
//                 <p className="mt-2 text-xs text-slate-500">Status: {r.status}</p>
//                 {/* <div className="mt-3 flex flex-wrap gap-2">
//                   <button
//                     onClick={() => downloadCertificate(r._id)}
//                     className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
//                   >
//                     Download Certificate
//                   </button>
//                 </div> */}
//                 <div className="mt-3 flex flex-wrap gap-2">
//   <button
//     onClick={() =>
//       downloadCertificate(
//         r._id
//       )
//     }
//     className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
//   >
//     Download Certificate
//   </button>

//   {r.status ===
//     "attended" &&
//     !r.feedback && (
//       <button
//         onClick={() =>
//           setSelectedRegistration(
//             r._id
//           )
//         }
//         className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
//       >
//         Give Feedback
//       </button>
//     )}

//   {r.feedback && (
//     <span className="rounded-md bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
//       Feedback Submitted ⭐
//       {r.feedback.rating}
//     </span>
//   )}
// </div>
                
//               </div>
//               <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-900">
//                 {r.qrPngDataUrl ? (
//                   <img src={r.qrPngDataUrl} alt="QR" className="mx-auto h-28 w-28" />
//                 ) : (
//                   <div className="flex h-28 items-center justify-center text-xs text-slate-500">No QR</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}

//         {!items.length && <p className="text-sm text-slate-600 dark:text-slate-300">No registrations yet.</p>}
//       </div>
//       {/* {selectedRegistration && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//     <div className="w-full max-w-md rounded-xl bg-white p-6">
//       <h3 className="mb-4 text-lg font-bold">
//         Rate Event
//       </h3>

//       <label>
//         Rating
//       </label>

//       <select
//         value={rating}
//         onChange={(e) =>
//           setRating(
//             Number(
//               e.target.value
//             )
//           )
//         }
//         className="mb-4 w-full rounded border p-2"
//       >
//         {[1,2,3,4,5].map(
//           (n) => (
//             <option
//               key={n}
//               value={n}
//             >
//               {n} ⭐
//             </option>
//           )
//         )}
//       </select>

//       <textarea
//         placeholder="Comment"
//         value={comment}
//         onChange={(e) =>
//           setComment(
//             e.target.value
//           )
//         }
//         className="mb-4 w-full rounded border p-2"
//       />

//       <div className="flex gap-2">
//         <button
//           onClick={
//             submitFeedback
//           }
//           className="rounded bg-indigo-600 px-4 py-2 text-white"
//         >
//           Submit
//         </button>

//         <button
//           onClick={() =>
//             setSelectedRegistration(
//               null
//             )
//           }
//           className="rounded border px-4 py-2"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   </div>
// )} */}
// {selectedRegistration && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
//     <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
//       <h2 className="mb-4 text-2xl font-bold text-white">
//         Event Feedback
//       </h2>

//       <p className="mb-3 text-slate-300">
//         Rate your experience
//       </p>

//       {/* Stars */}
//       <div className="mb-6 flex gap-2">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <button
//             key={star}
//             type="button"
//             onClick={() =>
//               setRating(star)
//             }
//             className="text-4xl transition hover:scale-110"
//           >
//             {star <= rating
//               ? "⭐"
//               : "☆"}
//           </button>
//         ))}
//       </div>

//       {/* Feedback box */}
//       <label className="mb-2 block text-sm font-medium text-slate-300">
//         Share your feedback
//       </label>

//       <textarea
//         rows={5}
//         value={comment}
//         onChange={(e) =>
//           setComment(
//             e.target.value
//           )
//         }
//         placeholder="Tell us about your experience..."
//         className="w-full rounded-xl border border-slate-600 bg-slate-800 p-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//       />

//       <div className="mt-6 flex gap-3">
//         <button
//           onClick={
//             submitFeedback
//           }
//           className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
//         >
//           Submit Feedback
//         </button>

//         <button
//           onClick={() =>
//             setSelectedRegistration(
//               null
//             )
//           }
//           className="rounded-xl border border-slate-600 px-5 py-3 text-slate-300 hover:bg-slate-800"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

function downloadBlob(blob, filename) {
  const url =
    window.URL.createObjectURL(
      blob
    );

  const a =
    document.createElement(
      "a"
    );

  a.href = url;
  a.download = filename;
  a.click();

  window.URL.revokeObjectURL(
    url
  );
}

export default function MyRegistrations() {
  const [items, setItems] =
    useState([]);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [
    likedMost,
    setLikedMost,
  ] = useState("");

  const [
    suggestions,
    setSuggestions,
  ] = useState("");

  const [
    selectedRegistration,
    setSelectedRegistration,
  ] = useState(null);

  const load =
    async () => {
      const { data } =
        await api.get(
          "/registrations/me"
        );

      setItems(
        data.registrations ||
          []
      );
    };

  useEffect(() => {
    load();
  }, []);

  const downloadCertificate =
    async (
      registrationId
    ) => {
      try {
        const res =
          await api.get(
            `/registrations/certificate/${registrationId}`,
            {
              responseType:
                "blob",
            }
          );

        downloadBlob(
          res.data,
          `certificate-${registrationId}.pdf`
        );
      } catch (err) {
        toast.error(
          err?.response?.data
            ?.message ||
            "Certificate not available yet"
        );
      }
    };

  const resetForm =
    () => {
      setRating(5);
      setComment("");
      setLikedMost("");
      setSuggestions("");
      setSelectedRegistration(
        null
      );
    };

  const submitFeedback =
    async () => {
      try {
        await api.post(
          `/registrations/feedback/${selectedRegistration}`,
          {
            rating,
            comment,
            likedMost,
            suggestions,
          }
        );

        toast.success(
          "Feedback submitted"
        );

        resetForm();

        load();
      } catch (err) {
        toast.error(
          err?.response?.data
            ?.message ||
            "Failed"
        );
      }
    };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            My Registered Events
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-300">
            QR code is
            generated after
            registration.
          </p>
        </div>

        <button
          onClick={load}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {items.map((r) => (
          <div
            key={r._id}
            className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="grid gap-4 md:grid-cols-[1fr_140px]">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {
                    r
                      .subevent
                      ?.name
                  }
                </p>

                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {
                    r
                      .subevent
                      ?.event
                      ?.name
                  }
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Status:
                  {" "}
                  {r.status}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      downloadCertificate(
                        r._id
                      )
                    }
                    className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    Download
                    Certificate
                  </button>

                  {r.status ===
                    "attended" &&
                    !r.feedback && (
                      <button
                        onClick={() =>
                          setSelectedRegistration(
                            r._id
                          )
                        }
                        className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                      >
                        Give
                        Feedback
                      </button>
                    )}

                  {r.feedback && (
                    <span className="rounded-md bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700">
                      Feedback
                      Submitted
                      ⭐
                      {
                        r
                          .feedback
                          .rating
                      }
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-900">
                {r.qrPngDataUrl ? (
                  <img
                    src={
                      r.qrPngDataUrl
                    }
                    alt="QR"
                    className="mx-auto h-28 w-28"
                  />
                ) : (
                  <div className="flex h-28 items-center justify-center text-xs text-slate-500">
                    No QR
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {!items.length && (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No
            registrations
            yet.
          </p>
        )}
      </div>

      {selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold text-white">
              Event
              Feedback
            </h2>

            <p className="mb-3 text-slate-300">
              Rate your
              experience
            </p>

            {/* Stars */}
            <div className="mb-6 flex gap-2">
              {[1, 2, 3, 4, 5].map(
                (
                  star
                ) => (
                  <button
                    key={
                      star
                    }
                    type="button"
                    onClick={() =>
                      setRating(
                        star
                      )
                    }
                    className="text-4xl transition hover:scale-110"
                  >
                    {star <=
                    rating
                      ? "⭐"
                      : "☆"}
                  </button>
                )
              )}
            </div>

            {/* Feedback */}
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Share your
              feedback
            </label>

            <textarea
              rows={4}
              value={comment}
              onChange={(
                e
              ) =>
                setComment(
                  e
                    .target
                    .value
                )
              }
              placeholder="Tell us about your experience..."
              className="w-full rounded-xl border border-slate-600 bg-slate-800 p-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Liked Most */}
            <input
              type="text"
              placeholder="What did you like most?"
              value={
                likedMost
              }
              onChange={(
                e
              ) =>
                setLikedMost(
                  e
                    .target
                    .value
                )
              }
              className="mt-4 w-full rounded-xl border border-slate-600 bg-slate-800 p-3 text-white placeholder:text-slate-400"
            />

            {/* Suggestions */}
            <textarea
              rows={3}
              placeholder="Suggestions for improvement"
              value={
                suggestions
              }
              onChange={(
                e
              ) =>
                setSuggestions(
                  e
                    .target
                    .value
                )
              }
              className="mt-4 w-full rounded-xl border border-slate-600 bg-slate-800 p-4 text-white placeholder:text-slate-400"
            />

            <div className="mt-6 flex gap-3">
              <button
                onClick={
                  submitFeedback
                }
                className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                Submit
                Feedback
              </button>

              <button
                onClick={
                  resetForm
                }
                className="rounded-xl border border-slate-600 px-5 py-3 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
