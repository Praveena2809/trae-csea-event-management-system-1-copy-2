import { useNavigate } from "react-router-dom";

export default function SelectMode() {
  const navigate = useNavigate();

  const selectMode = (mode) => {
    localStorage.setItem(
      "dashboardMode",
      mode
    );

    if (mode === "participant") {
      navigate("/dashboard/participant");
    } else {
      navigate("/dashboard/coordinator");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Choose Dashboard
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() =>
              selectMode("participant")
            }
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white"
          >
            Participant
          </button>

          <button
            onClick={() =>
              selectMode("coordinator")
            }
            className="px-6 py-3 rounded-lg bg-green-600 text-white"
          >
            Coordinator
          </button>
        </div>
      </div>
    </div>
  );
}