// // 
// import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import toast from "react-hot-toast";

// import LoginLanding from "./LoginLanding";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const { role } = useParams();
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   // If no role selected, show role cards
//   if (!role) {
//     return <LoginLanding />;
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const user = await login(email, password);

//       toast.success("Login successful");

//       // Redirect based on actual role
//       switch (user.role) {
//         case "participant":
//           navigate("/dashboard/participant");
//           break;

//         case "coordinator":
//           navigate("/dashboard/coordinator");
//           break;

//         case "hod":
//           navigate("/dashboard/hod");
//           break;

//         case "admin":
//           navigate("/dashboard/admin");
//           break;

//         default:
//           navigate("/");
//       }
//     } catch (err) {
//       console.error(err);

//       toast.error(
//         err?.response?.data?.message ||
//           "Invalid credentials"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-md space-y-6 rounded-xl bg-white p-6 shadow-md dark:bg-slate-900">
//       <div>
//         <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
//           {role.charAt(0).toUpperCase() + role.slice(1)} Login
//         </h2>

//         <p className="mt-1 text-slate-600 dark:text-slate-300">
//           Login as {role}
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Email */}
//         <div>
//           <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
//             Email
//           </label>

//           <input
//             type="email"
//             placeholder="Enter email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
//             required
//           />
//         </div>

//         {/* Password */}
//         <div>
//           <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
//             Password
//           </label>

//           <input
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full rounded-md bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
//         >
//           {loading
//             ? "Logging in..."
//             : `Login as ${role}`}
//         </button>
//       </form>
//     </div>
//   );
// }
// import { useState } from "react";
// import {
//   Link,
//   useNavigate,
//   useParams,
// } from "react-router-dom";
// import toast from "react-hot-toast";

// import LoginLanding from "./LoginLanding";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const { role } = useParams();
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const [email, setEmail] =
//     useState("");

//   const [password, setPassword] =
//     useState("");

//   const [loading, setLoading] =
//     useState(false);

//   // If no role selected
//   if (!role) {
//     return <LoginLanding />;
//   }

//   const handleSubmit = async (
//     e
//   ) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const user =
//         await login(
//           email,
//           password
//         );

//       toast.success(
//         "Login successful"
//       );

//       switch (
//         user.role
//       ) {
//         case "participant":
//           navigate(
//             "/dashboard/participant"
//           );
//           break;

//         case "coordinator":
//           navigate(
//             "/dashboard/coordinator"
//           );
//           break;

//         case "hod":
//           navigate(
//             "/dashboard/hod"
//           );
//           break;

//         case "admin":
//           navigate(
//             "/dashboard/admin"
//           );
//           break;

//         default:
//           navigate("/");
//       }
//     } catch (err) {
//       console.error(err);

//       toast.error(
//         err?.response?.data
//           ?.message ||
//           "Invalid credentials"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-md space-y-6 rounded-xl bg-white p-6 shadow-md dark:bg-slate-900">
//       <div>
//         <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
//           {role
//             .charAt(0)
//             .toUpperCase() +
//             role.slice(1)}{" "}
//           Login
//         </h2>

//         <p className="mt-1 text-slate-600 dark:text-slate-300">
//           Login as {role}
//         </p>
//       </div>

//       <form
//         onSubmit={
//           handleSubmit
//         }
//         className="space-y-4"
//       >
//         {/* Email */}
//         <div>
//           <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
//             Email
//           </label>

//           <input
//             type="email"
//             placeholder="Enter email"
//             value={email}
//             onChange={(
//               e
//             ) =>
//               setEmail(
//                 e.target.value
//               )
//             }
//             className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
//             required
//           />
//         </div>

//         {/* Password */}
//         <div>
//           <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
//             Password
//           </label>

//           <input
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(
//               e
//             ) =>
//               setPassword(
//                 e.target.value
//               )
//             }
//             className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={
//             loading
//           }
//           className="w-full rounded-md bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
//         >
//           {loading
//             ? "Logging in..."
//             : `Login as ${role}`}
//         </button>
//       </form>

//       {/* SIGN UP LINK */}
//       {role ===
//         "participant" && (
//         <div className="text-center text-sm text-slate-600 dark:text-slate-300">
//           Don’t have an
//           account?{" "}
//           <Link
//             to="/register"
//             className="font-medium text-indigo-600 hover:underline"
//           >
//             Sign Up
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import LoginLanding from "./LoginLanding";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // No role selected
  if (!role) {
    return <LoginLanding />;
  }

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      // PASS ROLE TO LOGIN
      const user = await login(
        email,
        password,
        role
      );

      toast.success(
        "Login successful"
      );

      // NAVIGATE BASED ON SELECTED PAGE ROLE
      if (user.role === "coordinator") {
        navigate("/select-mode");
      }
      else if (user.role === "participant") {
        navigate("/dashboard/participant");
      }
      else if (user.role === "hod") {
        navigate("/dashboard/hod");
      }
      else if (user.role === "admin") {
        navigate("/dashboard/admin");
      }
      else {
        navigate("/");
      }
      // switch (role) {
      //   case "participant":
      //     navigate(
      //       "/dashboard/participant"
      //     );
      //     break;

      //   case "coordinator":
      //     navigate(
      //       "/dashboard/coordinator"
      //     );
      //     break;

      //   case "hod":
      //     navigate(
      //       "/dashboard/hod"
      //     );
      //     break;

      //   case "admin":
      //     navigate(
      //       "/dashboard/admin"
      //     );
      //     break;

      //   default:
      //     navigate("/");
      // }
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data
          ?.message ||
          "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-xl bg-white p-6 shadow-md dark:bg-slate-900">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          {role
            .charAt(0)
            .toUpperCase() +
            role.slice(1)}{" "}
          Login
        </h2>

        <p className="mt-1 text-slate-600 dark:text-slate-300">
          Login as {role}
        </p>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >
        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(
              e
            ) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(
              e
            ) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={
            loading
          }
          className="w-full rounded-md bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading
            ? "Logging in..."
            : `Login as ${role}`}
        </button>
      </form>

      {/* Participant signup */}
      {role ===
        "participant" && (
        <div className="text-center text-sm text-slate-600 dark:text-slate-300">
          Don’t have an
          account?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:underline"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}