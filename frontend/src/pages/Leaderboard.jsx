// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Leaderboard() {
//   const [leaders, setLeaders] =
//     useState([]);

//   useEffect(() => {
//     fetchLeaderboard();
//   }, []);

//   const fetchLeaderboard =
//     async () => {
//       try {
//         const { data } =
//           await axios.get(
//             "http://localhost:8000/api/leaderboard"
//           );

//         setLeaders(data);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//   const topThree =
//     leaders.slice(0, 3);

//   const remaining =
//     leaders.slice(3);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white p-8">

//       <h1 className="text-5xl font-bold text-center mb-2">
//         🏆 Leaderboard
//       </h1>

//       <p className="text-center text-slate-400 mb-10">
//         Top Active Participants
//       </p>

//       {/* Top 3 */}
//       <div className="grid md:grid-cols-3 gap-6 mb-12">

//         {topThree.map(
//           (
//             student,
//             index
//           ) => (
//             <div
//               key={student._id}
//               className="bg-slate-800 rounded-3xl shadow-xl p-6 text-center hover:scale-105 transition"
//             >

//               <div className="text-6xl mb-4">
//                 {index === 0
//                   ? "🥇"
//                   : index === 1
//                   ? "🥈"
//                   : "🥉"}
//               </div>

//               <h2 className="text-2xl font-bold">
//                 {student.name}
//               </h2>

//               <p className="text-slate-400">
//                 {student.email}
//               </p>

//               <div className="mt-5 text-3xl font-bold text-yellow-400">
//                 {student.points}
//               </div>

//               <p className="text-slate-500">
//                 points
//               </p>
//             </div>
//           )
//         )}
//       </div>

//       {/* Remaining leaderboard */}
//       <div className="bg-slate-900 rounded-3xl shadow-xl overflow-hidden">

//         <div className="p-5 text-2xl font-bold border-b border-slate-700">
//           Rankings
//         </div>

//         <table className="w-full">

//           <thead className="bg-slate-800">
//             <tr>
//               <th className="p-4 text-left">
//                 Rank
//               </th>

//               <th className="p-4 text-left">
//                 Name
//               </th>

//               <th className="p-4 text-left">
//                 Points
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {remaining.map(
//               (
//                 student,
//                 index
//               ) => (
//                 <tr
//                   key={student._id}
//                   className="border-b border-slate-800 hover:bg-slate-800 transition"
//                 >
//                   <td className="p-4 font-bold">
//                     #{index + 4}
//                   </td>

//                   <td className="p-4">
//                     {student.name}
//                   </td>

//                   <td className="p-4 text-yellow-400 font-bold">
//                     {student.points}
//                   </td>
//                 </tr>
//               )
//             )}
//           </tbody>

//         </table>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
  const [leaders, setLeaders] =
    useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard =
    async () => {
      try {
        const { data } =
          await axios.get(
            "http://localhost:8000/api/leaderboard"
          );

        setLeaders(data);
      } catch (error) {
        console.log(error);
      }
    };

  const topThree =
    leaders.slice(0, 3);

  const remaining =
    leaders.slice(3);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white p-8 transition-colors">

      <h1 className="text-5xl font-bold text-center mb-2">
        🏆 Leaderboard
      </h1>

      <p className="text-center text-slate-600 dark:text-slate-400 mb-10">
        Top Active Participants
      </p>

      {/* Top 3 */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">

        {topThree.map(
          (
            student,
            index
          ) => (
            <div
              key={student._id}
              className="rounded-3xl shadow-xl p-6 text-center transition hover:scale-105
              bg-white border border-slate-200
              dark:bg-slate-900 dark:border-slate-800"
            >

              <div className="text-6xl mb-4">
                {index === 0
                  ? "🥇"
                  : index === 1
                  ? "🥈"
                  : "🥉"}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {student.name}
              </h2>

              <p className="text-slate-500 dark:text-slate-400">
                {student.email}
              </p>

              <div className="mt-5 text-4xl font-bold text-yellow-500">
                {student.points}
              </div>

              <p className="text-slate-500 dark:text-slate-400">
                points
              </p>
            </div>
          )
        )}
      </div>

      {/* Rankings */}
      <div className="rounded-3xl shadow-xl overflow-hidden
      bg-white border border-slate-200
      dark:bg-slate-900 dark:border-slate-800">

        <div className="p-5 text-2xl font-bold border-b
        border-slate-200
        dark:border-slate-700">
          Rankings
        </div>

        <table className="w-full">

          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="p-4 text-left">
                Rank
              </th>

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Points
              </th>
            </tr>
          </thead>

          <tbody>
            {remaining.map(
              (
                student,
                index
              ) => (
                <tr
                  key={student._id}
                  className="border-b
                  border-slate-200
                  dark:border-slate-800
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                  transition"
                >
                  <td className="p-4 font-bold">
                    #{index + 4}
                  </td>

                  <td className="p-4">
                    {student.name}
                  </td>

                  <td className="p-4 text-yellow-500 font-bold text-lg">
                    {student.points}
                  </td>
                </tr>
              )
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}