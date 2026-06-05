import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
alert("ROLE LOGIN LOADED");
console.log("ROLE LOGIN FILE LOADED");
export default function RoleLogin({ role, title, sampleEmail }) {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(sampleEmail || "");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);

  const dash = useMemo(() => {
    if (role === "participant") return "/dashboard/participant";
    if (role === "coordinator") return "/dashboard/coordinator";
    if (role === "hod") return "/dashboard/hod";
    return "/dashboard/admin";
  }, [role]);

  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     console.log("Role prop:", role);
  //     //const user = await login(email, password);
  //     console.log("Role being sent:", role);
  //     const user = await login(email, password, role);
  //     // if (user.role !== role) {
  //     //   logout();
  //     //   toast.error(`This login page is for "${role}". Your account role is "${user.role}".`);
  //     //   return;
  //     // }
  //     toast.success("Logged in");
  //     navigate(dash);
  //   } catch (err) {
  //     toast.error(err?.response?.data?.message || "Login failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      await login(email, password, role);
  
      toast.success("Logged in");
      navigate(dash);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title} Login</h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Use your account credentials to login.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm">
            {role === "participant" ? (
              <Link to="/register" className="text-indigo-600 hover:underline">
                Create participant account
              </Link>
            ) : (
              <Link to="/login" className="text-indigo-600 hover:underline">
                Back to role selection
              </Link>
            )}

            <Link to="/forgot-password" className="text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Sample login (after seeding)</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Email: <span className="font-medium">{sampleEmail}</span>
            <br />
            Password: <span className="font-medium">Password123!</span>
          </p>
          <button
            type="button"
            onClick={() => {
              setEmail(sampleEmail || "");
              setPassword("Password123!");
            }}
            className="mt-4 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800"
          >
            Use sample credentials
          </button>

          <div className="mt-6 text-xs text-slate-500 dark:text-slate-300">
            Tip: run <code className="px-1">cd backend && npm run seed</code> to create all 4 sample accounts.
          </div>
        </div>
      </div>
    </div>
  );
}

