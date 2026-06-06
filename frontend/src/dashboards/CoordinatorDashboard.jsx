// import DashboardLayout from "../layouts/DashboardLayout";

// export default function CoordinatorDashboard() {
//   return (
//     <DashboardLayout
//       title="Coordinator"
//       links={[
//         { to: "/dashboard/coordinator", label: "Overview", end: true },
//         { to: "/dashboard/coordinator/create-event", label: "Create Main Event" },
//         { to: "/dashboard/coordinator/my-events", label: "My Events" },
//         { to: "/dashboard/coordinator/qr-attendance", label: "QR Attendance" },
//       ]}
//     />
//   );
// }

import DashboardLayout from "../layouts/DashboardLayout";

export default function CoordinatorDashboard() {
  return (
    <DashboardLayout
      title="Coordinator"
      links={[
        {
          to: "/dashboard/coordinator",
          label: "Overview",
          end: true,
        },

        {
          to: "/dashboard/coordinator/create-event",
          label: "Create Main Event",
        },

        {
          to: "/dashboard/coordinator/my-events",
          label: "My Events",
        },

        {
          to: "/dashboard/coordinator/qr-attendance",
          label: "QR Attendance",
        },
        {
          to:
            "/dashboard/coordinator/announcements",
          label:
            "Announcements",
        }

        
      ]}
    />
  );
}