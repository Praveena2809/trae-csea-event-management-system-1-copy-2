import { useParams, useNavigate } from "react-router-dom";
import {
    useEffect,
    useState,
  } from "react";
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
    const { id } = useParams();
const navigate = useNavigate();
    const [venues, setVenues] =
    useState([]);
  
  const [availabilityMap,
    setAvailabilityMap] =
    useState({});
    useEffect(() => {
      const loadVenues =
        async () => {
          try {
            const {
              data,
            } =
              await api.get(
                "/venues"
              );
    
            setVenues(
              data.venues ||
                []
            );
          } catch (err) {
            console.error(
              err
            );
          }
        };
    
      loadVenues();
    }, []);
    useEffect(() => {
        loadEvent();
      }, []);
      
      const loadEvent = async () => {
        try {
          const { data } = await api.get(
            `/events/${id}/edit`
          );
      
          setForm({
            name: data.event.name || "",
            description: data.event.description || "",
            eventType:
              data.event.eventType || "workshop",
            date: data.event.date
              ? data.event.date.split("T")[0]
              : "",
            budgetEstimate:
              data.event.budgetEstimate || "",
            numberOfSubevents:
              data.event.numberOfSubevents || "",
            miscNotesForHod:
              data.event.miscNotesForHod || "",
          });
      
          if (data.subevents?.length) {
            setSubevents(data.subevents);
          }
        } catch (err) {
          console.error(err);
        }
      };
    const [subevents, setSubevents] =
    useState([
      {
        type: "workshop",
        name: "",
        description: "",
        venue: "",
        startAt: "",
        endAt: "",
        eligibility: ["1", "2", "3", "4"],
        maxParticipants: "",
        entryFee: "",
        eventManager: "",
        managerPhone: "",
        prizePool: "",
        poster:null,
        totalSessions: 1,
  
  certificateSettings: {
    mode: "attendance_once",
    minimumPercentage: 80,
  },
      },
    ]);
    const onChange = (e) => {
      setForm((f) => ({
        ...f,
        [e.target.name]: e.target.value,
      }));
    };
    const addSubevent = () => {
      setSubevents((prev) => [
        ...prev,
        {
          type: "workshop",
          name: "",
          description: "",
          venue: "",
          startAt: "",
          endAt: "",
          eligibility: ["1", "2", "3", "4"],
          maxParticipants: "",
          entryFee: "",
          eventManager: "",
          managerPhone: "",
          prizePool: "",
          poster: null,
          totalSessions: 1,
  
  certificateSettings: {
    mode: "attendance_once",
    minimumPercentage: 80,
  },
        },
      ]);
    };
    
    const updateSubevent =
      (
        index,
        field,
        value
      ) => {
        setSubevents((prev) =>
          prev.map((s, i) =>
            i === index
              ? {
                  ...s,
                  [field]:
                    value,
                }
              : s
          )
        );
      };
    
    const removeSubevent =
      (index) => {
        setSubevents((prev) =>
          prev.filter(
            (_, i) =>
              i !== index
          )
        );
      };
      const checkAvailability =
      async (
        index
      ) => {
        const s =
          subevents[
            index
          ];
    
        if (
          !s.venue ||
          !s.startAt ||
          !s.endAt
        )
          return;
    
        try {
          const {
            data,
          } =
            await api.get(
              `/venues/availability?venueId=${s.venue}&startAt=${encodeURIComponent(
                s.startAt
              )}&endAt=${encodeURIComponent(
                s.endAt
              )}`
            );
    
          setAvailabilityMap(
            (
              prev
            ) => ({
              ...prev,
              [index]:
                data,
            })
          );
        } catch (err) {
          setAvailabilityMap(
            (
              prev
            ) => ({
              ...prev,
              [index]:
                {
                  error:
                    err
                      ?.response
                      ?.data
                      ?.message ||
                    "Failed",
                },
            })
          );
        }
      };
    const onSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        const fd = new FormData();
  
        Object.entries(form).forEach(([k, v]) => {
          if (k === "certificateSettings") {
            fd.append(
              "certificateSettings",
              JSON.stringify(v)
            );
          } else {
            fd.append(k, v);
          }
        });
        const cleanedSubevents =
        subevents.map((s, index) => ({
          ...s,
          poster: s.poster
            ? `subeventPoster-${index}`
            : null,
        }));
      
      fd.append(
        "subevents",
        JSON.stringify(cleanedSubevents)
      );
      subevents.forEach((s, index) => {
        if (s.poster) {
          fd.append(
            `subeventPoster-${index}`,
            s.poster
          );
        }
      });
        // fd.append(
        //   "subevents",
        //   JSON.stringify(
        //     subevents
        //   )
        // );
  
        if (poster) {
          fd.append("poster", poster);
        }
        console.log(subevents);
        await api.put(
            `/events/${id}/resubmit`,
            fd,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );
  
          toast.success(
            "Event resubmitted for approval"
          );
          
          navigate(
            "/dashboard/coordinator/my-events"
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
        Edit & Resubmit Event
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
  {/* INITIAL SUBEVENTS */}
  
  <div className="md:col-span-2 mt-6">
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-semibold">
        Initial Subevents
      </h4>
  
      <button
        type="button"
        onClick={addSubevent}
        className="rounded-md bg-green-600 px-3 py-2 text-white"
      >
        + Add Subevent
      </button>
    </div>
  
    <div className="mt-4 space-y-4">
      {subevents.map(
        (s, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-300 p-4 dark:border-slate-700"
          >
            <div className="flex justify-between">
              <h5 className="font-semibold">
                Subevent{" "}
                {index + 1}
              </h5>
  
              {subevents.length >
                1 && (
                <button
                  type="button"
                  onClick={() =>
                    removeSubevent(
                      index
                    )
                  }
                  className="text-red-500"
                >
                  Remove
                </button>
              )}
            </div>
  {/* 
            <input
              placeholder="Subevent Name"
              value={s.name}
              onChange={(e) =>
                updateSubevent(
                  index,
                  "name",
                  e.target.value
                )
              }
              className="mt-3 w-full rounded-md border p-2"
            /> */}
  <div className="md:col-span-2">
    <label className="text-sm font-medium">
      Subevent Name
    </label>
  
    <input
      value={s.name}
      onChange={(e) =>
        updateSubevent(
          index,
          "name",
          e.target.value
        )
      }
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    />
  </div>
  <div>
    <label className="text-sm font-medium">
      Type
    </label>
  
    <select
      value={s.type}
      onChange={(e) =>
        updateSubevent(
          index,
          "type",
          e.target.value
        )
      }
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    >
      <option value="workshop">
        Workshop
      </option>
  
      <option value="competitive">
        Competitive
      </option>
    </select>
  </div>
            {/* <textarea
              placeholder="Description"
              value={
                s.description
              }
              onChange={(e) =>
                updateSubevent(
                  index,
                  "description",
                  e.target.value
                )
              }
              className="mt-3 w-full rounded-md border p-2"
            /> */}
            <div className="md:col-span-2">
    <label className="text-sm font-medium">
      Description
    </label>
  
    <textarea
      rows={3}
      value={s.description}
      onChange={(e) =>
        updateSubevent(
          index,
          "description",
          e.target.value
        )
      }
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    />
  </div>
  <div>
    <label className="text-sm font-medium">
      Venue
    </label>
  
    <select
      value={s.venue}
      onChange={(e) =>
        updateSubevent(
          index,
          "venue",
          e.target.value
        )
      }
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    >
      <option value="">
        Select Venue
      </option>
  
      {venues.map(
        (v) => (
          <option
            key={v._id}
            value={v._id}
          >
            {v.name}
          </option>
        )
      )}
    </select>
  </div>
            {/* <input
            
              type="datetime-local"
              value={
                s.startAt
              }
              onChange={(e) =>
                updateSubevent(
                  index,
                  "startAt",
                  e.target.value
                )
              }
              className="mt-3 w-full rounded-md border p-2"
            /> */}
            <div>
    <label className="text-sm font-medium">
      Start Time
    </label>
  
    <input
      type="datetime-local"
      value={s.startAt}
      onChange={(e) =>
        updateSubevent(
          index,
          "startAt",
          e.target.value
        )
      }
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    />
  </div>
  
            {/* <input
              type="datetime-local"
              value={s.endAt}
              onChange={(e) =>
                updateSubevent(
                  index,
                  "endAt",
                  e.target.value
                )
              }
              className="mt-3 w-full rounded-md border p-2"
            /> */}
            <div>
    <label className="text-sm font-medium">
      End Time
    </label>
  
    <input
      type="datetime-local"
      value={s.endAt}
      onChange={(e) =>
        updateSubevent(
          index,
          "endAt",
          e.target.value
        )
      }
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    />
  </div>
  {/* <div className="md:col-span-2">
    <button
      type="button"
      onClick={() =>
        checkAvailability(
          index
        )
      }
      className="rounded-md border border-slate-600 px-4 py-2"
    >
      Check Venue
      Availability
    </button>
  
    <div className="md:col-span-2">
    <button
      type="button"
      onClick={() =>
        checkAvailability(
          index
        )
      }
      className="rounded-md border border-slate-600 px-4 py-2"
    >
      Check Venue
      Availability
    </button>
  
    {availabilityMap[
      index
    ]?.conflicts
      ?.length ? (
      <p className="mt-2 text-sm text-red-600">
        Conflict! This
        slot is already
        booked. Try
        another
        venue/time.
      </p>
    ) : availabilityMap[
        index
      ] &&
      !availabilityMap[
        index
      ]?.error ? (
      <p className="mt-2 text-sm text-emerald-600">
        No conflicts
        for selected
        venue.
      </p>
    ) : null}
  
    {availabilityMap[
      index
    ]
      ?.suggestedAlternateVenues
      ?.length ? (
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
        Suggested
        alternate
        venues:
        {" "}
        {availabilityMap[
          index
        ]
          .suggestedAlternateVenues
          .map(
            (
              v
            ) =>
              v.name
          )
          .join(
            ", "
          )}
      </p>
    ) : null}
  
    {availabilityMap[
      index
    ]?.error ? (
      <p className="mt-2 text-sm text-red-600">
        {
          availabilityMap[
            index
          ].error
        }
      </p>
    ) : null}
  </div>
  
    {availabilityMap[
      index
    ]?.available ===
      true && (
      <div className="mt-3 text-green-400">
        Venue Available
      </div>
    )}
      
  </div> */}
  <div className="md:col-span-2">
    <button
      type="button"
      onClick={() =>
        checkAvailability(
          index
        )
      }
      className="rounded-md border border-slate-600 px-4 py-2"
    >
      Check Venue Availability
    </button>
  
    {availabilityMap[
      index
    ]?.conflicts?.length ? (
      <p className="mt-2 text-sm text-red-600">
        Conflict! This slot is already booked.
        Try another venue or time.
      </p>
    ) : availabilityMap[
        index
      ] &&
      !availabilityMap[
        index
      ]?.error ? (
      <p className="mt-2 text-sm text-emerald-600">
        No conflicts for selected venue.
      </p>
    ) : null}
  
    {availabilityMap[
      index
    ]
      ?.suggestedAlternateVenues
      ?.length ? (
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
        Suggested alternate venues:
        {" "}
        {availabilityMap[
          index
        ]
          .suggestedAlternateVenues
          .map(
            (
              v
            ) => v.name
          )
          .join(", ")}
      </p>
    ) : null}
  
    {availabilityMap[
      index
    ]?.error ? (
      <p className="mt-2 text-sm text-red-600">
        {
          availabilityMap[
            index
          ].error
        }
      </p>
    ) : null}
  </div>
  <div>
   
    <div>
   
  
    <div>
    <label className="text-sm font-medium">
      Eligible Years
    </label>
  
    {["1", "2", "3", "4"].map((year) => (
    <label key={year} className="flex gap-2">
      <input
        type="checkbox"
        checked={s.eligibility?.includes(year)}
        onChange={(e) => {
          if (e.target.checked) {
            updateSubevent(
              index,
              "eligibility",
              [...(s.eligibility || []), year]
            );
          } else {
            updateSubevent(
              index,
              "eligibility",
              s.eligibility.filter(
                (y) => y !== year
              )
            );
          }
        }}
      />
      Year {year}
    </label>
  ))}
  </div>
  </div>
  </div>
  <div>
    <label className="text-sm font-medium">
      Max Participants
    </label>
  
    <input
      type="number"
      value={
        s.maxParticipants
      }
      onChange={(e) =>
        updateSubevent(
          index,
          "maxParticipants",
          e.target.value
        )
      }
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    />
  </div>
  <div>
    <label className="text-sm font-medium">
      Entry Fee (₹)
    </label>
  
    <input
      type="number"
      value={s.entryFee}
      onChange={(e) =>
        updateSubevent(
          index,
          "entryFee",
          e.target.value
        )
      }
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    />
  </div>
  <div>
    <label className="text-sm font-medium">
      Total Sessions / Days
    </label>
  
    <input
      type="number"
      min="1"
      value={s.totalSessions}
      onChange={(e) =>
        updateSubevent(
          index,
          "totalSessions",
          Number(e.target.value)
        )
      }
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black"
    />
  </div>
  
  <div>
    <label className="text-sm font-medium">
      Certificate Eligibility
    </label>
  
    <select
      value={s.certificateSettings.mode}
      onChange={(e) =>
        updateSubevent(
          index,
          "certificateSettings",
          {
            ...s.certificateSettings,
            mode: e.target.value,
          }
        )
      }
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black"
    >
      <option value="attendance_once">
        Attend at least one session
      </option>
  
      <option value="attendance_percentage">
        Minimum attendance percentage
      </option>
    </select>
  </div>
  
  {s.certificateSettings.mode ===
    "attendance_percentage" && (
    <div>
      <label className="text-sm font-medium">
        Required Attendance %
      </label>
  
      <input
        type="number"
        min="1"
        max="100"
        value={
          s.certificateSettings
            .minimumPercentage
        }
        onChange={(e) =>
          updateSubevent(
            index,
            "certificateSettings",
            {
              ...s.certificateSettings,
              minimumPercentage:
                Number(e.target.value),
            }
          )
        }
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black"
      />
    </div>
  )}
            {/* <input
              placeholder="Event Manager"
              value={
                s.eventManager
              }
              onChange={(e) =>
                updateSubevent(
                  index,
                  "eventManager",
                  e.target.value
                )
              }
              className="mt-3 w-full rounded-md border p-2"
            /> */}
  <div>
    <label className="text-sm font-medium">
      Event Manager
    </label>
  
    <input
      value={
        s.eventManager
      }
      onChange={(e) =>
        updateSubevent(
          index,
          "eventManager",
          e.target.value
        )
      }
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    />
  </div>
            {/* <input
              placeholder="Manager Phone"
              value={
                s.managerPhone
              }
              onChange={(e) =>
                updateSubevent(
                  index,
                  "managerPhone",
                  e.target.value
                )
              }
              className="mt-3 w-full rounded-md border p-2"
            /> */}
            <div>
    <label className="text-sm font-medium">
      Manager Phone
    </label>
  
    <input
      value={
        s.managerPhone
      }
      onChange={(e) =>
        updateSubevent(
          index,
          "managerPhone",
          e.target.value
        )
      }
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    />
  </div>
  <div className="md:col-span-2">
    <label className="text-sm font-medium">
      Prize Pool
    </label>
  
    <input
      value={s.prizePool}
      onChange={(e) =>
        updateSubevent(
          index,
          "prizePool",
          e.target.value
        )
      }
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    />
  </div>
  <div className="md:col-span-2">
    <label className="text-sm font-medium">
      Poster
    </label>
  
    <input
      type="file"
      accept="image/*"
      onChange={(e) =>
        updateSubevent(
          index,
          "poster",
          e.target.files[0]
        )
      }
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    />
  </div>
          </div>
        )
      )}
    </div>
  </div>
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading
              ? "Creating..."
              : "Resubmit Event"}
          </button>
        </form>
      </div>
    );
  }
  