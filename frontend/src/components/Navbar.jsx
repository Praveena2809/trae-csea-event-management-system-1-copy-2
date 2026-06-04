import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "text-slate-700 dark:text-slate-200"
  }`;

export default function Navbar({ onToggleTheme, theme }) {
  const { user, logout } = useAuth();

  const dashboardPath =
    user?.role === "participant"
      ? "/dashboard/participant"
      : user?.role === "coordinator"
        ? "/dashboard/coordinator"
        : user?.role === "hod"
          ? "/dashboard/hod"
          : user?.role === "admin"
            ? "/dashboard/admin"
            : null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-semibold text-slate-900 dark:text-white">
          CSE Events
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/events" className={navLinkClass}>
            Events
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
        <button
  type="button"
  onClick={() => {
    console.log(
      "theme before:",
      theme
    );
    onToggleTheme();
  }}
  className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
>
  {theme === "dark"
    ? "☀️ Light"
    : "🌙 Dark"}
</button>

          {!user ? (
            <Link
              to="/login"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Login
            </Link>
          ) : (
            <>
              {dashboardPath && (
                <Link
                  to={dashboardPath}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

