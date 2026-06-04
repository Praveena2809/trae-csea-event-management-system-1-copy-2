// import { useState } from "react";
// import toast from "react-hot-toast";
// import { api } from "../services/api";

// export default function CreateMainEvent() {
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     date: "",
//     budgetEstimate: "",
//     numberOfSubevents: "",
//     miscNotesForHod: "",
//   });
//   const [poster, setPoster] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const fd = new FormData();
//       Object.entries(form).forEach(([k, v]) => fd.append(k, v));
//       if (poster) fd.append("poster", poster);
//       await api.post("/events", fd, { headers: { "Content-Type": "multipart/form-data" } });
//       toast.success("Event created (sent for HOD approval)");
//       setForm({ name: "", description: "", date: "", budgetEstimate: "", numberOfSubevents: "", miscNotesForHod: "" });
//       setPoster(null);
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create Main Event</h3>
//       <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
//         <div className="md:col-span-2">
//           <label className="text-sm font-medium">Event Name</label>
//           <input
//             name="name"
//             value={form.name}
//             onChange={onChange}
//             className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
//             required
//           />
//         </div>
//         <div className="md:col-span-2">
//           <label className="text-sm font-medium">Description</label>
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={onChange}
//             rows={3}
//             className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
//             required
//           />
//         </div>
//         <div>
//           <label className="text-sm font-medium">Date</label>
//           <input
//             type="date"
//             name="date"
//             value={form.date}
//             onChange={onChange}
//             className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
//             required
//           />
//         </div>
//         <div>
//           <label className="text-sm font-medium">Budget Estimate</label>
//           <input
//             name="budgetEstimate"
//             value={form.budgetEstimate}
//             onChange={onChange}
//             className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
//           />
//         </div>
//         <div>
//           <label className="text-sm font-medium">No. of subevents</label>
//           <input
//             name="numberOfSubevents"
//             value={form.numberOfSubevents}
//             onChange={onChange}
//             className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
//           />
//         </div>
//         <div>
//           <label className="text-sm font-medium">Poster</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setPoster(e.target.files?.[0] || null)}
//             className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
//           />
//         </div>
//         <div className="md:col-span-2">
//           <label className="text-sm font-medium">Notes for HOD</label>
//           <textarea
//             name="miscNotesForHod"
//             value={form.miscNotesForHod}
//             onChange={onChange}
//             rows={2}
//             className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
//           />
//         </div>

//         <button
//           disabled={loading}
//           className="md:col-span-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
//         >
//           {loading ? "Creating..." : "Create Event"}
//         </button>
//       </form>
//     </div>
//   );
// }
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";

export default function CreateMainEvent() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    eventType: "workshop",
    date: "",
    budgetEstimate: "",
    numberOfSubevents: "",
    miscNotesForHod: "",
  });

  const [poster, setPoster] = useState(null);
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
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) =>
        fd.append(k, v)
      );

      if (poster) {
        fd.append("poster", poster);
      }

      await api.post("/events", fd, {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      });

      toast.success(
        "Event created (sent for HOD approval)"
      );

      setForm({
        name: "",
        description: "",
        eventType: "workshop",
        date: "",
        budgetEstimate: "",
        numberOfSubevents: "",
        miscNotesForHod: "",
      });

      setPoster(null);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to create event"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        Create Main Event
      </h3>

      <form
        onSubmit={onSubmit}
        className="grid gap-4 md:grid-cols-2"
      >
        {/* Event Name */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium">
            Event Name
          </label>

          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            required
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={3}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            required
          />
        </div>

        {/* Event Type */}
        <div>
          <label className="text-sm font-medium">
            Event Type
          </label>

          <select
            name="eventType"
            value={form.eventType}
            onChange={onChange}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="workshop">
              Workshop
            </option>

            <option value="competitive">
              Competitive Event
            </option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="text-sm font-medium">
            Date
          </label>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={onChange}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            required
          />
        </div>

        {/* Budget */}
        <div>
          <label className="text-sm font-medium">
            Budget Estimate
          </label>

          <input
            type="number"
            name="budgetEstimate"
            value={form.budgetEstimate}
            onChange={onChange}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* Subevents */}
        <div>
          <label className="text-sm font-medium">
            No. of Subevents
          </label>

          <input
            type="number"
            name="numberOfSubevents"
            value={form.numberOfSubevents}
            onChange={onChange}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* Poster Upload */}
        <div>
          <label className="text-sm font-medium">
            Poster
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setPoster(
                e.target.files?.[0] || null
              )
            }
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-black dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* Notes for HOD */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium">
            Notes for HOD
          </label>

          <textarea
            name="miscNotesForHod"
            value={form.miscNotesForHod}
            onChange={onChange}
            rows={2}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading
            ? "Creating..."
            : "Create Event"}
        </button>
      </form>
    </div>
  );
}
