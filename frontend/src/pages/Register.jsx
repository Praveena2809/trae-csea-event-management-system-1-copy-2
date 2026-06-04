// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  // const { register } = useAuth();
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    registerNumber: "",
    year: "",
    department: "CSE",
    phone: "",
    email: "",
    password: "",
    collegeName: "",
    role: "participant", // IMPORTANT
  });

  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // await register(form);
      await signup(form);
      toast.success("Account created successfully!");

      navigate("/dashboard/participant");
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          "Sign up failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Participant Sign Up
        </h2>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Create an account to register for events
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-4 md:grid-cols-2"
      >
        {/* Name */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Enter your name"
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            required
          />
        </div>

        {/* Register Number */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Register Number
          </label>

          <input
            type="text"
            name="registerNumber"
            value={form.registerNumber}
            onChange={onChange}
            placeholder="e.g. CSE001"
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Year */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Year
          </label>

          <select
            name="year"
            value={form.year}
            onChange={onChange}
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Department
          </label>

          <input
            type="text"
            name="department"
            value={form.department}
            onChange={onChange}
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Phone Number
          </label>

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="Enter phone number"
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            required
          />
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Enter email"
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            required
          />
        </div>

        {/* College Name */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            College Name (For External Participants)
          </label>

          <input
            type="text"
            name="collegeName"
            value={form.collegeName}
            onChange={onChange}
            placeholder="Enter college name"
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Password */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="Minimum 6 characters"
            minLength={6}
            className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
        Already have an account?{" "}
        <Link
          to="/login/participant"
          className="font-medium text-indigo-600 hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
}