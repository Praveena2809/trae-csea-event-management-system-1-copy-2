import DashboardLayout from "../layouts/DashboardLayout";

export default function ParticipantDashboard() {
  return (
    <DashboardLayout
      title="Participant"
      links={[
        { to: "/dashboard/participant", label: "Overview", end: true },
        { to: "/dashboard/participant/registrations", label: "My Registered Events" },
        { to: "/dashboard/participant/apply-coordinator", label: "Apply as Coordinator" },
        { to: "/dashboard/participant/profile", label: "Profile" },
        {
          to: "/leaderboard",
          label: "🏆 Leaderboard",
        }
      ]}
    />
  );
}

