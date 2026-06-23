import { Link } from "react-router-dom";

const SAMPLE_PASSWORD = "Password123!";
const sample = {
  student: "participant@example.com",
  hod: "hod@example.com",
  admin: "admin@example.com",
};

function Card({ title, to, email }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-lg font-semibold text-slate-900 dark:text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Sample: <span className="font-medium">{email}</span>
        <br />
        Password: <span className="font-medium">{SAMPLE_PASSWORD}</span>
      </p>
      <Link
        to={to}
        className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Go to Login
      </Link>
    </div>
  );
}

export default function LoginLanding() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Login</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Choose your role. (To enable these sample logins, run <code className="px-1">npm run seed</code> in backend.)
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
      <Card
  title="Student"
  to="/login/student"
  email={sample.student}
/>
        <Card title="HOD" to="/login/hod" email={sample.hod} />
        <Card title="System Admin" to="/login/admin" email={sample.admin} />
      </div>
    </div>
  );
}

