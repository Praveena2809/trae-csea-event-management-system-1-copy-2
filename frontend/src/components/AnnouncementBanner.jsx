// import { useEffect, useState } from "react";
// import { api } from "../services/api";

// export default function AnnouncementBanner() {
//   const [announcements,
//     setAnnouncements] =
//     useState([]);

//   useEffect(() => {
//     load();
//   }, []);

//   const load =
//     async () => {
//       try {
//         const res =
//           await api.get(
//             "/announcements"
//           );

//         setAnnouncements(
//           res.data || []
//         );
//       } catch (err) {
//         console.error(err);
//       }
//     };

//   if (
//     announcements.length ===
//     0
//   ) {
//     return null;
//   }

//   return (
//     // <div className="mb-6 space-y-4">
//     //   {announcements
//     //     .slice(0, 3)
//     //     .map((a) => (
//     //       <div
//     //         key={a._id}
//     //         className="overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-5 shadow-lg shadow-yellow-500/10 backdrop-blur-sm"
//     //       >
//     //         <div className="mb-2 flex items-center justify-between">
//     //           <h2 className="text-lg font-bold text-yellow-300">
//     //             📢 {a.title}
//     //           </h2>

//     //           <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-200">
//     //             {a.type ===
//     //             "general"
//     //               ? "GENERAL"
//     //               : "EVENT"}
//     //           </span>
//     //         </div>

//     //         <p className="text-slate-200">
//     //           {a.message}
//     //         </p>
// {/* 
//             <p className="mt-3 text-xs text-slate-400">
//               Posted by{" "}
//               {
//                 a
//                   .createdBy
//                   ?.name
//               }
//             </p>
//           </div>
//         ))}
//     </div> */}
    
//   );
// }
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function AnnouncementBanner() {
  const [announcements,
    setAnnouncements] =
    useState([]);

  useEffect(() => {
    load();
  }, []);

  const load =
    async () => {
      try {
        const res =
          await api.get(
            "/announcements"
          );

        setAnnouncements(
          res.data || []
        );
      } catch (err) {
        console.error(err);
      }
    };

  if (
    announcements.length ===
    0
  ) {
    return null;
  }

  return (
    <div className="mb-6 space-y-4">

      {announcements
        .slice(0, 3)
        .map((a) => (
          <div
            key={a._id}
            className="
              rounded-2xl border p-5 shadow-sm transition-colors

              bg-amber-50
              border-amber-300

              dark:bg-yellow-950/30
              dark:border-yellow-800
            "
          >

            <div className="flex items-start justify-between gap-4">

              <div>
                <h2
                  className="
                    text-xl font-bold

                    text-amber-900

                    dark:text-yellow-300
                  "
                >
                  📢 {a.title}
                </h2>

                <p
                  className="
                    mt-3 text-base

                    text-slate-700

                    dark:text-slate-200
                  "
                >
                  {a.message}
                </p>

                <p
                  className="
                    mt-4 text-sm

                    text-slate-500

                    dark:text-slate-400
                  "
                >
                  Posted by{" "}
                  {a.createdBy
                    ?.name || "Admin"}
                </p>
              </div>

              <span
                className="
                  shrink-0 rounded-full px-4 py-1 text-xs font-semibold

                  bg-amber-200
                  text-amber-900

                  dark:bg-yellow-900/50
                  dark:text-yellow-300
                "
              >
                {a.type ===
                "general"
                  ? "GENERAL"
                  : "EVENT"}
              </span>
            </div>

          </div>
        ))}
    </div>
  );
}