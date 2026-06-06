import DashboardLayout from "../layouts/DashboardLayout";

export default function HodDashboard() {
  return (
    <DashboardLayout
      title="HOD"
      links={[
        {
          to: "/dashboard/hod",
          label: "Overview",
          end: true,
        },

        {
          to:
            "/dashboard/hod/pending-approvals",
          label:
            "Event Approvals",
        },

        {
          to:
            "/dashboard/hod/coordinator-applications",
          label:
            "Coordinator Applications",
        },

        {
          to:
            "/dashboard/hod/analytics",
          label:
            "Analytics",
        },

        {
          to:
            "/dashboard/hod/feedbacks",
          label:
            "Event Feedbacks",
        },

        {
          to:
            "/dashboard/hod/announcements",
          label:
            "Announcements",
        },
      ]}
    />
  );
}